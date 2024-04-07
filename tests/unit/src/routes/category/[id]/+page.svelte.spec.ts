import {cleanup, render} from '@testing-library/svelte'
import CategoryProductsPage from '$routes/category/[id]/+page.svelte'
import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
import type {PaginatedResponse} from '$lib/backend/core/PaginatedResponse'
import {mock} from 'vitest-mock-extended'
import '@testing-library/jest-dom'
import {afterEach} from 'vitest'
import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'

describe('/category/[id]', () => {

    const categoryName = 'a-category-name'
    const categoryId = 'a-category-id'

    let container: HTMLElement

    describe('when there is no data', () => {

        beforeEach(() => {
            ({container} = render(CategoryProductsPage, {
                data: {
                    id: categoryId,
                    categories: [],
                    currentCategoryOffers: mock<PaginatedResponse<OfferSummaryPresentation>>()
                }
            }))
        })

        it('should have the expected HTML structure', () => {

            expect(container).toMatchSnapshot()
        })
    })

    describe('when there is one page', () => {

        beforeEach(() => {
            ({container} = render(CategoryProductsPage, {
                data: {
                    id: categoryId,
                    categories: getAllCategories(),
                    currentCategoryOffers: getCategoryProducts()
                }
            }))
        })

        it('should have the expected HTML structure', () => {

            expect(container).toMatchSnapshot()
        })
    })

    describe('when on any other page', () => {

        beforeEach(() => {
            ({container} = render(CategoryProductsPage, {
                data: {
                    id: categoryId,
                    categories: getAllCategories(),
                    currentCategoryOffers: getCategoryProducts({
                        limit: 18,
                        totalPages: 3,
                        currentPage: 2,
                    })
                }
            }))
        })

        it('should have the expected HTML structure', () => {

            expect(container).toMatchSnapshot()
        })
    })

    describe('when on last page', () => {

        beforeEach(() => {
            ({container} = render(CategoryProductsPage, {
                data: {
                    id: categoryId,
                    categories: getAllCategories(),
                    currentCategoryOffers: getCategoryProducts({
                        limit: 18,
                        totalPages: 3,
                        currentPage: 3,
                    })
                }
            }))
        })

        it('should have the expected HTML structure', () => {

            expect(container).toMatchSnapshot()
        })
    })

    function getAllCategories() {
        return [mock<CategorySummaryPresentation>({
            id: categoryId,
            name: categoryName
        })]
    }

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})


function getItems(count = 10) {
    const items = []
    for (let i = 0; i < count; i++) {
        items.push(mock<OfferSummaryPresentation>({
            id: `an-offer-id-${i}`,
            name: `an-offer-${i}`,
            price: i * 100,
            image: `an-offer-image-${i}`,
            description: `an-offer-description-${i}`,
            isSoldByQuantities: i % 2 === 0,
            unit: `an-offer-unit-${i}`,
        }))
    }
    return items
}

function getCategoryProducts({limit = 18, totalPages = 3, currentPage = 2,} = {}) {
    return mock<PaginatedResponse<OfferSummaryPresentation>>({
        items: getItems(limit),
        currentPage,
        totalPages,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        previousPage: currentPage > 1 ? currentPage - 1 : null,
    })
}
