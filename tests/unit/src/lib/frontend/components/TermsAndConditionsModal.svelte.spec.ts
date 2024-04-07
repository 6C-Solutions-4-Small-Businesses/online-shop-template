import {beforeEach, describe, expect, it} from 'vitest'
import '@testing-library/jest-dom'
import type {ModalStore} from '@skeletonlabs/skeleton'
import {render, type RenderResult, screen as vScreen} from '@testing-library/svelte'
import TermsAndConditionsModal from '$lib/frontend/components/TermsAndConditionsModal.svelte'
import {mock} from 'vitest-mock-extended'
import type {SvelteComponent} from 'svelte'

describe('TermsAndConditionsModal component', () => {
    const parentOnModalClosed = vi.fn()
    let view: RenderResult<TermsAndConditionsModal, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        view = render(TermsAndConditionsModal, {
            props: {
                parent: mock<SvelteComponent>({
                    onClose: parentOnModalClosed
                })
            }
        })
    })

    it('should have match snapshot', () => {
        expect(view.container).toMatchSnapshot()
    })

    it(`should contain an close button`, () => {
        expect(vScreen.getByTestId('close-button')).toBeInTheDocument()
    })
})

vi.mock('@skeletonlabs/skeleton', async () => {
    const actual = await import('@skeletonlabs/skeleton')
    const {modalStore} = await import('$mocks/src/lib/frontend/components/Modals')
    return {
        ...actual,
        getModalStore: (): ModalStore => modalStore
    }
})