import { Status } from "@prisma/client"

export interface RequestGETTransactions {
    token: string
}

export interface TransactionsData {
    status: Status
    sum: number
    domein: string
    uid_session: string
    time: number
    number_card: string
    login: string
    password: string
}

export interface AdminTransactionsResponse {
    status: number
    data: TransactionsData[]
}

export interface UpdateTransaction {
    token: string
    uid: string
}