<script lang="ts">
    export let percentage: number

    function getDiscountClass(): string {
        if (percentage <= 10) {
            return 'bg-promotion-low';
        } else if (percentage <= 50) {
            return 'bg-promotion-medium';
        } else {
            return 'bg-promotion-high';
        }
    }
</script>

<div class={`absolute left-0 flex w-12 h-12 top-0 items-center justify-center rounded-tl-[10px] rounded-tr-none rounded-br-[20px] rounded-bl-none ${getDiscountClass()} ${percentage ? 'visible z-10' : 'invisible'}`}>
    <div class="text-white text-xs font-bold">
        -{percentage}%
    </div>
</div>