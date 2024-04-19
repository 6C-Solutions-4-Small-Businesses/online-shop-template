export const PRODUCT_DISPLAY_LIMIT = 18

export function isEmailInvalid(email: string): boolean {
    return !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
}

export function getAbbreviatedUnit(unit: string | null): string {
    switch (unit) {
        case 'Centiliter':
            return 'cl'
        case 'Gramme':
            return 'g'
        case 'Kilogram':
            return 'kg'
        case 'Liter':
            return 'l'
        case 'Milliliter':
            return 'ml'
        case 'Once':
            return 'oz'
        case 'Pound':
            return 'lb'
        case 'Portion':
            return 'portion'
        case 'Unit':
        default:
            return ''
    }
}
