import { GetSMS, GetSMSData, GetTTY } from "../Models/AdminSMSControllerModel";
import { SecretKey } from "../Secure/SeckretKey";
import { Answers } from "../Utils/Answers";
import { Fetch } from "../Utils/Fetch";
import { Logger } from "../Utils/Logger";
import { Token } from "../Utils/Token";


class AdminSMSController {

    /*
    *** Get all sms use number phone
    */
    public static async getSms(data: GetSMS) {

        try {

            if (data.token && data.phone) {

                const tok: boolean = await Token.verify(data.token, SecretKey.secret_key);

                if (tok) {

                    const token: string = await Token.sign({phone: data.phone}, SecretKey.secret_key_micro, 1000);

                    const tty: GetTTY = await Fetch.request('http://localhost:3010/getalltty', {token: token});

                    if (tty.status) {

                        for (const i of tty.data) {

                            if (i.phone === data.phone) {

                                const getSmsData: GetSMSData = await Fetch.request('http://localhost:3010/getallmessages', {token: token, port: i.tty});

                                return {status: getSmsData.status ? 200 : 500, data: getSmsData.data}

                            }
                        }

                        return Answers.wrong("number phone is not found");
                    }

                    return Answers.wrong("the service responded with an error");

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

export default AdminSMSController;