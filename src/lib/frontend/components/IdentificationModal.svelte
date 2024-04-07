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

    export let parent: SvelteComponent
    export let isEmailInvalid: Writable<boolean> = writable(true)
    export let email: Writable<string> = writable()

    const modalStore = getModalStore()
    const modalSettings = $modalStore[0] as ModalSettings

    function onChangeHandler(event: Event) {
        const enteredEmail = (event.target as HTMLInputElement).value
        if (enteredEmail && enteredEmail != '') {
            email.set(enteredEmail)
            if (!isEmailInvalidFunction(enteredEmail)) {
                isEmailInvalid.set(false)
            } else {
                isEmailInvalid.set(true)
            }

        } else {
            isEmailInvalid.set(true)
        }
    }

    async function onFormSubmit(): Promise<void> {
        const foundUser = await findUser(Email.create($email))
        if (modalSettings.response) {
            modalSettings.response({account: foundUser, email: $email} satisfies FoundUserPresentation)
        }
        modalStore.close()
    }
</script>

{#if modalSettings}
    <div class="w-full md:w-6/12 lg:w-6/12 xl:w-4/12">
        <BaseModal
                title={modalSettings.title}
                body={modalSettings.body}
                parent={parent}
                buttonTextCancel={modalSettings.buttonTextCancel}
                buttonTextSubmit={modalSettings.buttonTextSubmit}
                submitButtonDisabled={$isEmailInvalid}
                onSubmitClickHandler={onFormSubmit}
        >
            <form class="w-11/12">
                <Input
                        id="email-input"
                        label="Email"
                        placeholder="Entrez votre courriel"
                        value={$email}
                        error={$isEmailInvalid}
                        onChange={onChangeHandler}
                />
            </form>
        </BaseModal>
    </div>
{/if}
