import type {EventDispatcher} from 'svelte'
import {mock} from 'vitest-mock-extended'

export const dispatchEventFromMockedComponent = <T extends Record<string, any>> () => mock<EventDispatcher<T>>()

export default {
    dispatchEventFromMockedComponent,
}
