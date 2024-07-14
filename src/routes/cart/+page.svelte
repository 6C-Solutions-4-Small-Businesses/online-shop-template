<script lang="ts">
    import ShoppingCartProductCard from '$lib/frontend/components/ShoppingCartProductCard.svelte'
    import {cart} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
    import {onDestroy} from 'svelte'
    import CartIcon from '~icons/mdi/cart-variant'
    import {goto} from '$app/navigation'
    import {getModalStore} from '@skeletonlabs/skeleton'
    import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'
    import {t} from "$translations/index";
    import SortIcon from "$lib/frontend/components/icons/SortIcon.svelte";

    const modalStore = getModalStore()

    let totalPrice = 0

    const unsubscribe = cart.subscribe((newShoppingCartStoreMapValue) => {
        if (newShoppingCartStoreMapValue.size > 0) {
            const newShoppingCartStoreArrayValue = Array.from(newShoppingCartStoreMapValue)
            totalPrice = newShoppingCartStoreArrayValue.reduce(
                (accumulator, [_, currentValue]) => accumulator + (currentValue.selectedQuantity * currentValue.price),
                0,
            )
        } else {
            totalPrice = 0
        }
    })

    async function startCheckout(): Promise<void> {

        const userInfo = await openAuthenticationModal(modalStore, false)

        if (userInfo) {
            let endpoint = `/cart/checkout?`
            if (typeof userInfo === 'string') {
                endpoint += `email=${encodeURIComponent(userInfo)}`
            } else if (!userInfo.customerId) {
                endpoint += `email=${encodeURIComponent(userInfo.email)}`
                endpoint += `&phoneNumber=${encodeURIComponent(userInfo.phoneNumber)}`
            } else {
                endpoint += `customerId=${userInfo.customerId}`
            }

            await goto(endpoint)
        }
    }

    onDestroy(unsubscribe)
</script>
<div class="w-full max-w-full min-h-screen bg-slate-100">
    <div class="title flex justify-between items-center mt-5 px-10 py-5 h-20 border-b border-black border-opacity-10">
        <span class="text-primary uppercase text-2xl lg:text-32">{$t('cart.title')}</span>
        <SortIcon/>
    </div>
    {#if $cart.size > 0}
        <div class="w-full px-2.5 py-6 grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7">
            {#each $cart.values() as shoppingCartProductState}
                {#if (shoppingCartProductState.selectedQuantity > 0)}
                    <ShoppingCartProductCard
                            id={shoppingCartProductState.id}
                            name={shoppingCartProductState.name}
                            image={shoppingCartProductState.image}
                            price={shoppingCartProductState.price}
                            percentage={shoppingCartProductState.promotion?.percentage}
                            salePrice={shoppingCartProductState.promotion?.salePrice}
                    />
                {/if}
            {/each}
        </div>
    {:else }
        <div class="w-full flex flex-col items-center">
            <div class="text-[13rem] md:text-[15rem] mt-10">
                <CartIcon/>
            </div>
            <div class="text-2xl md:text-3xl font-thin text-orange-500 mt-7">{$t('cart.empty')}</div>
        </div>
    {/if}
</div>
{#if $cart.size > 0}
    <div class="sticky flex flex-col justify-center items-center gap-5 bottom-0 bg-white h-42 sm:flex-row sm:justify-end sm:items-center sm:h-22 md:h-30">
        <div class="text-xl font-semibold text-primary">Sub Total: <span
                class="text-28 leading-[33px] font-semibold text-primary">${(totalPrice / 100).toFixed(2)}</span></div>
        <button class="uppercase w-[300px] h-[39px] mr-6 rounded-[10px] text-white bg-primary font-semibold text-base"
                data-testid="checkout-button"
                on:click={startCheckout}>{$t('cart.checkout')}
        </button>
    </div>
{/if}
