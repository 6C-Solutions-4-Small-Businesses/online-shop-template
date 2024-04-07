import {json, type RequestHandler} from '@sveltejs/kit'
import {
    checkoutSessionWith16Items, checkoutSessionWith1Item
} from "$data/presentations/cart/checkout/[session_id]/response";
import {FETCH_REQUESTS_DELAY} from "$routes/api/Config";

export const POST: RequestHandler = async (event) => {

    await new Promise((resolve) => setTimeout(resolve, FETCH_REQUESTS_DELAY))

    if (event.url.searchParams.get('items') === '1') {
        return json(checkoutSessionWith1Item)
    } else {
        return json(checkoutSessionWith16Items)
    }
}
