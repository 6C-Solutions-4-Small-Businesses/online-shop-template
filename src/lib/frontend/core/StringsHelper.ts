export function removeDiacritics(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function compareStrings(rhs: string, lhs: string) {
    const normalizedRhs = removeDiacritics(rhs)
    const normalizedLhs = removeDiacritics(lhs)
    return normalizedRhs === normalizedLhs
}

export function compareStringsCaseInsensitive(rhs: string, lhs: string) {
    const normalizedRhs = removeDiacritics(rhs)
    const normalizedLhs = removeDiacritics(lhs)
    return normalizedRhs.toLowerCase() === normalizedLhs.toLowerCase()

}

export function includesString(haystack: string, needle: string) {
    const normalizedHaystack = removeDiacritics(haystack)
    const normalizedNeedle = removeDiacritics(needle)
    return normalizedHaystack.toLowerCase().includes(normalizedNeedle.toLowerCase())
}
