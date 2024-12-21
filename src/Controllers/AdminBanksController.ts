import { Banks, Card } from "@prisma/client";
import { SecretKey } from "../Secure/SeckretKey";
import { Answers } from "../Utils/Answers";
import { Logger } from "../Utils/Logger";
import { Token } from "../Utils/Token";
import { Prisma } from "../Utils/Prisma";
import { RequestGETBanks, ResponseGETBanks, UpdateBank } from "../Models/AdminBanksControllerModel";


class AdminBanksController {

    public static async get(token: RequestGETBanks): Promise<Answers | ResponseGETBanks> {

        try {

            if (token) {

                const tok: boolean = await Token.verify(token.token, SecretKey.secret_key);

                if (tok) {

                    const banks: Banks[] | null = await Prisma.client.banks.findMany();

                    const sort_banks: Banks[] = banks.sort((a: Banks, b: Banks) => b.id - a.id);

                    return banks ? { status: 200, data: sort_banks } : Answers.wrong("can not get banks");

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

    public static async update(data: UpdateBank): Promise<Answers> {

        try {

            if (data.token) {

                const tok: boolean = await Token.verify(data.token, SecretKey.secret_key);

                if (tok) {

                    const bank: Banks | null = await Prisma.client.banks.findUnique({
                        where: {uid: data.uid}
                    });

                    if (bank) {

                        const bank_update: Banks = await Prisma.client.banks.update({
                            where: {uid: data.uid},
                            data: {status: data.status == true ? false : true}
                        });

                        return bank_update ? Answers.ok('bank is update') : Answers.wrong('bank is not update');

                    }

                    return Answers.wrong("bank not found");

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

export default AdminBanksController;