import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'
import '@testing-library/jest-dom'
import {afterEach, beforeAll, expect, type Mock} from 'vitest'
import {modalStore} from '$mocks/src/lib/frontend/stores/ModalStore'
import {render, type RenderResult, screen, waitFor} from '@testing-library/svelte'
import CustomAppBar from '$lib/frontend/components/CustomAppBar.svelte'
import type {ModalSettings, ModalStore, ToastStore} from '@skeletonlabs/skeleton'
import CategoryListModal from "$lib/frontend/components/CategoryListModal.svelte";

describe('Custom App Bar Component', () => {
    let view: RenderResult<CustomAppBar, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        view = render(CustomAppBar, {
            isOnHomePage: true,
            categories:[]
        })
    })

    //TODO() Why is this failing in Gitlab?
    // describe('by default', () => {
    //     it('should have match snapshot', () => {
    //         const {container} = render(CustomAppBar, {
    //             isOnHomePage: true
    //         })
    //
    //         expect(container).toMatchSnapshot()
    //     })
    // })

    describe('behavior', () => {
        let openAuthenticationModalMock: Mock

        beforeAll(() => {
            vi.mock('$lib/frontend/stores/authentication/Authentication', async () => {
                return {
                    openAuthenticationModal: vi.fn(),
                }
            })

            openAuthenticationModalMock = openAuthenticationModal as Mock
        })

        it('should call "openAuthenticationModal" when "user-profile-button" is clicked', async () => {
            const userProfileButton = screen.getByTestId('user-profile-button')

            userProfileButton.click()

            await waitFor(() => expect(openAuthenticationModalMock).toHaveBeenCalledWith(modalStore))
        })

        it('should call "modalStore.trigger" when "category-list-button" is clicked', async () => {
            const categoryListButton = screen.getByTestId('category-list-button')

            categoryListButton.click()

            await waitFor(() => expect(modalStore.trigger).toHaveBeenCalledWith<[ModalSettings]>({
                type: "component",
                component: {
                    ref: CategoryListModal,
                    props: {
                        categories: [],
                    },
                }
            }))
        })

        // TODO(): Fix those test when enhancing the app bar
        // it('should call "fetchSearchedOffersResult" with search term when "onSearchSubmitHandler" is called', async () => {
        //     const searchTerm = 'rer'
        //
        //     await view.component.onSearchSubmitHandler(searchTerm)
        //
        //     expect(fetchSearchedOffersResult).toHaveBeenCalledWith(searchTerm)
        // })
        //
        // it('should navigate to "/offer/search" when search does not fail', async () => {
        //     const searchTerm = 'rer'
        //     fetchSearchedOffersResult.mockResolvedValueOnce({})
        //
        //     await view.component.onSearchSubmitHandler(searchTerm)
        //
        //     expect(goto).toHaveBeenCalledWith('/offer/search')
        // })
        //
        // it('should trigger error message toast when search fails', async () => {
        //
        //     fetchSearchedOffersResult.mockResolvedValueOnce(undefined)
        //
        //     await view.component.onSearchSubmitHandler('rer')
        //
        //     expect(toastStore.trigger).toHaveBeenCalledWith(expect.objectContaining({
        //         message: 'Nous sommes désolés, mais nous avons des difficultés à rechercher des produits. Veuillez réessayer plus tard.',
        //     }))
        // })
    })

    afterEach(() => {
        view.unmount()
        vi.clearAllMocks()
    })
})

vi.mock('@skeletonlabs/skeleton', async () => {
    const actual = await import('@skeletonlabs/skeleton')
    const {modalStore} = await import('$mocks/src/lib/frontend/stores/ModalStore')
    const {toastStore} = await import('$mocks/src/lib/frontend/stores/ToastStore')
    return {
        ...actual,
        getModalStore: (): ModalStore => modalStore,
        getToastStore: (): ToastStore => toastStore,
    }
})

vi.mock('$lib/frontend/endpoints/OfferEndpoints', async () => {
    const {fetchSearchedOffersResult} = await import('$mocks/src/lib/frontend/endpoints/OfferEndpoints')
    return {
        fetchSearchedOffersResult,
    }
})

vi.mock('$app/navigation', async () => {
    return {
        goto: vi.fn(),
    }
})
