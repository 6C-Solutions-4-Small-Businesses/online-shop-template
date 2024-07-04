<script lang="ts">
    import {t} from '$translations/index'
</script>

<div class="bg-white flex flex-col items-center">
    <div class="flex flex-col gap-4 mx-10 pb-10">
        <div class="flex flex-col gap-2">
            <h1 class="text-xl md:text-2xl font-bold my-10">{$t('terms-and-conditions.title')}</h1>
        </div>

        <div class="flex flex-col gap-2 md:gap-3">
            <span class="text-xl md:text-2xl font-bold">{$t('terms-and-conditions.conditions-of-use')}</span>
            <p class="text-slate-500 text-justify text-lg md:text-xl">
                {$t('terms-and-conditions.paragraph-1')}
            </p>
        </div>

        <div class="flex flex-col gap-2 md:gap-3">
            <span class="text-xl md:text-2xl font-bold">{$t('terms-and-conditions.acceptance-of-conditions')}</span>
            <p class="text-slate-500 text-justify text-lg md:text-xl">
                {$t('terms-and-conditions.paragraph-2')}
            </p>
        </div>

        <div class="flex flex-col gap-2 md:gap-3">
            <span class="text-xl md:text-2xl font-bold">{$t('terms-and-conditions.use-of-application')}</span>
            <p class="text-slate-500 text-justify text-lg md:text-xl">
                {$t('terms-and-conditions.paragraph-3')}
            </p>
        </div>

        <div class="flex flex-col gap-2 md:gap-3">
            <span class="text-xl md:text-2xl font-bold">{$t('terms-and-conditions.intellectual-property')}</span>
            <p class="text-slate-500 text-justify text-lg md:text-xl">
                {$t('terms-and-conditions.paragraph-4')}
            </p>
        </div>

        <div class="flex flex-col gap-2 md:gap-3">
            <span class="text-xl md:text-2xl font-bold">{$t('terms-and-conditions.limitation-of-liability')}</span>
            <p class="text-slate-500 text-justify text-lg md:text-xl">
                {$t('terms-and-conditions.paragraph-5')}
            </p>
        </div>

        <div class="flex flex-col gap-2 md:gap-3">
            <span class="text-xl md:text-2xl font-bold">{$t('terms-and-conditions.modifications-of-conditions')}</span>
            <p class="text-slate-500 text-justify text-lg md:text-xl">
                {$t('terms-and-conditions.paragraph-6')}
            </p>
        </div>
    </div>
</div>
