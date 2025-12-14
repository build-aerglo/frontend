<template>
  <div class="w-full flex justify-center mt-1">
    <div ref="searchContainer" class="relative flex items-center w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg
              bg-transparent dark:bg-gray-900 shadow-md
              border border-gray-300 dark:border-gray-700
              focus-within:ring-2 focus-within:ring-[#008253]
              transition-all duration-300 z-[10000]">
      
      <input v-model="query" type="text" placeholder="Search business or category" 
        @input="onInput"
        @keydown="handleKeyDown" 
        class="flex-1 bg-transparent outline-none
                text-white dark:text-white
                placeholder-gray-400 px-4 py-4" 
      />

      <button @click="submit()" class="w-1/3 bg-[#008253] text-white
                flex justify-center items-center
                hover:bg-[#006f45]
                transition-colors duration-200
                h-full">
        <span class="text-sm font-bold tracking-wide">
          Search
        </span>
      </button>
      <div v-if="showSuggestions"
          class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
          @click="showSuggestions = false">
      </div>
      <ul v-if="showSuggestions && hasSuggestions" 
        class="absolute top-full left-0 w-full
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              shadow-xl rounded-lg z-[9999] overflow-hidden">

        <!-- Companies Header -->
        <template v-if="suggestions.companies.length">
          <li class="px-4 py-2 text-[11px] font-bold uppercase tracking-wide 
                    text-gray-500 bg-gray-100 dark:bg-gray-700">
            Companies
          </li>

          <li v-for="(item, index) in suggestions.companies"
              :key="`c-${item.name}`"
              @mousedown.prevent="select(item.name, 'company')"
              @mouseover="activeIndex = index"
              :class="{ 'bg-gray-100 dark:bg-gray-700': activeIndex === index }"
              class="flex items-center justify-between px-4 py-3 cursor-pointer
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">

            <!-- Left side: logo + name + subtext -->
            <div class="flex items-center space-x-3 min-w-0">

              <!-- Logo -->
              <img :src="item.logoUrl"
                  class="w-9 h-9 rounded-md object-cover flex-shrink-0 border border-gray-200"
                  :alt="`${item.name} logo`">

              <!-- Text info -->
              <div class="flex flex-col min-w-0">
                <span class="text-gray-900 dark:text-gray-100 font-semibold truncate">
                  {{ item.name }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ item.url }} • {{ item.reviewCount }}
                </span>
              </div>
            </div>

            <!-- Rating badge -->
            <div class="flex items-center gap-1 px-2 py-1 rounded-md text-white text-xs font-bold"
                :class="{
                    'bg-green-600': item.rating >= 4.0,
                    'bg-yellow-500': item.rating >= 3.0 && item.rating < 4.0,
                    'bg-red-600': item.rating < 3.0,
                }">
              <i class="pi pi-star text-white text-[12px]"></i>
              {{ item.rating.toFixed(1) }}
            </div>

          </li>
        </template>

        <!-- Categories Header -->
        <template v-if="suggestions.categories.length">
          <li class="px-4 py-2 text-[11px] font-bold uppercase tracking-wide 
                    text-gray-500 bg-gray-100 dark:bg-gray-700 border-t dark:border-gray-600">
            Categories
          </li>

          <li v-for="(item, index) in suggestions.categories"
              :key="`cat-${item}`"
              @mousedown.prevent="select(item, 'category')"
              @mouseover="activeIndex = suggestions.companies.length + index"
              :class="{ 
                'bg-gray-100 dark:bg-gray-700': 
                activeIndex === suggestions.companies.length + index 
              }"
              class="flex items-center px-4 py-3 cursor-pointer
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">

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
import useSearch from '~/composables/search/useSearch';
const { useDummySearch } = useSearch();

interface CompanyData {
  name: string;
  url: string;
  logoUrl: string;
  reviewCount: string;
  rating: number;
}

// Define the expected structure of the grouped suggestions
interface GroupedSuggestions {
  companies: CompanyData[];
  categories: string[];
}

interface Selection {
    value: string;
    type: 'company' | 'category';
}

const query = ref('')
const suggestions = ref<GroupedSuggestions>({ companies: [], categories: [] }); 
const showSuggestions = ref(false)
const activeIndex = ref(-1)

let debounceTimer: number | null = null

const hasSuggestions = computed(() => {
  return suggestions.value.companies.length > 0 || suggestions.value.categories.length > 0;
})

const allSuggestionsCount = computed(() => {
  return suggestions.value.companies.length + suggestions.value.categories.length;
})

// --- Methods ---

const onInput = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  activeIndex.value = -1

  debounceTimer = window.setTimeout(async () => {
    const trimmedQuery = query.value.trim();

    if (!trimmedQuery) {
      suggestions.value = { companies: [], categories: [] };
      showSuggestions.value = false;
      return
    }
    
    try {
      const data = await useDummySearch(trimmedQuery)
      suggestions.value = data as GroupedSuggestions; 
      showSuggestions.value = true
    } catch {
      suggestions.value = { companies: [], categories: [] }
      showSuggestions.value = false
    }
  }, 400)
}

// Helper to get the selected item's value and type based on activeIndex
const getSuggestionItem = (index: number): Selection | null => {
  const { companies, categories } = suggestions.value;
  const companyCount = companies.length;

  if (index < companyCount) {
    const company = companies[index];
    if (company) {
      return { value: company.name, type: 'company' };
    }
  } else if (index < companyCount + categories.length) {
    const category = categories[index - companyCount];
    if (category) {
      return { value: category, type: 'category' }; 
    }
  }
  return null;
}

const select = (value: string, type: 'company' | 'category') => {
  query.value = value
  showSuggestions.value = false
  submit(type) 
}

const submit = (type?: string) => {
  const trimmedQuery = query.value.trim();
  if (!trimmedQuery) return

  let url = `/search?q=${encodeURIComponent(trimmedQuery)}`
  if (type) {
    url += `&type=${type}`
  }
  window.location.href = url
}

// --- Keyboard Navigation Methods ---

const navigateDown = () => {
  if (!showSuggestions.value || !hasSuggestions.value) return;
  activeIndex.value = (activeIndex.value + 1) % allSuggestionsCount.value;
};

const navigateUp = () => {
  if (!showSuggestions.value || !hasSuggestions.value) return;
  activeIndex.value = (activeIndex.value - 1 + allSuggestionsCount.value) % allSuggestionsCount.value;
};

const selectSuggestion = () => {
  if (activeIndex.value >= 0) {
    const selected = getSuggestionItem(activeIndex.value);
    if (selected) {
      select(selected.value, selected.type); 
    }
  } else {
    submit();
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault(); 
    navigateDown();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault(); 
    navigateUp();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    selectSuggestion();
  }
}

// --- Outside Click Handler ---
const searchContainer = ref<HTMLElement | null>(null);

const handleOutsideClick = (event: MouseEvent) => {
    if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
        showSuggestions.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick);
});
</script>