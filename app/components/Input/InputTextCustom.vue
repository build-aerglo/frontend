<template>
    <div :class="props.class">
        
        <label 
            v-if="label && props.type !== 'float'" 
            :for="formId" 
            class="block text-[110%] font-medium mb-1"
        >
            <!-- {{ label }} -->
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
            class="w-full !focus:border-accent"
        />

        <div v-else-if="props.type === 'password-toggle'" class="relative">
            <InputGroup>
                
                <InputGroupAddon v-if="icon">
                    <i :class="icon"></i>
                </InputGroupAddon>
                
                <FloatLabel>
                    
                    <Password 
                        :class="[inputClass, inputBgClass, inputFocusClass]" 
                        :id="formId" 
                        v-model="model" 
                        :required="required"
                        :disabled="disabled"
                        :placeholder="placeholder"
                        :toggleMask="true" 
                        :feedback="false"
                        
                        class="w-full"
                        :inputClass="['w-full', inputBgClass, inputFocusClass].join(' ')" 
                    />
                    
                    <label :for="formId">{{ label }}</label>
                </FloatLabel>
            </InputGroup>
        </div>

        <div v-else class="relative"> 
            <InputGroup>
                
                <InputGroupAddon v-if="icon">
                    <i :class="icon"></i>
                </InputGroupAddon>
                
                <FloatLabel>
                    
                    <InputText 
                        :class="[inputClass, inputBgClass, inputFocusClass]" 
                        :id="formId" 
                        :type="props.type ?? 'text'" 
                        v-model="model" 
                        :required="required"
                        :disabled="disabled"
                        :placeholder="placeholder"
                        class="w-full"
                    />
                    
                    <label :for="formId">{{ label }}</label>
                </FloatLabel>
            </InputGroup>
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
    
    inputBgClass: {
        type: String,
        default: '!bg-secondaryLinen' // Applying the secondary color as background
    },
    inputFocusClass: {
        type: String,
        default: '!focus:border-accent' // Applying the accent color on focus
    }
});

const formId = `input-${genRand(10)}`;
const model = defineModel<string>();
</script>