
import { AnswersError } from "../Models/Answers/AnswersError";

export class Answers {

    public static notFound(msg: string): AnswersError  {
        return {status: 400, message: msg}
    }

    public static serverError(msg: string): AnswersError  {
        return {status: 500, message: msg}
    }

}