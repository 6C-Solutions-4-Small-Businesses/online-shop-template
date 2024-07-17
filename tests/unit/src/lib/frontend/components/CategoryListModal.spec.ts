import {describe, expect, vi} from "vitest";
import {fireEvent, render} from "@testing-library/svelte";
import CategoryListModal from "$lib/frontend/components/CategoryListModal.svelte";
import {mock, type MockProxy} from "vitest-mock-extended";
import type {SvelteComponent} from "svelte";

describe('Category list modal', () => {
    it('should have match snapshot', () => {
        const {container} = render(CategoryListModal, {
            categories: [
                {id: 'd223bf35-9418-445d-821f-63d260991d3e', name: 'Accessoire', type: "Common"},
                {id: '1482c135-b8e6-4b6a-b125-e8c2b5e9ca7c', name: 'Biscuit', type: "Common"},
                {id: 'baa0dfe4-8d22-4611-b268-62143e96e65f', name: 'Boisson Gaseuze', type: "Common"},
                {id: '84a4a6ff-b5d3-4f19-9368-b5e438d58207', name: 'Collation', type: "Common"},
                {id: '9ff12202-4488-4854-a320-8e4899f96a69', name: 'Condiment', type: "Common"},
            ],
            parent: mock<SvelteComponent>()
        })

        expect(container).toMatchSnapshot()
    })

    it('should have called parent.onClose when the close button is clicked', async () => {
        const parentMock: MockProxy<SvelteComponent> = mock<SvelteComponent>({
            onClose: vi.fn()
        })
        const {getByTestId} = render(CategoryListModal, {
            categories: [
                {id: 'd223bf35-9418-445d-821f-63d260991d3e', name: 'Accessoire', type: "Common"},
                {id: '1482c135-b8e6-4b6a-b125-e8c2b5e9ca7c', name: 'Biscuit', type: "Common"},
                {id: 'baa0dfe4-8d22-4611-b268-62143e96e65f', name: 'Boisson Gaseuze', type: "Common"},
                {id: '84a4a6ff-b5d3-4f19-9368-b5e438d58207', name: 'Collation', type: "Common"},
                {id: '9ff12202-4488-4854-a320-8e4899f96a69', name: 'Condiment', type: "Common"},
            ],
            parent: parentMock
        })
        const closeButton = getByTestId('category-list-modal-close-button');

        await fireEvent.click(closeButton);

        expect(parentMock.onClose).toHaveBeenCalled();
    });

    it('should have called parent.onClose when navigating to products page', async () => {
        const parentMock: MockProxy<SvelteComponent> = mock<SvelteComponent>({
            onClose: vi.fn()
        })
        const {getByText} = render(CategoryListModal, {
            categories: [
                {id: 'd223bf35-9418-445d-821f-63d260991d3e', name: 'Accessoire', type: "Common"},
                {id: '1482c135-b8e6-4b6a-b125-e8c2b5e9ca7c', name: 'Biscuit', type: "Common"},
                {id: 'baa0dfe4-8d22-4611-b268-62143e96e65f', name: 'Boisson Gaseuze', type: "Common"},
                {id: '84a4a6ff-b5d3-4f19-9368-b5e438d58207', name: 'Collation', type: "Common"},
                {id: '9ff12202-4488-4854-a320-8e4899f96a69', name: 'Condiment', type: "Common"},
            ],
            parent: parentMock
        })
        const closeButton = getByText('Boisson Gaseuze');

        await fireEvent.click(closeButton);

        expect(parentMock.onClose).toHaveBeenCalled();
    });
})

vi.mock('$app/navigation', () => ({
    goto: vi.fn(),
}));
