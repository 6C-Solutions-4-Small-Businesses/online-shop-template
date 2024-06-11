import SearchInput from '$lib/frontend/components/SearchInput.svelte'
import '@testing-library/jest-dom'
import {cleanup, fireEvent, render, type RenderResult, screen} from '@testing-library/svelte'
import {afterEach, beforeEach, describe, expect} from 'vitest'
import type {ToastStore} from '@skeletonlabs/skeleton'

describe('Search input', () => {

    const inputId = 'search-input-id'
    const buttonId = 'search-input-button-id'
    const onSearchSubmitHandler = vi.fn()
    const onSearchTermChangeHandler = vi.fn()
    const onSearchResetHandler = vi.fn()

    let searchButton: HTMLButtonElement
    let searchInput: HTMLButtonElement
    let renderResult: RenderResult<SearchInput, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        renderResult = render(SearchInput, {
            props: {
                inputId,
                buttonId,
                width: 'w-20',
                onSearchSubmitHandler,
                onSearchTermChangeHandler,
                onSearchResetHandler,
            },
        })
        searchButton = screen.getByTestId(buttonId) as HTMLButtonElement
        searchInput = screen.getByTestId(inputId) as HTMLButtonElement
    })

    it('should have match snapshot', () => {
        expect(renderResult.container).toMatchSnapshot()
    })

    describe('always', () => {

        it('should invoke "onSearchTermChangeHandler"', () => {

            fireEvent.input(searchInput, {target: {value: 'a'}})

            expect(onSearchTermChangeHandler).toHaveBeenCalledWith('a')
        })

        it('should invoke "onSearchResetHandler" when clear button is clicked', async () => {

            await fireEvent.input(searchInput, {target: {value: 'ri'}})
            const clearButton = screen.getByTestId('search-input-clear-button') as HTMLButtonElement

            await fireEvent.click(clearButton)

            expect(onSearchResetHandler).toHaveBeenCalled()
        })
    })

    describe('when search term is valid', () => {

        beforeEach(async () => {

            await fireEvent.input(searchInput, {target: {value: 'ri'}})
        })

        it('Search button should not be disable when searched product name length is greater than two', async () => {

            expect(searchButton.disabled).toBe(false)
        })

        it('should invoke "onSearchSubmitHandler" when search button is clicked', () => {

            fireEvent.click(searchButton)

            expect(onSearchSubmitHandler).toBeCalled()
        })

        it('should invoke "onSearchSubmitHandler" when "Enter" key is pressed while search term is valid', () => {

            fireEvent.keyPress(searchInput, {key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13})

            expect(onSearchSubmitHandler).toBeCalled()
        })
    })

    describe('when search term is invalid', () => {

        it('Search button should be disable when searched product name length is inferior to two', async () => {

            await fireEvent.input(searchInput, {target: {value: 'r'}})

            expect(searchButton.disabled).toBe(true)
        })
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})
