import {render, type RenderResult} from '@testing-library/svelte'
import SlideToggleInput from '$lib/frontend/components/SlideToggleInput.svelte'
import {expect, vi} from 'vitest'

let rendering: RenderResult<SlideToggleInput, typeof import('@testing-library/dom/types/queries')>


describe('Slide toggle input Component', () => {
    describe('html structure', () => {

        beforeEach(() => {
            rendering = render(SlideToggleInput, {
                label: 'Re-use same address',
                value: true,
                onChange: vi.fn()
            })
        })

        it('should have match snapshot', () => {
            expect(rendering.container).toMatchSnapshot()
        })
    })
})