import { Card } from "@prisma/client";
import { SecretKey } from "../Secure/SeckretKey";
import { Answers } from "../Utils/Answers";
import { Fetch } from "../Utils/Fetch";
import { Logger } from "../Utils/Logger";
import { Token } from "../Utils/Token";
import { Prisma } from "../Utils/Prisma";




class AdminPhonesController {

    public static async getPhones({ token }: { token: string }) {
        try {

            if (token) {

                const tok: boolean = await Token.verify(token, SecretKey.secret_key);

                if (tok) {

                    const phones: {phone: string}[] = [];

                    const cards: Card[] = await Prisma.client.card.findMany();

                    if (cards) {
                        for (const i of cards) {
                            phones.push({phone: i.card_phone});
                        }

                        return {status: 200, data: phones}
                    }

                    return Answers.wrong("can not get cards data");

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

export default AdminPhonesController;