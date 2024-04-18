import {type Writable} from "svelte/store";
import {mock} from "vitest-mock-extended";

export const localStorageStubs = {
    cookiesAccepted: mock<Writable<boolean|undefined>>(),
    showCookiesDisclaimer: mock<Writable<boolean|undefined>>(),
}

