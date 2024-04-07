import {render, type RenderResult, screen} from '@testing-library/svelte'
import Input from '$lib/frontend/components/Input.svelte'
import '@testing-library/jest-dom'
import {expect} from 'vitest'

describe('Input Component', () => {
    const inputContainerId = 'test-id'
    const inputLabel = 'input-label'
    const inputPlaceHolder = 'input-placeholder'
    const initialInputValue = 'Initial Value'
    const inputType = 'text'

    let rendering: RenderResult<Input, typeof import('@testing-library/dom/types/queries')>

    describe('html structure', () => {

        beforeEach(() => {
            rendering = render(Input, {
                props: {
                    id: inputContainerId,
                    label: inputLabel,
                    type: inputType,
                    placeholder: inputPlaceHolder,
                    value: initialInputValue
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

            const labelElement = rendering.getByText(inputLabel)

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
            expect(inputElement.placeholder).toStrictEqual(inputPlaceHolder)
        })

        it('should set the value of the input element to the initial value of the value property', () => {

            const inputElement = rendering.getByTestId(inputContainerId) as HTMLInputElement

            expect(inputElement.value).toBeDefined()
            expect(inputElement.value).toStrictEqual(initialInputValue)
        })

        it('should set the input disabled property to the value of the provided disabled property', () => {

            const inputElement = rendering.getByTestId(inputContainerId) as HTMLInputElement

            expect(inputElement.disabled).toBeDefined()
            expect(inputElement.disabled).toBeFalsy()
        })
    })
})