<script lang="ts">
    import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
    import storeImage from '$lib/frontend/assets/images/location-interior.webp'
    import Button from '$lib/frontend/components/Button.svelte'
    import Collection from '$lib/frontend/components/Collection.svelte'
    import {isEmailInvalid} from '$lib/frontend/core/Helper'
    import {getErrorToastSettings, getSuccessToastSettings} from '$lib/frontend/core/ToasterUtils'
    import Autoplay from 'embla-carousel-autoplay'
    import emblaCarouselSvelte from 'embla-carousel-svelte'
    import {onMount} from 'svelte'
    import {writable, type Writable} from 'svelte/store'
    import type {PageData} from './$types'
    import type {CollectionPresentation} from '$lib/frontend/presentations/CollectionPresentation'
    import {PUBLIC_BUSINESS_NAME, PUBLIC_OWNER_ID} from '$env/static/public'
    import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
    import SpotlightedProductCard from '$lib/frontend/components/SpotlightedProductCard.svelte'
    import {getToastStore} from '@skeletonlabs/skeleton'

    export let data: PageData

    let spotlightCollection: CollectionPresentation | null = null
    let onSaleCollection: CollectionPresentation | null = null
    let remainingCollections: Writable<CollectionPresentation[]> = writable([])
    let isGuessEmailInvalid: Writable<boolean> = writable(false)
    let guessEmail: Writable<string> = writable()
    let options = {loop: true}
    let plugins = [Autoplay({stopOnMouseEnter: true, stopOnInteraction: false})]

    const toastStore = getToastStore()

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
            headers: {...BASE_HEADERS}
        })

        return await response.json()
    }

    async function createNewsLetterSubscription(businessId: string | undefined): Promise<Response> {
        return await fetch(`${API_BASE_ENDPOINT}/newsLetterSubscription`, {
            method: 'POST',
            headers: {...BASE_HEADERS},
            body: JSON.stringify({
                email: $guessEmail,
                businessId
            })
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
    <img
            alt="{PUBLIC_BUSINESS_NAME}, Business Slogan"
            class="object-cover w-full max-w-full h-screen brightness-75 blur-xs relative -z-1"
            src={storeImage}
    >

    <div class="absolute top-44 w-full flex justify-center">
        {#if (spotlightCollection != null)}
            <div class="embla w-10/12 md:w-2/3 xl:w-1/3" use:emblaCarouselSvelte="{{ options,plugins }}">
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
    <div class="w-full">
        {#if onSaleCollection != null}
            {#if onSaleCollection.offers.length > 0}
                <Collection
                        id={onSaleCollection.id}
                        name={onSaleCollection.name}
                        products={onSaleCollection.offers}
                />
            {/if}
        {/if}
        <div class="news-letter-box w-full flex flex-col items-center xl:flex-row xl:justify-center bg-green-100">
            <div class="flex flex-col w-10/12 xl:w-7/12 py-12 xl:py-20">
                <div class="flex flex-col">
                    <div class="text-3xl text-green-900 my-2">Rabais Exclusifs</div>
                    <p class="font-thin text-justify">
                        En tant qu'abonné privilégié, vous bénéficierez d'un accès exclusif à des offres spéciales et à
                        des
                        promotions, vous assurant de réaliser plus d'économies à chaque fois que vous faites vos achats
                    </p>
                </div>
                <div class="flex flex-col">
                    <div class="text-3xl text-green-900 my-2">Premier Arrivé, Premier Servi</div>
                    <p class="font-thin text-justify">
                        Abonnez-vous dès maintenant et soyez le premier à savoir quand nous réapprovisionnons en
                        produits frais,
                        produits laitiers et autres denrées périssables, vous garantissant ainsi de toujours obtenir les
                        choix les
                        plus frais de nos rayons.
                    </p>
                </div>
            </div>
            <div class="w-10/12 xl:w-3/12 flex flex-col justify-center items-center">
                <div class="w-80 h-80 flex flex-col items-center bg-green-300 rounded-full justify-center">
                    <div class="w-4/5 mt-5 mb-8 text-2xl text-center  text-green-900 font-thin">Abonnez-vous à notre
                        Infolettre
                    </div>
                    <input
                            bind:value={$guessEmail}
                            class={`w-4/5 h-10 border ${$isGuessEmailInvalid ? 'border-2 border-red-500' : 'border-gray-500'}  rounded-sm pl-2 focus:outline-none  focus:border-2`}
                            on:input={changeGuessEmail}
                            placeholder="Entrer votre courriel"
                            type="email"
                    >
                    <Button classNames="w-36 shadow-sm border border-orange-500 text-orange-500 bg-orange-50 h-12 hover:bg-white mt-10"
                            disabled="{false}" id="" onClick={subscribeToNewsLetter}>
                        S'abonner
                    </Button>
                </div>
            </div>
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
    .embla {
        overflow: hidden;
    }

    .embla__container {
        display: flex;
    }

    .embla__slide {
        flex: 0 0 100%;
        min-width: 0;
    }
</style>

