import {render, type RenderResult} from '@testing-library/svelte'
import SelectOption from '$lib/frontend/components/SelectOption.svelte'
import {expect, vi} from 'vitest'

let rendering: RenderResult<SelectOption, typeof import('@testing-library/dom/types/queries')>


describe('Select option Component', () => {
    describe('html structure', () => {

        beforeEach(() => {
            rendering = render(SelectOption, {
                label: 'Option 1',
                isSelected: false,
                onClickHandler: vi.fn()
            })
        })

        it('should have match snapshot', () => {
            expect(rendering.container).toMatchSnapshot()
        })
    })
})