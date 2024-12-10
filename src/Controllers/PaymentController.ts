


/*
*** Utils
*/
import { Logger } from "../Utils/Logger";
import { Answers } from "../Utils/Answers";
import { Fetch } from '../Utils/Fetch';
import { Token } from "../Utils/Token";

/*
*** Models
*/
import { InitPaymentData, InitResponse, GetCard, ObjectMicroSberRUB, Proxy, TrxMicroservice } from '../Models/PaymentControllerModels';
import { Session, Payment, Card, Banks, Errors } from "@prisma/client";

/*
*** Prisma client
*/
import { Prisma } from "../Utils/Prisma";
import { SecretKey } from "../Secure/SeckretKey";


export class PaymentController {

    /*
    *** Send http request to microsirvice check pay on card
    */
    private static async sendHttpToMicroservice(payment: Payment, type: string): Promise<number> {

        try {

            const bank: Banks | null = await Prisma.client.banks.findUnique({
                where: { uid: payment.bank_uid }
            })

            if (bank) {

                /*
                *** SBER BANK (RUB)
                */
                if (bank.uid === '111') {

                    console.log("wwwwwwwwww")
                    console.log(payment.card_id)

                    if (payment.card_id) {

                        const card: Card | null = await Prisma.client.card.findUnique({
                            where: { id: payment.card_id }
                        })

                        if (card) {

                            /* GET PROXY */

                            // const proxy: Proxy = { login: '', password: '', ip: '', port: '' }

                            const token: string = await Token.sign({ uid: payment.session_uid }, SecretKey.secret_key_micro, Math.floor(Date.now() / 1000) + 1440);

                            const objectMicroSberRUB: ObjectMicroSberRUB = {
                                session_uid: payment.session_uid,
                                token: token,
                                login: card.card_login,
                                password: card.card_password,
                                trx: payment.trx ? payment.trx : '',
                                amount: payment.amount,
                                timeout: Number(payment.created_at)
                            }

                            const sberbank_rub_trx: string = type === "pay" ? 'sberbank_rub' : 'sberbank_rub_trx';

                            const request: { status: number } = await Fetch.request(`http://127.0.0.1:3006/micro/payments/${sberbank_rub_trx}`, objectMicroSberRUB);

                            console.log("qwqwqwqwqwqwqwqwqwq");

                            console.log(request.status)
                            return request.status

                        }
                    }

                }

                /*
                *** ALFA BANK (USD)
                */
                if (bank.uid === '333') {
                }
            }

            return 200

        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            console.log(e)
            return 500
        }
    }

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
    private static async createPayment(init: InitPaymentData, amount: number, card_id?: number | null): Promise<Payment | null> {

        try {

            const banks = await Prisma.client.banks.findUnique({
                where: { uid: init.bank_uid }
            })

            if (banks) {

                const create_at: number = Date.parse(new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })) + 900000;

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
                        created_at: create_at,
                        bank_uid: init.bank_uid,
                        currency_symbol: banks.currencySymbol,
                        amount: amount
                    }
                })

                return payment ? payment : null
            }

            return null


        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return null
        }

    }

    /*
    *** Init payment or chane status for wait card
    */
    public static async init(init: InitPaymentData): Promise<InitResponse | Answers> {

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

                    const craete_payment: Payment | null = await PaymentController.createPayment(init, session.amount, card?.id);

                    if (card?.id && craete_payment) {

                        const updateSesson: Session = await Prisma.client.session.update({
                            where: { uid: init.session_uid },
                            data: { status: "PENDING_TRX" },
                        });

                        if (updateSesson) {

                            const microservice: number = await PaymentController.sendHttpToMicroservice(craete_payment, "trx");

                            if (microservice == 500) {
                                await Prisma.client.session.update({
                                    where: { uid: craete_payment.session_uid },
                                    data: { status: "ERROR" },
                                });

                                await Prisma.client.card.update({
                                    where: { id: card.id },
                                    data: { busy: false },
                                });

                            }

                            return { status: microservice }

                        }
                    }

                    return { status: !card && !craete_payment ? Answers.serverError('can not create payment') : 444 }

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
    public static async getCard(uid: GetCard): Promise<InitResponse | Answers> {

        try {

            const session: Session | null = await Prisma.client.session.findUnique({ where: { uid: uid.session_uid } });

            if (session) {

                if (session.status === "PENDING_TRX") { return { status: 444 } }

                else {
                    const payment: Payment | null = await Prisma.client.payment.findUnique({
                        where: { session_uid: uid.session_uid }
                    });

                    if (payment) {

                        if (session.status === "PENDING_PAY") {

                            if (payment.card_id) {
                                const card: Card | null = await Prisma.client.card.findUnique({ where: { id: payment.card_id } });

                                if (card) {
                                    return {
                                        status: 200,
                                        card_details: {
                                            card_number: card.card_number,
                                            card_receiver: card.card_receiver,
                                            card_valid_thru: card.card_valid_thru
                                        },
                                        timeout: Number(payment.created_at),
                                        amount: session.amount,
                                        currency_symbol: payment.currency_symbol
                                    }
                                }
                            }


                        }

                        if (session.status === "PENDING_CARD") {

                            const card: Card | null = await PaymentController.findCard(payment.bank_uid);

                            if (card) {

                                const updateSession: Session = await Prisma.client.session.update({
                                    where: { uid: uid.session_uid },
                                    data: { status: "PENDING_TRX" },
                                });

                                if (updateSession) {

                                    const payment: Payment = await Prisma.client.payment.update({
                                        where: { session_uid: session.uid },
                                        data: {
                                            card_id: card.id
                                        }
                                    });

                                    if (payment) {

                                        const microservice: number = await PaymentController.sendHttpToMicroservice(payment, "trx");

                                        console.log("qqqqqqqq")
                                        console.log(microservice)

                                        if (microservice == 500) {
                                            await Prisma.client.session.update({
                                                where: { uid: uid.session_uid },
                                                data: { status: "ERROR" },
                                            });

                                            await Prisma.client.card.update({
                                                where: { id: card.id },
                                                data: { busy: false },
                                            });

                                        }

                                        return { status: microservice == 200 ? 444 : 500 }
                                    }



                                    return Answers.notFound("Can not update payment");
                                }

                                return Answers.notFound("Payment no found");
                            }

                            return { status: 444 }

                        }

                        return Answers.notFound("something wrong");
                    }

                    return Answers.notFound("Payment in no found");

                }

            }

            return Answers.notFound("Session in no found");

        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }
    }

    /*
    *** Check session status
    */
    public static async checkPay({ session_uid }: { session_uid: string }): Promise<{ status: string } | Answers> {

        try {

            const session: Session | null = await Prisma.client.session.findUnique({
                where: { uid: session_uid }
            });


            return session ? { status: session.status } : Answers.notFound("session not found")
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }
    }

    /*
    *** Get trx and start pay microservice and chanche status (PENDING_PAY)
    */
    public static async getTrxMicroservice(body: TrxMicroservice): Promise<Answers> {

        try {

            const token: boolean = await Token.verify(body.token, SecretKey.secret_key_micro);

            if (token) {

                const session: Session | null = await Prisma.client.session.findUnique({where: {uid: body.session_uid}});

                if (session) {

                    const session: Session = await Prisma.client.session.update({
                        where: {uid: body.session_uid},
                        data: {
                            status: "PENDING_PAY",
                            status_error: Errors[body.error]
                        }
                    });

                    if (session) {

                        const create_at: number = Date.parse(new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })) + 900000;

                        const payment: Payment = await Prisma.client.payment.update({
                            where: {session_uid: body.session_uid},
                            data: {
                                trx: body.trx,
                                created_at: create_at
                            }
                        });


                        /*
                        *** Start microservice
                        */

                        const microservice: number = await PaymentController.sendHttpToMicroservice(payment, "pay");

                        if (microservice == 500) {
                            await Prisma.client.session.update({
                                where: { uid: body.session_uid },
                                data: { status: "ERROR" },
                            });

                            if (payment.card_id) {
                                await Prisma.client.card.update({
                                    where: { id: payment.card_id },
                                    data: { busy: false },
                                });
                            }

                        }
                    }
                }

            }

            return Answers.wrong("Parametrs in not correct")

        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }
    }

}