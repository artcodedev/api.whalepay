import { Card } from "@prisma/client"


export interface UpdateCard {

    token: string
    login: string
    status: boolean
    busy: boolean
    
}

export interface ResponseAmount {
    token: string
    id_card: number
    uid_bank: string
    status: number
    sum: number
}

export interface ResponseGetCard {
    status: null,
    data: Card
}