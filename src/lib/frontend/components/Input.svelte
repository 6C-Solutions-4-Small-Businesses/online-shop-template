<script lang="ts">
    export let id: string
    export let label: string
    export let type: string = 'text'
    export let placeholder: string
    export let value: string
    export let error: boolean = false
    export let disabled: boolean = false
    export let required: boolean = false
    export let onChange: (event: Event) => void = () => {
    }
</script>

<div class="w-full">
    <h4 class="mb-1 text-black" data-testid="input-label-id">{label}
        {#if required}
            <span class="text-red-500">*</span>
        {/if}
    </h4>
    <input
            class={`w-full p-3.5 rounded-md ${error ? 'border-2 border-red-500' : 'border-gray-500'} ${disabled ? 'bg-gray-100' : 'bg-white'} focus:outline-none focus:border-blue-500`}
            data-testid={id}
            disabled={disabled}
            id={id}
            on:input={onChange}
            placeholder={placeholder}
            type={type}
            value={value === undefined ? '' : value}
    />
</div>