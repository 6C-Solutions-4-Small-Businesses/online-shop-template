<script lang="ts">

    import {page} from '$app/stores'
    import {finalizeCheckoutSession} from '$lib/frontend/endpoints/Endpoints'
    import {getToastStore, ProgressBar} from '@skeletonlabs/skeleton'
    import {getErrorToastSettings} from '$lib/frontend/core/ToasterUtils'
    import {clearShoppingCartStore} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
    import OrderDetail from '$lib/frontend/components/OrderDetail.svelte'
    import {PUBLIC_BUSINESS_NAME} from '$env/static/public'
    import {track} from '@vercel/analytics/server'
    import {CHECKOUT_COMPLETED_EVENT} from '$lib/shared/Analytics'

    track(CHECKOUT_COMPLETED_EVENT)

    const toastStore = getToastStore()
</script>
<div class="w-full max-w-full h-screen bg-gray-50 overflow-y-scroll md:overflow-hidden">
    {#await
        finalizeCheckoutSession($page.params.session_id)
            .then((orderDetails) => {
                clearShoppingCartStore()
                return orderDetails
            })
    }
        <ProgressBar value={undefined} data-testid="loading-indicator"/>
    {:then orderDetails}
        {#if orderDetails}
            <div class="title text-3xl font-thin pt-5 pl-5">Commande confirmée!</div>
            <div class="w-full flex flex-col items-center">
                <p class="text-xl md:text-xl font-thin my-7"><span class="font-bold">{PUBLIC_BUSINESS_NAME}</span> vous
                    remercie!
                </p>
                <OrderDetail order={orderDetails}/>
            </div>
        {/if}
    {:catch _}
        {toastStore.trigger(getErrorToastSettings('Nous sommes désolés, mais nous n\'avons pas pu finaliser votre session de paiement. Veuillez réessayer plus tard.'))}
    {/await}
</div>
