<template>
  <div class="w-full flex justify-center mt-1">
    <div class="relative flex items-center w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg
             bg-transparent dark:bg-gray-900 shadow-md
             border border-gray-300 dark:border-gray-700
             focus-within:ring-2 focus-within:ring-[#008253]
             transition-all duration-300">
      <!-- Input -->
      <input v-model="query" type="text" placeholder="Search business or category" @input="onInput"
        @focus="showSuggestions = true" @keydown.enter="submit" class="flex-1 bg-transparent outline-none
               text-white dark:text-white
               placeholder-gray-400 px-4 py-4" />

      <!-- Search Button -->
      <button @click="submit" class="w-1/3 bg-[#008253] text-white
               flex justify-center items-center
               hover:bg-[#006f45]
               transition-colors duration-200
               h-full">
        <span class="text-sm font-bold tracking-wide">
          Search
        </span>
      </button>

      <!-- Suggestions -->
      <ul v-if="showSuggestions && suggestions.length" class="absolute top-full left-0 w-full
               bg-white dark:bg-gray-800
               border border-gray-200 dark:border-gray-700
               shadow-lg z-50">
        <li v-for="item in suggestions" :key="item" @mousedown.prevent="select(item)" class="flex items-center px-4 py-2 cursor-pointer
                 hover:bg-gray-100 dark:hover:bg-gray-700
                 transition">
          <i class="pi pi-search text-gray-400 mr-2"></i>
          <span class="text-white dark:text-gray-200">
            {{ item }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSearch } from '@/composables/search/useSearch'

const { search } = useSearch()

const query = ref('')
const suggestions = ref<string[]>([])
const showSuggestions = ref(false)

let debounceTimer: number

const onInput = () => {
  clearTimeout(debounceTimer)

  debounceTimer = window.setTimeout(async () => {
    if (!query.value.trim()) {
      suggestions.value = []
      return
    }

    try {
      const data = await search(query.value)
      suggestions.value = data.suggestions ?? []
    } catch {
      suggestions.value = []
    }
  }, 400)
}

const select = (value: string) => {
  query.value = value
  showSuggestions.value = false
  submit()
}

const submit = () => {
  if (!query.value.trim()) return
  window.location.href = `/search?q=${encodeURIComponent(query.value)}`
}
</script>
