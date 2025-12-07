<template>
  <div class="flex flex-col md:flex-row md:items-center gap-1">
    <div class="flex items-center gap-1">
      <span class="font-semibold text-gray-700">Opening days:</span>
      <template v-if="!isEditing">
        <span class="text-gray-900">{{ dayLabel }}</span>
      </template>
      <template v-else>
        <Dropdown 
          v-model="localDayKey" 
          :options="dayOptions" 
          optionLabel="label" 
          optionValue="key"
          placeholder="Select Days"
          class="w-32"
        />
      </template>
    </div>

    <!-- Divider only on md+ -->
    <span class="hidden md:inline-block text-gray-400 select-none">||</span>

    <div class="flex items-center gap-2">
      <span class="font-semibold text-gray-700">Opening time:</span>
      <template v-if="!isEditing">
        <span class="text-gray-900">{{ formattedTime }}</span>
      </template>
      <template v-else>
        <!-- START TIME -->
        <div class="flex items-center bg-white border border-gray-300 rounded-lg px-1 py-2 shadow-sm hover:border-blue-400 transition-colors">
          <!-- Hour controls -->
          <button 
            @click="changeTime('start', 'hour', -1)" 
            aria-label="Decrease start hour" 
            class="text-white bg-green-500 hover:bg-green-400 text-xs rounded transition-colors"
          >
            <i class="pi pi-chevron-left text-xs"></i>
          </button>
          <span class="min-w-[20px] text-center font-medium text-gray-900">{{ getHour(localStartTime) }}</span>
          <button 
            @click="changeTime('start', 'hour', 1)" 
            aria-label="Increase start hour" 
            class="text-white  bg-green-500 text-xs hover:bg-green-400 rounded transition-colors"
          >
            <i class="pi pi-chevron-right text-xs"></i>
          </button>

          <span class="text-gray-800 font-small">:</span>

          <!-- Minute controls -->
          <button 
            @click="changeTime('start', 'minute', -15)" 
            aria-label="Decrease start minutes" 
            class="text-white bg-green-500 text-xs hover:bg-green-400 rounded transition-colors"
          >
            <i class="pi pi-chevron-left text-xs"></i>
          </button>
          <span class="min-w-[20px] text-center font-medium text-gray-900">{{ getMinute(localStartTime) }}</span>
          <button 
            @click="changeTime('start', 'minute', 15)" 
            aria-label="Increase start minutes" 
            class="text-white text-xs bg-green-500 hover:bg-green-400 rounded transition-colors"
          >
            <i class="pi pi-chevron-right text-xs"></i>
          </button>
        </div>

        <span class="text-gray-400 font-medium">—</span>

        <!-- END TIME -->
        <div class="flex items-center bg-white border border-gray-300 rounded-lg px-1 py-2 shadow-sm hover:border-blue-400 transition-colors">
          <!-- Hour controls -->
          <button 
            @click="changeTime('end', 'hour', -1)" 
            aria-label="Decrease end hour" 
            class="text-white bg-green-500 text-xs hover:bg-green-400 rounded transition-colors"
          >
            <i class="pi pi-chevron-left text-xs"></i>
          </button>
          <span class="min-w-[20px] text-center font-medium text-gray-900">{{ getHour(localEndTime) }}</span>
          <button 
            @click="changeTime('end', 'hour', 1)" 
            aria-label="Increase end hour" 
            class="text-white bg-green-500 text-xs hover:bg-green-400 rounded transition-colors"
          >
            <i class="pi pi-chevron-right text-xs"></i>
          </button>

          <span class="text-gray-800 font-medium">:</span>

          <!-- Minute controls -->
          <button 
            @click="changeTime('end', 'minute', -15)" 
            aria-label="Decrease end minutes" 
            class="text-white bg-green-500 text-xs hover:bg-green-400 rounded transition-colors"
          >
            <i class="pi pi-chevron-left text-xs"></i>
          </button>
          <span class="min-w-[20px] text-center font-medium text-gray-900">{{ getMinute(localEndTime) }}</span>
          <button 
            @click="changeTime('end', 'minute', 15)" 
            aria-label="Increase end minutes" 
            class="text-white bg-green-500 text-xs hover:bg-green-400 rounded transition-colors"
          >
            <i class="pi pi-chevron-right text-xs"></i>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const dayOptions = [
  { key: 'mon-sat', label: 'Mon - Sun' },
  { key: 'weekdays', label: 'All Week days' },
  { key: 'weekends', label: 'Weekends only' },
]

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    // 🚨 UPDATED: Now expecting the API's format
    // Expected shape: { additionalProp1: string, additionalProp2: string, additionalProp3: string }
  },
  isEditing: Boolean,
})

const emit = defineEmits(['update:modelValue'])

// Local copies for editing
// 🚨 UPDATED: Initialize local state from the API's cryptic keys
const localDayKey = ref(props.modelValue.additionalProp1 || '')
const localStartTime = ref(props.modelValue.additionalProp2 || '09:00') // Default time for a better UX
const localEndTime = ref(props.modelValue.additionalProp3 || '17:00') // Default time for a better UX

// Watch for external changes to sync local state
watch(
  () => props.modelValue,
  (newVal) => {
    // 🚨 UPDATED: Map API keys to local keys
    localDayKey.value = newVal.additionalProp1 || ''
    localStartTime.value = newVal.additionalProp2 || '09:00'
    localEndTime.value = newVal.additionalProp3 || '17:00'
  },
  { immediate: true }
)
// Emit changes when local state changes
watch([localDayKey, localStartTime, localEndTime], () => {
  emit('update:modelValue', {
    // 🚨 UPDATED: Map local keys back to API keys
    additionalProp1: localDayKey.value,
    additionalProp2: localStartTime.value,
    additionalProp3: localEndTime.value,
  })
})

function parseTimeString(time: string): Date | null {
  if (!time) return null
  const parts = time.split(':')
  if (parts.length !== 2) return null

  const hh = Number(parts[0])
  const mm = Number(parts[1])

  if (isNaN(hh) || isNaN(mm)) return null

  const d = new Date()
  d.setHours(hh, mm, 0, 0)
  return d
}

function formatDateToHHMM(date: Date) {
  const hh = date.getHours().toString().padStart(2, '0')
  const mm = date.getMinutes().toString().padStart(2, '0')
  return `${hh}:${mm}`
}

function changeTime(which: 'start' | 'end', unit: 'hour' | 'minute', delta: number) {
  const currentStr = which === 'start' ? localStartTime.value : localEndTime.value
  let date = parseTimeString(currentStr)
  if (!date) {
    date = new Date()
    date.setHours(0, 0, 0, 0)
  }

  if (unit === 'hour') {
    date.setHours(date.getHours() + delta)
  } else {
    date.setMinutes(date.getMinutes() + delta)
  }

  // Clamp values between 00:00 and 23:59
  if (date.getHours() < 0) date.setHours(0, 0)
  if (date.getHours() > 23) date.setHours(23, 59)

  const newTime = formatDateToHHMM(date)

  if (which === 'start') {
    localStartTime.value = newTime
  } else {
    localEndTime.value = newTime
  }
}

// Helpers to get hour and minute from "HH:mm" string
const getHour = (timeStr: string) => {
  if (!timeStr) return '00'
  return timeStr.split(':')[0]?.padStart(2, '0')
}

const getMinute = (timeStr: string) => {
  if (!timeStr) return '00'
  return timeStr.split(':')[1]?.padStart(2, '0')
}

// Compute label for days
const dayLabel = computed(() => {
  const option = dayOptions.find(o => o.key === localDayKey.value)
  return option ? option.label : 'Unknown'
})

// Format times like "7:00am"
const formatTime = (t: string) => {
  if (!t) return ''
  const [hhStr, mmStr] = t.split(':')
  let hh = Number(hhStr)
  const mm = Number(mmStr)
  if (isNaN(hh) || isNaN(mm)) return ''

  const ampm = hh >= 12 ? 'pm' : 'am'
  hh = hh % 12
  if (hh === 0) hh = 12
  return `${hh}:${mm.toString().padStart(2, '0')}${ampm}`
}

const formattedTime = computed(() => {
  if (!localStartTime.value || !localEndTime.value) return ''
  return `${formatTime(localStartTime.value)} - ${formatTime(localEndTime.value)}`
})
</script>
