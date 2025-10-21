<template>
    <div>
        <label v-if="label" :class="class" class="block text-sm font-medium text-gray-700">{{ label
            }}</label>
        <div v-if="value" :class="inputClass" class="w-full mt-1 mb-3 py-2 outline-none rounded-[5px]">
            {{ value }}
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps(['class', 'inputClass', 'label', 'value']);
</script>
