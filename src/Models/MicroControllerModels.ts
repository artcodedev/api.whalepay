import { Status } from "@prisma/client"


export interface SberBankRubBody {
    status: Status
    error: string | null,
    trx: string,
    session_uid: string,
    token: string,
    amount: number,
    enrollment_time: number
}

export interface ResponseSberBankRUB {
    status: number
}

export interface Callback {
    session_uid: string
    status: string
    token: string
}