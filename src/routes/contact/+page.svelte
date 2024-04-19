<script lang="ts">
    import {onMount} from 'svelte'
    import type {PageData} from './$types'
    import * as GMaps from '@googlemaps/js-api-loader'
    import {PUBLIC_GOOGLE_MAPS_JAVASCRIPT_API_KEY} from '$env/static/public'
    import Button from '$lib/frontend/components/Button.svelte'
    import {contactBusiness} from '$lib/frontend/endpoints/Endpoints'
    import {getToastStore, type ToastSettings} from '@skeletonlabs/skeleton'
    import {getErrorToastSettings, getSuccessToastSettings} from '$lib/frontend/core/ToasterUtils'

    export let data: PageData

    const {Loader} = GMaps
    let googleMapElement: any
    let name: string
    let email: string
    let subject: string
    let message: string

    const toastStore = getToastStore()

    $: isSendButtonDisabled = !name || !email || !subject || !message

    async function initMap(): Promise<void> {
        const loader = new Loader({
            apiKey: PUBLIC_GOOGLE_MAPS_JAVASCRIPT_API_KEY,
            version: 'weekly',
        })

        let map: any

        loader.importLibrary('geocoding').then(({Geocoder}) => {
            const geocoder = new Geocoder()
            geocoder.geocode({address: data.address}, (results: any, status: any) => {
                if (status === 'OK') {
                    const location = results[0].geometry.location
                    loader.importLibrary('maps').then(({Map}) => {
                        map = new Map(googleMapElement, {
                            zoom: 15,
                            center: location,
                            fullscreenControl: false,
                            zoomControl: true,
                            streetViewControl: false,
                            mapId: 'business-location-map',
                        })
                    })
                    loader.importLibrary('marker').then(({AdvancedMarkerElement}) => {
                        new AdvancedMarkerElement({
                            position: location,
                            map,
                            title: data.name,
                        })
                    })
                } else {
                    toastStore.trigger(getErrorToastSettings('Une erreur est survenue durant l\'affichage de la carte.'))
                    console.log('Geocode was not successful for the following reason: ' + status)
                }
            })
        })
    }

    onMount(async () => {
        await initMap()
    })

    function clearContactUsForm(): void {
        name = ''
        email = ''
        subject = ''
        message = ''
    }

    async function contactBusinessHandler() {
        let toastSettings: ToastSettings

        const presentation = await contactBusiness({name, email, subject, message})
        if (presentation) {
            clearContactUsForm()
            toastSettings = getSuccessToastSettings('Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais. Merci !')
        } else {
            toastSettings = getErrorToastSettings('Malheureusement, nous n\'avons pas pu envoyer votre message. Veuillez réessayer plus tard.')
        }

        toastStore.trigger(toastSettings)
    }
</script>

<div class="w-full max-w-full h-fit flex flex-col justify-center items-center bg-slate-100">
    <div class="w-full lg:w-9/12 bg-white py-6 mb-0 lg:my-5">
        <p class="title text-2xl text-center font-light">Contactez-nous</p>
        <div class="w-full h-full flex flex-col md:flex-row">
            <div class="w-full md:w-1/2 h-full flex flex-col justify-center items-center py-6 sm:py-14 gap-6">
                <div class="w-10/12 md:w-9/12 h-full flex flex-col gap-4">
                    <h4 class="text-xl uppercase">Où nous trouver</h4>
                    <div bind:this={googleMapElement} class="h-96 bg-slate-100"></div>
                </div>
                <div class="w-10/12 md:w-9/12 flex flex-col gap-4">
                    <h4 class="text-xl uppercase">Coordonnées</h4>
                    <div class="flex flex-col gap-2">
                        <div class="w-full md:w-7/12 text-md font-light">{data.address}</div>
                        <div class="w-full md:w-7/12 text-md font-light">{data.phoneNumber}</div>
                        <div class="w-full md:w-7/12 text-md font-light">{data.email}</div>
                    </div>
                </div>
                <div class="w-10/12 md:w-9/12 flex flex-col gap-4">
                    <h4 class="text-xl uppercase">Nous sommes ouverts</h4>
                    {#each data.openingHours as {dayRange, open, close}}
                        {#if (open && close)}
                            <div class="w-full lg:w-7/12 flex flex-col gap-2">
                                <div class="w-full flex font-light text-justify">
                                    <div class="w-7/12">{dayRange.join(' - ')}</div>
                                    <div class="w-5/12 text-end">{`${open} - ${close}`}</div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
            <div class="w-full md:w-1/2 flex flex-col py-6 sm:py-14 items-center gap-3">
                <div class="w-10/12 md:w-9/12 flex flex-col gap-2">
                    <h4 class="text-xl uppercase">Prenez contact avec nous !</h4>
                    <p class="text-justify font-light">
                        Si vous avez des questions ou si vous souhaitez prendre rendez-vous, veuillez utiliser le
                        formulaire de contact ci-dessous ou appelez-nous directement au
                        <a class="text-blue-600" href="tel:{data.phoneNumber}">{data.phoneNumber}</a>.
                    </p>
                </div>
                <div class="w-10/12 md:w-9/12 flex flex-col gap-3 font-light">
                    <div class="flex flex-col gap-2">
                        <div>Name<span class="text-red-500">*</span></div>
                        <input bind:value={name} class="h-10 border-2" required type="text"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div>Email<span class="text-red-500">*</span></div>
                        <input bind:value={email} class="h-10 border-2" required type="email">
                    </div>
                    <div class="flex flex-col gap-2">
                        <div>Sujet<span class="text-red-500">*</span></div>
                        <input bind:value={subject} class="h-10 border-2" type="text">
                    </div>
                    <div class="flex flex-col gap-2">
                        <div>Message<span class="text-red-500">*</span></div>
                        <textarea bind:value={message} class="border-2" required rows="4"></textarea>
                    </div>
                    <div class="flex justify-end">
                        <Button
                                background="bg-orange-50 hover:bg-white"
                                border="border border-orange-500"
                                classNames="w-36 h-12 border border-white shadow-sm mb-2"
                                disabled={isSendButtonDisabled}
                                id="contact-business-button"
                                onClick={contactBusinessHandler}
                                text="text-orange-500"
                        >
                            Envoyer
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="css">
    .title {
        font-family: Roboto, sans-serif
    }
</style>
