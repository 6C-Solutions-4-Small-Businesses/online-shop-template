import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {type AsyncFunction, executeFunction, getAbbreviatedUnit} from '$lib/frontend/core/Helper'
import {mock, type MockProxy} from 'vitest-mock-extended'
import {type Writable} from 'svelte/store'
import * as ToasterUtils from '$lib/frontend/core/ToasterUtils'

const mockedFetch = vi.fn()
global.fetch = mockedFetch

describe('executeFunction', () => {
    let isLoading: MockProxy<Writable<boolean>>
    let mockFunction: MockProxy<AsyncFunction<NonNullable<unknown>>>

    beforeEach(async () => {
        isLoading = mock()
    })

    describe('loading indicator', () => {
        beforeEach(async () => {
            isLoading = mock()
            mockFunction = vi.fn()
            await executeFunction(isLoading, mockFunction)
        })

        it('should be true before executing provided function', async () => {
            const isLoadingSetCallOrder = isLoading.set.mock.invocationCallOrder[0]
            // @ts-ignore
            const mockFunctionCallOrder = mockFunction.mock.invocationCallOrder[0]

            expect(isLoadingSetCallOrder).toBeLessThan(mockFunctionCallOrder)
            expect(isLoading.set).toHaveBeenCalledWith(true)
        })

        it('should be false after executing provided function', () => {
            const isLoadingSetCallOrder = isLoading.set.mock.invocationCallOrder[1]
            // @ts-ignore
            const mockFunctionCallOrder = mockFunction.mock.invocationCallOrder[0]

            expect(isLoadingSetCallOrder).toBeGreaterThan(mockFunctionCallOrder)
            expect(isLoading.set).toHaveBeenCalledWith(false)
        })

        afterEach(() => {
            vi.clearAllMocks()
        })
    })

    describe('toasts', () => {
        beforeEach(() => {
            vi.mock('../../../../../../lib/frontend/core/ToasterUtils', () => {
                return {
                    toastGenericError: vi.fn()
                }
            })
        })

        it('generic error message when executing provided function fails', async () => {
            const mockFunction: MockProxy<AsyncFunction<NonNullable<unknown>>> = vi.fn(() => {
                throw new Error()
            })
            const toastGenericErrorSpy = vi.spyOn(ToasterUtils, 'toastGenericError')

            await executeFunction(isLoading, mockFunction)

            expect(toastGenericErrorSpy).toHaveBeenCalled()
        })
    })

    it('should returns resolved value from provided async function', async () => {
        const expectedReturn = {}

        const returnedValue = await executeFunction(isLoading, () => Promise.resolve(expectedReturn))

        expect(returnedValue).toBe(expectedReturn)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})

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
