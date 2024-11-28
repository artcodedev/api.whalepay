

import { Merchant, Session } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "../Utils/Prisma";
import jsonwebtoken from "jsonwebtoken";
import { Answers } from "../Utils/Answers";


/*
*** Interface Models
*/
import { Auth, AuthResponse, Signup, TrxList, MerchantByUID } from "../Models/MerchantController";
import { AnswersError } from '../Models/Answers/AnswersError'


export class MerchantController {

    /*
    *** Private secret key (quiet! don't tell anyone)
    */
    private static readonly secret_key: string = " 8 musdf 56)_@#9- 09 798f7*&R^ ^&  poduf6o9 0";

    /*
    *** Auth merchant
    */
    public static async auth({ login, pwd }: Auth): Promise<AuthResponse | AnswersError> {

        try {

            if (login && pwd) {
                const merchant = await Prisma.client.merchant.findUnique({
                    where: { login },
                });
                if (merchant) {
                    if (bcrypt.compareSync(pwd, merchant.password)) {
                        return {
                            status: 200,
                            message: "successfully authorized",
                            token: await MerchantController.generateMerchantToken(merchant),
                        };
                    }
                    return Answers.notFound('login data is incorrect');
                }
                return Answers.notFound('login data is not found');
            }

            return Answers.wrong("not all data has been transferred");

        } catch (e) {
            return Answers.serverError('server error');
        }
    }

    /*
    *** Signup merchant
    */
    public static async signup({ login, pwd, email, name, phone }: Signup): Promise<AuthResponse | AnswersError> {

        try {

            if (login && pwd && email && name && phone) {

                const mechantLogin = await Prisma.client.merchant.findUnique({ where: { login } });

                if (!mechantLogin) {
                    const merchant = await Prisma.client.merchant.create({
                        data: {
                            phone,
                            email,
                            login,
                            name,
                            uid: uuidv4(),
                            secret_key: await bcrypt.hash(Date.now().toString(), 4),
                            password: await bcrypt.hash(pwd, 15),
                            created_at: Date.now().toString(),
                        },
                    });

                    if (merchant) {

                        return {
                            status: 200,
                            message: "Merchant successfully created",
                            token: await MerchantController.generateMerchantToken(merchant),
                        };
                        
                    }

                }
                return Answers.wrong('merchant already exists');
            }

            return Answers.wrong("not all data has been transferred");
        }
        catch (e) {
            return Answers.serverError('server error');
        }
    }

    /*
    *** Get merchant transaction list
    */
    public static async getTrxList({ uid, secret_key, login, }: TrxList): Promise<AnswersError | string> {
        try {

            if (uid && secret_key && login) {
                const merchant = await Prisma.client.merchant.findUnique({ where: { uid } });
                if (merchant) {

                    if (merchant.login == login && secret_key == merchant.secret_key) {
                        let data = await Prisma.client.$queryRaw`
                        SELECT * FROM "Session"
                        JOIN "Payment" on "Session".uid = "Payment".session_uid
                        JOIN "Card" on "Payment".card_id = "Card".id
                        WHERE "Session".merchant_id = ${merchant.id}
                        ORDER BY "Session".id DESC`;

                        /* In progress */
                        console.log(data);

                        return 'data';

                    }

                    return Answers.wrong('incorrect data');
                }
                return Answers.notFound('mechant not found');
            }

            return Answers.wrong("not all data has been transferred");

        } catch (e) {

            return Answers.serverError('server error');
        }
    }

    /*
    *** Merchant UID
    */
    public static async getMerchantByUID({ merchant_uid, session_uid }: MerchantByUID): Promise<Session | AnswersError> {
        try {

            if (merchant_uid && session_uid) {
                const merchant = await Prisma.client.merchant.findUnique({
                    where: { uid: merchant_uid },
                });

                if (merchant) {
                    const session = await Prisma.client.session.findUnique({
                        where: { uid: session_uid },
                    });

                    return session ? session : Answers.notFound('session not found');
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
    *** Create merchant token
    */
    private static async generateMerchantToken(merchant: Merchant): Promise<string> {

        return jsonwebtoken.sign(
            {
                uid: merchant.uid,
                email: merchant.email,
                login: merchant.login,
                phone: merchant.phone,
                name: merchant.name,
                secret_key: merchant.secret_key,
            },

            MerchantController.secret_key,

            { expiresIn: "24h" }
        );
    }

}