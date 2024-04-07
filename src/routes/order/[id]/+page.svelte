<script lang="ts">

    import OrderDetail from '$lib/frontend/components/OrderDetail.svelte'
    import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'
    import type {PageData} from './$types'

    export let data: PageData

    const order = data as OrderDetailsPresentation

</script>
<div class="w-full max-w-full h-screen bg-slate-100 overflow-y-scroll md:overflow-hidden">
    <OrderDetail {order}/>
</div>
