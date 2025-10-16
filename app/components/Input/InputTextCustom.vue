<template>
    <div>
        <label 
            v-if="label" 
            :for="formId" 
            :class="props.class" 
            class="block text-[110%] font-medium mb-1"
        >
            {{ label }}
        </label>

        <Textarea 
            v-if="props.type === 'textarea'"
            :class="inputClass" 
            :rows="rows ? rows : 5" 
            :id="formId" 
            v-model="model" 
            :required="required"
            :disabled="disabled"
            :placeholder="placeholder"
            
            class="w-full focus:border-accent"
        />

        <InputText 
            v-else
            :class="inputClass" 
            :id="formId" 
            :type="props.type ?? 'text'" 
            v-model="model" 
            :required="required"
            :disabled="disabled"
            :placeholder="placeholder"
            
            class="w-full focus:border-accent mb-3 p-3"
        />
        
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    placeholder: String,
    rows: Number, 
    class: String,
    inputClass: String,
    label: String,
    type: String, 
    required: Boolean,
    disabled: Boolean,
});
const formId = `input-${genRand(10)}`;
const model = defineModel<string>();
</script>
