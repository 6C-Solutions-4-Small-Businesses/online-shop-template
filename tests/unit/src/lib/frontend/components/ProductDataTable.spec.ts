import ProductDataTable from '$lib/frontend/components/ProductDataTable.svelte'
import {cleanup, render} from '@testing-library/svelte'
import {afterEach, describe, expect} from 'vitest'
import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'

describe('Product data table', () => {

    let container: HTMLElement

    describe('when there is no products', () => {

        beforeEach(() => {
            ({container} = render(ProductDataTable, {
                props: {
                    products: [] as OfferSummaryPresentation[],
                    currentPage: 1,
                    totalPages: 1,
                    isLoading: false,
                }
            }))
        })

        it('should have match snapshot', () => {

            expect(container).toMatchSnapshot()
        })
    })

    describe('when on the first page', () => {

        beforeEach(() => {
            ({container} = render(ProductDataTable, getAllProducts({
                currentPage: 1,
                totalPages: 25,
            })))
        })

        it('should have match snapshot', () => {

            expect(container).toMatchSnapshot()
        })
    })

    describe('when on the any other page', () => {

        beforeEach(() => {
            ({container} = render(ProductDataTable, getAllProducts({
                currentPage: 5,
                totalPages: 25,
            })))
        })

        it('should have match snapshot', () => {

            expect(container).toMatchSnapshot()
        })
    })

    describe('when on the last page', () => {

        beforeEach(() => {
            ({container} = render(ProductDataTable, getAllProducts({
                currentPage: 25,
                totalPages: 25,
            })))
        })

        it('should have match snapshot', () => {

            expect(container).toMatchSnapshot()
        })
    })

    function getProducts() {
        return [
            {
                id: 'product-id-1',
                name: 'product-1',
                price: 100,
                image: 'an-image-url',
                description: 'a-product',
                quantity: 10,
                isSoldByQuantities: false,
                unit: 'Liter',
                promotion: {
                    id: 'a-promotion-id-1',
                    name: 'a-promotion-name',
                    salePrice: 2345,
                    percentage: 10
                }
            },
            {
                id: 'product-id-2',
                name: 'product-2',
                price: 800,
                image: 'an-image-url',
                description: 'a-product',
                quantity: 10,
                isSoldByQuantities: true,
                unit: 'Kilogram',
                promotion: null
            },
            {
                id: 'product-id-3',
                name: 'product-3',
                price: 1200,
                image: 'an-image-url',
                description: 'a-product',
                quantity: 10,
                isSoldByQuantities: false,
                unit: 'Milliliter',
                promotion: null
            }
        ]
    }

    function getAllProducts({currentPage = 1, totalPages = 25} = {}) {
        return {
            products: getProducts(),
            currentPage,
            totalPages,
            isLoading: false
        }
    }

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})

