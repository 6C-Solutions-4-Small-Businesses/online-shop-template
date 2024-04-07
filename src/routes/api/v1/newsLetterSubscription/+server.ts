import {json, type RequestHandler} from '@sveltejs/kit';
import {response} from "$data/presentations/newsLetterSubscription/response";
import {FETCH_REQUESTS_DELAY} from "$routes/api/Config";

export const POST: RequestHandler = async ({request}) => {
    await new Promise((resolve) => setTimeout(resolve, FETCH_REQUESTS_DELAY))

    return json(response)
}
