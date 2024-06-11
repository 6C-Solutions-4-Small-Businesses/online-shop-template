<script lang="ts">
    export let id: string
    export let classNames: string = 'w-full'
    export let label = ''
    export let type = 'text'
    export let placeholder = ''
    export let value: string
    export let error = false
    export let disabled = false
    export let required = false
    export let hidden = false
    export let accept = '*'
    export let capture: boolean | 'user' | 'environment' | null | undefined = undefined
    export let step: string | undefined = undefined
    export let onChange: (event: Event) => void = () => {
    }
    export let onBlur: (event: Event) => void = () => {
    }

</script>

<div class="{classNames}" data-testid="input-container">
    <h4 class="mb-1 text-black" data-testid="input-label-id">{label}
        {#if required}
            <span class="text-red-500">*</span>
        {/if}
    </h4>
    <input
            class={`w-full h-fit ${hidden? 'hidden' : ''} p-3.5 rounded-md ${error ? 'border-2 border-red-500' : 'border-gray-500'} ${disabled ? 'bg-gray-100' : 'bg-white'} focus:outline-none focus:border-blue-500`}
            data-testid={id}
            disabled={disabled}
            id={id}
            on:input={onChange}
            placeholder={placeholder}
            accept="{accept}"
            type={type}
            value={value === undefined ? '' : value}
            capture="{capture}"
            on:blur={onBlur}
            step="{step}"
    />
</div>
