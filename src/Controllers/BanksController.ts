

import { Prisma } from "../Utils/Prisma";
import { Logger } from "../Utils/Logger";
import { Answers } from "../Utils/Answers";
import { AnswersError } from "../Models/Answers/AnswersErrorModels";
import { BanksResponse, BanksResponseData } from '../Models/BacksControllerModels';
import { Banks, Session } from "@prisma/client";

export class BacksController {

    public static async banks(session_uid: { session_uid: string }): Promise<BanksResponse | AnswersError> {
        
        try {

            const session: Session | null = await Prisma.client.session.findUnique({
                where: { uid: session_uid.session_uid }
            });

            if (session) {

                const backs: Banks[] = await Prisma.client.banks.findMany({ where: { status: true, currency: session.currency } });

                if (backs) {

                    const response: BanksResponseData[] = [];

                    for (let i of backs) {

                        if (i.status) response.push({ title: i.title, uid: i.uid })
                    }

                    return { status: 200, data: response };

                }

                return Answers.wrong('no active banks');
            }

            return Answers.wrong('Session not found');
        
        }
        
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            console.log(e)
            return Answers.serverError('server error');
        }
    }

}