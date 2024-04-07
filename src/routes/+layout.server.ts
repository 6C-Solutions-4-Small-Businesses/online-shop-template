import {loadTranslations} from '$lib/frontend/translations'
import type {LayoutServerLoad} from './$types'
import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'

export const prerender = false

export type LayoutPageData = { categories: CategorySummaryPresentation[]; version?: string }

export const load: LayoutServerLoad = async (event): Promise<LayoutPageData> => {
    const initialLocale = 'en'

    await loadTranslations(initialLocale)

    const packageInfo = await import('../package.json')
    const version = packageInfo.version

    let response: Response
    try {
        response = await event.fetch('/api/v1/category/all', {method: 'GET'})
    } catch (e) {
        return {version, categories: []}
    }

    if (!response.ok) {
        return {version, categories: []}
    }

    const categoriesAndCollections = await response.json()

    return {
        version: packageInfo.version,
        categories: categoriesAndCollections,
    }
}
