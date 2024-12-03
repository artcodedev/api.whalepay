

export interface InitPaymentData {

    time_opened:      string
    timezone:         number
    browser_version:  string
    browser_language: string
    ip:               string
    email:            string
    bank_uid:         string
    session_uid:      string

}


interface InitResponseCard {
    card_number: string,
    card_receiver: string,
}

export interface InitResponse {
    status: number
    card_details?: InitPaymentData
    timeout?: number
}

export interface GetCard {
    session_uid: string
}