<script lang="ts">
    import BaseModal from '$lib/frontend/components/BaseModal.svelte'
    import Input from '$lib/frontend/components/Input.svelte'
    import {
        Autocomplete,
        type AutocompleteOption,
        getModalStore, getToastStore,
        InputChip,
        type ModalSettings,
    } from '@skeletonlabs/skeleton'
    import {onMount, type SvelteComponent} from 'svelte'
    import Button from '$lib/frontend/components/Button.svelte'
    import ChooseImageIcon from '~icons/mdi/camera'
    import ClearImageIcon from '~icons/mdi/close'
    import {compareStringsCaseInsensitive, includesString} from '$lib/frontend/core/StringsHelper.js'
    import Select from '$lib/frontend/components/Select.svelte'
    import type {OffersModificationPresentation} from '$lib/frontend/presentations/OffersModificationPresentation'
    import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'
    import type {NewCategoryPresentation} from '$lib/frontend/presentations/NewCategoryPresentation'
    import Cropper from 'svelte-easy-crop'
    import {getCroppedImage} from '$lib/frontend/core/ImagesHelper'
    import Image from '$lib/frontend/components/Image.svelte'
    import {getErrorToastSettings} from '$lib/frontend/core/ToasterUtils'

    export let parent: SvelteComponent

    const modalStore = getModalStore()
    const modalSettings = $modalStore[0] as ModalSettings
    const availableCategories: AutocompleteOption<string>[] = new Array(...modalSettings.meta?.categories ?? []).map((category) =>
        ({
            value: Object.keys(category)[0],
            label: Object.values(category)[0] as string,
        }),
    ).sort((a, b) => a.label.localeCompare(b.label))
    const validUnits = new Array(...modalSettings.meta?.units ?? [])
    const taxCategories = new Array(...modalSettings.meta?.taxCategories ?? [])

    const MAX_NUMBER_OF_CATEGORIES = 3
    const isImageValid = () => image !== undefined || imageData !== undefined
    const isNameValid = () => name !== undefined && name.length >= MAX_NUMBER_OF_CATEGORIES
    const isPriceValid = () => {
        if (!price) {
            return false
        }
        try {
            const amount = parseFloat(price)
            return amount > 0.0
        } catch (e) {
            return false
        }
    }
    const isQuantityValid = () => {
        try {
            const amount = parseInt(quantity)
            return amount > 0
        } catch (e) {
            return false
        }
    }
    const areCategoriesSet = () => selectedCategoriesValues.length > 0
    const MIN_CATEGORY_NAME_LENGTH = 3
    const MAX_CATEGORY_NAME_LENGTH = 32
    const isCategoryNameValid = (enteredName: string) =>
        /^[\p{L} ]+$/u.test(enteredName) && enteredName.length >= MIN_CATEGORY_NAME_LENGTH && enteredName.length <= MAX_CATEGORY_NAME_LENGTH
    const barCodesRegexes = {
        "UPC-A": /^\d{12}$/,
        "UPC-E": /^\d{6,8}$|^\d{12}$/,
        "EAN-13": /^\d{13}$/,
        "EAN-8": /^\d{8}$/,
        "Code 39": /^[A-Z0-9\-.$\/+% ]+$/,
        "Code 128": /^[\x00-\x7F]+$/,
        "Interleaved 2 of 5": /^\d{2,}$/,
        "ITF-14": /^\d{14}$/,
        "GS1 DataBar": /^\d{14}$/,
        "Codabar": /^[A-D][0-9\-$:\/.+]+[A-D]$/,
        "MSI": /^\d+$/,
    };
    const isBarCodeValid = () => {
        return barCode !== undefined && Object.entries(barCodesRegexes)
            .some((barCodeTypeEntry) => {
                const matches = barCode && barCodeTypeEntry[1].test(barCode)
                if (matches) {
                    console.log(`barcode ${barCode} matches type`, barCodeTypeEntry[0])
                }
                return matches
            })
    }
    const isInventoryValid = () => {
        try {
            const amount = parseInt(inventory)
            return amount > 0
        } catch (e) {
            return false
        }
    }
    const isTaxInfoSet = () => taxCategory !== undefined
    const toastStore = getToastStore()

    let image: string | undefined = modalSettings.meta?.offer?.image
    let imageData: string | undefined = modalSettings.meta?.offer?.imageData
    let croppedImageData: string | undefined = undefined
    let crop = {x: 0, y: 0}
    let cropSize = {width: 0, height: 0}
    let cropperContainer: HTMLDivElement
    let croppedAreaPixelsInfo = {x: 0, y: 0, width: 0, height: 0}
    let name: string | undefined = modalSettings.meta?.offer?.name
    let price: string | undefined = modalSettings.meta?.offer?.price
    let quantity = modalSettings.meta?.offer?.quantity?.toString() ?? '1'
    let unit = modalSettings.meta?.offer?.unit ?? 'Unité'
    let selectedCategoriesValues: { label: string, value?: string | undefined }[] =
        modalSettings.meta?.offer?.categories
            ?.map((c: (NewCategoryPresentation | CategorySummaryPresentation)) => ({
                label: c.name,
                //@ts-ignore value is not defined in NewCategoryPresentation
                value: c.id,
            })) ?? []
    let autoCompleteCategories = new Array(...availableCategories)
    let categoriesChips: InputChip
    let isCategoryAutocompleteVisible = false
    let description = modalSettings.meta?.offer?.description ?? ''
    let inventory = modalSettings.meta?.offer?.inventory?.toString() ?? '1'
    let barCode: string | undefined = modalSettings.meta?.offer?.barCode
    let taxCategory: string | undefined = modalSettings.meta?.offer?.taxCategory
    let formIsComplete = isFormComplete()

    function findFileInput() {
        return document.getElementById('image-file-input') as HTMLInputElement
    }

    function findCategoriesChipsInputField() {
        return document.getElementsByClassName('input-chip-field')[0]
    }

    function findCategoriesChipsInput() {
        return document.querySelectorAll('.input-chip-field')[0] as HTMLInputElement
    }

    function onInputChangeHandler(event: Event) {
        const input = event.target as HTMLInputElement
        switch (input.id) {
            case 'name-input':
                name = input.value
                break
            case 'price-input':
                price = input.value
                break
            case 'quantity-input':
                quantity = input.value
                break
            case 'barcode-input':
                barCode = input.value
                break
            case 'inventory-input':
                inventory = input.value
                break
        }
        formIsComplete = isFormComplete()
    }

    async function onFileHandler(event: Event) {
        //@ts-ignore Files is defined in the event target
        const imageBlob = event?.target?.files[0]
        if (imageBlob) {
            const reader = new FileReader()
            reader.onload = (e) => {
                imageData = <string>e!.target!.result!
                croppedImageData = imageData
                formIsComplete = isFormComplete()
            }
            reader.readAsDataURL(imageBlob)
        }
    }

    async function onCropComplete(
        croppedArea: CustomEvent<{ pixels: { x: number, y: number, width: number, height: number } }>,
    ) {
        croppedAreaPixelsInfo = croppedArea.detail.pixels
    }

    async function onSelectImageHandler() {
        findFileInput().click()
    }

    function onCategoriesSelectionFocusHandler() {
        const element = findCategoriesChipsInputField()
        const input = element as HTMLElement
        input.style.outline = 'none'
        isCategoryAutocompleteVisible = true
    }

    function onCategoriesChipInvalidHandler(event: CustomEvent) {
        const label = event.detail.input
        if (selectedCategoriesValues.some((category) => compareStringsCaseInsensitive(category.label, label))) {
            toastStore.trigger(getErrorToastSettings(`La catégorie "${label}" a déjà été rattachée à cette offre.`))
        } else if (label.length < MAX_NUMBER_OF_CATEGORIES) {
            toastStore.trigger(getErrorToastSettings(`Le nom d'une catégorie doit comprendre entre ${MIN_CATEGORY_NAME_LENGTH} et ${MAX_CATEGORY_NAME_LENGTH} charactères de l'alphabet.`))
        } else if (!isCategoryNameValid(label)) {
            toastStore.trigger(getErrorToastSettings(`Seulement les caractères de l'alphabet sont autorisé dans le nom d'une catégorie.`))
        } else {
            toastStore.trigger(getErrorToastSettings("Une offre ne peut apparternir à plus de 3 catégories."))
        }
    }

    function onAutocompletedCategorySelectedHandler(event: CustomEvent<AutocompleteOption<string>>) {
        const label = event.detail.label
        if (selectedCategoriesValues.some((category) => compareStringsCaseInsensitive(category.label, label)) === false) {
            selectedCategoriesValues.push({label, value: event.detail.value})
            formIsComplete = isFormComplete()
            categoriesChips.addChip(event.detail.label)
        }
        isCategoryAutocompleteVisible = false
        resetCategoryAutocompleteOptions()
    }

    function onCategoryChipAddedHandler(
        event: CustomEvent<{ event: SubmitEvent, chipIndex: number, chipValue: string }>,
    ) {
        const label = event.detail.chipValue
        const alreadyContainCategory = selectedCategoriesValues.some((category) => compareStringsCaseInsensitive(category.label, label))
        if (alreadyContainCategory) {
            categoriesChips.removeChip(label)
        }
        if (selectedCategoriesValues.length < MAX_NUMBER_OF_CATEGORIES) {
            selectedCategoriesValues.push({label})
            formIsComplete = isFormComplete()
        }
        resetCategoryAutocompleteOptions()
    }

    function onCategoryChipRemoveHandler(
        event: CustomEvent<{ event: MouseEvent, chipIndex: number, chipValue: string }>,
    ) {
        selectedCategoriesValues = new Array(...selectedCategoriesValues.filter((category) => category.label !== event.detail.chipValue))
        resetCategoryAutocompleteOptions()
        formIsComplete = isFormComplete()
    }

    async function onCategoryAutoCompleteInputHandler(event: Event) {
        const term = (event.target as HTMLInputElement).value
        autoCompleteCategories = availableCategories.filter((option) => includesString(option.label, term))
    }

    function onTaxCategoryClickHandler(event: Event) {
        const taxCategoryChip = event.target as HTMLButtonElement
        taxCategory = taxCategoryChip.dataset.category as string
        if (!taxCategory) { //Safari / iOS
            const child = taxCategoryChip.childNodes[0] as HTMLSpanElement
            taxCategory = child.textContent as string
        }
        formIsComplete = isFormComplete()
    }

    async function clearImage() {

        image = undefined
        imageData = undefined
        croppedImageData = undefined
        formIsComplete = isFormComplete()
    }

    function resetCategoryAutocompleteOptions() {
        findCategoriesChipsInput().value = ''
        autoCompleteCategories = availableCategories
            .filter((category) => false === selectedCategoriesValues
                .some((selectedCategory) => compareStringsCaseInsensitive(category.label, selectedCategory.label)))
    }

    function isFormComplete() {
        const imageValid = isImageValid()
        const nameValid = isNameValid()
        const priceValid = isPriceValid()
        const quantityValid = isQuantityValid()
        const categoriesSet = areCategoriesSet()
        const barCodeValid = isBarCodeValid()
        const inventoryValid = isInventoryValid()
        const taxInfoSet = isTaxInfoSet()
        return imageValid &&
            nameValid &&
            priceValid &&
            quantityValid &&
            categoriesSet &&
            barCodeValid &&
            inventoryValid &&
            taxInfoSet
    }

    async function onFormSubmit(): Promise<void> {
        if (imageData) {
            croppedImageData = await getCroppedImage(imageData, croppedAreaPixelsInfo)
        }
        if (modalSettings.response) {
            modalSettings.response({
                offer: toOfferManagementPresentation(),
                index: modalSettings.meta?.offerIndex,
            })
        }
        modalStore.close()
    }

    function mapSelectedCategories() {
        return selectedCategoriesValues
            .map((category: { label: string, value?: string | undefined }) => {

                if (category.value) {
                    return {
                        name: category.label,
                        id: category.value,
                    } satisfies CategorySummaryPresentation
                }
                return {name: category.label} satisfies NewCategoryPresentation
            })
    }

    function toOfferManagementPresentation(): OffersModificationPresentation | undefined {
        if (!(croppedImageData || image) || !name || !price || !selectedCategoriesValues || !barCode || !taxCategory) {
            return undefined
        }

        return {
            id: modalSettings.meta?.offer?.id,
            image,
            imageData: croppedImageData,
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            categories: mapSelectedCategories(),
            inventory: parseInt(inventory),
            unit,
            description,
            barCode,
            taxCategory,
        }
    }

    onMount(() => {
        for (const category of selectedCategoriesValues) {
            categoriesChips?.addChip(category.label)
        }
        if (cropperContainer) {
            cropSize = {
                width: cropperContainer.offsetWidth,
                height: cropperContainer.offsetHeight,
            }
        }
    })

</script>

{#if modalSettings}
    <div class="w-full md:w-6/12 lg:w-6/12 xl:w-4/12">
        <BaseModal
                title={modalSettings.title}
                body={modalSettings.body}
                parent={parent}
                buttonTextCancel={modalSettings.buttonTextCancel}
                buttonTextSubmit={modalSettings.buttonTextSubmit}
                submitButtonDisabled={!formIsComplete}
                onSubmitClickHandler={onFormSubmit}
                onCancelClickHandler={modalSettings.meta?.onClose}
        >
            <form class="w-11/12 h-[36rem] overflow-y-scroll">
                <div class="mb-2">
                    <h4 class="mb-1 text-black" data-testid="input-label-id">Image
                        <span class="text-red-500">*</span>
                    </h4>
                    {#key imageData}
                        <div bind:this={cropperContainer}
                             class="{`py-2 relative w-full aspect-1 flex flex-row items-center bg-gray-300 ${isImageValid() ? '' : 'border-2 border-red-500'}`}">
                            {#if image}
                                <div class="absolute w-full h-full bg-white">
                                    <Image
                                            imageRemoteUrl="{image}"
                                            name="{name ?? ''}"
                                            classes="w-full h-full object-contain"/>
                                    <Button
                                            id="clear-image-button"
                                            classNames="absolute top-1 right-2 border-none p-2"
                                            background="background-none"
                                            text="text-white"
                                            block="{true}"
                                            onClick={clearImage}>
                                        <ClearImageIcon
                                                class="text-3xl font-bold bg-red-400 rounded-full p-1 hover:bg-red-500"
                                        />
                                    </Button>
                                </div>
                            {:else if imageData}
                                <div
                                        id="offer-preview-container"
                                        class="absolute w-full h-full border-2">
                                    <div class="relative h-full">
                                        <Cropper
                                                image="{imageData}"
                                                aspect="{1}"
                                                restrictPosition="{false}"
                                                bind:cropSize
                                                bind:crop
                                                on:cropcomplete={onCropComplete}/>
                                        <Button
                                                id="clear-image-button"
                                                classNames="border-none p-2"
                                                background="background-none"
                                                text="text-white"
                                                block="{true}"
                                                onClick={clearImage}>
                                            <ClearImageIcon
                                                    class="absolute right-2 text-3xl font-bold bg-red-400 rounded-full p-1 hover:bg-red-500"
                                            />
                                        </Button>
                                    </div>
                                </div>
                            {:else}
                                <div class="absolute w-full flex-1 flex flex-col items-center">
                                    <Input
                                            id="image-file-input"
                                            hidden="{true}"
                                            accept="image/*"
                                            type="file"
                                            value=""
                                            onChange={onFileHandler}
                                    />
                                    <Button
                                            id="select-image-button"
                                            classNames="w-2/3 shadow-sm p-4"
                                            text="text-white"
                                            border="border-black"
                                            background="bg-gray-700 hover:bg-gray-800"
                                            onClick={onSelectImageHandler}>
                                        <div class="flex flex-row items-center">
                                            <ChooseImageIcon class="inline m-1"/>
                                            <span class="flex-1">Choisir image</span>
                                        </div>
                                    </Button>
                                </div>
                            {/if}
                        </div>
                    {/key}
                </div>
                <div class="py-2 mb-2">
                    <Input
                            id="name-input"
                            label="Nom"
                            placeholder="Pepsi Diet"
                            value={name ?? ''}
                            error={name !== undefined && !isNameValid()}
                            required="{true}"
                            onChange="{onInputChangeHandler}"
                            onBlur="{onInputChangeHandler}"
                    />
                </div>
                <div class="py-2 mb-2">
                    <div class="flex flex-row gap-2 justify-between">
                        <Input
                                id="price-input"
                                label="Prix"
                                type="number"
                                step="0.01"
                                classNames=""
                                placeholder="9.99"
                                value={price ?? ''}
                                required="{true}"
                                error="{price !== undefined && !isPriceValid()}"
                                onChange="{onInputChangeHandler}"
                                onBlur="{onInputChangeHandler}"
                        />
                        <Input
                                id="quantity-input"
                                label="Quantité"
                                type="number"
                                classNames=""
                                placeholder="24"
                                value={quantity}
                                error="{quantity !== '' && !isQuantityValid()}"
                                onChange="{onInputChangeHandler}"
                        />
                        <Select
                                id="unit-select"
                                label="Unité"
                                bind:selectedValue={unit}
                                options="{validUnits}"
                                onChange="{(value) => unit = value}"
                        />
                    </div>
                </div>
                <div class="py-2 mb-2">
                    <h4 class="mb-1 text-black" data-testid="input-label-id">Catégories
                        <span class="text-red-500">*</span>
                    </h4>
                    <InputChip
                            id="categories-selection"
                            data-testid="categories-selection"
                            label="Catégories"
                            name="Catégories"
                            placeholder="Entrez le nom d'une catégorie"
                            class={`categoriesSelection w-full p-3.5 rounded-md border-gray-500 bg-white focus:outline-none focus:ring-0 focus:border-blue-500`}
                            bind:this={categoriesChips}
                            on:input={onCategoryAutoCompleteInputHandler}
                            on:add={onCategoryChipAddedHandler}
                            on:remove={onCategoryChipRemoveHandler}
                            on:focus={onCategoriesSelectionFocusHandler}
                            on:blur={() => setTimeout(() => isCategoryAutocompleteVisible = false, 100)}
                            on:invalid={onCategoriesChipInvalidHandler}
                            validation={isCategoryNameValid}
                            invalid="border-2 border-red-500"
                            isValid="{areCategoriesSet}"
                            allowUpperCase
                            minlength={3}
                            maxlength={32}
                            max="{MAX_NUMBER_OF_CATEGORIES}"
                    />

                    {#if isCategoryAutocompleteVisible}
                        <div
                                id="categories-autocomplete"
                                class="card z-20 w-full max-h-48 p-4 bg-white overflow-y-auto"
                                tabindex="-1"
                        >
                            <Autocomplete
                                    id="categories-autocomplete"
                                    options={autoCompleteCategories}
                                    denylist={selectedCategoriesValues.map((category) => category.label)}
                                    on:selection={onAutocompletedCategorySelectedHandler}
                                    emptyState="Aucune catégorie correspond au critère de recherche."
                            />
                        </div>
                    {/if}
                </div>
                <div class="py-2 mb-2 gap-2">
                    <h4 class="mb-1 text-black" data-testid="input-label-id">Taxes de vente
                        <span class="text-red-500">*</span>
                    </h4>
                    {#each taxCategories as c}
                        <button
                                data-testid="{c}"
                                class="chip text-lg {taxCategory === c ? 'variant-filled' : 'variant-soft'} mr-2"
                                data-category="{c}"
                                on:click={onTaxCategoryClickHandler}
                                on:blur={onTaxCategoryClickHandler}
                        >
                            <span>{c}</span>
                        </button>
                    {/each}
                </div>
                <div class="py-2 mb-2">
                    <div class="flex flex-row gap-2 justify-between">
                        <Input
                                id="barcode-input"
                                label="Code barre"
                                classNames="flex-1"
                                placeholder="00000ABD000"
                                value={barCode ?? ''}
                                error="{barCode !== undefined && !isBarCodeValid()}"
                                required="{true}"
                                onChange="{onInputChangeHandler}"
                                onBlur="{onInputChangeHandler}"
                        />
                        <Input
                                id="inventory-input"
                                label="Inventaire"
                                type="number"
                                classNames="flex-0 w-[6rem]"
                                placeholder="24"
                                value={inventory}
                                error="{!isInventoryValid()}"
                                onChange="{onInputChangeHandler}"
                                onBlur="{onInputChangeHandler}"
                        />
                    </div>
                </div>
                <div class="py-2 mb-2">
                    <h4 class="mb-1 text-black" data-testid="input-label-id">Description</h4>
                    <textarea
                            id="large-text-input"
                            bind:value={description}
                            rows="4"
                            class="w-full text-l px-3 py-2 p-3.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ce produit provient de la ..."
                    ></textarea>
                </div>
            </form>
        </BaseModal>
    </div>
{/if}
