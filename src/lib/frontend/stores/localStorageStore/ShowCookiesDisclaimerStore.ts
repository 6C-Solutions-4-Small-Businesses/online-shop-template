import {type Writable} from "svelte/store";
import {localStorageStore} from "@skeletonlabs/skeleton";

export const showCookiesDisclaimer: Writable<boolean> = localStorageStore<boolean>('showCookiesDisclaimer', true, {
    storage: 'local',
})
