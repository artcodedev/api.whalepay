import { Card } from "@prisma/client"


export interface RequestGETCard {
    token: string
}

export interface ResponseGET {
    status: number
    data: Card[]
}