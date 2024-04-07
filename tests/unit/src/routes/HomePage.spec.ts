import {render} from '@testing-library/svelte'
import {beforeAll, describe, expect} from 'vitest'
import HomePage from '$routes/+page.svelte'
import {IntersectionObserver} from '$mocks/src/lib/frontend/IntersectionObserverStub'

describe('Home page', () => {
    beforeAll(() => {

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn(),
        })
        window.IntersectionObserver = IntersectionObserver
        global.IntersectionObserver = IntersectionObserver
        window.ResizeObserver =
            window.ResizeObserver ||
            vi.fn().mockImplementation(() => ({
                disconnect: vi.fn(),
                observe: vi.fn(),
                unobserve: vi.fn(),
            }))
    })

    it('should have match snapshot', () => {
        const {container} = render(HomePage, {
            data: {
                collections: [
                    {
                        id: 'collection-id-1',
                        name: 'spotlight',
                        description: 'a-collection',
                        type: 'Spotlight',
                        offers: [
                            {
                                id: 'product-id-1',
                                name: 'product-1',
                                price: 100,
                                image: 'an-image-url',
                                description: 'a-product',
                                quantity: 10,
                                isSoldByQuantities: false,
                                unit: 'Centiliter',
                            },
                            {
                                id: 'product-id-2',
                                name: 'product-2',
                                price: 800,
                                image: 'an-image-url',
                                description: 'a-product',
                                quantity: 10,
                                isSoldByQuantities: false,
                                unit: 'Milliliter',
                            },
                            {
                                id: 'product-id-3',
                                name: 'product-3',
                                price: 1200,
                                image: 'an-image-url',
                                description: 'a-product',
                                quantity: 10,
                                isSoldByQuantities: false,
                                unit: 'Gramme',
                            }
                        ]
                    },
                    {
                        id: 'collection-id-2',
                        name: 'En spéciale',
                        description: 'a-collection',
                        type: 'Sale',
                        offers: [
                            {
                                id: 'product-id-4',
                                name: 'product-4',
                                price: 100,
                                image: 'an-image-url',
                                description: 'a-product',
                                quantity: 10,
                                isSoldByQuantities: false,
                                unit: 'Unit',
                            },
                            {
                                id: 'product-id-5',
                                name: 'product-5',
                                price: 800,
                                image: 'an-image-url',
                                description: 'a-product',
                                quantity: 10,
                                isSoldByQuantities: false,
                                unit: 'Pound',
                            },
                            {
                                id: 'product-id-6',
                                name: 'product-6',
                                price: 1200,
                                image: 'an-image-url',
                                description: 'a-product',
                                quantity: 10,
                                isSoldByQuantities: false,
                                unit: 'Portion',
                            }
                        ]
                    },
                    {
                        id: 'collection-id-3',
                        name: 'Nous vous recommandons',
                        description: 'a-collection',
                        type: 'Common',
                        offers: [
                            {
                                id: 'product-id-7',
                                name: 'product-7',
                                price: 100,
                                image: 'an-image-url',
                                description: 'a-product',
                                quantity: 10,
                                isSoldByQuantities: false,
                                unit: 'Kilogram',
                            },
                            {
                                id: 'product-id-8',
                                name: 'product-8',
                                price: 800,
                                image: 'an-image-url',
                                description: 'a-product',
                                quantity: 10,
                                isSoldByQuantities: false,
                                unit: 'Kilogram',
                            }
                        ]
                    }
                ]
            }
        })

        expect(container).toMatchSnapshot()
    })
})
