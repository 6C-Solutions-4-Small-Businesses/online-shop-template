<script lang="ts">
    import Image from '$lib/frontend/components/Image.svelte'
    import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'
    import DiscountSticker from '$lib/frontend/components/DiscountSticker.svelte'

    export let id: string
    export let name: string
    export let image: string
    export let price: number
    export let percentage: number | null | undefined = null
</script>

<div class="relative w-[367px] h-[149px] p-[15px] flex gap-4 bg-white rounded-10">
    {#if (percentage)}
        <DiscountSticker percentage={percentage}/>
    {/if}
    <Image classes="w-[161px] h-[119px] object-contain scale" imageRemoteUrl="{image}" name={name}/>
    <div class="w-[161px] h-[119px] flex flex-col justify-between">
        <div class="w-full h-[12px] flex justify-end">
            <div class="font-thin flex items-center text-primary text-sm">CAD${(price / 100).toFixed(2)}</div>
        </div>
        <div class="w-full h-[100px] flex flex-col justify-end gap-1">
            <p class="w-full min-h-12 h-12 text-stone text-16 leading-6 font-bold line-clamp-2">{name}</p>
            <div class="w-full h-[50px] pb-2.5">
                <ShoppingCartActions
                        full
                        width={161}
                        height={50}
                        productId={id}
                        name={name}
                        image={image}
                        regularPrice={price}
                />
            </div>
        </div>
    </div>
</div>