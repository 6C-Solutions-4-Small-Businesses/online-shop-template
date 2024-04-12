<script lang="ts">
  import Image from '$lib/frontend/components/Image.svelte'

  export let id: string
  export let name: string
  export let image: string
  export let selectedQuantity: number
  export let price: number
</script>

<div data-testid="{id}" class="h-32 xl:h-36 flex bg-white rounded-md shadow-md">
  <Image imageRemoteUrl="{image}" name={name} classes="w-2/5 p-2 h-full product-image object-contain"/>
  <div class="w-3/5 flex flex-col justify-between hover:bg-orange-100 pl-2">
    <div class="flex justify-between">
      <div class="font-thin flex justify-center items-center">{`${selectedQuantity} x ${name}`}</div>
    </div>
    <div class="flex justify-between h-10">
      <div class="w-4/12 font-thin flex items-center">${(price / 100).toFixed(2)}</div>
    </div>
  </div>
</div>

<style lang="css">
  .product-image {
    aspect-ratio: 1;
  }
</style>
