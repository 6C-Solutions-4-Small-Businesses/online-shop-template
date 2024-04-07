import {NODE_ENV} from '$env/static/private'
import {error} from '@sveltejs/kit'

export function throwInvalidRequestError(info?: {
    message?: string,
    cause?: Error,
}): never {
    const message = info?.message ?? 'INVALID_REQUEST'
    if (NODE_ENV !== 'test') {
        console.log(`${message}, ${info?.cause}`)
    }
    error(400, {message})
}

export function throwInternalServerError(info?: {
    message?: string,
    cause?: Error | { message: string },
}): never {
    const message = info?.message ?? 'INTERNAL_SERVER_ERROR'
    if (NODE_ENV !== 'test') {
        console.log(`${message}, ${info?.cause}`)
    }
    error(500, {message})
}
