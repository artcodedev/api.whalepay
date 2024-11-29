

import { Currency, Status, PaymentType} from "@prisma/client"

export interface InitSessionData {
    merchant_uid: string
    secret_key: string
    amount: number
    currency: Currency
    domain: string
    callback: string,
    description: string
    metadata: any
}

export interface InitSessionDataResponseData {
    session_uid: string,
    merchant_uid: string,
    status: Status,
    currency: Currency,
    paid: boolean,
    amount: number,
    created_at: string,
    description: string,
    metadata: any,
    domain: string,
    gateway: string
}

export interface InitSessionDataResponse {
    status: number,
    data: InitSessionDataResponseData
}

export interface InitSessionFetchRequestData {
    session_uid: string
}