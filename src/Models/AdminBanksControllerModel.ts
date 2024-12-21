


import { Banks } from "@prisma/client"


export interface RequestGETBanks {
    token: string
}

export interface ResponseGETBanks {
    status: number
    data: Banks[]
}

export interface UpdateBank {
    uid: string
    status: boolean
    token: string
}