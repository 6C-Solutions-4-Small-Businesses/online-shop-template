<script lang="ts">
    export let label: string
    export let isSelected: boolean
    export let onClickHandler: () => void

</script>

<button
        class={`h-14 flex justify-start items-center shadow-md pl-3.5 py-4 hover:bg-orange-100 hover:text-red-500 rounded-md ${isSelected ? 'bg-orange-100 text-red-500' : 'bg-white'}`}
        on:click={onClickHandler}
>
    {label}
</button>