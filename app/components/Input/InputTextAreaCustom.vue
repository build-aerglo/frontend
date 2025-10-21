<template>
    <div>
        <label v-if="label" :for="id || formId" :class="class" class="block text-sm font-medium text-gray-700">{{ label
            }}</label>
        <textarea :class="inputClass" :rows="rows ? rows : 4" :id="id || formId" v-model="model" :required="required"
            :placeholder="placeholder"
            class=" w-full mt-1 mb-3 p-2 border border-gray-300 outline-none rounded-[5px] focus:ring-primary focus:border-primary">
            </textarea>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps(['placeholder', 'id', 'rows', 'class', 'inputClass', 'label', 'required', 'disabled']);
const formId = `input-${genRand(10)}`;
const model = defineModel<string>();
</script>
