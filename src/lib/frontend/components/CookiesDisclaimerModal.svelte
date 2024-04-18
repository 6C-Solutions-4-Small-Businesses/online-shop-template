<script lang="ts">
    import {wereCookiesAccepted} from '$lib/frontend/stores/localStorageStore/AcceptCookiesStore'
    import {showCookiesDisclaimer} from "$lib/frontend/stores/localStorageStore/ShowCookiesDisclaimerStore";

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
            <p class="font-light text-xl">Your privacy, your choice!</p>

            <br>

            <p class="font-thin">
                We use cookies to enhance your experience on our website. Your experience may be hindered if you decline
                our
                use
                of cookies.
            </p>

            <br>

            <p class="font-thin">
                By clicking accept you consent to our <a href="./">privacy policies.</a>
            </p>

            <div class="flex justify-center mt-4">
                <button data-testid="decline" class="btn variant-soft rounded-none mr-5" on:click={() => updateCookies(false)}>
                    Decline
                </button>

                <button data-testid="accept" class="btn variant-filled rounded-none" on:click={() => updateCookies(true)}>
                    Accept
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
