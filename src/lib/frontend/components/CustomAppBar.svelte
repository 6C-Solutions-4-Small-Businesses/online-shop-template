<script lang='ts'>
    import {goto} from '$app/navigation'
    import logo from '$lib/frontend/assets/images/logo.png'
    import SearchInput from '$lib/frontend/components/SearchInput.svelte'
    import {cart} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
    import '@fontsource/dancing-script'
    import {AppBar, getModalStore, getToastStore} from '@skeletonlabs/skeleton'
    import {createEventDispatcher, onDestroy} from 'svelte'
    import CloseIcon from '~icons/mdi/alpha-x-box-outline'
    import CartIcon from '~icons/mdi/cart-outline'
    import CloseSearchIcon from '~icons/mdi/magnify-close'
    import ExpandSearchIcon from '~icons/mdi/magnify-expand'
    import UserProfileIcon from '~icons/mdi/account-circle-outline'
    import MenuIcon from '~icons/mdi/menu'
    import HomeIcon from '~icons/mdi/home-outline'
    import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'
    import {PUBLIC_BUSINESS_NAME} from '$env/static/public'
    import {fetchSearchedOffersResult} from '$lib/frontend/endpoints/OfferEndpoints'
    import {
        searchedProductName,
        searchedProductResult,
        submittedProductName,
    } from '$lib/frontend/stores/productStore/SearchProductStore'
    import {getErrorToastSettings} from '$lib/frontend/core/ToasterUtils'

    export let isDrawerOpened = false
    export let isOnHomePage: boolean

    const businessName = PUBLIC_BUSINESS_NAME
    const businessNameFirstPart = businessName?.split(' ')[0] ?? 'Demo'
    const businessNameSecondPart = businessName?.split(' ')[1] ?? 'Merchant'
    const modalStore = getModalStore()
    const toastStore = getToastStore()
    const dispatch = createEventDispatcher()

    let numberOfProductsInCart = 0
    let isOverlaySearchBarVisible: boolean

    $: isOverlaySearchBarVisible = false

    const unsubscribe = cart.subscribe((newShoppingCartStoreMapValue) => {
        if (newShoppingCartStoreMapValue.size > 0) {
            const newShoppingCartStoreArrayValue = Array.from(newShoppingCartStoreMapValue)
            numberOfProductsInCart = newShoppingCartStoreArrayValue.reduce(
                (accumulator, [_, currentValue]) => accumulator + currentValue.selectedQuantity,
                0
            )
        } else {
            numberOfProductsInCart = 0
        }
    })

    async function navigateToShoppingCartPage(): Promise<void> {
        await goto('/cart')
    }

    async function navigateToHomePage(): Promise<void> {
        await goto('/')
    }

    async function navigateToContactUsPage(): Promise<void> {
        await goto('/contact')
    }

    function toggleOverlaySearchBarVisibility(): void {
        isOverlaySearchBarVisible = !isOverlaySearchBarVisible
    }

    function toggleDrawerHandler(): void {
        dispatch('toggleDrawer')
    }

    async function onUserProfileClicked() {
        await openAuthenticationModal(modalStore)
    }

    export async function onSearchSubmitHandler(searchTerm: string): Promise<void> {
        searchedProductName.set(searchTerm)
        const results = await fetchSearchedOffersResult(searchTerm)
        if (results) {
            searchedProductResult.set(results)
            submittedProductName.set($searchedProductName)
            await goto('/offer/search')
        } else {
            console.log('error')
            toastStore.trigger(getErrorToastSettings('Nous sommes désolés, mais nous avons des difficultés à rechercher des produits. Veuillez réessayer plus tard.'))
        }
    }

    onDestroy(unsubscribe)
</script>

<AppBar background='bg-green-50' class='fixed w-full z-10 h-14' padding='p-0'
        slotTrail={`w-36 ${isOnHomePage ? 'md:w-64' : 'md:w-80'}`}>
    <svelte:fragment slot='lead'>
        <button class='w-14 h-14' on:click={navigateToHomePage}>
            <img
                    alt='{businessName} Logo'
                    class='w-full h-full'
                    src={logo}
            >
        </button>
    </svelte:fragment>
    <div class='flex justify-between'>
        <div class='text-xl sm:text-2xl'>
            <span class='title'>{businessNameFirstPart}</span> <span
                class='business-name font-thin'>{businessNameSecondPart}</span>
        </div>
        <div class='hidden xl:flex w-1/2'>
            <SearchInput
                    buttonId="app-bar-search-input-button"
                    inputId="app-bar-search-input"
                    width='w-full'
                    onSearchSubmitHandler="{onSearchSubmitHandler}"
            />
        </div>
    </div>
    <svelte:fragment slot='trail'>
        <div class='flex w-full justify-around items-center'>
            <button
                    class='hover:text-orange-500 text-2xl flex justify-center items-center xl:hidden'
                    data-testid="overlay-search-bar-toggle-button"
                    on:click={toggleOverlaySearchBarVisibility}
            >
                {#if (isOverlaySearchBarVisible)}
                    <CloseSearchIcon/>
                {:else }
                    <ExpandSearchIcon/>
                {/if}
            </button>
            {#if (!isOnHomePage)}
                <button class='text-lg hidden sm:hidden md:block font-thin' on:click={navigateToHomePage}>
                    Accueil
                </button>
            {/if}
            <button class='text-lg hidden sm:hidden md:block font-thin' on:click={navigateToContactUsPage}>
                Contactez-nous
            </button>
            {#if (!isOnHomePage)}
                <div class='text-3xl relative flex md:hidden'>
                    <button
                            class='hover:text-orange-500 text-3xl flex justify-center items-center'
                            data-testid="home-button"
                            on:click={navigateToHomePage}>
                        <HomeIcon/>
                    </button>
                </div>
            {/if}
            <div class='text-3xl flex relative'>
                <button
                        class='hover:text-orange-500'
                        on:click={navigateToShoppingCartPage}
                >
                    <CartIcon/>
                </button>
                <span class='absolute left-5 bottom-5 bg-orange-500 text-xs text-white w-4 h-4 flex justify-center items-center rounded-full border border-orange-500'>
                  {numberOfProductsInCart}
                </span>
            </div>
            <div class='text-3xl relative hidden sm:hidden md:block'>
                <button
                        class='hover:text-orange-500 text-2xl flex justify-center items-center'
                        data-testid="user-profile-button"
                        on:click={onUserProfileClicked}>
                    <UserProfileIcon/>
                </button>
            </div>
            <button
                    class='text-3xl hover:text-orange-500 block sm:block md:hidden'
                    data-testid="menu-toggle-button"
                    on:click={toggleDrawerHandler}
            >
                {#if (isDrawerOpened)}
                    <CloseIcon/>
                {:else }
                    <MenuIcon/>
                {/if}
            </button>
        </div>
    </svelte:fragment>
</AppBar>
<div class={`fixed ${isOverlaySearchBarVisible ? 'flex justify-center' : 'hidden'} items-center w-full h-20 z-30 top-14 bg-white shadow-2xl xl:hidden`}
     data-testid="overlay-search-input-container"
>
    <SearchInput
            buttonId="overlay-search-input-button"
            inputId="overlay-search-input"
            width='w-full md:w-2/3'
            onSearchSubmitHandler="{onSearchSubmitHandler}"
    />
</div>

<style lang='css'>
    .title {
        font-family: 'Dancing Script', serif
    }

    .business-name {
        font-family: Roboto, sans-serif
    }
</style>
