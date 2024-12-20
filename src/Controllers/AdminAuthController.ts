import { UsersAdmin } from "@prisma/client";
import { AdminAuth, AdminAuthControllerResponse, VerifyAuthToken } from "../Models/AdminCRUDControllerModels";
import { Answers } from "../Utils/Answers";
import { Logger } from "../Utils/Logger";
import { Prisma } from "../Utils/Prisma";
import { Token } from "../Utils/Token";
import { SecretKey } from "../Secure/SeckretKey";




class AdminAuthController {

    /*
    *** Auth for administrations
    */
    public static async auth(data: AdminAuth ): Promise<Answers | AdminAuthControllerResponse> {
        
        try {

            if (data.login && data.password) {

                const auth: UsersAdmin | null = await Prisma.client.usersAdmin.findUnique({
                    where: {login: data.login}
                });

                if (auth) {

                    if (auth.login === data.login && auth.password === data.password) {

                        const exp_token: number = Date.parse(new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })) + ((60000 * 60) * 10);

                        const token: string = await Token.sign({login: data.login}, SecretKey.secret_key, exp_token);

                        return { status: 200, token: token }

                    }

                    return Answers.wrong("login or password not correct");

                }

                return Answers.wrong("user not found");

            }

            return Answers.wrong("data is not correct");

        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError("error in server");
        }
    }

    /*
    *** Verify token for administrations
    */
    public static async verify_auth(token: VerifyAuthToken) {

        try {

            if (token.token) {

                const ver: boolean = await Token.verify(token.token, SecretKey.secret_key);

                return ver ? Answers.ok("token correct") : Answers.wrong("token is not correct");

            }

            return Answers.wrong("data is not correct");
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError("error in server");
        }
    }

}

export default AdminAuthController;