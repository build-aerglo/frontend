<template>
    <button :type="type"
        :class="inputClass, rounded ? 'rounded-full' : 'rounded-[5px]', size && size === 'lg' ? 'py-[10px] px-[15px]' : 'py-[6px] px-[7px]', isLoading ? 'cursor-not-allowed' : 'cursor-pointer', primary ? 'bg-primary text-white' : 'border-primary border text-primary bg-white'"
        class="flex items-center justify-center gap-[5px] text-[14px] w-full" @click="$emit('clicked')"
        :disabled="isLoading ? 'disabled' : disabled">
        <i v-if="icon" :class="`pi pi-${icon}`"></i>
        {{ label }}
    </button>
</template>

<script setup>
const props = defineProps(['type', 'primary', 'label', 'disabled', 'icon', 'isLoading', 'size', 'inputClass', 'rounded']);
const events = defineEmits(['clicked'])
</script>