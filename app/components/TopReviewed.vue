<template>
  <section class="bg-purple-50 pb-8 pt-6">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="relative mb-6">
        <h2 class="text-2xl md:text-3xl font-demibold text-left text-gray-800 dark:text-white">
          Top Reviewed
        </h2>
        <NuxtLink
          to="/end-user/landing/explore"
          class="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:underline dark:text-gray-300"
        >
          See more
      </NuxtLink>
      </div>

      <!-- Card Grid -->
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
       <div
              v-for="(card, index) in cards"
              :key="index"
              class="relative bg-gray-50 dark:bg-gray-800 p-2 rounded-xl transform transition-transform duration-150 ease-out hover:-translate-y-1.5"
              :class="[
                card.borderColor,
                card.shadowColor,
                index > 4 ? 'hidden md:block' : 'block'
              ]"
            >

          <!-- Top-left icon -->
          <div
            class="absolute top-3 left-3 p-2 rounded-lg"
            :class="card.iconBg"
          >
            <component :is="card.icon" class="w-5 h-5" />
          </div>

          <!-- Logo -->
          <div class="flex justify-center mt-4 mb-3">
            <NuxtImg
              :src="card.logo"
              alt="logo"
              width="64"
              height="64"
              format="webp"
              class="w-16 h-16 rounded-full object-cover"
              loading="lazy"
              :placeholder="false"
            />
          </div>

          <!-- Business name -->
          <h3 class="text-lg font-semibold text-center text-slate-800 dark:text-white">
            {{ card.name }}
          </h3>

          <!-- Star Ratings -->
          <div class="flex items-center justify-center">
              <Stars
                    v-for="n in 5"
                    :key="n"
                    :value="card.rating - (n - 1)"
                    :color-level="Math.ceil(card.rating)"
                    class="w-6 h-6"
                  />
          </div>

          <div class="text-center text-[80%]">
            <p class="text-gray-400 dark:text-gray-300">
              ({{ card.reviews }} reviews)
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { NuxtImg } from '#components'

import { HeartPlus, Utensils, Hotel, GraduationCap, ShoppingCart } from 'lucide-vue-next'
import img1 from '/images/logos/gym1.jpg'
import img2 from '/images/logos/gym2.jpg'
import img3 from '/images/logos/shop1.jpg'
import img4 from '/images/logos/shop2.jpg'
import img5 from '/images/logos/hot1.jpg'
import img6 from '/images/logos/hot2.jpg'
import img7 from '/images/logos/sch1.jpg'
import img8 from '/images/logos/sch2.jpg'
import img9 from '/images/logos/res1.jpg'

const cards = [
  { icon: ShoppingCart, logo: img3, name: 'UrbanMart', rating: 5.0, reviews: 188, iconBg: 'bg-purple-100 text-purple-500', borderColor: 'border border-purple-200', shadowColor: 'shadow-[0_4px_12px_rgba(147,51,234,0.25)]' },
  { icon: HeartPlus, logo: img1, name: 'PowerHouse', rating: 5.0, reviews: 193, iconBg: 'bg-red-100 text-red-500', borderColor: 'border border-red-200', shadowColor: 'shadow-[0_4px_12px_rgba(220,38,38,0.25)]' },
  { icon: Utensils, logo: img9, name: 'Savory Spot', rating: 4.6, reviews: 176, iconBg: 'bg-orange-100 text-orange-600', borderColor: 'border border-orange-200', shadowColor: 'shadow-[0_4px_12px_rgba(234,88,12,0.25)]' },
  { icon: HeartPlus, logo: img2, name: 'IronFit Gym', rating: 4.4, reviews: 128, iconBg: 'bg-red-100 text-red-600', borderColor: 'border border-red-200', shadowColor: 'shadow-[0_4px_12px_rgba(220,38,38,0.25)]' },
  { icon: Hotel, logo: img5, name: 'OceanView', rating: 5.0, reviews: 98, iconBg: 'bg-sky-100 text-sky-500', borderColor: 'border border-sky-100', shadowColor: 'shadow-[0_4px_12px_rgba(22,163,74,0.25)]' },
  { icon: GraduationCap, logo: img7, name: 'Star Academy', rating: 5.0, reviews: 157, iconBg: 'bg-yellow-100 text-yellow-600', borderColor: 'border border-yellow-200', shadowColor: 'shadow-[0_4px_12px_rgba(220,38,38,0.25)]' },
  { icon: Utensils, logo: img9, name: 'TastyBite', rating: 4.9, reviews: 210, iconBg: 'bg-orange-100 text-orange-600', borderColor: 'border border-orange-200', shadowColor: 'shadow-[0_4px_12px_rgba(234,88,12,0.25)]' },
  { icon: ShoppingCart, logo: img4, name: 'ShopEase', rating: 4.3, reviews: 249, iconBg: 'bg-purple-100 text-purple-600', borderColor: 'border border-purple-200', shadowColor: 'shadow-[0_4px_12px_rgba(147,51,234,0.25)]' },
  { icon: Hotel, logo: img6, name: 'Luxury Stay', rating: 3.5, reviews: 134, iconBg: 'bg-sky-100 text-sky-500', borderColor: 'border border-sky-100', shadowColor: 'shadow-[0_4px_12px_rgba(22,163,74,0.25)]' },
  { icon: GraduationCap, logo: img8, name: 'Ace College', rating: 2.8, reviews: 122, iconBg: 'bg-yellow-100 text-yellow-600', borderColor: 'border border-yellow-200', shadowColor: 'shadow-[0_4px_12px_rgba(220,38,38,0.25)]' },
]

</script>
