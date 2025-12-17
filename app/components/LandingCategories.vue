<template>
  <div class="w-full py-4 px-4 rounded-2xl border border-slate-300 bg-gradient-to-r from-fuchsia-50 to-fuchsia-100">
    <div class="max-w-5xl mx-auto">
      <div class="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
        <div
          v-for="(category, index) in categories"
          :key="index"
          :class="[
            'flex flex-col items-center justify-center space-y-2',
            index >= 4 ? 'hidden md:flex' : ''
          ]"
        >
          <component
            :is="category.icon"
            :class="category.color"
            class="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
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
import {
  Utensils,
  ShoppingCart,
  HeartPlus,
  Sparkles,
  Home,
  LaptopMinimal,
  Hotel,
  GraduationCap
} from 'lucide-vue-next'

interface Category {
  icon: any
  name: string
  color: string
}

const categories: Category[] = [
  { icon: Utensils, name: 'Restaurants', color: 'text-orange-500' },
  { icon: ShoppingCart, name: 'Shopping', color: 'text-purple-500' },
  { icon: HeartPlus, name: 'Wellness', color: 'text-red-600' },
  { icon: Sparkles, name: 'Fashion', color: 'text-pink-400' },
  { icon: Home, name: 'Home Services', color: 'text-green-300' },
  { icon: LaptopMinimal, name: 'Electronics', color: 'text-indigo-300' },
  { icon: Hotel, name: 'Hotels & Vacation', color: 'text-sky-400' },
  { icon: GraduationCap, name: 'Education', color: 'text-yellow-400' }
]
</script>