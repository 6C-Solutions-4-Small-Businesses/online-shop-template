<script lang="ts">
    import {wereCookiesAccepted} from '$lib/frontend/stores/localStorageStore/AcceptCookiesStore'
    import {showCookiesDisclaimer} from "$lib/frontend/stores/localStorageStore/ShowCookiesDisclaimerStore"
    import {t, locale} from '$translations'

    wereCookiesAccepted.subscribe(value => {
        if (!value) {
            showCookiesDisclaimer.set(true)
        }
    })

    const updateCookies = (accepted: boolean) => {
        wereCookiesAccepted.set(accepted)
        showCookiesDisclaimer.set(false)
    }

</script>

<div class="fixed bottom-0 p-1 right-0 bg-green-50 shadow-md cookies-container block}">
    <div class="border p-4 border-gray-600">
        <p class="font-light text-xl">{$t('cookies-disclaimer.title')}</p>

        <br>

        <p class="font-thin">
            {$t('cookies-disclaimer.body')}
        </p>

        <br>

        <p class="font-thin">
            {$t('cookies-disclaimer.note')} <a href="{'./privacy-policies/' + $locale}">{$t('cookies-disclaimer.link')}.</a>
        </p>

        <div class="flex justify-center mt-4">
            <button data-testid="decline" class="btn variant-soft rounded-none mr-5"
                    on:click={() => updateCookies(false)}>
                {$t('cookies-disclaimer.decline')}
            </button>

            <button data-testid="accept" class="btn variant-filled rounded-none" on:click={() => updateCookies(true)}>
                {$t('cookies-disclaimer.accept')}
            </button>
        </div>
    </div>
</div>

<style lang="css">
    .cookies-container {
        min-height: 296px;
        max-width: 400px;
    }
</style>
