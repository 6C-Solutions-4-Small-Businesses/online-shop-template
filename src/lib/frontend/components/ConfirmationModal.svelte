<script lang="ts">
    import BaseModal from '$lib/frontend/components/BaseModal.svelte'
    import Input from '$lib/frontend/components/Input.svelte'
    import {getModalStore, type ModalSettings} from '@skeletonlabs/skeleton'
    import type {SvelteComponent} from 'svelte'
    import {writable, type Writable} from 'svelte/store'
    import {isEmailInvalid as isEmailInvalidFunction} from '$lib/frontend/core/Helper'
    import {findUser} from '$lib/frontend/endpoints/Endpoints'
    import {Email} from '$lib/frontend/requests/FindUserRequest'
    import type {FoundUserPresentation} from '$lib/frontend/presentations/FoundUserPresentation'

    const modalStore = getModalStore()
    const modalSettings = $modalStore[0] as ModalSettings

    export let parent: SvelteComponent

    async function onConfirmationClickHandler(confirmed: boolean): Promise<void> {
        if (modalSettings.response) {
            modalSettings.response(confirmed)
        }
        modalStore.close()
    }
</script>

{#if modalSettings}
    <div class="w-full md:w-6/12 lg:w-6/12 xl:w-4/12">
        <BaseModal
                title={modalSettings.title}
                body={modalSettings.body}
                isHtml="{modalSettings.meta?.isHtml}"
                parent={parent}
                buttonTextCancel={modalSettings.buttonTextCancel}
                buttonTextSubmit={modalSettings.buttonTextConfirm}
                onSubmitClickHandler={() => onConfirmationClickHandler(true)}
                onCancelClickHandler="{() => onConfirmationClickHandler(false)}"
        >
        </BaseModal>
    </div>
{/if}
