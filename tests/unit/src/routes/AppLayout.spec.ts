import {render} from '@testing-library/svelte'
import {describe, expect} from 'vitest'
import '@testing-library/jest-dom'
import AppLayout from '$routes/+layout.svelte'

describe('App Layout', () => {
    it('should have match snapshot', () => {
        const {container} = render(AppLayout, {
            // @ts-ignore
            data: {
                categories: [
                    {
                        id: 'category-id-1',
                        name: 'Accessoire',
                    },
                    {
                        id: 'category-id-2',
                        name: 'Biscuit',
                    },
                    {
                        id: 'category-id-3',
                        name: 'Boisson Gazeuse',
                    },
                    {
                        id: 'category-id-4',
                        name: 'Collation',
                    },
                    {
                        id: 'category-id-5',
                        name: 'Confiture et Tartinade',
                    }
                ]
            }
        })

        expect(container).toMatchSnapshot()
    })
})

vi.mock('$app/stores', async () => {
    return await import('$mocks/src/lib/frontend/stores/PageStore')
})
