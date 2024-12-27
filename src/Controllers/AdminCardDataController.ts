import { Card } from "@prisma/client";
import { SecretKey } from "../Secure/SeckretKey";
import { Answers } from "../Utils/Answers";
import { Logger } from "../Utils/Logger";
import { Prisma } from "../Utils/Prisma";
import { Token } from "../Utils/Token";

interface CardsData {
    card_number: string
    balance: number
}
interface ResponseCardsData {
    status: number
    data: CardsData
}

interface RequestDataCard {
    token: string
}

class AdminCardDataController {

    /*
    *** Get all number cards and balance
    */
    public static async getCard( token : RequestDataCard): Promise<Answers | ResponseCardsData> {

        try {
            
            if (token) {

                const tok: boolean = await Token.verify(token.token, SecretKey.secret_key);

                if (tok) {

                    const cards: Card[] = await Prisma.client.card.findMany();

                    const cards_mass: CardsData[] = []

                    if (cards) {

                        for (const i of cards) {
                            cards_mass.push({
                                card_number: i.card_number,
                                balance: i.balance
                            });
                        }

                        return {status: 200, data: cards_mass}

                    }

                    return Answers.wrong("can not get cards");

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

export default AdminCardDataController;