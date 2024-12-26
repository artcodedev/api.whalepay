



export interface GetSMS {
    token: string
    phone: string
}

export interface TTY {
    phone:   string
    tty:     string
}

export interface GetTTY {
    status: boolean
    data: TTY[]
}

export interface SMSData {
    id: number
    phone: string
    date: string
    message: string
} 

export interface GetSMSData {
    status: boolean
    data: SMSData[]
}
