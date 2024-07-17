import {afterEach, assert, beforeEach, describe, expect} from 'vitest'
import '@testing-library/jest-dom'
import {fireEvent, render, type RenderResult, screen as vScreen, waitFor} from '@testing-library/svelte'
import type {SvelteComponent} from 'svelte'
import {mock} from 'vitest-mock-extended'
import type {ModalStore} from '@skeletonlabs/skeleton'
import {currentModalSettings, currentModalStoreOnResponse} from '$mocks/src/lib/frontend/stores/ModalStore'
import OfferSearchModal from '$lib/frontend/components/OfferSearchModal.svelte'
import {searchedProductResult} from '$lib/frontend/stores/productStore/SearchProductStore'
import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
import type {PaginationPresentation} from '$lib/frontend/core/PaginationPresentation'
import { fetchSearchedOffersResult } from '$mocks/src/lib/frontend/endpoints/OfferEndpoints'

describe('OfferSearchModal component', () => {

    const title = 'Title'
    const body = `Body`
    const onClose = vi.fn()

    let searchInput: HTMLInputElement
    let view: RenderResult<OfferSearchModal, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        currentModalSettings.title = title
        currentModalSettings.body = body
        currentModalSettings.buttonTextConfirm = undefined
        currentModalSettings.buttonTextCancel = undefined
        currentModalSettings.meta = {
            onClose,
        }
        view = render(OfferSearchModal, {
            props: getComponentsProperties(),
        })
        searchInput = vScreen.getByTestId('search-input') as HTMLInputElement
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

        it('should NOT have a cancel button', () => {
            try {
                vScreen.getByText('cancel-button')
                assert.fail('Cancel button should not be present')
            } catch (e) {
            }
        })

        it('should NOT have a confirm button', () => {
            try {
                vScreen.getByText('continue-button')
                assert.fail('Continue button should not be present')
            } catch (e) {
            }
        })
    })

    describe('Behavior', () => {

        describe('when the search gave some results', () => {

            const offer1 = mock<OfferSummaryPresentation>({
                id: 'offer-1',
            })

            beforeEach(async () => {
                fetchSearchedOffersResult.mockResolvedValue(mock<PaginationPresentation<OfferSummaryPresentation>>({
                    items: [
                        offer1,
                        mock<OfferSummaryPresentation>({
                            id: 'offer-2',
                        }),
                        mock<OfferSummaryPresentation>({
                            id: 'offer-3',
                        }),
                    ],
                }))
                await fireEvent.input(searchInput, {target: {value: 'search with results'}})
            })

            it('should display offers in search result when there are any', () => {

                expect(vScreen.getByTestId('offer-1')).toBeInTheDocument()
                expect(vScreen.getByTestId('offer-2')).toBeInTheDocument()
                expect(vScreen.getByTestId('offer-3')).toBeInTheDocument()
            })

            it('should make the click handler of offer cards call the response method of the modal settings', () => {

                const offerCard = vScreen.getByTestId('offer-1')

                fireEvent.click(offerCard)

                expect(currentModalStoreOnResponse).toHaveBeenCalledWith(offer1)
            })
        })

        describe('otherwise', () => {

            it('should call the close function passed on through the meta of the modal settings when close modal button is clicked', async () => {

                const closeModalButton = vScreen.getByTestId('close-modal-button')

                await fireEvent.click(closeModalButton)

                await waitFor(() => expect(onClose).toHaveBeenCalled())
            })

            it('should show the "no match message" when search did not return any result', async () => {

                await fireEvent.input(searchInput, {target: {value: 'no match'}})
                searchedProductResult.set(mock())

                await waitFor(() => expect(vScreen.getByTestId('no-match-message')).toBeInTheDocument())
            })
        })
    })

    function getComponentsProperties() {
        return {
            parent: mock<SvelteComponent>(),
        }
    }

    afterEach(() => {
        view.unmount()
        vi.clearAllMocks()
        vi.clearAllTimers()
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

vi.mock('$lib/frontend/endpoints/OfferEndpoints', async () => {
    const {fetchSearchedOffersResult} = await import('$mocks/src/lib/frontend/endpoints/OfferEndpoints')
    return {
        fetchSearchedOffersResult,
    }
})

vi.mock('$lib/frontend/core/RxHelper', async () => {
    return {
        throttle: (func: (...args: any) => any, delay: number) : Promise<(...args: any) => void> => Promise.resolve((...args) => func(args)),
    }
})
