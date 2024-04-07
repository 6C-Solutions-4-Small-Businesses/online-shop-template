import OrderDetail from '$lib/frontend/components/OrderDetail.svelte'
import {cleanup, render, screen} from '@testing-library/svelte'
import {mock} from 'vitest-mock-extended'
import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'
import '@testing-library/jest-dom'
import {afterEach, vi} from 'vitest'
import {getOfferCartItems} from '$tests/unit/src/lib/TestHelpers'
import type {DeliveryPresentation} from "$lib/frontend/presentations/DeliveryPresentation";

describe('Order Details Component', () => {

    const items = getOfferCartItems()
    const orderId = 'the order id'
    const deliveryTrackingUrl = 'https://tracking.url'

    beforeEach(() => {
        render(OrderDetail, {
            props: {
                order: mock<OrderDetailsPresentation>({
                    id: orderId,
                    status: 'InProgress',
                    items,
                    delivery: mock<DeliveryPresentation>({
                        trackingUrl: deliveryTrackingUrl,
                    })
                }),
            },
        })
    })

    describe('statically', () => {

        it('should have match snapshot', () => {
            const {container} = render(OrderDetail, {
                props: {
                    order: mock<OrderDetailsPresentation>({
                        items: [mock({
                            id: 'product-id-1',
                            name: 'product-1',
                            price: 100,
                            image: 'an-image-url',
                            description: 'a-product',
                            quantity: 10,
                            isSoldByQuantities: false,
                            unit: 'Centiliter',
                        }), mock({
                            id: 'product-id-2',
                            name: 'product-2',
                            price: 800,
                            image: 'an-image-url',
                            description: 'a-product',
                            quantity: 10,
                            isSoldByQuantities: false,
                            unit: 'Milliliter',
                        }), mock({
                            id: 'product-id-3',
                            name: 'product-3',
                            price: 1200,
                            image: 'an-image-url',
                            description: 'a-product',
                            quantity: 10,
                            isSoldByQuantities: false,
                            unit: 'Gramme',
                        })],
                    })
                }
            })

            expect(container).toMatchSnapshot()
        })
    })

    describe('initially', () => {

        it('should show the link for tracking the delivery', async () => {

            expect(screen.getByTestId('track-delivery-link')).toHaveAttribute('href', deliveryTrackingUrl)
        })

        test.each([
            ...items,
        ])('should show the item $id in the order', async (cartItem: { id: string }) => {

            expect(await screen.findByTestId(cartItem.id)).toBeInTheDocument()
        })
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})
