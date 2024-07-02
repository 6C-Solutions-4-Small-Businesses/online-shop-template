<script lang="ts">
    import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'
    import Image from '$lib/frontend/components/Image.svelte'

    export let id: string
    export let image: string
    export let name: string
    export let price: number
    export let salePrice: number | undefined | null = null

    let isProductHovered = false
</script>

<div class="relative h-[326px] p-4 bg-white rounded-[10px] shadow flex-col justify-start items-start gap-[25px]"
     on:focus={() => isProductHovered = true}
     on:mouseleave={()=> isProductHovered = false}
     on:mouseover={()=> isProductHovered = true}
     role="none"
>
    <div class={`${isProductHovered ? 'w-full absolute flex justify-end top-0 right-0' : 'hidden'}`}>
        <ShoppingCartActions
                image={image}
                name={name}
                productId={id}
                regularPrice={price}
                salePrice={salePrice}
        />
    </div>

    <div class="w-[238px] h-[200px] mt-10 self-center justify-between items-center flex mx-auto">
        <Image imageRemoteUrl="{image}" name={name} classes="w-[238px] h-[200px] object-contain"/>
    </div>

    <div class="w-full flex-col justify-start items-start gap-2.5 flex mt-6">
        <div class="w-full justify-between items-center flex">
            <div class="text-accent pl-1.5 overflow-hidden max-h-[35px]">{name}</div>

            <div class="text-primary text-15 flex ml-3">
                {price / 100 >= 1 ? "$" : "¢"}{price / 100}
            </div>
        </div>
    </div>
</div>
