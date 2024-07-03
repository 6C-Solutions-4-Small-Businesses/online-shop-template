<script lang="ts">
    import SearchIcon from '$lib/frontend/components/icons/SearchIcon.svelte'

    export let inputId: string
    export let buttonId: string
    export let width: string | undefined = undefined
    export let onSearchSubmitHandler: ((searchTerm: string) => Promise<void>) | undefined = undefined
    export let onSearchTermChangeHandler: ((searchTerm: string) => void) | undefined = undefined
    export let onSearchResetHandler: (() => void) | undefined = undefined

    export let searchTerm: string = ''
    let isSearchTermInvalid: boolean = false

    $: isSearchTermInvalid = !searchTerm || searchTerm === "" || searchTerm.length <= 1

    async function onEnterPressSubmitSearch(event: KeyboardEvent): Promise<void> {
        if (event.code === "Enter") {
            await onSearchSubmitHandler?.call({}, searchTerm)
        }
    }

    function resetInput(): void {
        searchTerm = ''
        onSearchResetHandler?.call({})
    }

    function onSearchInputChangeHandler(event: Event): void {
        onSearchTermChangeHandler?.call({}, searchTerm)
    }

</script>

<div class={`${width} h-10 flex`}>
    <div class="{`relative w-full lg:w-8/12 lg:mb-0 mb-4`}">
        <input
                data-testid={inputId}
                bind:value={searchTerm}
                class="w-full h-12 focus:outline-transparent text-black text-left pl-2 rounded-l-lg border-none"
                on:keypress={onEnterPressSubmitSearch}
                on:input={onSearchInputChangeHandler}
                placeholder="Chercher un produit"
                type="text"
        >
        {#if searchTerm}
            <button
                    data-testid="search-input-clear-button"
                    class="absolute w-6 h-6 flex items-center justify-center text-sm text-white right-3 bottom-2 border rounded-full bg-orange-500 pb-0.5 shadow-md"
                    on:click={resetInput}
            >x
            </button>
        {/if}
    </div>
    <button
            data-testid={buttonId}
            class='h-12 text-sm xl:text-lg text-white p-1 rounded-r-lg bg-white'
            disabled={isSearchTermInvalid}
            on:click={() => onSearchSubmitHandler?.call({}, searchTerm)}
    >
        <SearchIcon classNames={`flex items-center rounded-r-lg py-1 px-2.5 h-10 text-black ${isSearchTermInvalid ? "bg-primary": "bg-teal-950"} p-1`}/>
    </button>
</div>
