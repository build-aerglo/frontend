<template>
  <div
    class="relative inline-block w-full"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <!-- Badge Item -->
    <div
      :class="[
        color,
        'rounded-lg p-3 flex items-center gap-3 transition-all duration-200 cursor-pointer',
        'hover:shadow-lg hover:scale-105 hover:brightness-105'
      ]"
    >
      <span class="text-2xl">{{ icon }}</span>
      <div class="flex-1">
        <span class="font-medium text-gray-700 text-sm">{{ name }}</span>
      </div>
    </div>

    <!-- Simplified Tooltip -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div
        v-if="showTooltip && description"
        class="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-56"
      >
        <div
          :class="[
            'rounded-lg shadow-xl p-2 border',
            'bg-white',
            getBorderColor(color)
          ]"
        >
          <!-- Just the description - smaller and greyer -->
          <p class="text-xs text-gray-500 leading-relaxed">
            {{ description }}
          </p>
        </div>

        <!-- Arrow -->
        <div
          :class="[
            'absolute left-1/2 transform -translate-x-1/2 top-full',
            'w-0 h-0 border-l-6 border-r-6 border-t-6',
            'border-l-transparent border-r-transparent',
            getArrowColor(color)
          ]"
        ></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  name: string;
  icon: string;
  color: string;
  description?: string;
}

const props = defineProps<Props>();
const showTooltip = ref(false);

const getBorderColor = (bgColor: string): string => {
  const colorMap: Record<string, string> = {
    'bg-green-100': 'border-green-300',
    'bg-blue-100': 'border-blue-300',
    'bg-orange-100': 'border-orange-300',
    'bg-gray-100': 'border-gray-300',
    'bg-yellow-100': 'border-yellow-300',
    'bg-purple-100': 'border-purple-300',
    'bg-pink-100': 'border-pink-300',
    'bg-teal-100': 'border-teal-300',
    'bg-indigo-100': 'border-indigo-300',
  };
  return colorMap[bgColor] || 'border-gray-300';
};

const getArrowColor = (bgColor: string): string => {
  const colorMap: Record<string, string> = {
    'bg-green-100': 'border-t-green-300',
    'bg-blue-100': 'border-t-blue-300',
    'bg-orange-100': 'border-t-orange-300',
    'bg-gray-100': 'border-t-gray-300',
    'bg-yellow-100': 'border-t-yellow-300',
    'bg-purple-100': 'border-t-purple-300',
    'bg-pink-100': 'border-t-pink-300',
    'bg-teal-100': 'border-t-teal-300',
    'bg-indigo-100': 'border-t-indigo-300',
  };
  return colorMap[bgColor] || 'border-t-gray-300';
};
</script>