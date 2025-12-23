<template>
  <div
    v-if="showSuggestions"
    class="fixed inset-0 bg-black/10 z-[9]"
    @click="showSuggestions = false"
  ></div>

  <div class="w-full flex justify-center mt-1">
    <div
      ref="searchContainer"
      class="relative rounded-lg flex items-center w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg
             bg-transparent dark:bg-gray-900 shadow-md
             border border-gray-300 dark:border-gray-700
             focus-within:ring-2 focus-within:ring-[#008253]
             transition-all duration-300 z-[10]"
    >
      <input
        v-model="query"
        type="text"
        placeholder="Search business"
        @input="onInput"
        @keydown="handleKeyDown"
        class="flex-1 h-12 sm:h-14 bg-transparent outline-none
               text-white dark:text-white rounded-l-lg
               placeholder-gray-400 px-4 py-4"
      />

      <button
        @click="handleSearchButton"
        class="w-1/3 h-12 sm:h-14 px-2 bg-[#008253] text-white
               flex justify-center items-center rounded-r-lg
               hover:bg-[#006f45]
               transition-colors duration-200"
      >
        <i v-if="isSmallScreen" class="pi pi-search text-sm"></i>
        <span v-else class="text-xs sm:text-sm font-bold tracking-wide">
          Search
        </span>
      </button>

      <ul
        v-if="showSuggestions"
        class="absolute top-full left-0 w-full mt-2
               bg-white dark:bg-gray-800
               border border-gray-200 dark:border-gray-700
               rounded-xl
               shadow-[0_20px_40px_rgba(0,0,0,0.15)]
               z-[20]
               overflow-hidden"
      >
        <template v-if="hasSuggestions">
          <li class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
            Companies
          </li>

          <li
            v-for="(item, index) in suggestions.companies"
            :key="item.id"
            @mousedown.prevent="selectSuggestion(item.name)"
            @mouseover="activeIndex = index"
            :class="{ 'bg-gray-100 dark:bg-gray-700': activeIndex === index }"
            class="flex items-center justify-between px-4 py-3 cursor-pointer
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <div class="flex items-center space-x-3 min-w-0">
              <img
                :src="item.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&h=200&auto=format&fit=crop'"
                class="w-9 h-9 rounded-md object-cover flex-shrink-0 border border-gray-200"
                :alt="`${item.name} logo`"
              />
              <div class="flex flex-col min-w-0">
                <span class="text-gray-900 dark:text-gray-100 font-semibold truncate">
                  {{ item.name }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ item.url }}
                </span>
              </div>
            </div>

            <div
              class="flex items-center gap-1 px-2 py-1 rounded-md text-white text-xs font-bold"
              :class="{
                'bg-green-600': item.rating >= 4.0,
                'bg-yellow-500': item.rating >= 3.0 && item.rating < 4.0,
                'bg-red-600': item.rating < 3.0,
              }"
            >
              <i class="pi pi-star-fill text-white text-[10px]"></i>
              {{ item.rating.toFixed(1) }}
            </div>
          </li>
        </template>

        <li v-else class="px-4 py-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
          <i class="pi pi-search text-2xl mb-2 block text-gray-300"></i>
          <p class="text-sm">No results for <span class="font-bold">"{{ query }}"</span></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import useSearch from '~/composables/search/useSearch'

const { search } = useSearch()

interface CompanyData {
  id: string;
  name: string
  url: string
  logoUrl: string
  rating: number
}

const query = ref('')
const suggestions = ref<{ companies: CompanyData[] }>({ companies: [] })
const showSuggestions = ref(false)
const activeIndex = ref(-1)
const searchContainer = ref<HTMLElement | null>(null)
const windowWidth = ref(0)

let debounceTimer: number | null = null

const hasSuggestions = computed(() => suggestions.value.companies.length > 0)
const isSmallScreen = computed(() => windowWidth.value < 343)

const onInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  activeIndex.value = -1

  debounceTimer = window.setTimeout(async () => {
    const trimmed = query.value.trim()
    if (!trimmed) {
      suggestions.value = { companies: [] }
      showSuggestions.value = false
      return
    }

    try {
      const res = await search(trimmed)
      const results = Array.isArray(res) ? res : (res.companies || [])

      if (results.length > 0) {
        suggestions.value.companies = results.slice(0, 6).map((b: any) => ({
          id: b.businessId,
          name: b.name,
          url: b.website || '',
          logoUrl: b.logo || '/images/default-logo.png',
          rating: b.avgRating || 0
        }))
      } else {
        suggestions.value.companies = []
      }
      showSuggestions.value = true
    } catch (error) {
      console.error("Search fetch error:", error)
      showSuggestions.value = false
    }
  }, 400)
}

const selectSuggestion = (name: string) => {
  query.value = name
  showSuggestions.value = false
}

const handleSearchButton = () => {
  const q = query.value.trim()
  if (!q) return

  showSuggestions.value = false

  const exactMatch = suggestions.value.companies.find(
    c => c.name.toLowerCase() === q.toLowerCase()
  )

  if (exactMatch) {
    navigateTo(`/biz/${exactMatch.id}`)
  } else {
    navigateTo(`/business/${encodeURIComponent(q)}`)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    const q = query.value.trim()
    if (!q) return
    
    showSuggestions.value = false
    navigateTo({ path: '/end-user/landing/explore', query: { q } })
    return
  }

  if (!showSuggestions.value || !hasSuggestions.value) return
  
  const count = suggestions.value.companies.length

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % count
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + count) % count
  }
}

const handleOutsideClick = (e: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
    showSuggestions.value = false
  }
}

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('resize', updateWindowWidth)
})
</script>