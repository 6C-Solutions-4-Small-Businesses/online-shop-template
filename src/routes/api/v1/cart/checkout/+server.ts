import {json, type RequestHandler} from '@sveltejs/kit'
import {
    expiredSession,
    response
} from "$data/presentations/cart/checkout/response";
import {FETCH_REQUESTS_DELAY} from "$routes/api/Config";
import {integratorUserAccount} from "$data/presentations/user/find/response";

export const POST: RequestHandler = async ({request}) => {

    await new Promise((resolve) => setTimeout(resolve, FETCH_REQUESTS_DELAY))

    const payload = await request.json()
    if (payload.user.customerId === integratorUserAccount.customerId) {
        return json(response)
    } else {
        return json(expiredSession)
    }
}
