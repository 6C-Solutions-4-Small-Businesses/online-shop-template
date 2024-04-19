<script lang="ts">

    import {getErrorToastSettings} from '$lib/frontend/core/ToasterUtils'
    import {getToastStore, ProgressBar} from '@skeletonlabs/skeleton'
    import {getUserProfile} from '$lib/frontend/endpoints/UserProfileEndpoints'

    const toastStore = getToastStore()

</script>
<div class="w-full max-w-full h-screen bg-gray-50 overflow-y-scroll md:overflow-hidden">
    {#await getUserProfile()}
        <ProgressBar value={undefined} data-testid="loading-indicator"/>
    {:then userProfile}
        {#if userProfile}
            <div class="title text-3xl font-thin pt-5 pl-5">Votre Compte</div>
            <div class="w-full flex flex-col items-center">

            </div>
        {/if}
    {:catch _}
        {toastStore.trigger(getErrorToastSettings('Nous n\'avons pas pu charger votre profil. Veuillez réessayer plus tard.'))}
    {/await}
</div>
