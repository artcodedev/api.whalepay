import { WithdrawStatus } from "@prisma/client"

export interface WithdrawData {
    withdraw_card_number: string
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
    amount: number
}

export interface JWTDataWithdraw {
    login: string
    iat: number
    exp: number
}