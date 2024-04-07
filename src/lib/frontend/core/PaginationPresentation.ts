export type PaginationPresentation<T> = {
    previousPage: number | null
    currentPage: number
    nextPage: number | null
    items: T[]
    totalPages: number
}
