import type { ToastStore } from '@skeletonlabs/skeleton'

export const toastStore: ToastStore = {
	subscribe: vi.fn(),
	close: vi.fn(),
	trigger: vi.fn(),
	freeze: vi.fn(),
	unfreeze: vi.fn(),
	clear: vi.fn(),
}