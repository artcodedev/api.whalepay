


/*
*** Utils
*/
import { Logger } from "../Utils/Logger";
import { Answers } from "../Utils/Answers";

/*
*** Models
*/
import { InitPaymentData, InitResponse, GetCard } from '../Models/PaymentControllerModels';
import { Session, Payment, Card } from "@prisma/client";

/*
*** Prisma client
*/
import { Prisma } from "../Utils/Prisma";
import { stat } from "fs";


export class PaymentController {

    /*
    *** Find free card
    */
    private static async findCard(bank_uid: string): Promise<Card | null> {

        try {

            const candidate = await Prisma.client.card.findFirst({
                where: {
                    active: true,
                    busy: false,
                    bank_uid: bank_uid
                }
            })

            if (candidate) {
                const update_status_card: Card = await Prisma.client.card.update({
                    where: { id: candidate.id },
                    data: { busy: true },
                });

                if (update_status_card) return candidate;
            }

            return null
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return null
        }
    }

    /*
    *** Craete payment (insert to db)
    */
    private static async createPayment(init: InitPaymentData, card_id?: number | null): Promise<Payment | null> {

        try {

            const payment: Payment = await Prisma.client.payment.create({
                data: {
                    time_opened: init.time_opened,
                    timezone: init.timezone,
                    browser_version: init.browser_version,
                    browser_language: init.browser_language,
                    ip: init.ip,
                    email: init.email,
                    session_uid: init.session_uid,
                    card_id,
                    created_at: Date.now().toString(),
                    bank_uid: init.bank_uid
                }
            })

            return payment ? payment : null
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return null
        }

    }

    /*
    *** Init payment or chane status for wait card
    */
    public static async init(init: InitPaymentData): Promise<InitResponse | Answers>{

        try {

            const session: Session | null = await Prisma.client.session.findUnique({
                where: { uid: init.session_uid }
            });

            if (session) {

                const updateSesson: Session = await Prisma.client.session.update({
                    where: { uid: init.session_uid },
                    data: { status: "PENDING_CARD" },
                });

                if (updateSesson) {

                    const card: Card | null = await PaymentController.findCard(init.bank_uid);

                    const craete_payment: Payment | null = await PaymentController.createPayment(init, card?.id);

                    if (card?.id && craete_payment) {

                        const updateSesson: Session = await Prisma.client.session.update({
                            where: { uid: init.session_uid },
                            data: { status: "PENDING_PAY" },
                        });

                        if (updateSesson) {

                            return {
                                status: 200,
                                card_details: {
                                    card_number: card.card_number,
                                    card_receiver: card.card_receiver,
                                },
                                timeout: craete_payment.created_at
                            }

                        }
                    }

                    return { status: 444 }

                }

                return Answers.wrong("Can not update status");

            }

            return Answers.notFound("Session no found");

        }

        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }
    }

    /*
    *** Get free card uid 
    */
    public static async getCard(uid: GetCard) {

        try {

            const payment: Payment | null = await Prisma.client.payment.findUnique({
                where: {session_uid: uid.session_uid}
            });

            if (payment) {
                console.log(payment)

                if (payment.card_id == null) {

                    const card: Card | null = await PaymentController.findCard(payment.bank_uid);

                    if (card) {
                        const updateSesson: Session = await Prisma.client.session.update({
                            where: { uid: payment.session_uid },
                            data: { status: "PENDING_PAY" },
                        });

                        if (updateSesson) {

                            // return {
                            //     status: 200,
                            //     card_details: {
                            //         card_number: card.card_number,
                            //         card_receiver: card.card_receiver,
                            //     },
                            //     timeout: craete_payment.created_at
                            // }

                        }
                    }

                }

                /*
                *** ?????? CARD IS NOT NULLL 
                */
                if (payment.card_id != null) {

                }


            }

        } catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }

        return {status: 444}
    }


}