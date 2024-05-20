import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'
import '@testing-library/jest-dom'
import {afterEach, beforeAll, expect, type Mock} from 'vitest'
import {modalStore} from '$mocks/src/lib/frontend/components/Modals'
import {cleanup, render, screen, waitFor} from '@testing-library/svelte'
import CustomAppBar from '$lib/frontend/components/CustomAppBar.svelte'
import type {ModalStore} from '@skeletonlabs/skeleton'

describe('Custom App Bar Component', () => {
    beforeEach(() => {
        render(CustomAppBar, {
            isOnHomePage: true
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
                    openAuthenticationModal: vi.fn()
                }
            })

            openAuthenticationModalMock = openAuthenticationModal as Mock
        })

        it('should call "openAuthenticationModal" when "user-profile-button" is clicked', async () => {
            const userProfileButton = screen.getByTestId('user-profile-button')

            userProfileButton.click()

            await waitFor(() => expect(openAuthenticationModalMock).toHaveBeenCalledWith(modalStore))
        })
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
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
