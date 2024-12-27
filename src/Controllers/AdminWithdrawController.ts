import { Card, Merchant, UsersAdmin, Withdraw, WithdrawStatus } from "@prisma/client";
import { VerifyAuthToken } from "../Models/AdminCRUDControllerModels";
import { SecretKey } from "../Secure/SeckretKey";
import { Answers } from "../Utils/Answers";
import { Logger } from "../Utils/Logger";
import { Token } from "../Utils/Token";
import { Prisma } from "../Utils/Prisma";
import { createWithDraw, JWTDataWithdraw, ResponseGETWithDraw, WithdrawData } from "./AdminWithdrawControllerModel";



class AdminWithdrawController {


    /*
    *** Get all Withdraw
    */
    public static async get(token: VerifyAuthToken): Promise<Answers | ResponseGETWithDraw> {
        try {

            if (token) {

                const tok: boolean = await Token.verify(token.token, SecretKey.secret_key);

                if (tok) {

                    const withdraw: Withdraw[] | null = await Prisma.client.withdraw.findMany();

                    if (withdraw) {

                        const data: WithdrawData[] = [];

                        for (const i of withdraw) {

                            const data_m: WithdrawData = {
                                withdraw_card_number: i.withdraw_card_number,
                                amount: i.amount,
                                created_at: Number(i.created_at),
                                status: i.status
                            }

                            data.push(data_m);
                        }

                        return { status: 200, data: data }

                    }

                    return Answers.wrong("can not get widthdraw");
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

    /*
    *** Create Withdraw
    */
    public static async set(data: createWithDraw) {

        try {

            if (data) {

                const tok: boolean = await Token.verify(data.token, SecretKey.secret_key);

                if (tok) {

                    if (data.amount && data.card_number) {

                        const parseJWT: JWTDataWithdraw = JSON.parse(atob(data.token.split('.')[1]));

                        const usersAdmin: UsersAdmin | null = await Prisma.client.usersAdmin.findUnique({
                            where: { login: parseJWT.login }
                        });

                        if (usersAdmin) {

                            const merchant: Merchant | null = await Prisma.client.merchant.findUnique({
                                where: { uid: usersAdmin.merchant_uid }
                            });

                            if (merchant) {

                                const card: Card | null = await Prisma.client.card.findUnique({
                                    where: { card_number: data.card_number }
                                });

                                if (card) {

                                    if (card.balance < data.amount) {
                                        return {status: 400}
                                    }

                                    const create_at: number = Date.parse(new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" }));

                                    const withdraw_cr: Withdraw = await Prisma.client.withdraw.create({
                                        data: {
                                            merchant_id: merchant.id,
                                            card_id: card.id,
                                            withdraw_card_number: data.card_number,
                                            amount: data.amount,
                                            status: WithdrawStatus['PENDING'],
                                            message: '',
                                            created_at: create_at,
                                            updated_at: create_at

                                        }
                                    });

                                    if (withdraw_cr) {

                                        /*
                                        *** START MICROSERVICE
                                        */
                                    }

                                    return { status: withdraw_cr ? 200 : 504 }
                                }

                                return Answers.wrong("card not found");

                            }

                            return Answers.wrong("merchant not found");
                        }


                        return Answers.wrong("admin not found");
                    }

                    return Answers.wrong("params is not correct");
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

export default AdminWithdrawController;