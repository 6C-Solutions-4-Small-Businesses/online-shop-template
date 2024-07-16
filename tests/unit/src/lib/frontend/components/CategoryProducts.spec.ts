import CategoryProducts from '$lib/frontend/components/CategoryProducts.svelte'
import {cleanup, fireEvent, render} from '@testing-library/svelte'
import {afterEach, describe, expect, vi} from 'vitest'
import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'

describe('Category products', () => {

    let container: HTMLElement

    describe('when there is no products', () => {

        beforeEach(() => {
            ({container} = render(CategoryProducts, {
                props: {
                    products: [] as OfferSummaryPresentation[],
                    currentPage: 1,
                    totalPages: 1,
                    isLoading: false,
                    loadMoreHandler: vi.fn()
                }
            }))
        })

        it('should have match snapshot', () => {

            expect(container).toMatchSnapshot()
        })
    })

    describe('when first page is loaded', () => {

        beforeEach(() => {
            ({container} = render(CategoryProducts, getAllProducts({
                currentPage: 1,
                totalPages: 25,
            })))
        })

        it('should have match snapshot', () => {

            expect(container).toMatchSnapshot()
        })

        it('calls loadMoreHandler when load more button is clicked', async () => {
            const loadMoreHandlerMock = vi.fn();
            const {getAllByTestId} = render(CategoryProducts, getAllProducts({
                currentPage: 1,
                totalPages: 25,
                loadMoreHandler: loadMoreHandlerMock
            }));

            const loadMoreButtons = getAllByTestId('load-more-button');
            await fireEvent.click(loadMoreButtons[1]);
            expect(loadMoreHandlerMock).toHaveBeenCalledTimes(1);
        });
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

    function getAllProducts({currentPage = 1, totalPages = 25, loadMoreHandler = vi.fn()} = {}) {
        return {
            products: getProducts(),
            currentPage,
            totalPages,
            isLoading: false,
            loadMoreHandler
        }
    }

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})

