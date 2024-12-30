import { WithdrawStatus } from "@prisma/client"

export interface WithdrawData {
    withdraw_card_number: string
    card_number: string
    amount: number
    status: WithdrawStatus
    created_at: number
}

export interface ResponseGETWithDraw {
    status: number
    data: WithdrawData[]
}

export interface createWithDraw {
    token: string
    card_number: string
    card_number_withdraw: string
    amount: number
}

export interface JWTDataWithdraw {
    login: string
    iat: number
    exp: number
}

export interface SberBankWithdrawRequest {
    login: string
    pass: string
    amount: number
    id: number
    number_card: string
    token: string
    phone: string
  }
  