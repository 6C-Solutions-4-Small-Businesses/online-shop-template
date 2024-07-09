<script lang="ts">
    import ShoppingCartProductCard from '$lib/frontend/components/ShoppingCartProductCard.svelte'
    import {cart} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
    import {onDestroy} from 'svelte'
    import CartIcon from '~icons/mdi/cart-variant'
    import {goto} from '$app/navigation'
    import {getModalStore} from '@skeletonlabs/skeleton'
    import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'

    const modalStore = getModalStore()

    let totalPrice = 0

    const unsubscribe = cart.subscribe((newShoppingCartStoreMapValue) => {
        if (newShoppingCartStoreMapValue.size > 0) {
            const newShoppingCartStoreArrayValue = Array.from(newShoppingCartStoreMapValue)
            totalPrice = newShoppingCartStoreArrayValue.reduce(
                (accumulator, [_, currentValue]) => accumulator + (currentValue.selectedQuantity * currentValue.price),
                0
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
<div class="w-full max-w-full h-screen bg-slate-100 overflow-y-scroll md:overflow-hidden">
    <div class="title text-3xl font-thin pt-5 pl-5">Shopping Cart</div>
    {#if $cart.size > 0}
        <div class="w-full p-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {#each $cart.values() as shoppingCartProductState}
                {#if (shoppingCartProductState.selectedQuantity > 0)}
                    <ShoppingCartProductCard
                            id={shoppingCartProductState.id}
                            name={shoppingCartProductState.name}
                            image={shoppingCartProductState.image}
                            price={shoppingCartProductState.price}
                            percentage={shoppingCartProductState.promotion?.percentage}
                    />
                {/if}
            {/each}
        </div>
    {:else }
        <div class="w-full flex flex-col items-center">
            <div class="text-[13rem] md:text-[15rem] mt-10">
                <CartIcon/>
            </div>
            <div class="text-2xl md:text-3xl font-thin text-orange-500 mt-7">Votre panier est actuellement vide.</div>
        </div>
    {/if}
</div>
{#if $cart.size > 0}
    <div class="sticky flex justify-end items-center bottom-0 bg-green-50 h-14">
        <div class="mr-10 text-lg font-thin">Sub Total: <span
                class="text-3xl font-light text-orange-500">${(totalPrice / 100).toFixed(2)}</span></div>
        <button class="uppercase w-36 h-11 mr-10 border border-orange-500 rounded-sm text-orange-500 bg-orange-50"
                data-testid="checkout-button"
                on:click={startCheckout}>checkout
        </button>
    </div>
{/if}
