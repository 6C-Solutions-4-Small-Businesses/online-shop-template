<svelte:options accessors/>
<script lang="ts">
    import type {AddressPresentation} from '$lib/frontend/presentations/AddressPresentation'
    import {createEventDispatcher} from 'svelte'
    import Input from '$lib/frontend/components/Input.svelte'
    import Select from '$lib/frontend/components/Select.svelte'

    const streetAddressLine1Id = 'street-address-line1'
    const streetAddressLine2Id = 'street-address-line2'
    const cityId = 'city'
    const postalCodeId = 'postal-code'
    const stateId = 'state'
    const countryId = 'country'
    const getInputValue = (event: Event) => (event.target as HTMLInputElement).value
    const dispatch = createEventDispatcher()

    export let id = 'address-form'
    export let address = {
        streetAddressLine1: '',
        streetAddressLine2: '',
        city: '',
        postalCode: '',
        state: '',
        country: '',
    } as AddressPresentation
    export let readonly = false

    dispatchAddressUpdated()

    function dispatchAddressUpdated() {

        dispatch('address-updated', {
            address,
        })
    }

    function updateAddressInfo(event: Event) {
        const target = event.target as HTMLElement
        const inputValue = getInputValue(event)
        switch (target.id) {
            case 'street-address-line1':
                address.streetAddressLine1 = inputValue
                break
            case 'street-address-line2':
                address.streetAddressLine2 = inputValue
                break
            case 'city':
                address.city = inputValue
                break
            case 'postal-code':
                address.postalCode = inputValue
                break
            default:
                break
        }

        dispatchAddressUpdated()
    }
</script>

<div class="flex flex-col gap-4"
     data-testid="{id}"
     id="{id}">
    <Input
            disabled={readonly}
            id="{streetAddressLine1Id}"
            label="Adresse"
            onChange={updateAddressInfo}
            placeholder="123 Rue Fonteneau"
            value={address.streetAddressLine1}
            required
    />
    <Input
            disabled={readonly}
            id="{streetAddressLine2Id}"
            label="Appartement, suite, unité, etc."
            onChange={updateAddressInfo}
            placeholder="Apt. 405"
            value={address.streetAddressLine2}
    />
    <Input
            disabled={readonly}
            id={cityId}
            label="Ville"
            onChange={updateAddressInfo}
            placeholder="Entre une ville"
            value={address.city}
            required
    />
    <Input
            disabled={readonly}
            id={postalCodeId}
            label="Code postal"
            onChange={updateAddressInfo}
            placeholder="H2H 1H1"
            value={address.postalCode}
            required
    />
    <Select
            disabled={readonly}
            id={stateId}
            label="Province"
            onChange={(value) => {
                address.state = value
                dispatchAddressUpdated()
            }}
            options={["Québec"]}
            selectedValue={address.state}
            required
    />
    <Select
            disabled={readonly}
            id={countryId}
            label="Pays"
            onChange={(value) => {
                address.country = value
                dispatchAddressUpdated()
            }}
            options={["Canada"]}
            optionsBottom={false}
            selectedValue={address.country}
            required
    />
</div>
