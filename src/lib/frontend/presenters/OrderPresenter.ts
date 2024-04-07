import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'
import type {OrderDetails} from '$lib/backend/order/models/OrderDetails'
import type {Order} from '@prisma/client'
import type {CheckoutSession} from '$lib/backend/stripe/models/CheckoutSession'
import type {Delivery} from '$lib/backend/uberDirect/models/Delivery'
import type {CartItem} from '$lib/backend/cart/CartItem'
import type {ManifestItem} from '$lib/backend/uberDirect/Types'

export class OrderPresenter {

    presentFromOrderDetails(orderDetails: OrderDetails): OrderDetailsPresentation {
        return {
            id: orderDetails.id,
            checkoutSessionId: orderDetails.stripeCheckoutSessionId,
            customerId: orderDetails.stripeCustomerId,
            deliveryId: orderDetails.uberDirectDeliveryId,
            status: orderDetails.status,
            description: orderDetails.description,
            amount: orderDetails.amount,
            createdAt: orderDetails.createdAt.toISOString(),
            canceledAt: orderDetails.canceledAt?.toISOString(),
            canceledBy: orderDetails.canceledBy,
            items: this.mapToOrderDetailsItemPresentation(orderDetails.items),
            delivery: orderDetails.delivery,
        }
    }

    presentFromModels(
        models: { order: Order, checkoutSession: CheckoutSession, delivery: Delivery }
    ): OrderDetailsPresentation {
        return {
            id: models.order.id,
            checkoutSessionId: models.order.stripeCheckoutSessionId,
            customerId: models.order.stripeCustomerId,
            deliveryId: models.order.uberDirectDeliveryId,
            status: models.order.status,
            description: models.order.description,
            amount: models.order.amount,
            createdAt: models.order.createdAt.toISOString(),
            canceledAt: models.order.canceledAt?.toISOString(),
            canceledBy: models.order.canceledBy,
            items: this.mapToOrderDetailsItemPresentation(models.checkoutSession.items),
            delivery: models.delivery,
        }
    }

    private mapToOrderDetailsItemPresentation(items: CartItem[]): (CartItem & ManifestItem)[] {
        return items.map((item) => {
            return {
                ...item,
                amountInCents: item.selectedQuantity * item.price,
            }
        })
    }
}
