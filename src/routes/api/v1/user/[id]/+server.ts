import {json, type RequestHandler} from '@sveltejs/kit';
import {owner} from "$data/presentations/user/[id]/response";
import {FETCH_REQUESTS_DELAY} from "$routes/api/Config";

export const GET: RequestHandler = async ({params}) => {
    await new Promise((resolve) => setTimeout(resolve, FETCH_REQUESTS_DELAY))

    return json(owner)
}
