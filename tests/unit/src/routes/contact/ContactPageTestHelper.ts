import {mock} from 'vitest-mock-extended'

export function getDemoMerchantPresentedOpeningHours() {
    return [
        {dayRange: ['Lundi'], open: '11:00', close: '17:00'},
        {dayRange: ['Mardi', 'Vendredi'], open: '10:00', close: '19:00'},
        {dayRange: ['Samedi'], open: '10:00', close: '18:00'},
        {dayRange: ['Dimanche'], open: '11:00', close: '17:00'}
    ]
}

export function getDemoMerchantOpeningHours() {
    return [mock({
        dayOfTheWeek: 'Lundi',
        status: 'Available',
        openingTime: new Date('2021-01-01T11:00:00Z'),
        closingTime: new Date('2021-01-01T17:00:00Z')
    }), mock({
        dayOfTheWeek: 'Mardi',
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T19:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Mercredi',
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T19:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Jeudi',
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T19:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Vendredi',
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T19:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Samedi',
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T18:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Dimanche',
        status: 'Available',
        openingTime: new Date('2021-01-01T11:00:00Z'),
        closingTime: new Date('2021-01-01T17:00:00Z'),
    })]
}
