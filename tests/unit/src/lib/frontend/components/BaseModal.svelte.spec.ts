import {beforeEach, describe, expect} from 'vitest'
import '@testing-library/jest-dom'
import {render, type RenderResult, screen as vScreen} from '@testing-library/svelte'
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
    let view: RenderResult<BaseModal, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        view = render(BaseModal, {
            props: {
                title,
                body,
                buttonTextCancel,
                buttonTextSubmit,
                parent: mock<SvelteComponent>({
                    onClose: parentOnModalClosed
                }),
                onSubmitClickHandler
            }
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
})
