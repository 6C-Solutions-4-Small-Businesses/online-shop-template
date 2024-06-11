<script lang="ts">
  import Image from '$lib/frontend/components/Image.svelte'

  export let id: string
  export let name: string
  export let image: string
  export let price: number
</script>

<div data-testid="{id}" class="h-32 flex bg-white rounded-md border-1 border-gray-600 shadow-md hover:bg-orange-100">
  <Image imageRemoteUrl="{image}" name={name} classes="w-2/5 p-2 h-full object-contain"/>
  <div class="w-3/5 flex flex-col justify-between pl-2">
    <div class="flex justify-between">
      <div class="font-thin flex justify-center items-center">{`${name}`}</div>
    </div>
    <div class="flex justify-between h-10">
      <div class="w-4/12 font-thin flex items-center">${(price / 100).toFixed(2)}</div>
    </div>
  </div>
</div>
