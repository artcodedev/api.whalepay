import { InitSessionDataResponse, InitSessionFetchRequestData, VarifySessionResponse } from "../Models/SessionControllerModels";
import { Prisma } from "../Utils/Prisma";
import { Console } from '../Utils/Console';
import { AnswersError } from "../Models/Answers/AnswersErrorModels";
import { Answers } from "../Utils/Answers";
import { Currency, Status, Session, Merchant, Payment, Banks } from "@prisma/client";
import { Logger } from "../Utils/Logger";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { SecretKey } from '../Secure/SeckretKey';
import { InitSessionDataRequest } from "../Models/MerchantControllerModels";
import { fromString } from 'uuidv4'
import { Token } from "../Utils/Token";

export class SessionController {

    /*
    *** Get Random number
    */
    private static getRandomArbitrary(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /*
    *** Create new session
    */
    public static async CreateSession({ token, data }: InitSessionDataRequest): Promise<AnswersError | InitSessionDataResponse> {

        try {

            if (token && data) {

                const verifyToken: boolean = await Token.verify(token, SecretKey.secret_key)

                if (verifyToken) {

                    const activeBanks: Banks[] | null = await Prisma.client.banks.findMany({ where: { status: true } });

                    if (activeBanks.length && activeBanks) {
                        const merchant: Merchant | null = await Prisma.client.merchant.findUnique({ where: { uid: data.merchant_uid } });

                        if (merchant) {

                            const random: number = SessionController.getRandomArbitrary(100000, 99999999999);

                            const uidst: string = `${merchant.login}${merchant.password}${merchant.email}${merchant.name}${merchant.phone}${SecretKey.secret_key}${Date.now()}${random}`;

                            const uid: string = fromString(uidst);

                            const create_at: number = Date.parse(new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"}));

                            const session = await Prisma.client.session.create({
                                data: {
                                    uid: uid,
                                    merchant_id: merchant.id,
                                    amount: data.amount,
                                    currency: Currency[data.currency],
                                    description: data.description,
                                    domain: data.domain,
                                    callback: data.callback,
                                    metadata: data.metadata,
                                    created_at: create_at,
                                    status: Status.PROCESS,
                                    paid: false,
                                }
                            })

                            if (session) {
                                return {
                                    status: 200, data: {
                                        session_uid: session.uid,
                                        merchant_uid: merchant.uid,
                                        status: Status.PROCESS,
                                        currency: session.currency,
                                        paid: false,
                                        amount: session.amount,
                                        created_at: Number(session.created_at),
                                        description: session.description,
                                        metadata: session.metadata,
                                        domain: session.domain,
                                        gateway: `${process.env.FRONTEND}/payment?session_uid=${session.uid}`

                                    }
                                }
                            }

                            return Answers.notFound('Session is not created');

                        }

                        return Answers.notFound("merchand no found");
                    }

                    return Answers.notFound("no active banks");
                }

                return Answers.wrong("token is not variated");

            }

            return Answers.wrong("not all data has been transferred");

        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }
    }

    /*
    *** Varify Session
    */
    public static async VerifySession({ session_uid }: InitSessionFetchRequestData): Promise<AnswersError | VarifySessionResponse> {

        try {

            if (session_uid) {

                const session: Session | null = await Prisma.client.session.findUnique({ where: { uid: session_uid } });

                console.log(session)

                if (session) {

                    const merchant: Merchant | null = await Prisma.client.merchant.findUnique({ where: { id: session.merchant_id } });

                    // console.log(merchant)

                    if (merchant) {

                        const payment: Payment | null = await Prisma.client.payment.findUnique({ where: { session_uid: session.uid } })

                        console.log(session)

                        if (payment) {

                            if (!payment.card_id && payment.bank_uid) {

                                /*
                                *** Status session PENDING_CARD
                                */

                                console.log(session.status)
                                if (session.status === "PENDING_CARD") {
                                    return {
                                        status: 200,
                                        data: {
                                            session: { status: session.status }
                                        }
                                    }
                                }

                                return Answers.notFound('error checking status (PENDING_CARD)');


                            } else {


                                if (payment.card_id) {

                                    /*
                                    *** Status session PENDING_PAY
                                    */
                                    if (session.status === "PENDING_PAY" || session.status === "REQVER") {

                                        const data_now: number = Date.parse(new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"}));

                                        if (data_now > Number(payment.created_at)) {

                                            await Prisma.client.payment.update({
                                                where: { session_uid: session.uid },
                                                data: { time_closed: Number(data_now), }
                                            })

                                            await Prisma.client.session.update({
                                                where: { uid: payment.session_uid },
                                                data: { status: "EXITED", paid: false }
                                            })

                                            await Prisma.client.card.update({
                                                where: { id: payment.card_id },
                                                data: { busy: false }
                                            })

                                            return { status: 200, data: { session: { status: session.status } } }

                                        } else {

                                            const card = await Prisma.client.card.findUnique({ where: { id: payment.card_id } });

                                            if (card) {
                                                return {

                                                    status: 200,
                                                    data: {
                                                        session: {
                                                            status: session.status,
                                                            currency: session.currency,
                                                            amount: session.amount,
                                                        },
                                                        payment: {

                                                            payment_type: payment.bank_uid,
                                                            card_details: {
                                                                card_reciever: card.card_receiver,
                                                                card_number: card.card_number,
                                                                card_valid_thru: card.card_valid_thru
                                                            },
                                                            timeout: Number(payment.created_at),
                                                            amount: payment.amount,
                                                            currency_symbol: payment.currency_symbol
                                                        },
                                                        domain: session.domain
                                                    }
                                                }
                                            }

                                            return Answers.notFound('Error with card');
                                        }

                                    }

                                    /*
                                    *** Status session SUCCESS
                                    */
                                    if (session.status === "SUCCESS") {
                                        const card = await Prisma.client.card.findUnique({ where: { id: payment.card_id } })
                                        if (card) {
                                            return {
                                                status: 200,
                                                data: {
                                                    session: {
                                                        status: session.status,
                                                        currency: session.currency,
                                                        amount: session.amount,
                                                        email: payment.email
                                                    },
                                                    payment: {
                                                        payment_type: payment.bank_uid,
                                                        payment_id: payment.id

                                                    },
                                                    domain: session.domain
                                                }
                                            }
                                        }
                                        return Answers.notFound('Error with card');
                                    }

                                    /*
                                    *** Status session EXITED
                                    */
                                    if (session.status === "EXITED") {
                                        return {
                                            status: 200,
                                            data: {
                                                session: {
                                                    status: "EXITED"
                                                },
                                                domain: session.domain
                                            }
                                        }
                                    }

                                    /*
                                    *** Status session ERROR
                                    */
                                    if (session.status === "ERROR") {
                                        return {
                                            status: 200,
                                            data: {
                                                session: { status: "ERROR" }
                                            }
                                        }
                                    }

                                    if (session.status === "PENDING_TRX") {
                                        return {
                                            status: 200,
                                            data: {
                                                session: { status: session.status }
                                            }
                                        }
                                    }

                                    return Answers.notFound('Payment error get status');
                                }

                                return Answers.notFound('Card not found');

                            }

                        } else {

                            /*
                            *** Status session PROCESS
                            */

                            if (session.status === "PROCESS") {
                                return {
                                    status: 200,
                                    data: {
                                        session: {
                                            status: session.status,
                                            currency: session.currency,
                                            amount: session.amount,
                                        },
                                        domain: session.domain
                                    }
                                }
                            }

                            return Answers.notFound('error checking status');

                        }

                    }

                    return Answers.notFound('Session not found');

                }

                return Answers.notFound('Merchant not found');

            }

            return Answers.wrong("not all data has been transferred");

        }

        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }

    }

}

