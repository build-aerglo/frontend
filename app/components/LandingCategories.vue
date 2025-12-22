<template>
  <div class="w-full py-4 px-4 rounded-2xl border border-slate-300 bg-gradient-to-r from-fuchsia-50 to-fuchsia-100">
    <div class="max-w-5xl mx-auto">
      <div class="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
        <div
          v-for="(category, index) in categories"
          :key="index"
          :class="[
            'flex flex-col items-center justify-center space-y-2 cursor-pointer hover:scale-110 transition-transform duration-200',
            index >= 4 ? 'hidden md:flex' : ''
          ]"
          @click="navigateToCategory(category.name)"
        >
          <component
            :is="category.icon"
            :class="category.color"
            class="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:scale-110 transition-transform"
          />
          <span class="text-[13px] md:text-xs text-gray-600 text-center leading-tight">
            {{ category.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import useBusinessMethods from '~/composables/business/useBusinessMethods'
import {
  GraduationCap,
  Hotel,
  HeartPlus,
  Utensils,
  Wallet,
  Sparkles,
  Palmtree,
  ShoppingCart,
  Store,
  CircleEllipsis
} from 'lucide-vue-next'

interface Category {
  icon: any
  name: string
  color: string
}

const { getCategories } = useBusinessMethods()
const iconMapping: Record<string, { icon: any, color: string }> = {
  'Education and Training': { icon: GraduationCap, color: 'text-yellow-500' },
  'Hotels, BnB and vacation': { icon: Hotel, color: 'text-sky-400' },
  'Health and Wellness': { icon: HeartPlus, color: 'text-red-600' },
  'Food and Resturants': { icon: Utensils, color: 'text-orange-500' },
  'Finance': { icon: Wallet, color: 'text-emerald-600' },
  'Fashion and Baauty': { icon: Sparkles, color: 'text-pink-400' },
  'Tourism': { icon: Palmtree, color: 'text-teal-500' },
  'Shopping': { icon: ShoppingCart, color: 'text-purple-500' },
  'Retail': { icon: Store, color: 'text-indigo-500' }
}

// Initialize with 8 skeletons
const categories = ref<Category[]>(
  Array(8).fill(null).map(() => ({
    icon: CircleEllipsis,
    name: '...',
    color: 'text-gray-300'
  }))
)

onMounted(async () => {
  try {
    const data = await getCategories()
    
    if (data && Array.isArray(data)) {
      const mappedData = data.slice(0, 8).map((item: any) => {
        const match = iconMapping[item.name]
        
        return {
          name: item.name,
          icon: match ? match.icon : CircleEllipsis,
          color: match ? match.color : 'text-gray-400'
        }
      })
      while (mappedData.length < 8) {
        mappedData.push({
          name: 'More',
          icon: CircleEllipsis,
          color: 'text-gray-400'
        })
      }

      categories.value = mappedData
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
})
const navigateToCategory = (categoryName: string) => {
  // Navigate to explore page with category query parameter
  navigateTo({
    path: '/end-user/landing/explore',
    query: { category: categoryName.toLowerCase() }
  })
}
</script>