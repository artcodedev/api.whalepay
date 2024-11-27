import { InitSessionData, InitSessionDataResponse } from "../src/Models/SessionModels";
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from "../src/Utils/Prisma";
import { Console } from '../src/Utils/Console';
import { AnswersError } from "../src/Models/Answers/AnswersError";
import { Answers } from "../src/Utils/Answers";
import { Currency, Status } from "@prisma/client";


export class SessionController {

    public static async CreateSession(initSessionData: InitSessionData): Promise<AnswersError | InitSessionDataResponse> {

        try {

            const merchant = await Prisma.client.merchant.findUnique({ where: { uid: initSessionData.merchant_uid } })

            if (merchant) {

                if (merchant.secret_key == initSessionData.secret_key) {

                    const session = await Prisma.client.session.create({
                        data: {
                            uid: uuidv4(),
                            merchant_id: merchant.id,
                            secret_key: merchant.secret_key,
                            amount: initSessionData.amount,
                            currency: Currency[initSessionData.currency],
                            description: initSessionData.description,
                            domain: initSessionData.domain,
                            callback: initSessionData.callback,
                            metadata: initSessionData.metadata,
                            created_at: Date.now().toString(),
                            status: Status.PROCESS,
                            paid: false
                        }
                    })

                    if (session) {
                        return {
                            status: 200, data: {
                                session_uid: session.uid,
                                merchant_uid: merchant.uid,
                                status: Status.PROCESS,
                                currency: session.currency,
                                paid: false,
                                amount: session.amount,
                                created_at: session.created_at,
                                description: session.description,
                                metadata: session.metadata,
                                domain: session.domain,
                                gateway: `${process.env.FRONTEND}/payment?merchant_uid=${merchant.uid}&session_uid=${session.uid}`
                            }
                        }
                    }

                    return Answers.notFound('Session is not created');
                }
            }

            return Answers.notFound('Merchant not found');

        }
        catch {
            return Answers.serverError('server error');
        }
    }

    public static VarifySession() {}

}