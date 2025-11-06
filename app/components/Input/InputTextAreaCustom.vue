<template>
    <div>
        <label v-if="label" :for="id || formId" :class="class" class="block text-sm font-medium text-contrast">{{ label
            }}</label>
        <textarea :class="inputClass" :rows="rows ? rows : 4" :id="id || formId" v-model="model" :maxlength="maxlength" :required="required"
            :placeholder="placeholder"
            class=" w-full mt-1 mb-3 p-2 border border-gray-300 outline-none rounded-[5px] focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300 bg-secondaryLinen">
            </textarea>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps(['placeholder', 'id', 'rows', 'class', 'inputClass', 'label', 'required', 'disabled', 'maxlength']);
const formId = `input-${genRand(10)}`;
const model = defineModel<string>();
</script>
