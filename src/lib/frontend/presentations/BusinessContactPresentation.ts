export type OpeningHour = {
    dayRange: string[]
    open?: string
    close?: string
}

export type BusinessContactPresentation = {
    name: string
    email: string
    phoneNumber: string
    address: string
    openingHours: OpeningHour[]
}
