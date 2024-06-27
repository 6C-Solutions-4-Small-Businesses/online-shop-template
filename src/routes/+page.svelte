<script lang="ts">
    import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
    import storeImage from '$lib/frontend/assets/images/location-interior.webp'
    import Collection from '$lib/frontend/components/Collection.svelte'
    import {isEmailInvalid} from '$lib/frontend/core/Helper'
    import {toastError, toastGenericError, toastSuccess} from '$lib/frontend/core/ToasterUtils'
    import Autoplay from 'embla-carousel-autoplay'
    import emblaCarouselSvelte from 'embla-carousel-svelte'
    import {onMount} from 'svelte'
    import {writable, type Writable} from 'svelte/store'
    import type {PageData} from './$types'
    import type {CollectionPresentation} from '$lib/frontend/presentations/CollectionPresentation'
    import {PUBLIC_BUSINESS_NAME, PUBLIC_OWNER_ID} from '$env/static/public'
    import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
    import SpotlightedProductCard from '$lib/frontend/components/SpotlightedProductCard.svelte'
    import SearchInput from "$lib/frontend/components/SearchInput.svelte";
    import {t} from '$translations/index'
    import Button from '$lib/frontend/components/Button.svelte'

    export let data: PageData

    let spotlightCollection: CollectionPresentation | null = null
    let onSaleCollection: CollectionPresentation | null = null
    let remainingCollections: Writable<CollectionPresentation[]> = writable([])
    let isGuessEmailInvalid: Writable<boolean> = writable(false)
    let guessEmail: Writable<string> = writable()
    let options = {loop: true}
    let plugins = [Autoplay({stopOnMouseEnter: true, stopOnInteraction: false})]

    onMount(() => {
        initialiseCollections()
    })

    function initialiseCollections(): void {
        if (data.collections != null) {
            data.collections.forEach((collection: CollectionPresentation) => {
                switch (collection.type.toLowerCase()) {
                    case 'Spotlight'.toLowerCase():
                        spotlightCollection = collection
                        break
                    case 'Sale'.toLowerCase():
                        onSaleCollection = collection
                        break
                    default:
                        remainingCollections.update((previousCollection: CollectionPresentation[]) => {
                            previousCollection.push(collection)
                            return previousCollection
                        })
                        break
                }
            })
        }
    }

    async function subscribeToNewsLetter(): Promise<void> {
        if ($guessEmail && !$isGuessEmailInvalid) {
            const owner = await fetchOwner()
            const response = await createNewsLetterSubscription(owner.businessId)

            if (response.ok) {
                guessEmail.set('')
                toastSuccess('Merci de vous être abonné à notre infolettre!')
            } else {
                const jsonResponse = await response.json()

                if (jsonResponse?.error === 'SUBSCRIPTION_ALREADY_EXIST') {
                    toastError('Merci! vous faites déja partis de nos abonnés')
                } else {
                    toastGenericError()
                }
            }
        }
    }

    async function fetchOwner(): Promise<UserAccountSummaryPresentation> {
        const response = await fetch(`${API_BASE_ENDPOINT}/user/${PUBLIC_OWNER_ID}`, {
            method: 'GET',
            headers: {...BASE_HEADERS},
        })

        return await response.json()
    }

    async function createNewsLetterSubscription(businessId: string | undefined): Promise<Response> {
        return await fetch(`${API_BASE_ENDPOINT}/newsLetterSubscription`, {
            method: 'POST',
            headers: {...BASE_HEADERS},
            body: JSON.stringify({
                email: $guessEmail,
                businessId,
            }),
        })
    }

    function changeGuessEmail(event: Event) {
        const email = (event.target as HTMLInputElement).value
        if (email) {
            guessEmail.set(email)
            isGuessEmailInvalid.set(isEmailInvalid($guessEmail))
        } else {
            guessEmail.set(email)
            isGuessEmailInvalid.set(false)
        }
    }
</script>

<div>
    <img alt="{PUBLIC_BUSINESS_NAME}, Business Slogan"
         class="object-cover w-full max-w-full h-screen brightness-75 blur-xs relative -z-1" src={storeImage}>

    <div class="absolute top-44 w-full flex justify-center px-10">
        <div class="w-[40%] self-center">
            <h1 class="text-[40px] font-bold mb-4 leading-[48px] text-white w-5/6">
                {$t('page.shop.title')}
            </h1>

            <div class=''>
                <SearchInput buttonId="app-bar-search-input-button" inputId="app-bar-search-input" width=''/>
            </div>
        </div>

        {#if (spotlightCollection != null)}
            <div class="overflow-hidden w-[60%]" use:emblaCarouselSvelte="{{ options,plugins }}">
                <div class="embla__container">
                    {#each spotlightCollection?.offers as onSaleProduct}
                        <div class="embla__slide w-2/3 md:w-2/3 xl:w-1/3">
                            <SpotlightedProductCard
                                    id={onSaleProduct.id}
                                    image={onSaleProduct.image}
                                    name={onSaleProduct.name}
                                    price={onSaleProduct.price}
                                    salePrice={onSaleProduct.promotion?.salePrice}
                            />
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
    <div class="bg-zinc-500 w-full my-8">
        {#if onSaleCollection != null}
            {#if onSaleCollection.offers.length > 0}
                <Collection id={onSaleCollection.id} name={onSaleCollection.name} products={onSaleCollection.offers}/>
            {/if}
        {/if}

        <div class="max-h-[452px] 2xl:max-h-[552px] xl:px-4 xs:mx-5 mx-8 px-10 gradient-background rounded-[30px] text-white shadow-lg flex overflow-hidden">
            <div class="md:inline-flex 2xl:h-[500px] md:h-[330px] lg:h-[452px] xl:px-[38px] xl:py-[60px] md:px-0 md:pr-4 px-6 py-10 flex-col hidden">
                <div class="md:w-[320px] xl:w-[450px] 2xl:w-[550px] lg:w-[429px] rounded-[20px] overflow-hidden justify-center items-center inline-flex">
                    <img alt="Family with delivery"
                         class="rounded-[30px] md:mt-[100px] xl:mt-[120px] mt-60px object-cover object-top"
                         src="delivery.png">
                </div>
            </div>
            {#if (false)}
                <div class="xs:py-8 xs:px-0 sm:py-10 sm:px-2 lg:p-8 md:py-12 p-16 flex flex-col justify-center">
                    <h1 class="2xl:text-3xl 3xl:text-5xl text-2xl sm:text-3xl md:text-3xl font-bold mb-5">
                        {$t('page.newsletter.altTitle')}
                    </h1>

                    <p class="2xl:text-2xl 3xl:text-3xl 3xl:mt-5 font-medium text-lg xs:text-sm sm:text-lg md:text-lg mb-2">{$t('page.newsletter.description')}</p>

                    <div class="mt-10 justify-start items-center gap-2.5 inline-flex">
                        <input
                                bind:value={$guessEmail}
                                class={`3xl:h-20 2xl:h-12 xs:w-full sm:w-2/3 w-auto text-lg font-normal h-[52px] opacity-60 rounded-lg text-black ${$isGuessEmailInvalid ? 'border-2 border-red-500' : 'border-gray-500'}`}
                                on:input={changeGuessEmail}
                                placeholder={$t('page.newsletter.input.placeholder')}
                                type="email"
                        >

                        <Button classNames="md:w-[180px] 3xl:h-20 2xl:h-12 2xl:px-3 w-auto xs:px-3 lg:px-2 py-3 rounded-xl text-center text-black text-lg font-semibold uppercase"
                                disabled="{false}" id="" onClick={subscribeToNewsLetter}>
                            <span class="hidden md:inline-flex lg:text-md text-[14px]">{$t('page.newsletter.button.title')}</span>

                            <img src="send.svg" alt={$t('page.newsletter.button.search')}/>
                        </Button>
                    </div>
                </div>
            {:else}
                <div class="xs:py-8 xs:px-0 xs:m-0 sm:px-0 sm:mx-0 md:px-4 md:mx-0 mx-8 lg:px-10 xl:p-0 p-10 text-white flex">
                    <div class="lg:p-10 flex flex-col justify-center">
                        <p class="2xl:text-xl xs:text-sm lg:text-lg font-medium xl:text-xl mb-2">{$t('page.newsletter.info')}</p>

                        <h1 class="3xl:text-5xl xs:text-2xl md:text-3xl xl:text-3xl font-bold xs:mb-8 mb-10">
                            {$t('page.newsletter.title')}
                        </h1>

                        <ul class="2xl:text-xl 3xl:text-3xl md:text-sm xs:text-lg xl:text-xl xs:columns-1 sm:columns-2">
                            <li class="flex gap-2 mb-3 items-start">
                                <img src="vector.svg" class="align-top flex 2xl:w-[30px]" alt="search">
                                {$t('page.newsletter.qualities.first')}
                            </li>

                            <li class="flex gap-2 mb-3 items-start">
                                <img src="vector.svg" class="align-top flex 2xl:w-[30px]" alt="search">
                                {$t('page.newsletter.qualities.second')}
                            </li>

                            <li class="flex gap-2 mb-3 items-start">
                                <img src="vector.svg" class="align-top flex 2xl:w-[30px]" alt="search">
                                {$t('page.newsletter.qualities.third')}
                            </li>

                            <li class="flex gap-2 mb-3 items-start">
                                <img src="vector.svg" class="align-top flex 2xl:w-[30px]" alt="search">
                                {$t('page.newsletter.qualities.fourth')}
                            </li>
                        </ul>
                    </div>
                </div>
            {/if}
        </div>

        {#each $remainingCollections as collection}
            {#if collection.offers.length > 0}
                <Collection
                        id={collection.id}
                        name={collection.name}
                        products={collection.offers}
                />
            {/if}
        {/each}
    </div>
</div>

<style lang="css">
    .embla__container {
        display: flex;
    }

    .embla__slide {
        flex: 0 0 100%;
        min-width: 0;
    }

    .gradient-background {
        border-radius: 30px;
        background: linear-gradient(to top, #1E6D59 0%, #0A3B2F 50%) right / 100% no-repeat,
        linear-gradient(to bottom, #1E6D59 0%, #0A3B2F 50%) left / 100% no-repeat;
    }
</style>