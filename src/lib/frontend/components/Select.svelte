<script lang="ts">
    import SelectOption from '$lib/frontend/components/SelectOption.svelte'
    import {writable, type Writable} from 'svelte/store'
    import ChevronDownIcon from '~icons/mdi/chevron-down'
    import ChevronUpIcon from '~icons/mdi/chevron-up'
    import Input from '$lib/frontend/components/Input.svelte'

    export let id: string
    export let label: string
    export let placeholder: string = 'Placeholder'
    export let selectedValue: string
    export let options: string []
    export let disabled: boolean = false
    export let required: boolean = false
    export let optionsBottom: boolean = true

    export let onChange: (value: string) => void = () => {
    }

    let showOptions: Writable<boolean> = writable(false)

    $:optionsListSize = options.length > 4 ? 'h-56' : 'h-auto'

    function toggleOptionsDisplay(): void {
        showOptions.set(!$showOptions)
    }

    function selectOption(value: string): void {
        onChange(value)
        showOptions.set(false)
    }

</script>

<div>
    <div class="relative">
        <Input
                disabled={disabled}
                id={id}
                label={label}
                placeholder={placeholder}
                value={selectedValue}
                required={required}
        />
        <button class="absolute bottom-2.5 right-1" on:click={toggleOptionsDisplay}>
            {#if $showOptions}
                <ChevronUpIcon class="w-8 h-8 text-gray-400"/>
            {:else}
                <ChevronDownIcon class="w-8 h-8 text-gray-400"/>
            {/if}
        </button>
        <div
                class={`${$showOptions ? 'visible bg-slate-100 shadow-lg p-2 rounded-lg overflow-scroll' : 'hidden'} absolute ${optionsBottom ? 'top-22' : 'bottom-14'} flex flex-col w-full font-bold gap-1 z-30 ${optionsListSize}`}>
            {#each options as option}
                <SelectOption
                        label={option}
                        isSelected={option === selectedValue}
                        onClickHandler={() => selectOption(option)}
                />
            {/each}
        </div>
    </div>
</div>
