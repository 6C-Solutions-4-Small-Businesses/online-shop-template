import {afterEach, beforeEach, describe, expect} from 'vitest'
import '@testing-library/jest-dom'
import {render, type RenderResult, screen as vScreen, waitFor} from '@testing-library/svelte'
import BaseModal from '$lib/frontend/components/BaseModal.svelte'
import type {SvelteComponent} from 'svelte'
import {mock} from 'vitest-mock-extended'
import Button from '$lib/frontend/components/Button.svelte'

const buttonId = 'button-id'
describe('Button component', () => {
    const title = 'Title'
    const body = 'Body'
    const buttonTextCancel = 'annuler'
    const buttonTextSubmit = 'soumettre'
    const parentOnModalClosed = vi.fn()
    const onClickHandler = vi.fn()

    let view: RenderResult<Button, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        view = render(Button, {
            props: {
                id: buttonId,
                text: 'Button text',
                onClick: onClickHandler,
                border: 'border-2',
                background: 'bg-blue-500',
                block: true,
                disabled: false,
                classNames: 'text-white',
            }
        })
    })

    describe('Structure', () => {
        it('should have match snapshot', () => {
            expect(view.container).toMatchSnapshot()
        })
    })

    describe('Behavior', () => {
        it('should call "onClickHandler" when button is clicked', async () => {
            const button = vScreen.getByTestId(buttonId)
            button.click()

            await waitFor(() => expect(onClickHandler).toHaveBeenCalled())
        })
    })

    afterEach(() => {
        view.unmount()
        vi.clearAllMocks()
    })
})
