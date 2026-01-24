<template>
  <div class="fixed inset-0 z-[1200] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

    <div class="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl z-10 overflow-visible">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <i class="pi pi-times"></i>
      </button>

      <h3 class="text-xl font-bold mb-2 text-gray-800">Claim a Business</h3>
      <p class="text-sm text-gray-500 mb-6">Search for your business in our database to start the verification process.</p>

      <div class="relative">
        <form @submit.prevent="handleSearchSubmit">
          <div class="flex flex-col gap-4">
            <div class="relative w-full">
              <InputText 
                v-model="query" 
                placeholder="Type business name..." 
                class="w-full" 
                @input="onInput"
                @keydown="handleKeyDown"
                autofocus 
              />
              <i v-if="isSearching" class="pi pi-spin pi-spinner absolute right-3 top-3 text-gray-400"></i>
            </div>

            <ButtonCustom 
              label="Claim Business" 
              primary="true" 
              type="submit"
              :disabled="!query.trim()" 
            />
          </div>
        </form>

        <ul
          v-if="showSuggestions"
          class="absolute top-full left-0 w-full mt-1
                 bg-white border border-gray-200 
                 rounded-xl shadow-xl z-[20]
                 overflow-hidden max-h-60 overflow-y-auto"
        >
          <template v-if="hasSuggestions">
            <li
              v-for="(item, index) in suggestions"
              :key="item.id"
              @mousedown.prevent="selectSuggestion(item)"
              @mouseover="activeIndex = index"
              :class="{ 'bg-gray-100': activeIndex === index }"
              class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all border-b last:border-0"
            >
              <img
                :src="item.logoUrl || '/images/default-business-logo.png'"
                class="w-8 h-8 rounded object-cover border border-gray-100"
              />
              <div class="flex flex-col min-w-0">
                <span class="text-sm font-semibold text-gray-900 truncate">{{ item.name }}</span>
                <!-- <span class="text-xs text-gray-500 truncate">{{ item.location || 'Business Entity' }}</span> -->
              </div>
            </li>
          </template>

          <li v-else-if="query.length > 2" class="px-4 py-6 text-center text-gray-500 bg-gray-50">
            <p class="text-xs font-medium">No registered business found for "{{ query }}"</p>
            <NuxtLink to="/business/auth/sign-up" class="text-primary text-xs underline mt-2 block" @click="$emit('close')">
              Add your business instead?
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useSearch from '~/composables/search/useSearch'

const { search } = useSearch()
const emit = defineEmits(['close', 'search'])

const query = ref('')
const suggestions = ref<any[]>([])
const showSuggestions = ref(false)
const activeIndex = ref(-1)
const isSearching = ref(false)
let debounceTimer: number | null = null

const hasSuggestions = computed(() => suggestions.value.length > 0)

const onInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  activeIndex.value = -1

  debounceTimer = window.setTimeout(async () => {
    const trimmed = query.value.trim()
    if (trimmed.length < 2) {
      suggestions.value = []
      showSuggestions.value = false
      return
    }

    try {
      isSearching.value = true
      const res = await search(trimmed)
      const results = Array.isArray(res) ? res : (res.companies || [])

      suggestions.value = results.slice(0, 5).map((b: any) => ({
        id: b.businessId || b.id,
        name: b.name,
        logoUrl: b.logo || b.logoUrl,
        location: b.address || b.location
      }))
      showSuggestions.value = true
    } catch (error) {
      console.error("Claim search error:", error)
    } finally {
      isSearching.value = false
    }
  }, 400)
}

const selectSuggestion = (item: any) => {
  query.value = item.name
  showSuggestions.value = false
  emit('search', item.id) // Emits the ID to the navbar function
}

const handleSearchSubmit = () => {
  // If user hits enter and there's a highlighted suggestion, use it
  if (activeIndex.value >= 0 && suggestions.value[activeIndex.value]) {
    selectSuggestion(suggestions.value[activeIndex.value])
    return
  }
  
  // Otherwise, if there is at least one suggestion, use the first one
  if (hasSuggestions.value) {
    selectSuggestion(suggestions.value[0])
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!showSuggestions.value || !hasSuggestions.value) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % suggestions.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length
  }
}
</script>