

export interface Auth {
    login: string
    pwd: string
}

export interface AuthResponse {
    status: number
    message: string
    token: string
}

export interface Signup {
    phone: string;
    name: string;
    login: string;
    pwd: string;
    email: string;
}

export interface MerchantByUID {
    merchant_uid: string
    session_uid: string
}

export interface TrxList {
    uid: string;
    secret_key: string;
    login: string;
}