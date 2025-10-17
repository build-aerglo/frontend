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

    <div v-else>
      
      <InputGroup v-if="icon" class="mb-5">
        <InputGroupAddon>
          <i :class="icon"></i>
        </InputGroupAddon>
        
        <InputText 
          :class="inputClass" 
          :id="formId" 
          :type="props.type ?? 'text'" 
          v-model="model" 
          :required="required"
          :disabled="disabled"
          :placeholder="placeholder"
          
          class="w-full focus:border-accent p-3"
        />
      </InputGroup>

      <InputText 
        v-else
        :class="inputClass" 
        :id="formId" 
        :type="props.type ?? 'text'" 
        v-model="model" 
        :required="required"
        :disabled="disabled"
        :placeholder="placeholder"
        
        class="w-full focus:border-accent"
      />
    </div>
    
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  placeholder: String,
  rows: Number, 
  class: String,
  label: String,
  inputClass: String, 
  type: String, 
  required: Boolean,
  disabled: Boolean,
  icon: String, 
});

const formId = `input-${genRand(10)}`;
const model = defineModel<string>();
</script>