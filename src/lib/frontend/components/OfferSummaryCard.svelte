<script lang="ts">
    import Image from '$lib/frontend/components/Image.svelte'

    export let id: string
    export let name: string
    export let image: string
    export let price: number
    export let onClickHandler: () => void = () => {
    }
</script>

<button
        id="{id}"
        data-testid="{id}"
        class=" flex bg-white m-1 rounded-md border-1 border-gray-600 shadow-md hover:bg-orange-100"
        on:click={onClickHandler}
>
    <div class="w-full h-32 flex flex-row">
        <Image imageRemoteUrl="{image}" name={name} classes="w-2/5 p-2 h-full object-contain"/>
        <div class="w-3/5 flex flex-col h-w p-2 items-stretch">
            <p class="flex-1 font-thin text-xl text-left">{`${name}`}</p>
            <p class="w-full text-xl font-bold text-right">${(price / 100).toFixed(2)}</p>
        </div>
    </div>
</button>
