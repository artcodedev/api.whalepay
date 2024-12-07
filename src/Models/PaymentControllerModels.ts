

import { Currency } from "@prisma/client"

export interface InitPaymentData {

    time_opened:      string
    timezone:         number
    browser_version:  string
    browser_language: string
    ip:               string
    email:            string
    bank_uid:         string
    session_uid:      string
    currency:         Currency

}

interface InitResponseCard {
    card_number: string
    card_receiver: string
    card_valid_thru: string
}

export interface InitResponse {
    status: number
    card_details?: InitPaymentData
    timeout?: number
    amount: number
    currency_symbol: string
}

export interface GetCard {
    session_uid: string
}

export interface Proxy {
    login: string
    password: string
    ip: string
    port: string
}

export interface ObjectMicroSberRUB {
    session_uid: string
    token: string
    login: string
    password: string
    txr: string
    amount: number
    timeout: number
    proxy: Proxy
}