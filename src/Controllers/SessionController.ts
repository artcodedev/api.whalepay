import { InitSessionData, InitSessionDataResponse, InitSessionFetchRequestData } from "../Models/SessionModels";
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from "../Utils/Prisma";
import { Console } from '../Utils/Console';
import { AnswersError } from "../Models/Answers/AnswersError";
import { Answers } from "../Utils/Answers";
import { Currency, Status } from "@prisma/client";



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

interface VarifySessionResponse {
    session: VarifySessionResponseSession
    payment?: VarifySessionResponsePayment
    domain?: string
}

export class SessionController {

    /*
    *** Create new session
    */
    public static async CreateSession(
        { merchant_uid, secret_key, amount, currency, domain, callback, description, metadata }: InitSessionData
    ): Promise<AnswersError | InitSessionDataResponse> {

        try {

            if (merchant_uid && secret_key && amount && currency && domain && callback && description && metadata) {

                const merchant = await Prisma.client.merchant.findUnique({ where: { uid: merchant_uid } })

                Console.log(merchant)

                if (merchant) {

                    if (merchant.secret_key == secret_key) {

                        const session = await Prisma.client.session.create({
                            data: {
                                uid: uuidv4(),
                                merchant_id: merchant.id,
                                secret_key: merchant.secret_key,
                                amount: amount,
                                currency: Currency[currency],
                                description: description,
                                domain: domain,
                                callback: callback,
                                metadata: metadata,
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
                                    gateway: `${process.env.FRONTEND}/payment?merchant_uid=${merchant.uid}&session_uid=${session.uid}`
                                }
                            }
                        }

                        return Answers.notFound('Session is not created');

                    }

                    return Answers.notFound('Merchant wrong');
                }

                return Answers.notFound('Merchant not found');
            }

            return Answers.wrong("not all data has been transferred");

        }
        catch (e) {
            return Answers.serverError('server error');
        }
    }

    /*
    *** Varify Session
    */
    public static async VarifySession({ merchant_uid, session_uid, tag, payment_type }: InitSessionFetchRequestData): Promise<AnswersError | VarifySessionResponse> {

        try {

            if (merchant_uid && session_uid) {
                const merchant = await Prisma.client.merchant.findUnique({ where: { uid: merchant_uid } });

                if (merchant) {
                    const session = await Prisma.client.session.findUnique({ where: { uid: session_uid } });

                    if (session) {
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

                                    return { session: { status: "EXITED" } }
                                } else {
                                    const card = await Prisma.client.card.findUnique({ where: { id: payment.card_id } });
                                    if (card) {
                                        return {
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
                                return Answers.notFound('Error with card');
                            }

                            /*
                            *** Status session EXITED
                            */
                            if (session.status === "EXITED") {
                                return {
                                    session: {
                                        status: "EXITED"
                                    },
                                    domain: session.domain
                                }
                            }

                            /*
                            *** Status session ERROR
                            */
                            if (session.status === "ERROR") {
                                return {session: {status: "ERROR"}}
                            }

                            return Answers.notFound('Payment error get status');
                        }

                        return Answers.notFound('Payment error');
                    }

                    return Answers.notFound('Session not found');

                }

                return Answers.notFound('Merchant not found');

            }

            return Answers.wrong("not all data has been transferred");

        }

        catch (e) {
            return Answers.serverError('server error');
        }

    }


}

