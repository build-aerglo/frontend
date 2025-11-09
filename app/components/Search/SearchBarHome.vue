<template>
  <div class="w-full flex justify-center mt-1">
    <div
      class="relative flex items-center w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-transparent dark:bg-gray-900 shadow-md border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-[#008253] transition-all duration-300"
    >
      <!-- Input Field -->
      <input
        v-model="query"
        type="text"
        placeholder="Search business or category"
        @input="filterSuggestions"
        @focus="showSuggestions = true"
        @blur="hideWithDelay"
        class="flex-1 bg-transparent outline-none text-white dark:text-white placeholder-gray-400 px-4 py-4"
      />

      <!-- Search Button -->
      <button
        @click="filterSuggestions"
        class="w-1/3 bg-[#008253] text-white flex justify-center items-center hover:bg-[#006f45] transition-colors duration-200 h-full"
      >
        <span class="text-sm font-bold tracking-wide">Search</span>
      </button>

      <!-- Suggestion Dropdown -->
      <ul
        v-if="showSuggestions && filteredSuggestions.length"
        class="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-xl shadow-lg z-50"
      >
        <li
          v-for="(item, index) in filteredSuggestions"
          :key="index"
          @mousedown.prevent="selectSuggestion(item)"
          class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <i class="pi pi-search text-gray-400 mr-2"></i>
          <span class="text-gray-700 dark:text-gray-200">{{ item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')
const showSuggestions = ref(false)

// Expanded suggestion list with testable entries
const suggestions = ref([
  'Home Services',
  'Health & Wellness',
  'Travel & Vacation',
  'Restaurant & Bars',
  'Electronics & Gadgets',
  'Technology & Software',
  'Business & Finance',
  'Events',
  'Media',
  'Academic',
  'Animals & Pets',
  'National Parks',
  'Nature Trips',
])

const filteredSuggestions = ref<string[]>([])

const filterSuggestions = () => {
  const q = query.value.trim().toLowerCase()
  // Always filter suggestions when typing
  filteredSuggestions.value = q
    ? suggestions.value.filter((s) => s.toLowerCase().includes(q))
    : []
  // Show dropdown only when relevant
  showSuggestions.value = filteredSuggestions.value.length > 0
}

const selectSuggestion = (item: string) => {
  query.value = item
  showSuggestions.value = false
}

const hideWithDelay = () => {
  // slight delay to allow clicks to register
  setTimeout(() => (showSuggestions.value = false), 120)
}
</script>

<style scoped>
ul {
  animation: fadeIn 0.15s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
