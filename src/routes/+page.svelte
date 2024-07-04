<script lang="ts">
    import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
    import storeImage from '$lib/frontend/assets/images/market.webp'
    import Collection from '$lib/frontend/components/Collection.svelte'
    import {isEmailInvalid} from '$lib/frontend/core/Helper'
    import {getErrorToastSettings, getSuccessToastSettings} from '$lib/frontend/core/ToasterUtils'
    import Autoplay from 'embla-carousel-autoplay'
    import emblaCarouselSvelte from 'embla-carousel-svelte'
    import {onMount} from 'svelte'
    import {writable, type Writable} from 'svelte/store'
    import type {PageData} from './$types'
    import type {CollectionPresentation} from '$lib/frontend/presentations/CollectionPresentation'
    import {PUBLIC_OWNER_ID} from '$env/static/public'
    import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
    import SpotlightedProductCard from '$lib/frontend/components/SpotlightedProductCard.svelte'
    import SearchInput from "$lib/frontend/components/SearchInput.svelte";
    import {t} from '$translations/index'
    import Button from '$lib/frontend/components/Button.svelte'
    import {getToastStore} from '@skeletonlabs/skeleton'
    import CircleCheckIcon from '$lib/frontend/components/icons/CircleCheckIcon.svelte'
    import SendIcon from '$lib/frontend/components/icons/SendIcon.svelte'

    export let data: PageData

    let spotlightCollection: CollectionPresentation | null = null
    let onSaleCollection: CollectionPresentation | null = null
    let remainingCollections: Writable<CollectionPresentation[]> = writable([])
    let isGuessEmailInvalid: Writable<boolean> = writable(false)
    let guessEmail: Writable<string> = writable()
    let options = {loop: true, slidesToScroll: 2}
    let plugins = [Autoplay({delay: 4000, stopOnMouseEnter: true, stopOnInteraction: false})]

    const toastStore = getToastStore()

    onMount(() => {
        if (window.innerWidth < 1120) {
            options.slidesToScroll = 1;
        } else {
            options.slidesToScroll = 2;
        }

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
                toastStore.trigger(getSuccessToastSettings('Merci de vous être abonné à notre infolettre!'))
            } else {
                const jsonResponse = await response.json()

                if (jsonResponse?.error === 'SUBSCRIPTION_ALREADY_EXIST') {
                    toastStore.trigger(getErrorToastSettings('Merci! vous faites déja partis de nos abonnés'))
                } else {
                    toastStore.trigger(getErrorToastSettings('Nous sommes désolés, mais nous ne pouvons pas vous inscrire a l\'infolettre pour le moment. Veuillez réessayer plus tard.'))
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
    <div class="bg-cover-container" style="background-image: url({storeImage});">
        <div class="test flex flex-col lg:flex-row justify-center items-center min-h-[586px] px-10 principal-container">
            <div class="lg:w-[40%] lg:pr-5 w-full mb-10 lg:mb-0">
                <h1 class="text-[40px] hidden lg:flex font-bold mb-4 leading-[48px] text-white lg:w-5/6">
                    {$t('page.shop.title')}
                </h1>

                <div>
                    <SearchInput buttonId="app-bar-search-input-button" inputId="app-bar-search-input" />
                </div>
            </div>

            {#if (spotlightCollection != null)}
                <div class="overflow-hidden lg:w-[60%] w-full" use:emblaCarouselSvelte="{{ options,plugins }}">
                    <div class="embla__container">
                        {#each spotlightCollection?.offers as onSaleProduct}
                            <div class="embla__slide embla__class-names">
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
    </div>

    <div class="bg-neutral-100 w-full my-8">
        {#if onSaleCollection != null}
            {#if onSaleCollection.offers.length > 0}
                <Collection id={onSaleCollection.id} name={onSaleCollection.name} products={onSaleCollection.offers}/>
            {/if}
        {/if}

        <div class="max-h-[452px] mt-[50px] 2xl:max-h-[552px] xl:px-4 xs:mx-5 mx-8 px-10 gradient-background rounded-[30px] text-white shadow-lg flex overflow-hidden">
            <div class="md:inline-flex 2xl:h-[500px] md:h-[330px] lg:h-[452px] xl:px-[38px] xl:py-[60px] md:px-0 md:pr-4 px-6 py-10 flex-col hidden">
                <div class="md:w-[320px] xl:w-[450px] 2xl:w-[550px] lg:w-[429px] rounded-[20px] overflow-hidden justify-center items-center inline-flex">
                    <img alt="Family with delivery"
                         class="rounded-[30px] md:mt-[100px] xl:mt-[120px] mt-60px object-cover object-top"
                         src="delivery.webp">
                </div>
            </div>
            <!-- TODO: It should be conditioned if the user is logged in or has just registered for the newsletter to show the welcome banner instead of the subscribe banner -->
            {#if (!false)}
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
                            <SendIcon />
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
                                <CircleCheckIcon classNames="align-top flex 2xl:w-[30px]"/>
                                {$t('page.newsletter.qualities.first')}
                            </li>

                            <li class="flex gap-2 mb-3 items-start">
                                <CircleCheckIcon classNames="align-top flex 2xl:w-[30px]"/>
                                {$t('page.newsletter.qualities.second')}
                            </li>

                            <li class="flex gap-2 mb-3 items-start">
                                <CircleCheckIcon classNames="align-top flex 2xl:w-[30px]"/>
                                {$t('page.newsletter.qualities.third')}
                            </li>

                            <li class="flex gap-2 mb-3 items-start">
                                <CircleCheckIcon classNames="align-top flex 2xl:w-[30px]"/>
                                {$t('page.newsletter.qualities.fourth')}
                            </li>
                        </ul>
                    </div>
                </div>
            {/if}
        </div>

        {#each $remainingCollections as collection, index}
            {#if collection.offers.length > 0}
                <div class="{index % 2 === 0 ? 'even' : 'odd'}">
                    <Collection
                            id={collection.id}
                            name={collection.name}
                            products={collection.offers}
                    />
                </div>
            {/if}
        {/each}
    </div>
</div>

<style lang="css">
    .gradient-background {
        border-radius: 30px;
        background: linear-gradient(to top, #1E6D59 0%, #0A3B2F 50%) right / 100% no-repeat,
        linear-gradient(to bottom, #1E6D59 0%, #0A3B2F 50%) left / 100% no-repeat;
    }

    .bg-cover-container {
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        min-height: 586px;
    }

    .bg-cover-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 586px;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1;
    }

    .principal-container {
        position: relative;
        z-index: 2;
    }

    .embla__container {
        backface-visibility: hidden;
        display: flex;
        touch-action: pan-y pinch-zoom;
    }

    .embla__slide {
        min-width: 320px;
        padding-left: 20px;
    }
</style>