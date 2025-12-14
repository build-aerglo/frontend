<template>
  <!-- Overlay (global layer, very light) -->
  <div
    v-if="showSuggestions"
    class="fixed inset-0 bg-black/10 z-[9998]"
    @click="showSuggestions = false"
  ></div>

  <div class="w-full flex justify-center mt-1">
    <div
      ref="searchContainer"
      class="relative flex items-center w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg
             bg-transparent dark:bg-gray-900 shadow-md
             border border-gray-300 dark:border-gray-700
             focus-within:ring-2 focus-within:ring-[#008253]
             transition-all duration-300 z-[10000]"
    >
      <input
        v-model="query"
        type="text"
        placeholder="Search business or category"
        @input="onInput"
        @keydown="handleKeyDown"
        class="flex-1 bg-transparent outline-none
               text-white dark:text-white
               placeholder-gray-400 px-4 py-4"
      />

      <button
        @click="submit()"
        class="w-1/3 bg-[#008253] text-white
               flex justify-center items-center
               hover:bg-[#006f45]
               transition-colors duration-200
               h-full"
      >
        <span class="text-sm font-bold tracking-wide">
          Search
        </span>
      </button>

      <!-- Suggestions dropdown -->
      <ul
        v-if="showSuggestions && hasSuggestions"
        class="absolute top-full left-0 w-full mt-2
               bg-white dark:bg-gray-800
               border border-gray-200 dark:border-gray-700
               rounded-xl
               shadow-[0_20px_40px_rgba(0,0,0,0.15)]
               z-[10001]
               overflow-hidden"
      >
        <!-- Companies Header -->
        <template v-if="suggestions.companies.length">
          <li
            class="mt-2 py-2 text-[100%] text-left font-bold tracking-wide
                   text-contrast dark:bg-gray-700"
          >
            Companies
          </li>

          <li
            v-for="(item, index) in suggestions.companies"
            :key="`c-${item.name}`"
            @mousedown.prevent="select(item.name, 'company')"
            @mouseover="activeIndex = index"
            :class="{ 'bg-gray-100 dark:bg-gray-700': activeIndex === index }"
            class="flex items-center justify-between px-4 py-3 cursor-pointer
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <!-- Left -->
            <div class="flex items-center space-x-3 min-w-0">
              <img
                :src="item.logoUrl"
                class="w-9 h-9 rounded-md object-cover flex-shrink-0 border border-gray-200"
                :alt="`${item.name} logo`"
              />

              <div class="flex flex-col min-w-0">
                <span class="text-gray-900 dark:text-gray-100 font-semibold truncate">
                  {{ item.name }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ item.url }} • {{ item.reviewCount }}
                </span>
              </div>
            </div>

            <!-- Rating -->
            <div
              class="flex items-center gap-1 px-2 py-1 rounded-md
                     text-white text-xs font-bold"
              :class="{
                'bg-green-600': item.rating >= 4.0,
                'bg-yellow-500': item.rating >= 3.0 && item.rating < 4.0,
                'bg-red-600': item.rating < 3.0,
              }"
            >
              <i class="pi pi-star text-white text-[12px]"></i>
              {{ item.rating.toFixed(1) }}
            </div>
          </li>
        </template>

        <!-- Categories Header -->
        <template v-if="suggestions.categories.length">
          <li
            class="mt-2 py-2 text-[100%] text-left tracking-wide
                   text-contrast dark:bg-gray-700
                   border-t dark:border-gray-600"
          >
            Categories
          </li>

          <li
            v-for="(item, index) in suggestions.categories"
            :key="`cat-${item}`"
            @mousedown.prevent="select(item, 'category')"
            @mouseover="activeIndex = suggestions.companies.length + index"
            :class="{
              'bg-gray-100 dark:bg-gray-700':
                activeIndex === suggestions.companies.length + index
            }"
            class="flex items-center px-4 py-3 cursor-pointer
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <i class="pi pi-tag text-[#008253] mr-3 text-sm"></i>
            <span class="text-gray-800 dark:text-gray-200 text-sm font-medium">
              {{ item }}
            </span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import useSearch from '~/composables/search/useSearch'

const { useDummySearch } = useSearch()

interface CompanyData {
  name: string
  url: string
  logoUrl: string
  reviewCount: string
  rating: number
}

interface GroupedSuggestions {
  companies: CompanyData[]
  categories: string[]
}

interface Selection {
  value: string
  type: 'company' | 'category'
}

const query = ref('')
const suggestions = ref<GroupedSuggestions>({ companies: [], categories: [] })
const showSuggestions = ref(false)
const activeIndex = ref(-1)

let debounceTimer: number | null = null

const hasSuggestions = computed(() =>
  suggestions.value.companies.length > 0 ||
  suggestions.value.categories.length > 0
)

const allSuggestionsCount = computed(() =>
  suggestions.value.companies.length +
  suggestions.value.categories.length
)

const onInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  activeIndex.value = -1

  debounceTimer = window.setTimeout(async () => {
    const trimmed = query.value.trim()
    if (!trimmed) {
      suggestions.value = { companies: [], categories: [] }
      showSuggestions.value = false
      return
    }

    try {
      suggestions.value = await useDummySearch(trimmed)
      showSuggestions.value = true
    } catch {
      showSuggestions.value = false
    }
  }, 400)
}

const getSuggestionItem = (index: number): Selection | null => {
  const companyCount = suggestions.value.companies.length

  if (index < companyCount) {
    const c = suggestions.value.companies[index]
    return c ? { value: c.name, type: 'company' } : null
  }

  const category = suggestions.value.categories[index - companyCount]
  return category ? { value: category, type: 'category' } : null
}

const select = (value: string, type: 'company' | 'category') => {
  query.value = value
  showSuggestions.value = false
  submit(type)
}

const submit = (type?: string) => {
  const q = query.value.trim()
  if (!q) return
  window.location.href =
    `/search?q=${encodeURIComponent(q)}` +
    (type ? `&type=${type}` : '')
}

const navigateDown = () => {
  if (!showSuggestions.value) return
  activeIndex.value = (activeIndex.value + 1) % allSuggestionsCount.value
}

const navigateUp = () => {
  if (!showSuggestions.value) return
  activeIndex.value =
    (activeIndex.value - 1 + allSuggestionsCount.value) %
    allSuggestionsCount.value
}

const selectSuggestion = () => {
  if (activeIndex.value >= 0) {
    const s = getSuggestionItem(activeIndex.value)
    if (s) select(s.value, s.type)
  } else submit()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    navigateDown()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    navigateUp()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    selectSuggestion()
  }
}

const searchContainer = ref<HTMLElement | null>(null)

const handleOutsideClick = (e: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
    showSuggestions.value = false
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>
