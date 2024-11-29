import { InitSessionDataResponse, InitSessionFetchRequestData } from "../Models/SessionModels";
import { Prisma } from "../Utils/Prisma";
import { Console } from '../Utils/Console';
import { AnswersError } from "../Models/Answers/AnswersError";
import { Answers } from "../Utils/Answers";
import { Currency, Status } from "@prisma/client";
import { Logger } from "../Utils/Logger";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { SecretKey } from '../Secure/SeckretKey';
import { InitSessionDataRequest } from "../Models/MerchantController";
import { fromString } from 'uuidv4'

interface VarifySessionResponseSession {
    status: string
    currency?: string
    amount?: number
    timeout?: number
    email?: string
}

interface VarifySessionResponsePaymentCardDetails {
    card_reciever: string
    card_number: string
}

interface VarifySessionResponsePayment {
    payment_type: string
    card_details?: VarifySessionResponsePaymentCardDetails
    payment_id?: number
}

interface VarifySessionResponseData {
    session: VarifySessionResponseSession
    payment?: VarifySessionResponsePayment
    domain?: string
}

interface VarifySessionResponse {
    status: number
    data?: VarifySessionResponseData
}


export class SessionController {

    /*
    *** Get Random number
    */
    private static getRandomArbitrary(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /*
    *** Check varify token
    */
    private static async VarifyToket(token: string): Promise<boolean> {

        try {
            const varify: string | JwtPayload = jsonwebtoken.verify(token, SecretKey.secret_key);
            return varify ? true : false;

        } catch (e) {
            return false
        }

    }

    /*
    *** Create new session
    */
    public static async CreateSession({ token, data }: InitSessionDataRequest): Promise<AnswersError | InitSessionDataResponse> {

        try {

            if (token && data) {

                const varifyToken: boolean = await SessionController.VarifyToket(token);

                if (varifyToken) {

                    const merchant = await Prisma.client.merchant.findUnique({ where: { uid: data.merchant_uid } });

                    if (merchant) {

                        const random: number = SessionController.getRandomArbitrary(100000, 99999999999);

                        const uidst: string = `${merchant.login}${merchant.password}${merchant.email}${merchant.name}${merchant.phone}${SecretKey.secret_key}${Date.now()}${random}`;

                        const uid: string = fromString(uidst);

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
                                created_at: Date.now().toString(),
                                status: Status.PROCESS,
                                paid: false
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
                                    created_at: session.created_at,
                                    description: session.description,
                                    metadata: session.metadata,
                                    domain: session.domain,
                                    gateway: `${process.env.FRONTEND}/payment?session_uid=${session.uid}`

                                    // gateway: `${process.env.FRONTEND}/payment?merchant_uid=${merchant.uid}&session_uid=${session.uid}`
                                }
                            }
                        }

                        return Answers.notFound('Session is not created');

                    }

                    return Answers.notFound("merchand no found");
                }

                return Answers.wrong("token is not variated");

            }

            return Answers.wrong("not all data has been transferred");

        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e)
            return Answers.serverError('server error');
        }
    }

    /*
    *** Varify Session
    */
    public static async VarifySession({ session_uid }: InitSessionFetchRequestData): Promise<AnswersError | VarifySessionResponse> {

        try {

            if ( session_uid) {
                const session = await Prisma.client.session.findUnique({ where: { uid: session_uid } });

                

                if (session) {
                    const merchant = await Prisma.client.merchant.findUnique({ where: { id: session.merchant_id} });

                    console.log(merchant)

                    if (merchant) {

                        const payment = await Prisma.client.payment.findUnique({ where: { session_uid: session.uid } })

                        if (payment) {

                            /*
                            *** Status session PENDING
                            */
                            if (session.status === "PENDING") {

                                if (Date.now() >= Number(payment.created_at) + 840000) {

                                    await Prisma.client.payment.update({
                                        where: { session_uid: session.uid },
                                        data: { time_closed: Date.now().toString(), }
                                    })
                                    await Prisma.client.session.update({
                                        where: { uid: session.uid },
                                        data: { status: "EXITED", paid: false }
                                    })
                                    await Prisma.client.card.update({
                                        where: { id: payment.card_id },
                                        data: { busy: false }
                                    })

                                    return { status: 200, data: {session: { status: "EXITED" }} }

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
                                                    timeout: Number(payment.created_at) + 840000 - Date.now()
                                                },
                                                payment: {
                                                    payment_type: payment.payment_type,
                                                    card_details: {
                                                        card_reciever: card.card_receiver,
                                                        card_number: card.card_number
                                                    }
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
                                                payment_type: payment.payment_type,
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


                            return Answers.notFound('Payment error get status');

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

                        }

                    }

                    return Answers.notFound('Session not found');

                }

                return Answers.notFound('Merchant not found');

            }

            return Answers.wrong("not all data has been transferred");

        }

        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e)
            return Answers.serverError('server error');
        }

    }

}

