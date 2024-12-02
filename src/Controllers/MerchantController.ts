

import { Merchant, Session } from "@prisma/client";
import bcrypt from "bcrypt";
// import { v4 as uuidv4 } from "uuid";
import { fromString } from 'uuidv4'
import { Prisma } from "../Utils/Prisma";
import jsonwebtoken from "jsonwebtoken";
import { Answers } from "../Utils/Answers";
import {SecretKey} from '../Secure/SeckretKey'


/*
*** Interface Models
*/
import { Auth, AuthResponse, Signup, TrxList, MerchantByUID, SignupResponse } from "../Models/MerchantControllerModels";
import { AnswersError } from '../Models/Answers/AnswersErrorModels'
import { Logger } from "../Utils/Logger";


export class MerchantController {

    /*
    *** Auth merchant
    */
    public static async auth({ login, password, session}: Auth): Promise<AuthResponse | AnswersError> {

        try {

            if (login && password) {
                const merchant = await Prisma.client.merchant.findUnique({
                    where: { login }
                });

                if (merchant) {
                    
                    if (bcrypt.compareSync(password, merchant.password)) {

                        const time_live: number = session ? 600 : 5

                        const token: string = jsonwebtoken.sign(

                            {uid: merchant.uid},

                            SecretKey.secret_key,
                            
                            { expiresIn: Math.floor(Date.now() / 1000) + (time_live * 60)}
                        );

                        return { status: 200, token: token };
                    }

                    return Answers.notFound('login or password is incorrect');
                }

                return Answers.notFound('login or password is not found');
            }

            return Answers.wrong("not all data has been transferred");

        } catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');

        }
    }

    /*
    *** Signup merchant
    */
    public static async signup({ login, password, email, name, phone }: Signup): Promise<SignupResponse | AnswersError> {

        try {

            if (login && password && email && name && phone) {

                const mechantLogin = await Prisma.client.merchant.findUnique({ where: { login: login, password: password } });

                if (!mechantLogin) {

                    const key: string = await bcrypt.hash(Date.now().toString(), 4);

                    const uidst: string = `${login}${password}${email}${name}${phone}${SecretKey.secret_key}`

                    const uid: string = fromString(uidst);

                    const pass_sha: string = await bcrypt.hash(password, 15);

                    const merchant = await Prisma.client.merchant.create({
                        data: {
                            phone,
                            email,
                            login,
                            name,
                            uid: uid,
                            secret_key: key,
                            password: pass_sha,
                            created_at: Date.now().toString(),
                            status: true
                        },
                    });

                    if (merchant) {

                        return {
                            status: 200,
                            data: {
                                uid: uid,
                                secret_key: key
                            }
                        }

                    }

                }

                return Answers.wrong('merchant already exists');
            }

            return Answers.wrong("not all data has been transferred");
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
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
            Logger.write(process.env.ERROR_LOGS, e);
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
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }
    }

}
