import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
import type {ModalSettings, ModalStore} from '@skeletonlabs/skeleton'
import type {FoundUserPresentation} from '$lib/frontend/presentations/FoundUserPresentation'

export async function openAuthenticationModal(
    store: ModalStore
): Promise<UserAccountSummaryPresentation | string | undefined> {
    return await new Promise<UserAccountSummaryPresentation | string | undefined>((resolve) => {
        const modal: ModalSettings = {
            type: 'component',
            title: 'Identification par courriel',
            component: 'identificationModal',
            body: 'Tapez votre adresse courriel afin que nous puissions vous identifier.',
            buttonTextSubmit: 'Soumettre',
            buttonTextCancel: 'Annuler',

            response: (userInfo: FoundUserPresentation | null) => {
                if (userInfo === null || userInfo === undefined) {
                    resolve(undefined)
                    return
                }
                resolve(userInfo.account ?? userInfo.email)
            }
        }
        store.trigger(modal)
    })
}
