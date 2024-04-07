import {OrderPresenter} from '$lib/frontend/presenters/OrderPresenter'
import type {OrderDetails} from '$lib/backend/order/models/OrderDetails'
import {mock, type MockProxy} from 'vitest-mock-extended'
import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'
import type {CartItem} from '$lib/backend/cart/CartItem'
import type {Delivery} from '$lib/backend/uberDirect/models/Delivery'
import type {Order} from '@prisma/client'
import type {CheckoutSession} from '$lib/backend/stripe/models/CheckoutSession'

describe('Order Presenter', () => {

    const cartItem = mock<CartItem>({
        selectedQuantity: 1,
        price: 1234,
    })
    let presenter: OrderPresenter

    beforeEach(() => {
        presenter = new OrderPresenter()
    })

    describe('when given an OrderDetails model', () => {

        let orderDetails: MockProxy<OrderDetails>
        let presentation: OrderDetailsPresentation

        beforeEach(() => {
            orderDetails = mock<OrderDetails>({
                id: 'the-id',
                stripeCheckoutSessionId: 'a checkout session id',
                stripeCustomerId: 'a customer id',
                uberDirectDeliveryId: 'a delivery id',
                status: 'InProgress',
                description: 'a very good description',
                amount: 1234235,
                createdAt: new Date(),
                canceledAt: new Date(),
                canceledBy: 'Owner',
                items: [cartItem],
                delivery: mock(),
            })
            presentation = presenter.presentFromOrderDetails(orderDetails)
        })

        test.each([
            ['id', 'id'],
            ['stripeCheckoutSessionId', 'checkoutSessionId',],
            ['stripeCustomerId', 'customerId',],
            ['uberDirectDeliveryId', 'deliveryId',],
            ['status', 'status',],
            ['description', 'description',],
            ['amount', 'amount',],
            ['canceledBy', 'canceledBy',],
            ['delivery', 'delivery'],
        ])('should present the top-level property "%s" of the model into the property "%s" "OrderPresentation"', (modelKey, presentationKey) => {

            // @ts-ignore
            const value = orderDetails[modelKey]

            expect(value).toBeDefined()
            expect(presentation).toHaveProperty(presentationKey, value)
        })

        it('should present cart items from "OrderDetails" model', () => {

            expect(presentation.items[0]).toEqual(expect.objectContaining(cartItem))
        })

        test.each([
            ['createdAt', 'createdAt',],
            ['canceledAt', 'canceledAt',],
        ])('should present the top-level property of type date "%s" of the model into the property "%s" "OrderPresentation"', (modelKey, presentationKey) => {

            // @ts-ignore
            const value = orderDetails[modelKey]

            expect(value).toBeDefined()
            expect(presentation).toHaveProperty(presentationKey, (value as Date).toISOString())
        })
    })

    describe('when given Order, CheckoutSession and Delivery models', () => {

        let order: MockProxy<Order>
        let checkoutSession: MockProxy<CheckoutSession>
        let delivery: MockProxy<Delivery>
        let presentation: OrderDetailsPresentation

        beforeEach(() => {
            order = mock<Order>({
                id: 'the-id',
                stripeCheckoutSessionId: 'a checkout session id',
                stripeCustomerId: 'a customer id',
                uberDirectDeliveryId: 'a delivery id',
                status: 'InProgress',
                description: 'a very good description',
                amount: 1234235,
                createdAt: new Date(),
                canceledAt: new Date(),
                canceledBy: 'Owner',
            })
            checkoutSession = mock<CheckoutSession>({
                items: [cartItem]
            })
            delivery = mock<Delivery>()
            presentation = presenter.presentFromModels({
                order, checkoutSession, delivery,
            })
        })

        test.each([
            ['id', 'id'],
            ['stripeCheckoutSessionId', 'checkoutSessionId',],
            ['stripeCustomerId', 'customerId',],
            ['uberDirectDeliveryId', 'deliveryId',],
            ['status', 'status',],
            ['description', 'description',],
            ['amount', 'amount',],
            ['canceledBy', 'canceledBy',],
        ])('should present the top-level property "%s" of the model into the property "%s" "OrderPresentation"', (modelKey, presentationKey) => {

            // @ts-ignore
            const value = order[modelKey]

            expect(value).toBeDefined()
            expect(presentation).toHaveProperty(presentationKey, value)
        })

        test.each([
            ['createdAt', 'createdAt',],
            ['canceledAt', 'canceledAt',],
        ])('should present the top-level property of type date "%s" of the model into the property "%s" "OrderPresentation"', (modelKey, presentationKey) => {

            // @ts-ignore
            const value = order[modelKey]

            expect(value).toBeDefined()
            expect(presentation).toHaveProperty(presentationKey, (value as Date).toISOString())
        })

        it('should present cart items from "CheckoutSession" model', () => {

            expect(presentation.items[0]).toEqual(expect.objectContaining(cartItem))
        })

        it('should present delivery from "Delivery" model', () => {

            expect(presentation).toHaveProperty('delivery', delivery)
        })
    })
})
