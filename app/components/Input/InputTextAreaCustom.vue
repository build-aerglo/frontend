<template>
    <label v-if="label" :for="formId" :class="class" class="block text-sm font-medium text-gray-700">{{ label
        }}</label>
    <textarea :class="inputClass" :rows="rows ? rows : 5" :id="formId" v-model="model" :required="required"
        :placeholder="placeholder"
        class="resize-none w-full mt-1 mb-3 p-2 border border-gray-300 outline-none rounded-[5px] focus:ring-indigo-500 focus:border-indigo-500">
        </textarea>
</template>

<script lang="ts" setup>
const props = defineProps(['placeholder', 'rows', 'class', 'inputClass', 'label', 'required', 'disabled']);
const formId = `input-${genRand(10)}`;
const model = defineModel<string>();
</script>
