

export interface BanksResponseData {
    title: string
    uid: string
}

export interface BanksResponse {
    status: number
    data: BanksResponseData[]
}