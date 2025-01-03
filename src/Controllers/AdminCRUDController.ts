import { Prisma } from "../Utils/Prisma";
import { AddUser, DeleteUser, GetAllUsers, UpdateUser } from "../Models/AdminCRUDControllerModels";
import { AnswersError } from "../Models/Answers/AnswersErrorModels";
import { SecretKey } from "../Secure/SeckretKey";
import { Answers } from "../Utils/Answers";
import { Logger } from "../Utils/Logger";
import { Token } from "../Utils/Token";
import { UsersAdmin } from "@prisma/client";



class AdminCRUDController {

    /*
    *** Create user for administration
    */
    public static async create_user(data: AddUser): Promise<AnswersError> {

        try {

            if (data.token) {

                const varify_token: boolean = await Token.verify(data.token, SecretKey.secret_key);

                if (varify_token) {

                    const mechant_uid: string = await Token.parseJWT(data.token);

                    if (mechant_uid.length && data.data.login && data.data.password) {

                        const login = await Prisma.client.usersAdmin.findMany({
                            where: {
                                login: data.data.login
                            }
                        })

                        if (!login.length) {

                            const create_user = await Prisma.client.usersAdmin.create({
                                data: {
                                    login: data.data.login,
                                    password: data.data.password,
                                    merchant_uid: mechant_uid,
                                    name: data.data.name
                                }
                            });

                            return create_user ? Answers.ok("user created") : Answers.wrong("user will be not created");
                        }

                        return Answers.wrong("user is exists")

                    }

                    return Answers.wrong("wrong data");

                }

                return Answers.wrong("token is not correct");
            }

            return Answers.wrong("data is not correct");
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError("error in server")
        }
    }

    /*
    *** Delete user
    */
    public static async delete_user(data: DeleteUser): Promise<AnswersError>  {

        try {

            if (data.token) {

                const varify_token: boolean = await Token.verify(data.token, SecretKey.secret_key);

                if (varify_token) {

                    if (data.login && data.login) {

                        const delete_user  = await Prisma.client.usersAdmin.delete({
                            where: {login: data.login}
                        })

                        return delete_user ? Answers.ok("user deleted") : Answers.wrong("user will be not deleted");
                    }

                    return Answers.wrong("wrong data");
                }

                return Answers.wrong("token is not correct");
            }

            return Answers.wrong("data is not correct");
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError("error in server");
        }
    }

    /*
    *** Update user
    */
    public static async update_user(data: UpdateUser): Promise<AnswersError> {

        try {

            if (data.token) {

                const varify_token: boolean = await Token.verify(data.token, SecretKey.secret_key);

                if (varify_token) {
                    
                    if (data.data.login) {

                        const update_user = await Prisma.client.usersAdmin.update({
                            where: {login: data.data.login},
                            data: {
                                login: data.data.login,
                                password: data.data.password,
                                name: data.data.name
                            }
                        });

                        return update_user ? Answers.ok("user updated") : Answers.wrong("user will be not updated");
                    }

                    return Answers.wrong("wrong data");
                }

                return Answers.wrong("token is not correct");
            }

            return Answers.wrong("data is not correct");
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError("error in server");
        }
    }

    /*
    *** Get all users use mechant_uid
    */
    public static async get_all_user(data: GetAllUsers): Promise<AnswersError | UsersAdmin[]> {
        try {

            if (data.token) {

                const varify_token: boolean = await Token.verify(data.token, SecretKey.secret_key);

                if (varify_token) {
                    
                    if (data.marchant_uid) {

                        const get_all_user = await Prisma.client.usersAdmin.findMany({
                            where: {merchant_uid: data.marchant_uid}
                        });

                        return get_all_user ? get_all_user : Answers.wrong("can not get users");
                    }

                    return Answers.wrong("wrong data");
                }

                return Answers.wrong("token is not correct");
            }

            return Answers.wrong("data is not correct");
        }
        catch (e) {
            Logger.write(process.env.ERROR_LOGS, e);
            return Answers.serverError("error in server");
        }
    }

}

export default AdminCRUDController;