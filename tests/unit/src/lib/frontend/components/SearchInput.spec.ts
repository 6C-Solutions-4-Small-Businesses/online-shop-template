import SearchInput from '$lib/frontend/components/SearchInput.svelte';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, type RenderResult, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect } from 'vitest';

describe('Search input', () => {
	let renderResult: RenderResult<SearchInput, typeof import('@testing-library/dom/types/queries')>;
	const inputId = 'search-input-id';
	const buttonId = 'search-input-button-id';

	beforeEach(() => {
		renderResult = render(SearchInput, {
			props: {
				inputId,
				buttonId,
				width: 'w-20'
			}
		});
	});

	it('should have match snapshot', () => {
		expect(renderResult.container).toMatchSnapshot();
	});

	it('Search button should not be disable when searched product name length is greater than two', async () => {
		const searchButton = screen.getByTestId(buttonId) as HTMLButtonElement;
		const searchInput = screen.getByTestId(inputId) as HTMLButtonElement;

		await fireEvent.input(searchInput, { target: { value: 'riz' } });

		expect(searchButton.disabled).toBe(false);
	});

	it('Search button should be disable when searched product name length is inferior to two', async () => {
		const searchButton = screen.getByTestId(buttonId) as HTMLButtonElement;
		const searchInput = screen.getByTestId(inputId) as HTMLButtonElement;

		await fireEvent.input(searchInput, { target: { value: 'r' } });

		expect(searchButton.disabled).toBe(true);
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});
});
