<script lang="ts">
    export let inputId: string
    export let buttonId: string
    export let width: string
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

<div class={`${width} h-10 flex justify-center`}>
    <div class="{`relative ${onSearchSubmitHandler ? 'w-8/12' : 'w-full'}`}">
        <input
                data-testid={inputId}
                bind:value={searchTerm}
                class="w-full h-full focus:outline-none text-black text-left pl-2 rounded-none border border-l-gray-500 border-t-gray-500 border-b-gray-500"
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
    {#if onSearchSubmitHandler}
        <button
                data-testid={buttonId}
                class={`w-3/12 h-full text-sm xl:text-lg text-white ${isSearchTermInvalid ? "bg-slate-500": "bg-orange-500"} p-1`}
                disabled={isSearchTermInvalid}
                on:click={() => onSearchSubmitHandler?.call({}, searchTerm)}
        >Rechercher
        </button>
    {/if}
</div>
