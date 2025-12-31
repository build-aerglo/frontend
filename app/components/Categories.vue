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

      <template v-else-if="categories.length > 0">
        <div
          v-for="(column, columnIndex) in columnizedCategories"
          :key="'col-' + columnIndex"
          class="flex flex-col gap-4"
        >
          <div
            v-for="category in column"
            :key="category.id"
            class="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <button
              @click="toggleCategory(category.id)"
              class="w-full flex items-center justify-between p-4 transition-colors text-left"
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
                <div>
                  <span class="font-semibold text-gray-800 text-base block">{{ category.name }}</span>
                  <span class="text-xs text-gray-500">
                    {{ category.tags.length }} tags
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
                  v-for="tag in category.tags"
                  :key="tag.id"
                  @click="handleSelection(category.id, tag.id)"
                  class="text-left px-3 py-2 rounded-md text-sm transition-colors bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-100 shadow-sm"
                >
                  {{ tag.name }}
                </button>
                <p v-if="category.tags.length === 0" class="text-xs text-gray-400 text-center py-2 italic">
                  No tags available for this category.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="col-span-full text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
          <CircleEllipsis class="w-8 h-8 text-gray-300" />
        </div>
        <p class="text-gray-500 text-lg">No categories available at the moment.</p>
        <p class="text-sm text-gray-400 mt-1">Please check your connection or try again later.</p>
      </div>
    </div>

    <div v-if="!isLoading && categories.length > 0 && filteredCategories.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">No matches found for "{{ searchQuery }}"</p>
      <button @click="searchQuery = ''" class="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
        Clear search
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBusinessMethods from '~/composables/business/useBusinessMethods'
import {
  Utensils, ShoppingCart, Sparkles, HeartPlus, Hotel,
  GraduationCap, Wallet, Palmtree, Store, ChevronDown, 
  ChevronRight, CircleEllipsis, ShoppingBag
} from 'lucide-vue-next'

const { getCategoryWithTags } = useBusinessMethods()

interface Tag {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  icon: any
  color: string
  tags: Tag[]
}

const iconMapping: Record<string, any> = {
  'Education and Training': { icon: GraduationCap, color: 'text-yellow-400' },
  'Hotels, BnB and vacation': { icon: Hotel, color: 'text-sky-500' },
  'Health and Wellness': { icon: HeartPlus, color: 'text-red-500' },
  'Food and Resturants': { icon: Utensils, color: 'text-orange-500' },
  'Finance': { icon: Wallet, color: 'text-emerald-600' },
  'Bank': { icon: Wallet, color: 'text-emerald-600' },
  'Fashion and Baauty': { icon: Sparkles, color: 'text-pink-500' },
  'Tourism': { icon: Palmtree, color: 'text-teal-500' },
  'Shopping': { icon: ShoppingCart, color: 'text-purple-500' },
  'Retail': { icon: Store, color: 'text-indigo-500' },
  'E-commerce': { icon: ShoppingBag, color: 'text-indigo-600' }
}

const categories = ref<Category[]>([])
const isLoading = ref(true)
const expandedCategories = ref<Set<string>>(new Set())
const searchQuery = ref('')
const hoverCategory = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await getCategoryWithTags()
    console.log(res)
    const rawArray = Array.isArray(res) ? res : (res?.data || [])
    
    const mapped = rawArray.map((item: any) => {
      const config = iconMapping[item.categoryName] || {
        icon: CircleEllipsis,
        color: 'text-gray-400'
      }
      
      return {
        id: item.categoryId || item.id,
        name: item.categoryName || 'Unnamed Category',
        icon: config.icon,
        color: config.color,
        // Sort tags inside the category
        tags: Array.isArray(item.tags) 
          ? item.tags.map((t: any) => ({
              id: t.tagId || t.id,
              name: t.tagName || t.name || 'Unnamed Tag'
            })).sort((a: Category, b: Category) => a.name.localeCompare(b.name)) 
          : []
      }
    })

    // Sort the main categories A-Z by name
    categories.value = mapped.sort((a: Category, b: Category) => a.name.localeCompare(b.name))

  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    isLoading.value = false
  }
})

const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return categories.value

  return categories.value.filter(cat => {
    const nameMatch = cat.name.toLowerCase().includes(query)
    const tagMatch = cat.tags.some(t => t.name.toLowerCase().includes(query))
    return nameMatch || tagMatch
  })
})

const columnizedCategories = computed(() => {
  const list = filteredCategories.value
  if (!list.length) return [[], [], []]

  // Calculate how many items should be in each column
  const totalItems = list.length
  const itemsPerColumn = Math.ceil(totalItems / 3)

  // Slice the array so it reads vertically (A-Z down the first column)
  return [
    list.slice(0, itemsPerColumn),
    list.slice(itemsPerColumn, itemsPerColumn * 2),
    list.slice(itemsPerColumn * 2)
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
    'text-indigo-600': 'rgba(79, 70, 229, 0.08)',
  }
  return colorMap[colorClass] || 'rgba(243, 244, 246, 0.6)'
}

const toggleCategory = (id: string) => {
  if (expandedCategories.value.has(id)) {
    expandedCategories.value.delete(id)
  } else {
    expandedCategories.value.add(id)
  }
}

const emit = defineEmits(['categorySelected'])

// Inside <script setup> of your Category Component
const handleSelection = (categoryId: string, tagId: string) => {
  // Find the tag name from categories
  const category = categories.value.find(cat => cat.id === categoryId)
  const tag = category?.tags.find(t => t.id === tagId)
  
  // Redirect to explore page with the tagId in the URL
  navigateTo({
    path: '/end-user/landing/explore',
    query: {
      tagId: tagId,
      tagName: tag?.name || 'Tag'
    }
  })
}
</script>