<script lang="ts">
    import {goto} from '$app/navigation'
    import CustomAppBar from '$lib/frontend/components/CustomAppBar.svelte'
    import '../app.postcss'
    import {
        Drawer,
        type DrawerSettings,
        getDrawerStore,
        getModalStore,
        initializeStores,
        Modal,
        type ModalComponent
    } from '@skeletonlabs/skeleton'
    import {Toaster} from 'svelte-french-toast'
    import IdentificationModal from '$lib/frontend/components/IdentificationModal.svelte'
    import {page} from '$app/stores'
    import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'
    import type {PageData} from './$types'
    import {showCookiesDisclaimer} from "$lib/frontend/stores/localStorageStore/ShowCookiesDisclaimerStore"
    import {browser} from "$app/environment"

    export let data: PageData

    let isOnHomePage: boolean
    $: isOnHomePage = $page.route.id === '/'

    initializeStores()
    const drawerStore = getDrawerStore()
    const modalStore = getModalStore()


    const modalRegistry: Record<string, ModalComponent> = {
        identificationModal: {ref: IdentificationModal},
    }

    async function navigateToContactUsPage(): Promise<void> {
        drawerStore.close()
        await goto('/contact')
    }

    async function onUserProfileClicked() {
        await openAuthenticationModal(modalStore)
    }

    function toggleDrawer(): void {
        if ($drawerStore.open) {
            drawerStore.close()
        } else {
            const drawerSettings: DrawerSettings = {
                shadow: 'drop-shadow-2xl',
                bgDrawer: 'bg-white',
                rounded: 'none',
                width: 'w-8/12',
                position: 'right',
                padding: 'pt-14'
            }

            drawerStore.open(drawerSettings)
        }
    }

    async function goToTermsAndConditions(): Promise<void> {
        await goto('/terms-and-conditions')
    }

    async function goToProductsPage(categoryId: string): Promise<void> {
        await goto(`/category/${categoryId}`)
    }
</script>
<Toaster/>
<Modal components="{modalRegistry}"/>
<div class="bg-white">
    <CustomAppBar
            isDrawerOpened={$drawerStore.open}
            isOnHomePage={isOnHomePage}
            on:toggleDrawer={toggleDrawer}
    />
    <div class="absolute top-0 -z-10 w-full h-full pt-14">
        <slot/>
        <Drawer>
            <button
                    class="w-full text-lg text-center font-thin mt-4"
                    data-testid="user-profile-drawer-button"
                    on:click={onUserProfileClicked}
            >
                Profil
            </button>
            <button class="w-full text-lg text-center font-thin mt-4" on:click={navigateToContactUsPage}>
                Contactez-nous
            </button>
        </Drawer>
        {#if browser && $showCookiesDisclaimer}
            <CookiesDisclaimerModal/>
        {/if}
        <div class="footer w-full flex flex-col justify-center items-center bg-green-100 py-6 gap-7">
            <div class={`w-11/12 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 grid-flow-row gap-y-2 gap-x-5`}>
                {#each data.categories as {id, name}}
                    <button class="font-light hover:underline text-left truncate text-sm xl:text-md"
                            on:click={() => goToProductsPage(id)}>{name}</button>
                {/each}
            </div>
            <div class="terms-conditions w-full md:w-11/12 flex flex-col md:flex-row-reverse md:justify-between items-center gap-3 md:gap-0 text-sm md:text-md">
                <button class="text-slate-500" data-testid="terms-and-condition-button"
                        on:click={goToTermsAndConditions}>Termes et conditions
                </button>
                <span class="text-slate-500">v{data.version} ©{(new Date()).getFullYear()} <b>6C Solutions</b>. Tous droits reservés.</span>
            </div>
        </div>
    </div>
</div>
