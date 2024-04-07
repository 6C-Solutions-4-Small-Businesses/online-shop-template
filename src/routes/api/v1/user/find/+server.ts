import {error, json, type RequestHandler} from '@sveltejs/kit';
import {integratorUserAccount} from "$data/presentations/user/find/response";
import {FETCH_REQUESTS_DELAY} from "$routes/api/Config";

export const POST: RequestHandler = async ({request}) => {

    await new Promise((resolve) => setTimeout(resolve, FETCH_REQUESTS_DELAY))

    const parameters = await request.json()
    if (parameters.email === 'integrator@mail.com') {

        return json(integratorUserAccount)
    } else {
        error(404, { message: 'USER_NOT_FOUND' })
    }
}
