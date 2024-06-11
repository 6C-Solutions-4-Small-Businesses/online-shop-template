<script lang="ts">
    import Button from '$lib/frontend/components/Button.svelte'
    import AddIcon from '~icons/mdi/add'
    import EditIcon from '~icons/mdi/edit'
    import RemoveIcon from '~icons/mdi/delete'
    import {fly} from 'svelte/transition'
    import {getModalStore, type ModalSettings} from '@skeletonlabs/skeleton'
    import type {OffersModificationPresentation} from '$lib/frontend/presentations/OffersModificationPresentation'
    import OffersModificationCard from '$lib/frontend/components/OffersModificationCard.svelte'
    import ClearModificationIcon from '~icons/mdi/close'
    import EditModificationIcon from '~icons/mdi/edit'
    import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'

    const modalStore = getModalStore()
    const areModificationsPending = () => offersModifications.length > 0

    let offersModifications: OffersModificationPresentation[] = []

    async function startOffersModification(offer?: OffersModificationPresentation | undefined, index?: number) {

        const isModification = !!offer
        const modal: ModalSettings = {
            type: 'component',
            title: isModification ? "Modification d'Offre" : 'Nouvelle Offre',
            component: 'offersModificationModal',
            buttonTextSubmit: isModification ? 'Modifier' : 'Créer',
            buttonTextCancel: 'Annuler',
            meta: {
                offer,
                offerIndex: index,
                onClose,
                taxCategories: [
                    'Alimentation',
                    'Autre',
                ],
                units: [
                    'Unité',
                    'Portion',
                    'Lbs',
                    'Kgs',
                ],
                categories: [
                    {'b4e09e6e-2221-418d-87dd-ee8c94d916fb': 'Viande et Volaille'},
                    {'d8753e0e-566c-483b-b9c3-34924e1875a7': 'Viande'},
                    {'19b62a39-7aea-4d91-b62b-d562d614b0d7': 'Thé et Café'},
                    {'b2b92d25-4260-4740-8525-a27570109a05': 'Teinture'},
                    {'01427378-9f21-4e0c-b596-4555478dba99': 'Surgelé'},
                    {'302a5567-2da4-42e0-ac3e-d1b114cc548b': 'Sucre'},
                    {'2b4514fa-f9af-4c65-830e-11395c83d690': 'Soins Capillaires'},
                    {'ec9938ce-8197-4ac4-b18c-1be799928165': 'Savon'},
                    {'e4ccd80a-8059-4734-98a6-168a9b8fd820': 'Riz et Pâte'},
                    {'89234338-17f6-44d7-bf9f-04d06397ce1d': 'Pâtes de Végétaux'},
                    {'75755cb9-2335-44da-a8e4-3e31b026073c': 'Pommade et Lotion'},
                    {'c774db0a-70bc-4f4b-aa1e-5a0aeb60f796': 'Poisson'},
                    {'9ce4f1c3-060c-4c96-92f6-668ecd6fe3ce': 'Pois et Légumineux'},
                    {'aa7e264a-dc82-4ea9-bbed-6a94b0b88bc5': 'Mèche et Extension'},
                    {'639194bd-b02e-4440-818e-7c66614f46c6': 'Maquillage'},
                    {'1ac521f5-e610-4c8b-9979-ef1c084a3a57': 'Lait en poudre'},
                    {'404ab4f3-1317-4557-b529-3632ca819ef9': 'Kaolin'},
                    {'0bf642bd-642d-4d10-95ee-5ab532021bc9': 'Jus et Sirop'},
                    {'42543677-652e-49d2-a5ba-08c2145652df': 'Huile et Vinaigre'},
                    {'577d1c81-6c58-42d0-8a5b-e1140d7b1f0e': 'Herbe et Feuille'},
                    {'ce85a342-86e3-4629-970b-e8333a9c7db1': 'Fruit et Légume'},
                    {'1e9cf02e-5823-4a82-a3db-8f39973e895a': 'Foulard et Écharpe'},
                    {'dc88eec6-2f87-4878-b0ad-dec9adb06f2f': 'Farine et Céréale'},
                    {'93528876-b9fc-4db5-919f-8093c36edcae': 'Cosmétique'},
                    {'f1d276d0-f739-4449-a599-10d7398cc7a7': 'Conserve'},
                    {'ba22478d-2f6b-4a90-928d-1071ff7fbc23': 'Confiture et Tartinade'},
                    {'9ff12202-4488-4854-a320-8e4899f96a69': 'Condiment'},
                    {'84a4a6ff-b5d3-4f19-9368-b5e438d58207': 'Collation'},
                    {'baa0dfe4-8d22-4611-b268-62143e96e65f': 'Boisson Gaseuze'},
                    {'1482c135-b8e6-4b6a-b125-e8c2b5e9ca7c': 'Biscuit'},
                    {'27f313bb-b390-41e1-aaa0-028024bb9c0e': 'Alimentation'},
                    {'d223bf35-9418-445d-821f-63d260991d3e': 'Accessoire'},
                ],
            },

            response: (data: { offer: OffersModificationPresentation, index?: number }) => {

                if (data.index === undefined) {
                    offersModifications = [...offersModifications, data.offer]
                } else {
                    offersModifications[data.index] = data.offer
                }
            },
        }
        modalStore.trigger(modal)
    }

    function toOfferModificationPresentation(offer: OfferSummaryPresentation): OffersModificationPresentation {
        return {
            id: offer.id,
            name: offer.name,
            description: offer.description,
            price: offer.price / 100,
            quantity: 1,
            unit: offer.unit ?? 'Unité',
            //TODO(https://github.com/6C-Solutions-4-Small-Businesses/static-web-site/issues/375)
            categories: [{
                id: '27f313bb-b390-41e1-aaa0-028024bb9c0e',
                name: 'Viande et Volaille',
            }],
            taxCategory: 'Alimentation',
            image: offer.image,
            barCode: '1234567890',
            inventory: 99,
        }
    }

    async function startOfferSearch(followUpAction: { isEdition: boolean }) {
        const modal: ModalSettings = {
            type: 'component',
            component: 'offerSearchModal',
            title: 'Rechercher un produit ou service',
            buttonTextSubmit: 'Rechercher',
            buttonTextCancel: 'Annuler',
            meta: {
                onClose,
            },

            response: (offer: OfferSummaryPresentation) => {
                modalStore.close()
                const offersModificationPresentation = toOfferModificationPresentation(offer)
                if (followUpAction.isEdition) {
                    startOffersModification(offersModificationPresentation)
                } else {
                    offersModificationPresentation.deleted = true
                    offersModifications = [...offersModifications, offersModificationPresentation]
                }
            },
        }
        modalStore.trigger(modal)
    }

    async function startOfferSearchForEdition() {
        await startOfferSearch({ isEdition: true })
    }

    async function startOfferSearchForDeletion() {
        await startOfferSearch({ isEdition: false })
    }

    function onClose() {
        modalStore.close()
    }

    async function onModificationsCancelClickHandler() {

        const confirmationModal: ModalSettings = {
            type: 'component',
            component: 'confirmationModal',
            title: 'Annuler les modifications',
            body: 'Voulez-vous vraiment annuler les modifications aux produits et services?',
            buttonTextConfirm: 'Oui',
            buttonTextCancel: 'Non',
            response: (confirmed: boolean) => {
                if (confirmed) {
                    offersModifications = []
                }
            },
        }
        modalStore.trigger(confirmationModal)
    }

    async function onModificationsApplyClickHandler() {
        function formatModificationsConfirmationMessage(newOffers: OffersModificationPresentation[]) {
            return `Voulez-vous vraiment appliquer les modifications suivantes aux produits et services? <br/><br/> <span class="text-xl block">Création d'offre</span> <br/><ul class="list-disc pl-5 space-y-2">${newOffers.map(o => `<li>${o.name}</li>`).join('')}</ul>`
        }

        const confirmationModal: ModalSettings = {
            type: 'component',
            component: 'confirmationModal',
            title: 'Appliquer les modifications',
            body: formatModificationsConfirmationMessage(offersModifications),
            buttonTextConfirm: 'Oui',
            buttonTextCancel: 'Non',
            meta: {
                isHtml: true,
            },
            response: (confirmed: boolean) => {
                if (confirmed) {
                    offersModifications = []
                }
            },
        }
        modalStore.trigger(confirmationModal)
    }

</script>
<div class="w-full max-w-full flex flex-col p-5 bg-gray-50">

    <div class="title text-3xl font-thin">Produits et Services</div>
    <div class="w-full flex-1 flex flex-col items-center py-5">
        <p class="text-xl font-thin">Ici vous pouvez ajouter, modifier ou supprimer les produits et
            services que vous offrez.
        </p>
        <div class="w-full flex flex-row justify-items-stretch py-3">
            <div class="p-3 flex-1">
                <Button
                        id="add-offer-button"
                        classNames="w-full shadow-sm p-4"
                        text="text-white"
                        border="border-black"
                        background="bg-green-500 hover:bg-green-600"
                        disabled="{false}"
                        onClick={startOffersModification}
                >
                    <div class="flex flex-row">
                        <AddIcon class="inline"/>
                        <span class="flex-1 hidden md:visible">Ajouter</span>
                    </div>
                </Button>
            </div>
            <div class="p-3 flex-1">
                <Button
                        id="edit-product-button"
                        classNames="w-full shadow-sm p-4 "
                        text="text-white"
                        border="border-black"
                        background="bg-blue-500 hover:bg-blue-600"
                        disabled="{false}"
                        onClick={startOfferSearchForEdition}
                >
                    <div class="flex flex-row">
                        <EditIcon class="inline"/>
                        <span class="flex-1 hidden md:visible">Modifier</span></div>
                </Button>
            </div>
            <div class="p-3 flex-1">
                <Button
                        id="delete-product-button"
                        classNames="w-full shadow-sm p-4 "
                        text="text-white"
                        border="border-black"
                        background="bg-red-500 hover:bg-red-600"
                        disabled="{false}"
                        onClick={startOfferSearchForDeletion}
                >
                    <div class="flex flex-row">
                        <RemoveIcon class="inline"/>
                        <span class="flex-1 hidden md:visible">Supprimer</span></div>
                </Button>
            </div>
        </div>
        <div class="w-full border-opacity-50 pt-2 pb-3">
            <div class="divider h-0.5 bg-black"></div>
        </div>
        {#if offersModifications.length}
            <div class="w-full flex flex-col pt-5 gap-3">
                {#each offersModifications as o, i(o)}
                    <div class="relative h-[28rem]"> <!-- HELP -->
                        <div class="absolute w-full" transition:fly={{ x: -20, duration: 300 }}>
                            <OffersModificationCard offer="{o}"/>
                        </div>
                        <Button
                                id="delete-modification-button"
                                classNames="absolute border-none p-2 right-0 z-10"
                                background="background-none"
                                text="text-white"
                                block="{true}"
                                onClick={() => {
                                    offersModifications = offersModifications.filter((offer, index) => index !== i)
                                    return Promise.resolve()
                                }}>
                            <ClearModificationIcon
                                    class="right-2 text-3xl font-bold bg-red-400 rounded-full p-1 hover:bg-red-500"
                            />
                        </Button>
                        <Button
                                id="edit-modification-button"
                                classNames="absolute border-none p-2 right-12 z-10"
                                background="background-none"
                                text="text-white"
                                block="{true}"
                                onClick={() => {
                                    startOffersModification(o, i)
                                    return Promise.resolve()
                                }}>
                            <EditModificationIcon
                                    class="right-2 text-3xl font-bold bg-blue-500 rounded-full p-1 hover:bg-blue-600"
                            />
                        </Button>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="flex-1 flex bg-gray-200 mt-5">
                <div class="flex-1 flex items-center justify-center">
                    <p class="text-xl font-thin text-center p-3"><span class="text-3xl block my-2">Vos modifications apparaîtront ici.</span><br>
                        Appuyez sur <b>Appliquer</b> pour les soumettre ou sur <b>Annuler</b> pour les abandonner.</p>
                </div>
            </div>
        {/if}
        {#key offersModifications}
            <div class="w-full flex flex-row justify-between py-4">
                <div class="p-3 sm:px-1">
                    <Button
                            id="add-product-button"
                            classNames="w-36 shadow-sm h-12 "
                            text="text-gray-800"
                            border="border border-gray-800"
                            disabled="{!areModificationsPending()}"
                            onClick={onModificationsCancelClickHandler}
                    >
                        Annuler
                    </Button>
                </div>
                <div class="p-3 sm:px-1">
                    <Button
                            id="add-product-button"
                            classNames="w-36 shadow-sm h-12"
                            text="text-orange-500"
                            border="border border-orange-500"
                            disabled="{!areModificationsPending()}"
                            onClick={onModificationsApplyClickHandler}
                    >
                        Appliquer
                    </Button>
                </div>
            </div>
        {/key}
    </div>
</div>
