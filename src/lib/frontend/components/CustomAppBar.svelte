<script lang='ts'>
    import {goto} from '$app/navigation'
    import logo from '$lib/frontend/assets/images/logo.png'
    import SearchInput from '$lib/frontend/components/SearchInput.svelte'
    import {cart} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
    import '@fontsource/dancing-script'
    import {AppBar, getModalStore} from '@skeletonlabs/skeleton'
    import {createEventDispatcher, onDestroy} from 'svelte'
    import CloseIcon from '~icons/mdi/alpha-x-box-outline'
    import MenuIcon from '~icons/mdi/menu'
    import HomeIcon from '~icons/mdi/home-outline'
    import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'
    import {PUBLIC_BUSINESS_NAME} from '$env/static/public'

    export let isDrawerOpened = false
    export let isOnHomePage: boolean

    const businessName = PUBLIC_BUSINESS_NAME
    const businessNameFirstPart = businessName?.split(' ')[0] ?? 'Demo'
    const businessNameSecondPart = businessName?.split(' ')[1] ?? 'Merchant'
    const modalStore = getModalStore()
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

    onDestroy(unsubscribe)
</script>

<AppBar background="transparent" class='w-full px-10 py-2 gap-2.5 flex text-white'
        slotTrail={`w-36 ${isOnHomePage ? 'md:w-64' : 'md:w-80'}`}>
    <svelte:fragment slot='lead'>
        <button class='w-[30px] h-[35px]' on:click={navigateToHomePage}>
            <img alt='{businessName} Logo' class='w-[30px] h-[35px]' src={logo}>
        </button>
    </svelte:fragment>

    <div class='flex justify-between'>
        <div class='text-xl font-semibold'>
            <span class='title'>{businessNameFirstPart}</span>
            <span class='business-name font-thin'>{businessNameSecondPart}</span>
        </div>
        <!--        <div class='hidden xl:flex w-1/2'>-->
        <!--            <SearchInput buttonId="app-bar-search-input-button" inputId="app-bar-search-input" width='w-full'/>-->
        <!--        </div>-->
    </div>
    <svelte:fragment slot='trail'>
        <div class='flex w-full justify-end items-center gap-6 py-3'>
            {#if (!isOnHomePage)}
                <button class='text-sm hidden sm:hidden md:block font-semibold' on:click={navigateToHomePage}>
                    Accueil
                </button>
            {/if}
            <button class='text-sm hidden sm:hidden md:block font-semibold mr-4' on:click={navigateToContactUsPage}>
                Contactez-nous
            </button>
            {#if (!isOnHomePage)}
                <div class='text-3xl relative flex md:hidden'>
                    <button
                            class='hover:text-orange-500 text-sm flex justify-center items-center'
                            data-testid="home-button"
                            on:click={navigateToHomePage}>
                        <HomeIcon/>
                    </button>
                </div>
            {/if}
            <div class='text-3xl flex relative'>
                <button class='hover:text-orange-500' on:click={navigateToShoppingCartPage}>
                    <img alt="remove" class="h-5 w-5" src="shopping-cart.svg">
                </button>

                <span class='absolute left-4 bottom-4 bg-red text-10 text-white w-4 h-4 flex justify-center items-center rounded-full border border-orange-500'>
                  {numberOfProductsInCart}
                </span>
            </div>

            <div class='relative hidden sm:hidden md:block'>
                <button
                        class='hover:text-orange-500 flex justify-center items-center'
                        data-testid="user-profile-button"
                        on:click={onUserProfileClicked}>
                    <img alt="remove" class="h-5 w-5 ml-2" src="user.svg">
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
<style lang='css'>
    .title {
        font-family: 'Dancing Script', serif
    }

    .business-name {
        font-family: Roboto, sans-serif
    }
</style>
