import {describe, expect, it, vi} from 'vitest'
import {getAbbreviatedUnit} from '$lib/frontend/core/Helper'

const mockedFetch = vi.fn()
global.fetch = mockedFetch

describe('getAbbreviatedUnit', () => {

    it('should return "g" for "Gramme"', () => {
        expect(getAbbreviatedUnit('Gramme')).toBe('g')
    })

    it('should return "cl" for "Centiliter"', () => {
        expect(getAbbreviatedUnit('Centiliter')).toBe('cl')
    })

    it('should return "ml" for "Milliliter"', () => {
        expect(getAbbreviatedUnit('Milliliter')).toBe('ml')
    })

    it('should return "oz" for "Once"', () => {
        expect(getAbbreviatedUnit('Once')).toBe('oz')
    })

    it('should return "portion" for "Portion"', () => {
        expect(getAbbreviatedUnit('Portion')).toBe('portion')
    })

    it('should return "kg" for "Kilogram"', () => {
        expect(getAbbreviatedUnit('Kilogram')).toBe('kg')
    })

    it('should return "l" for "Liter"', () => {
        expect(getAbbreviatedUnit('Liter')).toBe('l')
    })

    it('should return "lb" for "Pound"', () => {
        expect(getAbbreviatedUnit('Pound')).toBe('lb')
    })

    it('should return "ml" for "Milliliter"', () => {
        expect(getAbbreviatedUnit('Milliliter')).toBe('ml')
    })

    it('should return "unit" for "Unit"', () => {
        expect(getAbbreviatedUnit('Unit')).toBe('')
    })
})
