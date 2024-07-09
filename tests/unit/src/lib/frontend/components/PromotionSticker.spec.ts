import {describe} from 'vitest'
import PromotionSticker from '$lib/frontend/components/PromotionSticker.svelte'
import {render} from '@testing-library/svelte'

describe('Promotion sticker', () => {
    it('should have match snapshot', () => {
        const {container} = render(PromotionSticker, {
            percentage: 85
        })

        expect(container).toMatchSnapshot()
    })
})