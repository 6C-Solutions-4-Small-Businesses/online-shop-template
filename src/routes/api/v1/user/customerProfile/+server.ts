import {json, type RequestHandler} from '@sveltejs/kit'
import {response} from "$data/presentations/user/customerProfile/response";
import {FETCH_REQUESTS_DELAY} from "$routes/api/Config";

export const POST: RequestHandler = async (event) => {
    await new Promise((resolve) => setTimeout(resolve, FETCH_REQUESTS_DELAY))

    return json(response)
}
