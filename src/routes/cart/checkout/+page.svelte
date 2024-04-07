<svelte:options accessors/>
<script lang="ts">
    import {cart} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
    import {loadStripe, type StripeEmbeddedCheckout} from '@stripe/stripe-js'
    import {PUBLIC_STRIPE_BUSINESS_CONNECT_ACCOUNT_ID, PUBLIC_STRIPE_KEY} from '$env/static/public'
    import {createCheckoutSession, createCustomerProfile} from '$lib/frontend/endpoints/Endpoints'
    import {ProgressBar, Step, Stepper,} from '@skeletonlabs/skeleton'
    import {page} from '$app/stores'
    import {onDestroy} from 'svelte'
    import {writable} from 'svelte/store'
    import AddressForm from '$lib/frontend/components/AddressForm.svelte'
    import type {AddressPresentation} from '$lib/frontend/presentations/AddressPresentation'
    import type {AddressUpdatedEvent} from '$lib/frontend/Types'
    import {executeFunction} from '$lib/frontend/core/Helper.js'
    import {goto} from '$app/navigation'
    import Input from '$lib/frontend/components/Input.svelte'
    import SlideToggleInput from '$lib/frontend/components/SlideToggleInput.svelte'

    type StepChangedEvent = { detail: { state: { current: number, total: number }, step: number } }

    const emailInputElementId = 'email-input'
    const firstNameInputElementId = 'first-name'
    const lastNameInputElementId = 'last-name'
    const phoneNumberInputElementId = 'phone-number'

    const email = $page.url.searchParams.get('email') ?? ''
    const userFirstName = $page.url.searchParams.get('firstName') ?? ''
    const userLastName = $page.url.searchParams.get('lastName') ?? ''
    const userPhoneNumber = $page.url.searchParams.get('phoneNumber') ?? ''
    const retrievedCustomerId = $page.url.searchParams.get('customerId') ?? ''
    const checkoutSessionContainerId = 'checkout-session-container'

    const getInputValue = (event: Event) => (event.target as HTMLInputElement).value
    const defaultAddress = {
        streetAddressLine1: '',
        streetAddressLine2: '',
        city: '',
        postalCode: '',
        state: 'Québec',
        country: 'Canada',
    } as AddressPresentation

    export let startingStep = 0
    export let firstName = writable(userFirstName)
    export let lastName = writable(userLastName)
    export let phoneNumber = writable(userPhoneNumber)
    export let isShippingAddressIncomplete = writable(true)
    export let isBillingAddressIncomplete = writable(false)
    export let shippingAddress = {} as AddressPresentation
    Object.assign(shippingAddress, defaultAddress)

    export let billingAddress = {} as AddressPresentation
    Object.assign(shippingAddress, defaultAddress)
    export let useShippingAddress = true
    export let customerId = writable(retrievedCustomerId)
    let isCreatingCustomerProfile = writable(false)

    let isPersonalInformationIncomplete = writable(true)
    let checkout: StripeEmbeddedCheckout | undefined

    async function checkoutShoppingCart(customerId: string): Promise<void> {

        const checkoutSession = await createCheckoutSession({
            user: {customerId,},
            products: [...$cart.values()],
        })

        if (checkoutSession) {
            const clientSecret = checkoutSession.clientSecret
            const stripe = await loadStripe(PUBLIC_STRIPE_KEY, {
                stripeAccount: PUBLIC_STRIPE_BUSINESS_CONNECT_ACCOUNT_ID,
            })

            checkout = await stripe?.initEmbeddedCheckout({
                clientSecret,
            })

            checkout?.mount(`#${checkoutSessionContainerId}`)
        } else {
            await goto('/cart')
        }
    }

    function updatePersonalInformation(event: Event) {
        const target = event.target as HTMLElement
        const inputValue = getInputValue(event)
        switch (target.id) {
            case 'first-name':
                firstName.set(inputValue)
                break
            case 'last-name':
                lastName.set(inputValue)
                break
            case 'phone-number':
                phoneNumber.set(inputValue)
                break
            default:
                break
        }
        isPersonalInformationIncomplete.set(!$firstName || !$lastName || !$phoneNumber || $phoneNumber.length < 10)
    }

    function onShippingAddressUpdated(event: AddressUpdatedEvent) {
        Object.assign(shippingAddress, event.detail.address)
        Object.assign(billingAddress, shippingAddress)
        isShippingAddressIncomplete.set(isAddressIncomplete(shippingAddress))
    }

    function onBillingAddressUpdated(event: AddressUpdatedEvent) {
        Object.assign(billingAddress, event.detail.address)
        isBillingAddressIncomplete.set(isAddressIncomplete(billingAddress))
    }

    function isAddressIncomplete(address: AddressPresentation) {
        return !address.streetAddressLine1 || !address.city || !address.postalCode || !address.state || !address.country
    }

    async function onComplete(_state: StepChangedEvent) {

        const customerProfile = await executeFunction(isCreatingCustomerProfile, () =>
            createCustomerProfile({
                email,
                firstName: $firstName,
                lastName: $lastName,
                phoneNumber: $phoneNumber,
                details: {
                    shippingAddress,
                    billingAddress,
                },
            }))

        if (customerProfile) {
            customerId.set(customerProfile.customerId)
        }
    }

    function onUseShippingAddressChanged() {

        useShippingAddress = !useShippingAddress

        if (useShippingAddress) {
            Object.assign(billingAddress, shippingAddress)
        } else {
            Object.assign(billingAddress, defaultAddress)
        }
        isBillingAddressIncomplete.set(isAddressIncomplete(billingAddress))
    }

    onDestroy(() => checkout?.destroy())
</script>

<div class="w-full max-w-full h-full flex flex-col items-center justify-center">
    <div class="bg-white w-full xl:w-10/12 flex flex-col items-center h-max overflow-y-scroll xl:overflow-hidden">
        <div class="title text-3xl font-thin my-5 p-5 text-center">Processus de paiement</div>
        {#key $customerId}
            <div class="px-5 w-full h-max mb-10 flex justify-center">
                {#if !$customerId}
                    <div class="w-full md:w-7/12 lg:w-5/12">
                        {#if $isCreatingCustomerProfile}
                            <ProgressBar value={undefined}/>
                        {:else}
                            <Stepper id="stepper"
                                     buttonBackLabel="Précédent"
                                     buttonBack="hover:bg-orange-50 bg-white border border-orange-500 rounded-md w-full mt-2 p-3.5"
                                     buttonNext="bg-orange-50 hover:bg-white border border-orange-500 rounded-md w-full text-orange-500 mt-2 p-3.5"
                                     buttonNextLabel="Suivant"
                                     buttonComplete="bg-orange-50 hover:bg-white border border-orange-500 rounded-md w-full text-orange-500 mt-2 p-3.5"
                                     buttonCompleteLabel="Terminer"
                                     stepTerm="Étape"
                                     start="{startingStep}"
                                     badge="bg-orange-100 text-orange-500"
                                     active="bg-orange-100 text-red-500"
                                     on:complete={onComplete}>
                                <Step locked="{$isPersonalInformationIncomplete}" regionNavigation="!gap-0">
                                    <svelte:fragment slot="header">Vos Informations</svelte:fragment>
                                    <svelte:fragment slot="navigation">
                                        <div class="hidden"></div>
                                    </svelte:fragment>
                                    <Input
                                            id="{emailInputElementId}"
                                            label="Courriel"
                                            type="email"
                                            placeholder="Entrer une adresse courriel"
                                            value={email}
                                            disabled
                                    />
                                    <Input
                                            id="{firstNameInputElementId}"
                                            label="Prénom"
                                            placeholder="Entrer vos prénoms"
                                            value={$firstName}
                                            onChange={updatePersonalInformation}
                                            required
                                    />
                                    <Input
                                            id="{lastNameInputElementId}"
                                            label="Nom de famille"
                                            placeholder="Entrer votre nom de famille"
                                            value={$lastName}
                                            onChange={updatePersonalInformation}
                                            required
                                    />
                                    <Input
                                            id="{phoneNumberInputElementId}"
                                            label="Numéro de téléphone portable"
                                            placeholder="438-273-5678"
                                            value={$phoneNumber}
                                            onChange={updatePersonalInformation}
                                            required
                                    />
                                </Step>
                                <Step locked="{$isShippingAddressIncomplete}"
                                      regionNavigation="flex flex-col lg:flex-row">
                                    <svelte:fragment slot="header">Adresse de Livraison</svelte:fragment>
                                    <AddressForm
                                            id="shipping"
                                            address="{shippingAddress}"
                                            on:address-updated={onShippingAddressUpdated}
                                    />
                                </Step>
                                <Step locked="{$isBillingAddressIncomplete}"
                                      regionNavigation="flex flex-col lg:flex-row">
                                    <svelte:fragment slot="header">Adresse de Facturation</svelte:fragment>
                                    {#key useShippingAddress}
                                        <SlideToggleInput
                                                label="Utiliser l'adresse de livraison"
                                                value={useShippingAddress}
                                                onChange={onUseShippingAddressChanged}
                                        />
                                        <AddressForm
                                                id="billing"
                                                address="{billingAddress}"
                                                readonly="{useShippingAddress}"
                                                on:address-updated={onBillingAddressUpdated}
                                        />
                                    {/key}
                                </Step>
                            </Stepper>
                        {/if}
                    </div>
                {/if}
                {#if $customerId}
                    <div class="w-full h-max">
                        {#await checkoutShoppingCart($customerId)}
                            <ProgressBar value={undefined} data-testid="loading-indicator"/>
                        {:catch error}
                            <span> {error.message}</span>
                        {/await}
                        <div id="{checkoutSessionContainerId}" class="w-full"/>
                    </div>
                {/if}
            </div>
        {/key}
    </div>
</div>
<style lang="css">
    .title {
        font-family: Roboto, sans-serif
    }
</style>
