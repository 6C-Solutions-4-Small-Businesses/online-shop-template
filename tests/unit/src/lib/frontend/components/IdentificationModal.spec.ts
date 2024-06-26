import {afterEach, beforeEach, describe, expect, it, type Mock} from 'vitest'
import '@testing-library/jest-dom'
import {findUser} from '$lib/frontend/endpoints/Endpoints'
import {type Writable, writable} from 'svelte/store'
import {cleanup, render, type RenderResult, screen as vScreen} from '@testing-library/svelte'
import IdentificationModal from '$lib/frontend/components/IdentificationModal.svelte'
import {mock} from 'vitest-mock-extended'
import type {SvelteComponent} from 'svelte'
import type {ModalStore, ToastStore} from '@skeletonlabs/skeleton'
import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
import {currentModalSettings} from '$mocks/src/lib/frontend/stores/ModalStore'

const validEmail = 'a@mail.com'

describe('IdentificationModal component', () => {
    const parentOnModalClosed = vi.fn()
    const mockedFindUser = findUser as Mock
    const isEmailInvalidProperty = writable(true)
    const submitButtonTestId = 'continue-button'
    const cancelButtonTestId = 'cancel-button'
    const emailProperty = writable('')
    let view: RenderResult<IdentificationModal, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {
        view = render(IdentificationModal, {
            props: {
                isEmailInvalid: isEmailInvalidProperty,
                email: emailProperty,
                parent: mock<SvelteComponent>({
                    onClose: parentOnModalClosed,
                }),
            },
        })
    })

    describe('Structure', () => {
        it('should have match snapshot', () => {
            expect(view.container).toMatchSnapshot()
        })
    })

    describe('requests email', () => {
        let emailInput: any

        beforeEach(() => {
            emailInput = vScreen.getByTestId('email-input')
        })

        it('should contains an email input', () => {
            expect(emailInput).toBeInTheDocument()
        })

        it('should set email invalid property to false from valid email in its input', () => {
            const isEmailInvalidPropertySetSpy = vi.spyOn(isEmailInvalidProperty, 'set')
            emailInput.value = validEmail

            emailInput.dispatchEvent(new Event('input'))

            expect(isEmailInvalidPropertySetSpy).toHaveBeenCalledWith(false)
        })

        it('should populate email property from its input', () => {
            const emailPropertySetSpy = vi.spyOn(emailProperty, 'set')
            emailInput.value = validEmail

            emailInput.dispatchEvent(new Event('input'))

            expect(emailPropertySetSpy).toHaveBeenCalledWith(validEmail)
        })

        it('should set email invalid property to true from invalid email in its input', () => {
            const isEmailInvalidPropertySetSpy = vi.spyOn(isEmailInvalidProperty, 'set')
            emailInput.value = 'an invalid email'

            emailInput.dispatchEvent(new Event('input'))

            expect(isEmailInvalidPropertySetSpy).toHaveBeenCalledWith(true)
        })
    })

    describe(`submit button`, () => {
        describe('Structure', () => {
            it(`should contain an ${submitButtonTestId}`, () => {
                expect(vScreen.getByTestId(submitButtonTestId)).toBeInTheDocument()
            })

            it(`should have the ${submitButtonTestId} disabled by default`, () => {
                expect(vScreen.getByTestId(submitButtonTestId)).toBeDisabled()
            })

            it(`should enable the ${submitButtonTestId} when email is valid`, () => {
                isEmailInvalidProperty.set(false)
                rerender()

                expect(vScreen.getByTestId(submitButtonTestId)).toBeEnabled()
            })

            it('should have the label "Continuer" when the buttonTextSubmit is not defined', () => {
                expect(vScreen.getByTestId(submitButtonTestId)).toHaveTextContent('Continuer')
            })

            it('should have the expected label when buttonTextSubmit is set', () => {
                currentModalSettings.buttonTextSubmit = 'Submit'

                rerender()

                expect(vScreen.getByTestId(submitButtonTestId)).toHaveTextContent('Submit')
            })
        })

        describe('when clicked', () => {
            describe('try to find the user', () => {
                beforeEach(() => {
                    emailProperty.set(validEmail)
                    vScreen.getByTestId(submitButtonTestId).dispatchEvent(new Event('click'))
                })

                it(`should call "findUser" with the entered email`, async () => {
                    expect(mockedFindUser).toHaveBeenCalledWith(
                        expect.objectContaining({
                            value: validEmail,
                        }),
                    )
                })

                it('should close the modal', async () => {
                    const {currentModalStoreOnClose} = await import(
                        '$mocks/src/lib/frontend/stores/ModalStore'
                        )

                    expect(currentModalStoreOnClose).toHaveBeenCalled()
                })
            })

            describe('when user is found', () => {
                const user = mock<UserAccountSummaryPresentation | undefined>()

                beforeEach(() => {
                    mockedFindUser.mockResolvedValue(user)
                    emailProperty.set(validEmail)
                    vScreen.getByTestId(submitButtonTestId).dispatchEvent(new Event('click'))
                })

                it('should send the found user as response to the modal store', async () => {
                    const {currentModalStoreOnResponse} = await import(
                        '$mocks/src/lib/frontend/stores/ModalStore'
                        )

                    expect(currentModalStoreOnResponse).toHaveBeenCalledWith(
                        expect.objectContaining({
                            account: user,
                        }),
                    )
                })
            })

            describe('when user is not found', () => {
                beforeEach(() => {
                    mockedFindUser.mockResolvedValue(undefined)
                    emailProperty.set(validEmail)
                    vScreen.getByTestId(submitButtonTestId).dispatchEvent(new Event('click'))
                })

                it('should send the email as response to the modal store', async () => {
                    const {currentModalStoreOnResponse} = await import(
                        '$mocks/src/lib/frontend/stores/ModalStore'
                        )

                    expect(currentModalStoreOnResponse).toHaveBeenCalledWith({
                        email: validEmail,
                    })
                })
            })
        })
    })

    function rerender(properties: { isEmailInvalid: Writable<boolean> } = {isEmailInvalid: isEmailInvalidProperty }) {
        view.unmount()
        view = render(IdentificationModal, {
            props: {
                parent: mock<SvelteComponent>(),
                isEmailInvalid: isEmailInvalidProperty,
            }
        })
    }

    describe(`cancel button`, () => {
        describe('Structure', () => {
            it(`should contain an ${cancelButtonTestId}`, () => {
                expect(vScreen.getByTestId(cancelButtonTestId)).toBeInTheDocument()
            })

            it(`should have the ${cancelButtonTestId} enabled by default`, () => {
                expect(vScreen.getByTestId(cancelButtonTestId)).toBeEnabled()
            })

            it('should have the label "Annuler" when the buttonTextCancel is not defined', () => {
                expect(vScreen.getByTestId(cancelButtonTestId)).toHaveTextContent('Annuler')
            })

            it('should have the expected label when buttonTextCancel is set', () => {
                currentModalSettings.buttonTextCancel = 'Cancel'
                rerender()

                expect(vScreen.getByTestId(cancelButtonTestId)).toHaveTextContent('Cancel')
            })
        })

        describe('when clicked', () => {
            beforeEach(() => {
                vScreen.getByTestId(cancelButtonTestId).dispatchEvent(new Event('click'))
            })

            it('should call the close method on the parent', async () => {
                expect(parentOnModalClosed).toHaveBeenCalled()
            })
        })
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})

vi.mock('@skeletonlabs/skeleton', async () => {
    const actual = await import('@skeletonlabs/skeleton')
    const {modalStore} = await import('$mocks/src/lib/frontend/stores/ModalStore')
    const {toastStore} = await import('$mocks/src/lib/frontend/stores/ToastStore')
    return {
        ...actual,
        getModalStore: (): ModalStore => modalStore,
        getToastStore: (): ToastStore => toastStore,
    }
})

vi.mock('$lib/frontend/core/Helper', async () => {
    const actual = await import('$lib/frontend/core/Helper')
    return {
        ...actual,
        isEmailInvalid: vi.fn((email) => email !== validEmail),
    }
})

vi.mock('$lib/frontend/endpoints/Endpoints', async () => {
    const actual = await import('$lib/frontend/endpoints/Endpoints')
    return {
        ...actual,
        findUser: vi.fn(),
    }
})
