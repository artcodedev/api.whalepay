


export interface AddUserData {
    login: string
    password: string
    name: string
}

export interface AddUser {
    token: string
    data: AddUserData
}

export interface DeleteUser {
    token: string
    login: string
}

export interface UpdateUserData {
    login: string
    password?: string
    name?: string
}
export interface UpdateUser {
    token: string
    data: UpdateUserData
}

export interface GetAllUsers {
    token: string
    marchant_uid: string
}

/* ======= AdminAuthController ======= */

export interface AdminAuth {
    login: string
    password: string
}

export interface AdminAuthControllerResponse {
    status: number
    token: string
}

export interface VerifyAuthToken {
    token: string
}