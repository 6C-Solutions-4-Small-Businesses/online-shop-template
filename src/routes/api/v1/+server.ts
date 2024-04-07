import {json, type RequestHandler} from '@sveltejs/kit'
import {response} from "$data/presentations/response";
import {FETCH_REQUESTS_DELAY} from "$routes/api/Config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET: RequestHandler = async ({params}) => {

    await new Promise((resolve) => setTimeout(resolve, FETCH_REQUESTS_DELAY))

    return json(response)
}
