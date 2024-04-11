import { cleanup, render, type RenderResult } from '@testing-library/svelte'
import OrderDetailsPage from '$routes/order/[id]/+page.svelte'
import { mock } from 'vitest-mock-extended'
import type { OrderDetailsPresentation } from '$lib/frontend/presentations/OrderDetailsPresentation'
import { afterEach } from 'vitest'
import { getOfferCartItems } from '$tests/unit/src/lib/TestHelpers'
import type { CategorySummaryPresentation } from '$lib/frontend/presentations/CategorySummaryPresentation'

describe('/order/[id]', () => {

	let view: RenderResult<OrderDetailsPage>

	describe('statically', () => {

		beforeEach(() => {
			view = render(OrderDetailsPage, {
				data: mock<OrderDetailsPresentation & {
					categories: CategorySummaryPresentation[],
				}>({
					items: getOfferCartItems()
				})
			})
		})

		it('should have the expected HTML structure', () => {

			expect(view.container).toMatchSnapshot()
		})
	})

	afterEach(() => {
		cleanup()
		vi.clearAllMocks
	})
})
