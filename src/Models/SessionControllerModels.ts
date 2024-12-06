

import { Currency, Status } from "@prisma/client"

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

interface VarifySessionResponseSession {
    status: string
    currency?: string
    amount?: number
    timeout?: number
    email?: string
}

interface VarifySessionResponsePaymentCardDetails {
    card_reciever: string
    card_number: string
    card_valid_thru: string
}

interface VarifySessionResponsePayment {
    payment_type: string
    card_details?: VarifySessionResponsePaymentCardDetails
    payment_id?: number
    timeout?: number,
    amount?: number,
    currency_symbol?: string
}

interface VarifySessionResponseData {
    session: VarifySessionResponseSession
    payment?: VarifySessionResponsePayment
    domain?: string
}

export interface VarifySessionResponse {
    status: number
    data: VarifySessionResponseData
}
