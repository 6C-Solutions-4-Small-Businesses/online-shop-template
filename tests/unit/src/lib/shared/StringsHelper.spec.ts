import {
    compareStrings,
    compareStringsCaseInsensitive,
    includesString,
    removeDiacritics,
} from "$lib/frontend/core/StringsHelper"

describe('removeDiacritics', () => {

    it('should replace "é" by "e"', () => {
        expect(removeDiacritics('é')).toBe('e')
    })
})

describe('compareStrings', () => {

    it('should return true when comparing "café" and "cafe"', () => {
        expect(compareStrings('café', 'cafe')).toBe(true)
    })
})

describe('compareStringsCaseInsensitive', () => {

    it('should return true when comparing "Café" and "cafe"', () => {
        expect(compareStringsCaseInsensitive('Café', 'cafe')).toBe(true)
    })
})

describe('includeString', () => {

    it('should return true when looking for "oeuf" in "BOEUF"', () => {
        expect(includesString('BOEUF', 'oeuf')).toBe(true)
    })
})
