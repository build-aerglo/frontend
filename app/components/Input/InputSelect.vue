<template>
    <div>
        <label v-if="label" :for="formId" :class="class" class="block text-sm font-medium text-contrast">{{ label
            }}</label>
        <select v-model="model" :required="required" :class="inputClass" :id="formId"
            class="w-full mt-1 mb-3 p-2 border border-gray-300 outline-none rounded-[5px] focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300 bg-secondaryLinen">
            <slot />
        </select>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps(['class', 'inputClass', 'label', 'required', 'disabled']);
const formId = `input-${genRand(10)}`;
const model = defineModel<string>();
</script>
