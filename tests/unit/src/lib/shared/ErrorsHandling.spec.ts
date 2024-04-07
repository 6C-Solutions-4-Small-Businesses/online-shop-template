import {throwInternalServerError, throwInvalidRequestError} from '$lib/shared/ErrorsHandling'
import {type HttpError} from '@sveltejs/kit'
import {expect} from 'vitest'

describe('throwInvalidRequestError', () => {

    it('should throw', () => {
        expect(throwInvalidRequestError).toThrow()
    })

    it('should have a status code of 400', () => {

        try {
            expect(throwInvalidRequestError())
        } catch (e) {
            expect((e as HttpError).status).toBe(400)
        }
    })

    it('should have a message in its body saying "INVALID_REQUEST"', () => {

        try {
            expect(throwInvalidRequestError())
        } catch (e) {
            expect((e as HttpError).body.message).toBe("INVALID_REQUEST")
        }
    })

    it('should be able to handle a custom message in its body ', () => {

        try {
            expect(throwInvalidRequestError({ message: 'CUSTOM'}))
        } catch (e) {
            expect((e as HttpError).body.message).toBe('CUSTOM')
        }
    })
})

describe('throwInternalServerError', () => {

    it('should throw', () => {
        expect(throwInternalServerError).toThrow()
    })

    it('should have a status code of 500', () => {

        try {
            expect(throwInternalServerError())
        } catch (e) {
            expect((e as HttpError).status).toBe(500)
        }
    })

    it('should have a message in its body saying "INTERNAL_SERVER_ERROR"', () => {

        try {
            expect(throwInternalServerError())
        } catch (e) {
            expect((e as HttpError).body.message).toBe('INTERNAL_SERVER_ERROR')
        }
    })

    it('should be able to handle a custom message in its body ', () => {

        try {
            expect(throwInternalServerError({ message: 'CUSTOM'}))
        } catch (e) {
            expect((e as HttpError).body.message).toBe('CUSTOM')
        }
    })
})
