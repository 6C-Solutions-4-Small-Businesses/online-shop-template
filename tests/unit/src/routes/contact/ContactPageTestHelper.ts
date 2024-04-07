import {mock} from 'vitest-mock-extended'
import type {Day} from '@prisma/client'

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
        dayOfTheWeek: 'Lundi' as Day,
        status: 'Available',
        openingTime: new Date('2021-01-01T11:00:00Z'),
        closingTime: new Date('2021-01-01T17:00:00Z')
    }), mock({
        dayOfTheWeek: 'Mardi' as Day,
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T19:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Mercredi' as Day,
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T19:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Jeudi' as Day,
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T19:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Vendredi' as Day,
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T19:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Samedi' as Day,
        status: 'Available',
        openingTime: new Date('2021-01-01T10:00:00Z'),
        closingTime: new Date('2021-01-01T18:00:00Z'),
    }), mock({
        dayOfTheWeek: 'Dimanche' as Day,
        status: 'Available',
        openingTime: new Date('2021-01-01T11:00:00Z'),
        closingTime: new Date('2021-01-01T17:00:00Z'),
    })]
}
