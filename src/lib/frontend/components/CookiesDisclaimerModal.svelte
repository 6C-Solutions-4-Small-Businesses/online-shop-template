<script lang="ts">
    import {wereCookiesAccepted} from '$lib/frontend/stores/localStorageStore/AcceptCookiesStore'
    import {showCookiesDisclaimer} from "$lib/frontend/stores/localStorageStore/ShowCookiesDisclaimerStore"
    import {t} from '$translations/index'

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
        <p class="font-light text-xl">{$t('lib/frontend/components/cookies-disclaimer.title')}</p>

        <br>

        <p class="font-thin">
            {$t('lib/frontend/components/cookies-disclaimer.body')}
        </p>

        <br>

        <p class="font-thin">
            {$t('lib/frontend/components/cookies-disclaimer.note')} <a href="./privacy-policies">{$t('lib/frontend/components/cookies-disclaimer.link')}.</a>
        </p>

        <div class="flex justify-center mt-4">
            <button data-testid="decline" class="btn variant-soft rounded-none mr-5"
                    on:click={() => updateCookies(false)}>
                {$t('lib/frontend/components/cookies-disclaimer.decline')}
            </button>

            <button data-testid="accept" class="btn variant-filled rounded-none" on:click={() => updateCookies(true)}>
                {$t('lib/frontend/components/cookies-disclaimer.accept')}
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
