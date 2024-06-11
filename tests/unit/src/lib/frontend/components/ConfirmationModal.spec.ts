import {afterEach, beforeEach, describe, expect} from 'vitest'
import '@testing-library/jest-dom'
import {render, type RenderResult, screen as vScreen, waitFor} from '@testing-library/svelte'
import type {SvelteComponent} from 'svelte'
import {mock} from 'vitest-mock-extended'
import ConfirmationModal from '$lib/frontend/components/ConfirmationModal.svelte'
import type {ModalStore} from '@skeletonlabs/skeleton'
import {currentModalSettings, currentModalStoreOnResponse} from '$mocks/src/lib/frontend/stores/ModalStore'

describe('ConfirmationModal component', () => {

    const title = 'Title'
    const bodyContent = 'Body'
    const body = `<b>${bodyContent}</b>`
    const buttonTextCancel = 'annuler'
    const buttonTextConfirm = 'soumettre'

    let view: RenderResult<ConfirmationModal, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        currentModalSettings.title = title
        currentModalSettings.body = body
        currentModalSettings.buttonTextConfirm = buttonTextConfirm
        currentModalSettings.buttonTextCancel = buttonTextCancel
        currentModalSettings.meta = {
            isHtml: true,
        }
        view = render(ConfirmationModal, {
            props: {
                parent: mock<SvelteComponent>(),
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
            const bodyElement = vScreen.getByText(bodyContent)
            expect(bodyElement).toBeInTheDocument()
        })

        it('should contains a cancel button', () => {
            const cancelButton = vScreen.getByText(buttonTextCancel)
            expect(cancelButton).toBeInTheDocument()
        })

        it('should contains a confirm button', () => {
            const submitButton = vScreen.getByText(buttonTextConfirm)
            expect(submitButton).toBeInTheDocument()
        })
    })

    describe('Behavior', () => {
        it('should call "response" with a "true" on modal settings store when submit button is clicked', async () => {
            const submitButton = vScreen.getByText(buttonTextConfirm)
            submitButton.click()

            await waitFor(() => expect(currentModalStoreOnResponse).toHaveBeenCalledWith(true))
        })

        it('should call "response" with a "false" on modal settings when cancel button is clicked', () => {
            const cancelButton = vScreen.getByText(buttonTextCancel)
            cancelButton.click()

            expect(currentModalStoreOnResponse).toHaveBeenCalledWith(false)
        })
    })

    afterEach(() => {
        view.unmount()
        vi.clearAllMocks()
    })
})

vi.mock('@skeletonlabs/skeleton', async () => {
    const actual = await import('@skeletonlabs/skeleton')
    const {modalStore} = await import('$mocks/src/lib/frontend/stores/ModalStore')
    return {
        ...actual,
        getModalStore: (): ModalStore => modalStore,
    }
})
