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

<div class="w-full relative flex flex-col bg-white"
     on:focus={() => isProductHovered = true}
     on:mouseleave={()=> isProductHovered = false}
     on:mouseover={()=> isProductHovered = true}
     role="none"
>
    <Image imageRemoteUrl="{image}" name={name}
           classes="object-contain h-[15rem] sm:h-[30rem] md:h-[30rem] lg:h-[30rem] xl:h-[30rem] py-5"
            width="{640}"/>
    <div
            class={`h-16 flex items-center justify-center gap-2 text-3xl rounded-none ${isProductHovered ? 'bg-green-50' : 'bg-white'}`}
    >
        <span>{name}</span>
        <span class="font-bold text-red-500"> {price / 100 >= 1 ? "$" : "¢"}{price / 100}</span>
    </div>
    <div class={`${isProductHovered ? 'w-full md:w-2/3 absolute top-0 right-0 flex justify-end' : 'hidden'}`}>
        <ShoppingCartActions
                image={image}
                name={name}
                productId={id}
                regularPrice={price}
                salePrice={salePrice}
        />
    </div>
</div>
