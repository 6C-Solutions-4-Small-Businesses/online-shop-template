import {json, type RequestHandler} from '@sveltejs/kit';
import {FETCH_REQUESTS_DELAY} from "$routes/api/Config";
import {order} from '$data/presentations/order/[id]/response'

export const GET: RequestHandler = async ({params}) => {
    await new Promise((resolve) => setTimeout(resolve, FETCH_REQUESTS_DELAY))

    return json(order)
}
