<script lang="ts">
    export let value: string
</script>
<div class="title flex justify-between items-center mt-5 px-10 py-5 h-20 border-b border-black border-opacity-10">
    <span class="text-primary uppercase text-2xl lg:text-32">{value}</span>
    <slot/>
</div>