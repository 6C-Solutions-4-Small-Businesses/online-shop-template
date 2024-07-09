<script lang="ts">
    export let percentage: number

    function getDiscountClass():  string {
        if (percentage <= 10) {
            return 'discount-bg-low';
        } else if (percentage <= 50) {
            return 'discount-bg-mid';
        } else {
            return 'discount-bg-high';
        }
    }
</script>

<div class={`absolute left-0 flex w-12 h-12 top-0 items-center justify-center discount-container ${getDiscountClass()} ${percentage ? 'visible z-10' : 'invisible'}`}>
    <div class="text-white text-xs font-bold">
        -{percentage}%
    </div>
</div>

<style lang="css">
    .discount-bg-low {
        background-color: #a67b5b;
        border-radius: 10px 0 20px 0;
    }

    .discount-bg-mid {
        background-color: #fd7e14;
        border-radius: 10px 0 20px 0;
    }

    .discount-bg-high {
        background-color: #ff0000;
        border-radius: 10px 0 20px 0;
    }
</style>