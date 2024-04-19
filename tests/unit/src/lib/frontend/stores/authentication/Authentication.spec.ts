import {currentModalStoreOnTrigger, modalStore} from '$mocks/src/lib/frontend/stores/ModalStore'
import type {ModalSettings} from '@skeletonlabs/skeleton'
import {mock} from 'vitest-mock-extended'
import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'
import {afterEach} from 'vitest'
import type {FoundUserPresentation} from '$lib/frontend/presentations/FoundUserPresentation'

describe('requestAuthentication', () => {
    const userEmail = 'a@mail.com'
    const expectedUserAccount = mock<UserAccountSummaryPresentation>()

    let foundUserInfo: FoundUserPresentation
    let result: UserAccountSummaryPresentation | string | undefined

    beforeEach(async () => {
        foundUserInfo = mock<FoundUserPresentation>({
            email: userEmail
        })
        currentModalStoreOnTrigger.mockImplementation((modal: ModalSettings) => {
            modal.response?.call(modal, foundUserInfo)
        })
        result = await openAuthenticationModal(modalStore)
    })

    it('should prompt user for email using the "EmailInputModal" component', async () => {
        expect(modalStore.trigger).toHaveBeenCalledWith(
            expect.objectContaining({
                body: 'Tapez votre adresse courriel afin que nous puissions vous identifier.',
                component: 'identificationModal',
                title: 'Identification par courriel',
                type: 'component',
                buttonTextSubmit: 'Soumettre',
                buttonTextCancel: 'Annuler'
            })
        )
    })

    it(`should return a UserAccountSummaryPresentation for the existing user when prompt resolves`, async () => {
        foundUserInfo = {
            account: expectedUserAccount,
            email: userEmail
        }

        result = await openAuthenticationModal(modalStore)

        expect(result).toEqual(foundUserInfo.account)
    })

    it(`should return the entered email when prompt resolves if user was not found`, async () => {
        foundUserInfo = {
            email: userEmail
        }

        result = await openAuthenticationModal(modalStore)

        expect(result).toStrictEqual(userEmail)
    })

    it('should return "undefined" if user info returned by identification modal is invalid', async () => {
        currentModalStoreOnTrigger.mockImplementation((modal: ModalSettings) => {
            modal.response?.call(modal, undefined)
        })

        result = await openAuthenticationModal(modalStore)

        expect(result).toBeUndefined()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})
