<template>
    <div>
        <label v-if="label" :for="formId" :class="class" class="block text-sm font-medium text-gray-700">{{ label
            }}</label>
        <input :class="inputClass" :id="formId" :type="props.type ?? 'text'" v-model="model" :required="required"
            :placeholder="placeholder"
            class="w-full mt-1 mb-3 p-2 border border-gray-300 outline-none rounded-[5px] focus:ring-primary focus:border-primary" />
    </div>
</template>

<script lang="ts" setup>
const props = defineProps(['placeholder', 'class', 'inputClass', 'label', 'type', 'required', 'disabled']);
const formId = `input-${genRand(10)}`;
const model = defineModel<string>();
</script>
