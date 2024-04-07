import {vi} from 'vitest'

vi.mock('svelte-french-toast', () => {
    return {
        default: {
            error: vi.fn(),
        },
    }
})
