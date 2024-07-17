<script lang="ts">

    import {getModalStore} from '@skeletonlabs/skeleton'
    import BaseModal from '$lib/frontend/components/BaseModal.svelte'
    import {type SvelteComponent} from 'svelte'
    import SearchInput from '$lib/frontend/components/SearchInput.svelte'
    import {fetchSearchedOffersResult} from '$lib/frontend/endpoints/OfferEndpoints'
    import {searchedProductResult} from '$lib/frontend/stores/productStore/SearchProductStore'
    import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
    import OfferSummaryCard from '$lib/frontend/components/OfferSummaryCard.svelte'
    import {throttle} from '$lib/frontend/core/RxHelper'

    const modalStore = getModalStore()
    const throttleSearchFunction = throttle(async (searchTerm: string) => {
        const searchedOffersResult = await fetchSearchedOffersResult(searchTerm)
        if (searchedOffersResult) {
            matchedOffers = searchedOffersResult.items
        } else {
            matchedOffers = []
        }
    }, 500)

    export let parent: SvelteComponent

    let modalSettings = $modalStore[0]
    let matchedOffers: OfferSummaryPresentation[] = $searchedProductResult?.items
    let searchTerm: string = ''

    async function handleSearchTermChange(value: string): Promise<void> {
        searchTerm = value
        const func = await throttleSearchFunction
        func(searchTerm)
    }

    async function onSearchResetHandler() {
        matchedOffers = []
        searchTerm = ''
    }

</script>
{#if modalSettings}
    <div class="w-full md:w-6/12 lg:w-6/12 xl:w-4/12">
        <BaseModal
                title={modalSettings.title}
                body={modalSettings.body}
                parent={parent}
                background="bg-gray-100"
                submitButtonDisabled={false}
                onSubmitClickHandler={() => Promise.resolve()}
                onCancelClickHandler={modalSettings.meta?.onClose}
        >
            <div class="w-full px-4">
                <SearchInput
                        inputId="search-input"
                        buttonId="search-submit-button"
                        width="w-full"
                        onSearchTermChangeHandler="{handleSearchTermChange}"
                        onSearchResetHandler="{onSearchResetHandler}"
                />
                <div class="py-4">
                    {#if searchTerm}
                        {#if matchedOffers?.length > 0}
                            <div class="w-full h-96 flex flex-col gap-2 overflow-y-scroll">
                                {#each matchedOffers.slice(0, 5) as offer}
                                    <OfferSummaryCard
                                            id="{offer.id}"
                                            name="{offer.name}"
                                            image="{offer.image}"
                                            price="{offer.price}"
                                            onClickHandler="{() => modalSettings?.response?.call({}, offer)}"
                                    />
                                {/each}
                            </div>
                        {:else}
                            <p class="text-center text-gray-700" data-testid="no-match-message"><span>{@html `Aucune offre trouvée pour "<b>${searchTerm}</b>"`}</span></p>
                        {/if}
                    {:else}
                        <p class="text-center text-gray-700" data-testid="description-message"><span>Cherchez l'offre que vous désirez modifier.</span></p>
                    {/if}
                </div>
            </div>
        </BaseModal>
    </div>
{/if}
