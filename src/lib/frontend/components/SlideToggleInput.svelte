<script lang="ts">
    import {SlideToggle} from '@skeletonlabs/skeleton'

    export let label: string
    export let value: boolean
    export let onChange: (event: Event) => void
</script>

<div class="w-full mb-3">
    <div class="flex justify-between items-center bg-slate-200 p-3.5 text-black rounded-md">
        <p>{label}</p>
        <SlideToggle
                active="bg-orange-400"
                background="bg-slate-400"
                checked={value}
                name="slide"
                on:change={onChange}
                size="sm"
        />
    </div>
</div>