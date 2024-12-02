
import { Logger } from "../Utils/Logger";
import { Answers } from "../Utils/Answers";
import { AnswersError } from "../Models/Answers/AnswersErrorModels";
import {InitPaymentData } from '../Models/PaymentControllerModels';
import { Prisma } from "../Utils/Prisma";


export class PaymentController {

    private static async findCard() {

        try {

            // while ()
            // const candidate = await Prisma.client.card.findFirst({
            //     where: {
            //         active: true,
            //         busy: false,
            //         // payment_type: PaymentType[payment_type]
            //     } 
            // })
        }
        catch(e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }
    }


    public static async init(init: InitPaymentData) {

        try {

            const session = await Prisma.client.session.findUnique({
                where: {uid: init.session_uid}
            });

            if (session) {



            }

            return Answers.notFound("Session no found");

        }

        catch(e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError('server error');
        }
    }

    
}