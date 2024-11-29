

export interface Auth {
    login: string
    password: string
    session?: boolean
}

export interface AuthResponse {
    status: number
    token: string
}

export interface Signup {
    phone: string
    name: string
    login: string
    password: string
    email: string
}

export interface SignupResponseData {
    uid: string
    secret_key: string
}

export interface SignupResponse {
    status: number
    data: SignupResponseData
}

export interface MerchantByUID {
    merchant_uid: string
    session_uid: string
}

export interface TrxList {
    uid: string
    secret_key: string
    login: string
}