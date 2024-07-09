<script lang="ts">
    import Image from '$lib/frontend/components/Image.svelte'
    import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'
    import PromotionSticker from '$lib/frontend/components/PromotionSticker.svelte'

    export let id: string
    export let name: string
    export let image: string
    export let price: number
    export let percentage: number | null | undefined = null
    export let salePrice: number | null | undefined = null
</script>

<div class="relative w-[367px] h-[149px] p-[15px] flex gap-4 bg-white rounded-10">
    {#if (percentage)}
        <PromotionSticker percentage={percentage}/>
    {/if}
    <Image classes="w-[161px] h-[119px] object-contain scale" imageRemoteUrl="{image}" name={name}/>
    <div class="w-[161px] h-[119px] flex flex-col justify-between">
        <div class="w-full h-[12px] flex justify-end">
            <div class={`font-bold flex items-center text-sm ${percentage ? 'text-error' : 'text-primary'}`}>
                CAD${((salePrice ?? price) / 100).toFixed(2)}</div>
        </div>
        <div class="w-full h-[100px] flex flex-col justify-end gap-1">
            <div class="flex items-center w-full min-h-12 h-12">
                <p class="w-full text-stone text-16 leading-6 font-bold line-clamp-2">{name}</p>
            </div>
            <div class="w-full h-[50px] pb-2.5">
                <ShoppingCartActions
                        full
                        height={50}
                        width={161}
                        image={image}
                        name={name}
                        productId={id}
                        regularPrice={price}
                />
            </div>
        </div>
    </div>
</div>