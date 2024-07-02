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
        type ModalComponent,
        Toast,
    } from '@skeletonlabs/skeleton'
    import IdentificationModal from '$lib/frontend/components/IdentificationModal.svelte'
    import OffersModificationModal from '$lib/frontend/components/OffersModificationModal.svelte'
    import {page} from '$app/stores'
    import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'
    import type {PageData} from './$types'
    import {showCookiesDisclaimer} from '$lib/frontend/stores/localStorageStore/ShowCookiesDisclaimerStore'
    import {browser, dev} from '$app/environment'
    import CookiesDisclaimerModal from '$lib/frontend/components/CookiesDisclaimerModal.svelte'
    import {initialLocale, loadTranslations, locale, t} from '$translations/index'
    import {inject} from '@vercel/analytics'
    import ConfirmationModal from '$lib/frontend/components/ConfirmationModal.svelte'
    import OfferSearchModal from '$lib/frontend/components/OfferSearchModal.svelte'
    import {onMount} from 'svelte'

    export let data: PageData

    let isOnHomePage: boolean
    $: isOnHomePage = $page.route.id === '/'

    initializeStores()
    const drawerStore = getDrawerStore()
    const modalStore = getModalStore()

    inject({mode: dev ? 'development' : 'production'})

    const modalRegistry: Record<string, ModalComponent> = {
        identificationModal: {ref: IdentificationModal},
        offersModificationModal: {ref: OffersModificationModal},
        confirmationModal: {ref: ConfirmationModal},
        offerSearchModal: { ref: OfferSearchModal},
    }

    onMount(() => {
        loadTranslations(initialLocale)
    })

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
                padding: 'pt-14',
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
<Toast/>
<Modal components="{modalRegistry}"/>
<div class="bg-transparent">
    <CustomAppBar
            isDrawerOpened={$drawerStore.open}
            isOnHomePage={isOnHomePage}
            on:toggleDrawer={toggleDrawer}
    />
    <div class="absolute top-0 -z-10 w-full h-full">
        <slot/>
        <Drawer>
            <button
                    class="w-full text-lg text-center font-thin mt-4"
                    data-testid="user-profile-drawer-button"
                    on:click={onUserProfileClicked}
            >
                {$t('layout.profile')}
            </button>

            <button class="w-full text-lg text-center font-thin mt-4" on:click={navigateToContactUsPage}>
                {$t('layout.contactUs')}
            </button>
        </Drawer>
        {#if browser && $showCookiesDisclaimer}
            {#if $locale}
                <CookiesDisclaimerModal/>
            {/if}
        {/if}
        <div class="footer w-full flex flex-col justify-center items-center bg-primary py-6 gap-7">
            <div class={`w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 grid-flow-row gap-y-2 gap-x-5 border-b-[1px] border-primary p-10`}>
                {#each data.categories as {id, name}}
                    <button class="font-semibold hover:underline text-left truncate text-sm xl:text-md text-white"
                            on:click={() => goToProductsPage(id)}>{name}
                    </button>
                {/each}
            </div>

            <div class="h-[90px] px-[19px] flex-col justify-center gap-2.5 inline-flex font-semibold text-white">
                <div class="gap-[30px] inline-flex">
                    <div>{$t('layout.aboutUs')}</div>

                    <div>
                        <button data-testid="terms-and-condition-button" on:click={goToTermsAndConditions}>
                            {$t('layout.termsAndConditions')}
                        </button>
                    </div>

                    <div>{$t('layout.contactUs')}</div>
                </div>

                <div class="w-full text-center text-xs">
                    <span>
                        v{data.version} ©{(new Date()).getFullYear()}
                        <b>6C Solutions</b>. {$t('layout.allRightsReserved')}
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
