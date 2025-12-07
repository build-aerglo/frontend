<template>
  <div class="flex items-start gap-2 w-full">
    <i class="pi pi-map-marker text-gray-600 mt-1"></i>

    <template v-if="!isEditing">
    <span class="text-gray-700">
          {{ modelValue || 'Add location' }} 
    </span>
    </template>

    <template v-else>
    <div class="flex flex-col gap-2 w-full">
      <input
      :value="localLocation.street"
      @input="updateLocalField('street', $event)"
      type="text"
      placeholder="Street number & name (e.g., 15 Admiralty Way)"
      class="border border-gray-400 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
      />
or 
      <div class="flex gap-2 w-full">
      <input
        :value="localLocation.city"
        @input="updateLocalField('city', $event)"
        type="text"
        placeholder="City/Town (e.g., Lekki)"
        class="border border-gray-400 rounded-md px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
      />

      <Dropdown
        :model-value="localLocation.state"
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
import { ref, watch, computed } from 'vue'

// 🚨 Interface for internal use only
interface LocationData {
  street: string
  city: string
  state: string
}

interface Props {
  // 🚨 modelValue is now a string (the full address)
  modelValue: string 
  isEditing: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  // 🚨 Emitting a string back to the parent
  (e: 'update:modelValue', value: string): void
}>()

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'Federal Capital Territory'
]

// 🚨 Local state for the three fields (used ONLY when isEditing is true)
const localLocation = ref<LocationData>({
  street: '',
  city: '',
  state: ''
})

// Function to combine the three fields into the single address string
const formatAddress = (location: LocationData): string => {
  const parts = [location.street, location.city, location.state].filter(p => p && p.trim() !== '');
  return parts.join(', ');
}

// 🚨 Watch the parent's editing state to initialize/emit data
const parseAddress = (fullAddress: string) => {
    // This is a simplified split that assumes the format "street, city, state"
    const parts = fullAddress.split(',').map(p => p.trim());
    localLocation.value = {
        street: parts[0] || '',
        city: parts[1] || '',
        state: parts[2] || ''
    };
    // We try to handle cases where the entire address is just one part (e.g., "Lagos")
    if (parts.length === 1 && nigerianStates.includes(parts[0] ?? '')) {
         localLocation.value = {
             street: '',
             city: '',
             state: parts[0] ?? ''
         };
    }
};

// 🚨 Initial load and whenever modelValue changes (e.g., after a successful save)
watch(() => props.modelValue, (newAddress) => {
    // Only parse the string into fields if the component is being viewed or edited
    // The parent's modelValue should always be represented in the local state
    parseAddress(newAddress);
}, { immediate: true });

// 🚨 REMOVE the old watch on `isEditing`, as it was causing synchronization issues.


const updateAndEmit = () => {
    const finalAddress = formatAddress(localLocation.value);
    emit('update:modelValue', finalAddress);
}

// 🚨 MODIFIED: Updates local state and emits the new full address
const updateLocalField = (field: keyof LocationData, event: Event) => {
 const target = event.target as HTMLInputElement
 localLocation.value[field] = target.value;
  updateAndEmit(); // 🚨 Emit the change immediately
}

// 🚨 MODIFIED: Updates local state and emits the new full address
const updateState = (value: string) => {
 localLocation.value.state = value;
  updateAndEmit(); // 🚨 Emit the change immediately
}
</script>