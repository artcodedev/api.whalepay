import { Banks, Card } from "@prisma/client";
import { SecretKey } from "../Secure/SeckretKey";
import { Answers } from "../Utils/Answers";
import { Logger } from "../Utils/Logger";
import { Token } from "../Utils/Token";
import { Prisma } from "../Utils/Prisma";
import { RequestGETBanks, ResponseGETBanks } from "../Models/AdminBanksControllerModel";


class AdminBanksController {

    public static async get(token: RequestGETBanks): Promise<Answers | ResponseGETBanks> {

        try {

            if (token) {

                const tok: boolean = await Token.verify(token.token, SecretKey.secret_key);

                if (tok) {

                    const banks: Banks[] | null = await Prisma.client.banks.findMany();

                    return banks ? { status: 200, data: banks } : Answers.wrong("can not get banks");

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

export default AdminBanksController;