import { Card } from "@prisma/client";
import { SecretKey } from "../Secure/SeckretKey";
import { Answers } from "../Utils/Answers";
import { Logger } from "../Utils/Logger";
import { Token } from "../Utils/Token";
import { Prisma } from "../Utils/Prisma";
import { RequestGETCard } from "../Models/AdminCardControllerModel";
import { ResponseAmount, ResponseGetCard, UpdateCard } from "../Models/AdminCardControllerModels";


class AdminCardController {

    /*
    *** Get all cards
    */
    public static async get(token: RequestGETCard): Promise<Answers | ResponseGetCard> {

        try {

            if (token) {

                const tok: boolean = await Token.verify(token.token, SecretKey.secret_key);

                if (tok) {

                    const cards: Card[] | null = await Prisma.client.card.findMany();

                    const sort_cards: Card[] = cards.sort((a: Card, b: Card) => b.id - a.id);

                    return cards ? { status: 200, data: sort_cards } : Answers.wrong("can not get cards");

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
    *** Update all card
    */
    public static async update(data: UpdateCard): Promise<Answers>  {
        try {

            if (data.token) {

                const tok: boolean = await Token.verify(data.token, SecretKey.secret_key);

                if (tok) {

                    const card: Card | null = await Prisma.client.card.findUnique({
                        where: {card_login: data.login}
                    });

                    if (card) {

                        const bank_update: Card = await Prisma.client.card.update({
                            where: {card_login: data.login},
                            data: {active: data.status, busy: data.busy}
                        });

                        return bank_update ? Answers.ok('card is update') : Answers.wrong('card is not update');

                    }

                    return Answers.wrong("card not found");

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
    *** Update balance card
    */
    public static async updateAmount(data: ResponseAmount): Promise<Answers | {status: number}>  {

        try {

            if (data.token) {

                const tok: boolean = await Token.verify(data.token, SecretKey.secret_key_micro);

                if (tok) {

                    if (data.status == 200) {

                        const card: Card | null = await Prisma.client.card.findUnique({
                            where: {id: data.id_card, bank_uid: data.uid_bank}
                        });

                        if (card) {
                            const card: Card = await Prisma.client.card.update({
                                where: {id: data.id_card, bank_uid: data.uid_bank},
                                data: {balance: data.sum}
                            });

                            return {status: card ? 200 : 500}
                        }

                        return Answers.wrong("card not found");
 
                    }

                    Logger.write(process.env.ERROR_LOGS, 'Error in get amount card service');

                    return Answers.wrong("card not found");

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

export default AdminCardController;