import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'

export type FoundUserPresentation = {
    account?: UserAccountSummaryPresentation | undefined
    email: string,
}
