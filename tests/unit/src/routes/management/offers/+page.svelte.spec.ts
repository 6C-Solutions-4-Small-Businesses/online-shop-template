import OffersManagementPage from '$routes/management/offers/+page.svelte'
import {cleanup, fireEvent, render, type RenderResult} from '@testing-library/svelte'
import type {ModalStore, ToastStore} from '@skeletonlabs/skeleton'
import {sendOffersManagementRequests} from '$mocks/src/lib/frontend/endpoints/ManagementEndpoints'
import {mock} from 'vitest-mock-extended'
import type {OffersModificationPresentation} from '$lib/frontend/presentations/OffersModificationPresentation'
import '@testing-library/jest-dom'
import {afterEach} from 'vitest'
import {currentModalStoreOnTrigger} from '$mocks/src/lib/frontend/stores/ModalStore'

describe('/management/offers', () => {

    let view: RenderResult<OffersManagementPage>
    beforeEach(() => {

        view = render(OffersManagementPage, {
            props: {
                offersModifications: [mock<OffersModificationPresentation>({
                    price: 100,
                })],
            },
        })
    })

    describe('HTML structure', () => {

        it('should match snapshot', () => {
            expect(view.container).toMatchSnapshot()
        })
    })

    describe('Behavior', () => {

        it('should call "sendOffersManagementRequests" when confirm action dialog apply button is pressed', async () => {
            const applyModificationsButton = view.getByTestId('apply-modifications-button')

            expect(applyModificationsButton).not.toBeDisabled()
            await fireEvent.click(applyModificationsButton)
            const confirmationModalSettings = currentModalStoreOnTrigger.mock.calls[0][0]
            await confirmationModalSettings.response(true)

            expect(sendOffersManagementRequests).toHaveBeenCalled()
        })
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})

vi.mock('$lib/frontend/endpoints/ManagementEndpoints', async () => {
    const { sendOffersManagementRequests } = await import('$mocks/src/lib/frontend/endpoints/ManagementEndpoints')
    return {
        sendOffersManagementRequests,
    }
})

vi.mock('@skeletonlabs/skeleton', async () => {
    const actual = await import('@skeletonlabs/skeleton')
    const {toastStore} = await import('$mocks/src/lib/frontend/stores/ToastStore')
    const {modalStore} = await import('$mocks/src/lib/frontend/stores/ModalStore')
    return {
        ...actual,
        getToastStore: (): ToastStore => toastStore,
        getModalStore: (): ModalStore => modalStore,
    }
})
