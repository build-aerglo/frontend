<template>
  <div class="w-full max-w-7xl mx-auto p-6">
    <CategorySearch 
      v-model="searchQuery"
      @clear="searchQuery = ''"
    />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
      
      <template v-if="isLoading">
        <div 
          v-for="n in 9" 
          :key="'skeleton-' + n" 
          class="border border-gray-100 rounded-lg p-4 bg-white animate-pulse"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          v-for="(column, columnIndex) in columnizedCategories"
          :key="columnIndex"
          class="flex flex-col gap-4"
        >
          <div
            v-for="category in column"
            :key="category.id"
            class="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <button
              @click="toggleCategory(category.id)"
              class="w-full flex items-center justify-between p-4 transition-colors"
              :style="{ 
                backgroundColor: expandedCategories.has(category.id) || hoverCategory === category.id 
                  ? getCategoryBgColor(category.color) 
                  : 'transparent' 
              }"
              @mouseenter="hoverCategory = category.id"
              @mouseleave="hoverCategory = null"
            >
              <div class="flex items-center gap-3">
                <component :is="category.icon" :class="category.color" class="w-6 h-6 flex-shrink-0" />
                <div class="text-left">
                  <span class="font-semibold text-gray-800 text-base block">{{ category.name }}</span>
                  <span class="text-xs text-gray-500">
                    {{ category.subcategories.length }} subcategories
                  </span>
                </div>
              </div>
              <component
                :is="expandedCategories.has(category.id) ? ChevronDown : ChevronRight"
                class="w-5 h-5 text-gray-400 flex-shrink-0"
              />
            </button>

            <div
              v-show="expandedCategories.has(category.id)"
              class="border-t border-gray-100 p-3 flex-grow"
              :style="{ backgroundColor: getCategoryBgColor(category.color) }"
            >
              <div class="grid grid-cols-1 gap-2">
                <button
                  v-for="subcategory in category.subcategories"
                  :key="subcategory.id"
                  @click="handleSelection(category.id, subcategory.id)"
                  class="text-left px-3 py-2 rounded-md text-sm transition-colors bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                >
                  {{ subcategory.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-if="!isLoading && filteredCategories.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">No categories found matching "{{ searchQuery }}"</p>
      <button @click="searchQuery = ''" class="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
        Clear search
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import useBusinessMethods from '~/composables/business/useBusinessMethods'
import {
  Utensils,
  ShoppingCart,
  Sparkles,
  HeartPlus,
  Hotel,
  GraduationCap,
  Wallet,
  Palmtree,
  Store,
  ChevronDown,
  ChevronRight,
  CircleEllipsis
} from 'lucide-vue-next'

const { getCategories } = useBusinessMethods()

interface SubCategory {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  icon: any
  color: string
  subcategories: SubCategory[]
}

const iconMapping: Record<string, any> = {
  'Education and Training': { 
    icon: GraduationCap, 
    color: 'text-yellow-400',
    subcategories: [{ id: 'schools', name: 'Schools' }, { id: 'universities', name: 'Universities' }]
  },
  'Hotels, BnB and vacation': { 
    icon: Hotel, 
    color: 'text-sky-500',
    subcategories: [{ id: 'hotels', name: 'Hotels & Resorts' }]
  },
  'Health and Wellness': { 
    icon: HeartPlus, 
    color: 'text-red-500',
    subcategories: [{ id: 'clinics', name: 'Clinics' }]
  },
  'Food and Resturants': { 
    icon: Utensils, 
    color: 'text-orange-500',
    subcategories: [{ id: 'fine-dining', name: 'Fine Dining' }, { id: 'bukka', name: 'Bukka' }]
  },
  'Finance': { 
    icon: Wallet, 
    color: 'text-emerald-600',
    subcategories: [{ id: 'banking', name: 'Banking' }]
  },
  'Fashion and Baauty': { 
    icon: Sparkles, 
    color: 'text-pink-500',
    subcategories: [{ id: 'hair-salons', name: 'Hair Salons' }]
  },
  'Tourism': { 
    icon: Palmtree, 
    color: 'text-teal-500',
    subcategories: [{ id: 'agencies', name: 'Agencies' }]
  },
  'Shopping': { 
    icon: ShoppingCart, 
    color: 'text-purple-500',
    subcategories: [{ id: 'malls', name: 'Malls' }]
  },
  'Retail': { 
    icon: Store, 
    color: 'text-indigo-500',
    subcategories: [{ id: 'supermarkets', name: 'Supermarkets' }]
  }
}

const categories = ref<Category[]>([])
const isLoading = ref(true)
const expandedCategories = ref<Set<string>>(new Set())
const selectedCategory = ref<string | null>(null)
const selectedSubcategory = ref<string | null>(null)
const searchQuery = ref('')
const hoverCategory = ref<string | null>(null)

onMounted(async () => {
  try {
    const data = await getCategories()
    if (data && Array.isArray(data)) {
      categories.value = data.map((item: any) => {
        const config = iconMapping[item.name] || {
          icon: CircleEllipsis,
          color: 'text-gray-400',
          subcategories: []
        }
        return {
          id: item.id || item.name,
          name: item.name,
          icon: config.icon,
          color: config.color,
          subcategories: config.subcategories
        }
      })
    }
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    isLoading.value = false
  }
})

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  const query = searchQuery.value.toLowerCase().trim()
  return categories.value.filter(category => 
    category.name.toLowerCase().includes(query) ||
    category.subcategories.some(sub => sub.name.toLowerCase().includes(query))
  )
})

const columnizedCategories = computed<Category[][]>(() => {
  const itemsPerColumn = Math.ceil(filteredCategories.value.length / 3)
  return [
    filteredCategories.value.slice(0, itemsPerColumn),
    filteredCategories.value.slice(itemsPerColumn, itemsPerColumn * 2),
    filteredCategories.value.slice(itemsPerColumn * 2)
  ]
})

const getCategoryBgColor = (colorClass: string): string => {
  const colorMap: Record<string, string> = {
    'text-orange-500': 'rgba(249, 115, 22, 0.08)',
    'text-purple-500': 'rgba(168, 85, 247, 0.08)',
    'text-red-500': 'rgba(239, 68, 68, 0.08)',
    'text-pink-500': 'rgba(236, 72, 153, 0.08)',
    'text-indigo-500': 'rgba(99, 102, 241, 0.08)',
    'text-teal-500': 'rgba(20, 184, 166, 0.08)',
    'text-sky-500': 'rgba(14, 165, 233, 0.08)',
    'text-yellow-400': 'rgba(250, 204, 21, 0.08)',
    'text-emerald-600': 'rgba(5, 150, 105, 0.08)',
  }
  return colorMap[colorClass] || 'rgba(243, 244, 246, 1)'
}

const toggleCategory = (categoryId: string) => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId)
  } else {
    expandedCategories.value.add(categoryId)
  }
}

const emit = defineEmits<{
  categorySelected: [category: string, subcategory: string | null]
}>()

const handleSelection = (categoryId: string, subcategoryId: string | null = null) => {
  selectedCategory.value = categoryId
  selectedSubcategory.value = subcategoryId
  emit('categorySelected', categoryId, subcategoryId)
}
</script>