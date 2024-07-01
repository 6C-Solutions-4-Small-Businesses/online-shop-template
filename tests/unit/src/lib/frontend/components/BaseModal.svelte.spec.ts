import {afterEach, beforeEach, describe, expect} from 'vitest'
import '@testing-library/jest-dom'
import {render, type RenderResult, screen as vScreen, waitFor} from '@testing-library/svelte'
import BaseModal from '$lib/frontend/components/BaseModal.svelte'
import type {SvelteComponent} from 'svelte'
import {mock} from 'vitest-mock-extended'

describe('BaseModal component', () => {
    const title = 'Title'
    const body = 'Body'
    const buttonTextCancel = 'annuler'
    const buttonTextSubmit = 'soumettre'
    const parentOnModalClosed = vi.fn()
    const onSubmitClickHandler = vi.fn()
    const onCancelClickHandler = vi.fn()
    let view: RenderResult<BaseModal, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        view = render(BaseModal, {
            props: {
                title,
                body,
                buttonTextCancel,
                buttonTextSubmit,
                background: 'bg-gray-500 bg-opacity-50',
                parent: mock<SvelteComponent>(),
                onSubmitClickHandler,
                onCancelClickHandler,
            },
        })
    })

    describe('Structure', () => {
        it('should have match snapshot', () => {
            expect(view.container).toMatchSnapshot()
        })

        it('should contains a title', () => {
            const titleElement = vScreen.getByText(title)
            expect(titleElement).toBeInTheDocument()
        })

        it('should contains a body', () => {
            const bodyElement = vScreen.getByText(body)
            expect(bodyElement).toBeInTheDocument()
        })

        it('should contains a cancel button', () => {
            const cancelButton = vScreen.getByText(buttonTextCancel)
            expect(cancelButton).toBeInTheDocument()
        })

        it('should contains a submit button', () => {
            const submitButton = vScreen.getByText(buttonTextSubmit)
            expect(submitButton).toBeInTheDocument()
        })
    })

    describe('Behavior', () => {
        it('should call "onSubmitClickHandler" when submit button is clicked', async () => {
            const submitButton = vScreen.getByText(buttonTextSubmit)
            submitButton.click()

            await waitFor(() => expect(onSubmitClickHandler).toHaveBeenCalled())
        })

        it('should call "parentOnModalClosed" when cancel button is clicked if "onCancelClickHandler" is not set', async () => {
            rerender()

            const cancelButton = vScreen.getByText(buttonTextCancel)
            cancelButton.click()

            await waitFor(() => expect(parentOnModalClosed).toHaveBeenCalled())
        })

        it('should call "onCancelClickHandler" if defined when cancel button is clicked', () => {
            const cancelButton = vScreen.getByText(buttonTextCancel)
            cancelButton.click()

            expect(onCancelClickHandler).toHaveBeenCalled()
        })

        it('should display body has html if "isHtml" is true', () => {
            rerender({ isHtml: true })

            const bodyElement = vScreen.getByText('Body')
            expect(bodyElement).toBeInTheDocument()
        })
    })

    function rerender(properties: { isHtml: boolean } = { isHtml: false }) {
        view.unmount()
        view = render(BaseModal, {
            props: {
                title,
                body: '<div>Body</div>',
                buttonTextCancel,
                buttonTextSubmit,
                parent: mock<SvelteComponent>({
                    onClose: parentOnModalClosed,
                }),
                onSubmitClickHandler,
                isHtml: properties.isHtml,
            },
        })
    }

    afterEach(() => {
        view.unmount()
        vi.clearAllMocks()
    })
})
