<script lang="ts">
    import type {SvelteComponent} from 'svelte'
    import CloseIcon from '$lib/frontend/components/icons/CloseIcon.svelte'
    import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'
    import {writable, type Writable} from 'svelte/store'
    import {goto} from '$app/navigation'

    export let parent: SvelteComponent
    export let categories: CategorySummaryPresentation []

    const indexedCategories: Writable<Record<string, {
        id: string,
        name: string
    }[]>> = writable(indexCategories(categories))

    function indexCategories(categories: CategorySummaryPresentation[]): Record<string, {
        id: string,
        name: string
    }[]> {
        const categorized: Record<string, {
            id: string,
            name: string
        }[]> = {}

        categories.forEach(category => {
            const firstLetter = category.name[0].toUpperCase()
            if (!categorized[firstLetter]) {
                categorized[firstLetter] = []
            }
            categorized[firstLetter].push({
                id: category.id,
                name: category.name
            })
        })

        for (const key in categorized) {
            categorized[key].sort()
        }

        const sortedKeys = Object.keys(categorized).sort()
        return sortedKeys.reduce((acc: Record<string, {
            id: string,
            name: string
        }[]>, key: string) => {
            acc[key] = categorized[key]
            return acc
        }, {})
    }

    async function goToProductsPage(categoryId: string, categoryName: string): Promise<void> {
        parent.onClose()
        await goto(`/category/${categoryId}`, {
            state: {
                name: categoryName
            },
        })
    }
</script>

<div class="flex flex-col gap-2.5 w-11/12 sm:w-11/12 lg:w-10/12 py-6 px-7 bg-white rounded-4xl">
    <header class="flex items-center justify-end">
        <button data-testid="category-list-modal-close-button" on:click={parent.onClose}>
            <CloseIcon/>
        </button>
    </header>
    <div class="px-6 gap-2.5">
        <div class="flex justify-start">
            <span class="text-primary uppercase text-2xl">Categories</span>
        </div>
        <div class="h-[654px] py-9 px-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 overflow-y-scroll">
            {#each Object.keys($indexedCategories) as startingLetter}
                <div class="min-h-[229px]">
                    <span class="text-black font-bold text-[50px] leading-12">{startingLetter}</span>
                    <ul role="list"
                        class="list-disc marker:text-primary text-black font-medium text-2xl list-outside ml-4">
                        {#each $indexedCategories[startingLetter] as category}
                            <li class="h-10">
                                <button class="h-full text-left flex items-center"
                                        on:click={() => goToProductsPage(category.id, category.name)}>
                                    <span class="line-clamp-1">{category.name}</span>
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </div>
</div>