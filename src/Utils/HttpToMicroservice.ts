import { Banks, Card, Payment } from "@prisma/client";
import { ObjectMicroSberRUB } from "../Models/PaymentControllerModels";
import { SecretKey } from "../Secure/SeckretKey";
import { Fetch } from "./Fetch";
import { Token } from "./Token";
import { Logger } from "./Logger";
import { Prisma } from "./Prisma";



export class HttpToMicroservice {
    /*
    *** Send http request to microsirvice check pay on card
    */
    public static async sendHttpToMicroservice(payment: Payment, type: string): Promise<number> {

        try {

            const bank: Banks | null = await Prisma.client.banks.findUnique({
                where: { uid: payment.bank_uid }
            })

            if (bank) {

                /*
                *** SBER BANK (RUB)
                */
                if (bank.uid === '111') {

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

            return 500

        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            console.log(e)
            return 500
        }
    }
}