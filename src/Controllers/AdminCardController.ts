import { Card } from "@prisma/client";
import { SecretKey } from "../Secure/SeckretKey";
import { Answers } from "../Utils/Answers";
import { Logger } from "../Utils/Logger";
import { Token } from "../Utils/Token";
import { Prisma } from "../Utils/Prisma";
import { RequestGETCard } from "../Models/AdminCardControllerModel";


class AdminCardController {

    public static async get(token: RequestGETCard): Promise<Answers> {

        try {

            if (token) {

                const tok: boolean = await Token.verify(token.token, SecretKey.secret_key);

                if (tok) {

                    const card: Card[] | null = await Prisma.client.card.findMany();

                    return card ? { status: 200, data: card } : Answers.wrong("can not get cards");

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

    public static async update(): Promise<void> { }

}

export default AdminCardController;