<template>
  <div class="flex items-start gap-2 w-full">
    <i class="pi pi-map-marker text-gray-600 mt-1"></i>
    
    <template v-if="!isEditing">
      <span class="text-gray-700">
        {{ displayAddress }}
      </span>
    </template>
    
    <template v-else>
      <div class="flex flex-col gap-2 w-full">
        <!-- Street Address -->
        <input
          :value="modelValue.street"
          @input="updateField('street', $event)"
          type="text"
          placeholder="Street number & name (e.g., 15 Admiralty Way)"
          class="border border-gray-400 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
        />
        
        <!-- City/Town and State in one row -->
        <div class="flex gap-2 w-full">
          <input
            :value="modelValue.city"
            @input="updateField('city', $event)"
            type="text"
            placeholder="City/Town (e.g., Lekki)"
            class="border border-gray-400 rounded-md px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
          />
          
          <Dropdown
            :model-value="modelValue.state"
            @update:model-value="updateState"
            :options="nigerianStates"
            placeholder="Select State"
            class="flex-1"
            :pt="{
              root: { class: 'text-sm' },
              input: { class: 'text-sm py-2' }
            }"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Dropdown from 'primevue/dropdown'

interface LocationData {
  street: string
  city: string
  state: string
}

interface Props {
  modelValue: LocationData
  isEditing: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: LocationData): void
}>()

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'Federal Capital Territory'
]

const displayAddress = computed(() => {
  const parts = []
  if (props.modelValue.street) parts.push(props.modelValue.street)
  if (props.modelValue.city) parts.push(props.modelValue.city)
  if (props.modelValue.state) parts.push(props.modelValue.state)
  
  return parts.length > 0 ? parts.join(', ') : 'Add location'
})

const updateField = (field: keyof LocationData, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: target.value
  })
}

const updateState = (value: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    state: value
  })
}
</script>