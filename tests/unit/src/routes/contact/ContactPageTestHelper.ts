export function getDemoMerchantPresentedOpeningHours() {
    return [
        {dayRange: ['Lundi'], open: '11:00', close: '17:00'},
        {dayRange: ['Mardi', 'Vendredi'], open: '10:00', close: '19:00'},
        {dayRange: ['Samedi'], open: '10:00', close: '18:00'},
        {dayRange: ['Dimanche'], open: '11:00', close: '17:00'}
    ]
}
