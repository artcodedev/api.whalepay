import { Merchant, Payment, Session, Status } from "@prisma/client";
import { Logger } from "../Utils/Logger";
import { Prisma } from "../Utils/Prisma";
import { Token } from "../Utils/Token";
import { SecretKey } from "../Secure/SeckretKey";
import { Fetch } from "../Utils/Fetch";
import { Callback, ResponseSberBankRUB, SberBankRubBody } from "../Models/MicroControllerModels";

export class MicroController {

    /*
    *** Callback where need send status after microservice get response
    */
    private static async callBack(status: string, session_uid: string, merchant_id: number, domain: string, callback: string): Promise<void> {

        try {

            const merchant: Merchant | null = await Prisma.client.merchant.findUnique({ where: { id: merchant_id } });

            if (merchant) {

                const token: string = await Token.sign({ session_uid: session_uid }, merchant.secret_key, Math.floor(Date.now() / 1000) + 1440);

                const data: Callback = {
                    token: token,
                    status: status,
                    session_uid: session_uid
                }

                await Fetch.request(`${domain}${callback}`, data);

            }
        }

        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
        }

    }

    /*
    *** Method for CBER BANK RUB only
    */
    public static async sberbankrub(body: SberBankRubBody): Promise<ResponseSberBankRUB> {

        try {

            if (body.token) {

                const token: boolean = await Token.verify(body.token, SecretKey.secret_key_micro);

                if (token) {

                    const session: Session | null = await Prisma.client.session.findUnique({ where: { uid: body.session_uid } });

                    if (session) {

                        const updateSession: Session = await Prisma.client.session.update({
                            where: { uid: body.session_uid },
                            data: {
                                status: Status[body.status],
                                paid: true

                            }
                        });

                        if (updateSession) {
                            const payment: Payment = await Prisma.client.payment.update({
                                where: { session_uid: body.session_uid },
                                data: {
                                    time_paid: Number(body.enrollment_time),
                                    trx: body.trx
                                }
                            });

                            if (payment) {

                                /* SEND CALLBACK */
                                // await MicroController.callBack(session.uid, body.status, session.merchant_id, session.domain, session.callback);

                                return { status: 200 }
                            };
                        }
                    }

                }
            }

            return { status: 500 };
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            console.log(e)
            return { status: 500 };
        }

    }

}