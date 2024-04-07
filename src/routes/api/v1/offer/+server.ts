import {json, type RequestHandler} from '@sveltejs/kit'
import {xpressionPage1} from "$data/presentations/offer/response";
import {FETCH_REQUESTS_DELAY} from "$routes/api/Config";

export const GET: RequestHandler = async ({url}) => {
    await new Promise((resolve) => setTimeout(resolve, FETCH_REQUESTS_DELAY))

    return json(xpressionPage1)
}
