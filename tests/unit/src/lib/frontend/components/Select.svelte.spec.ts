import {render, type RenderResult, screen} from '@testing-library/svelte'
import '@testing-library/jest-dom'
import Select from '$lib/frontend/components/Select.svelte'
import {expect} from 'vitest'

describe('Select Component', () => {
    const inputContainerId = 'test-id'
    const selectLabel = 'select-label'
    const selectPlaceHolder = 'input-placeholder'
    const initialSelectValue = 'Québec'
    const selectOptions = ['Québec', 'Ontario', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island', 'Northwest Territories', 'Yukon', 'Nunavut']
    const inputType = 'text'

    let rendering: RenderResult<Select, typeof import('@testing-library/dom/types/queries')>

    describe('html structure', () => {

        beforeEach(() => {
            rendering = render(Select, {
                props: {
                    id: inputContainerId,
                    label: selectLabel,
                    placeholder: selectPlaceHolder,
                    selectedValue: initialSelectValue,
                    options: selectOptions
                },
            })
        })

        it('should have match snapshot', () => {
            expect(rendering.container).toMatchSnapshot()
        })

        it('should map the "id" property to the "data-testid" of the containing div', () => {

            expect(screen.getByTestId(inputContainerId)).toBeInTheDocument()
        })

        it('should set the value of the label element to the value of the label property', () => {

            const labelElement = rendering.getByText(selectLabel)

            expect(labelElement).toBeInTheDocument()
        })

        it('should set the value of the input type to the value of the type property', () => {

            const inputElement = rendering.getByTestId(inputContainerId) as HTMLInputElement

            expect(inputElement.type).toBeDefined()
            expect(inputElement.type).toStrictEqual(inputType)
        })

        it('should set the value of the input placeholder to the value of the placeholder property', () => {

            const inputElement = rendering.getByTestId(inputContainerId) as HTMLInputElement

            expect(inputElement.placeholder).toBeDefined()
            expect(inputElement.placeholder).toStrictEqual(selectPlaceHolder)
        })

        it('should set the value of the input element to the initial value of the value property', () => {

            const inputElement = rendering.getByTestId(inputContainerId) as HTMLInputElement

            expect(inputElement.value).toBeDefined()
            expect(inputElement.value).toStrictEqual(initialSelectValue)
        })

        it('should set the input disabled property to the value of the provided disabled property', () => {

            const inputElement = rendering.getByTestId(inputContainerId) as HTMLInputElement

            expect(inputElement.disabled).toBeDefined()
            expect(inputElement.disabled).toBeFalsy()
        })

        test.each(selectOptions)('should have displayed the options', (option) => {

            const htmlElement = rendering.getByText(option)

            expect(htmlElement).toBeDefined()
        })
    })
})