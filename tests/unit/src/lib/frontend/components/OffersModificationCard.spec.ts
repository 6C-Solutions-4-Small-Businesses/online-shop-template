import {cleanup, render, type RenderResult, waitFor} from '@testing-library/svelte'
import {afterEach, describe, expect} from 'vitest'
import OffersModificationCard from '$lib/frontend/components/OffersModificationCard.svelte'
import {mock, type MockProxy} from 'vitest-mock-extended'
import type {OffersModificationPresentation} from '$lib/frontend/presentations/OffersModificationPresentation'
import '@testing-library/jest-dom'

describe('OffersModificationCard', () => {

    const offerId = 'ordered-item-id'
    const price = 10099
    const name = 'ordered-item-name'
    const unit = 'Centiliter'

    let offer: MockProxy<OffersModificationPresentation>
    let view: RenderResult<OffersModificationCard, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        offer = mock<OffersModificationPresentation>({
            id: offerId,
            price,
            name,
            unit,
        })
        view = render(OffersModificationCard, {
            props: getComponentProperties(offer),
        })
    })

    function rerender() {
        view.unmount()
        view = render(OffersModificationCard, {
            props: getComponentProperties(offer),
        })
    }

    describe('Structure', () => {

        it('should have match snapshot', () => {

            expect(view.container).toMatchSnapshot()
        })

        describe('when offer image is a URL', () => {

            const imageUrl = 'https://cdn-cemal.nitrocdn.com/iwTMUnSsYeigzDpMWgwdBZhpcIeWwszq/assets/images/optimized/rev-59c8081/www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp-95907_800x675.jpg'

            beforeEach(async () => {
                offer.image = imageUrl
                rerender()
            })

            it('should show the image', () => {

                const image = view.getByAltText(name) as HTMLImageElement
                expect(image).toBeInTheDocument()
            })
        })

        describe('when offer image is base64 data', () => {

            const imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIS+2UwQ3CMAxFX4'

            beforeEach(async () => {
                offer.imageData = imageData
                rerender()
            })

            it('should show the image as well', () => {

                const image = view.getByAltText(name) as HTMLImageElement
                expect(image.src).toStrictEqual(imageData)
            })
        })

        describe('when offer modification has no id and "deleted" undefined', () => {

            beforeEach(async () => {
                offer.id = undefined
                offer.deleted = undefined

                rerender()
            })

            it('should show a banner labeled "ajouté"', async () => {

                const banner = await waitFor(() => view.getByText('ajouté'))
                expect(banner).toBeInTheDocument()
            })

            it('should match snapshot', () => {
                expect(view.container).toMatchSnapshot()
            })
        })

        describe('when offer modification has "deleted" property set', () => {

            beforeEach(async () => {
                offer.deleted = true
                rerender()
            })

            it('should show a banner labeled "supprimé"', () => {

                const banner = view.getByText('supprimé')
                expect(banner).toBeInTheDocument()
            })

            it('should match snapshot', () => {
                expect(view.container).toMatchSnapshot()
            })
        })

        describe('when offer modification has an id but not the "deleted" property set', () => {

            beforeEach(async () => {
                offer.deleted = undefined
                rerender()
            })

            it('should show a banner labeled "modifié"', () => {

                const banner = view.getByText('modifié')
                expect(banner).toBeInTheDocument()
            })

            it('should match snapshot', () => {
                expect(view.container).toMatchSnapshot()
            })
        })
    })


    function getComponentProperties(offer: MockProxy<OffersModificationPresentation>) {
        return {
            offer,
        }
    }

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})
