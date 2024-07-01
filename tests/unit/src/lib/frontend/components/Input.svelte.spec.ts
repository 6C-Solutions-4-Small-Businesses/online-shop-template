import {cleanup, fireEvent, render, type RenderResult, screen} from '@testing-library/svelte'
import Input from '$lib/frontend/components/Input.svelte'
import '@testing-library/jest-dom'
import {afterEach, expect} from 'vitest'

describe('Input Component', () => {
    const inputId = 'test-id'
    const inputLabel = 'input-label'
    const inputPlaceHolder = 'input-placeholder'
    const initialInputValue = 'Initial Value'
    const inputType = 'text'
    const classNames = 'bg-red-500'
    const inputCaptureType = 'user'
    const onBlur = vi.fn()
    const onChange = vi.fn()

    let inputElement: HTMLInputElement
    let rendering: RenderResult<Input, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        rendering = render(Input, {
            props: {
                id: inputId,
                label: inputLabel,
                type: inputType,
                placeholder: inputPlaceHolder,
                value: initialInputValue,
                classNames,
                capture: inputCaptureType,
                onBlur,
                onChange,
            },
        })
        inputElement = rendering.getByTestId(inputId) as HTMLInputElement
    })

    describe('html structure', () => {

        it('should have match snapshot', () => {
            expect(rendering.container).toMatchSnapshot()
        })

        it('should map the "id" property to the "data-testid" of the input', () => {

            expect(screen.getByTestId(inputId)).toBeInTheDocument()
        })

        it('should set the value of the label element to the value of the label property', () => {

            const labelElement = rendering.getByText(inputLabel)

            expect(labelElement).toBeInTheDocument()
        })

        it('should set the value of the input type to the value of the type property', () => {

            expect(inputElement.type).toBeDefined()
            expect(inputElement.type).toStrictEqual(inputType)
        })

        it('should set the value of the input placeholder to the value of the placeholder property', () => {

            expect(inputElement.placeholder).toBeDefined()
            expect(inputElement.placeholder).toStrictEqual(inputPlaceHolder)
        })

        it('should set the value of the input element to the initial value of the value property', () => {

            expect(inputElement.value).toBeDefined()
            expect(inputElement.value).toStrictEqual(initialInputValue)
        })

        it('should set the input disabled property to the value of the provided disabled property', () => {

            expect(inputElement.disabled).toBeDefined()
            expect(inputElement.disabled).toBeFalsy()
        })

        it('should set the input div container class to the provided "classNames" property', () => {

            const containerElement = rendering.getByTestId('input-container') as HTMLInputElement

            expect(containerElement.classList).toContain(classNames)
        })

        it('should set the hide the input if the "hidden" property is set to true', async () => {

            await rerenderComponent({hidden: true})

            const hiddenInputElement = rendering.getByTestId(inputId) as HTMLInputElement

            expect(hiddenInputElement.classList).toContain('hidden')
        })

        it('should set the "accept" property of the input to the value provided to the property "accept"', async () => {
            const accept = 'image/*'

            await rerenderComponent({accept})

            const imageInputElement = rendering.getByTestId(inputId) as HTMLInputElement
            expect(imageInputElement.accept).toStrictEqual(accept)
        })

        it('should set the increment and decrement step of the input to the value provided to the property "step"', async () => {
            const step = '0.0001'

            await rerenderComponent({step})

            const stepInputElement = rendering.getByTestId(inputId) as HTMLInputElement
            expect(stepInputElement.step).toStrictEqual(step)
        })
    })

    describe('Behavior', () => {

        it('should call onChange handler when a change occurs in the input', () => {

            fireEvent.input(inputElement, {target: {value: 'new value'}})

            expect(onChange).toHaveBeenCalled()
        })

        it('should call onBlur handler when a blur occurs', () => {

            fireEvent.blur(inputElement)

            expect(onBlur).toHaveBeenCalled()
        })
    })

    async function rerenderComponent(
        options: {
            hidden?: boolean,
            accept?: string,
            capture?: boolean | 'user' | 'environment' | undefined,
            step?: string,
        } = {hidden: false, accept: '*'},
    ) {
        await rendering.rerender({
            id: inputId,
            label: inputLabel,
            type: inputType,
            placeholder: inputPlaceHolder,
            value: initialInputValue,
            hidden: options.hidden,
            accept: options.accept,
            capture: options.capture,
            step: options.step,
        })
    }

    afterEach(() => {
        rendering.unmount()
        cleanup()
        vi.clearAllMocks()
    })
})
