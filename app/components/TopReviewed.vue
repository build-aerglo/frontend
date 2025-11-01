<template>
  <section class="bg-white dark:bg-gray-900 pb-5 pt-10">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="relative mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-left text-[#008253] dark:text-white">
          Top Reviewed
        </h2>
        <a
          href="#hero"
          class="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:underline dark:text-gray-300"
        >
          See more
        </a>
      </div>

      <!-- Card Grid -->
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div
            v-for="(card, index) in cards"
            :key="index"
            class="relative bg-gray-50 dark:bg-gray-800 p-2 rounded-xl transform transition-transform duration-150 ease-out hover:-translate-y-1.5"
            :class="[card.borderColor, card.shadowColor]"
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
              placeholder="blur"
            />
          </div>

          <!-- Business name -->
          <h3 class="text-lg font-semibold text-center text-gray-800 dark:text-white">
            {{ card.name }}
          </h3>

          <!-- SVG Ratings -->
          <div class="flex items-center justify-center space-x-1">
            <span v-for="n in 5" :key="n">
              <svg
                v-if="n <= card.rating"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-gold"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 .587l3.668 7.431L24 9.753l-6 5.847L19.335 24 12 20.201 4.665 24 6 15.6 0 9.753l8.332-1.735z"
                />
              </svg>

              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-gray-300 dark:text-gray-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 .587l3.668 7.431L24 9.753l-6 5.847L19.335 24 12 20.201 4.665 24 6 15.6 0 9.753l8.332-1.735z"
                />
              </svg>
            </span>
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

import { Dumbbell, Utensils, Hotel, School, ShoppingCart } from 'lucide-vue-next'
import img1 from '/images/gym1.jpg'
import img2 from '/images/gym2.jpg'
import img3 from '/images/shop1.jpg'
import img4 from '/images/shop2.jpg'
import img5 from '/images/hot1.jpg'
import img6 from '/images/hot2.jpg'
import img7 from '/images/sch1.jpg'
import img8 from '/images/sch2.jpg'
import img9 from '/images/res1.jpg'

const cards = [
  { icon: ShoppingCart, logo: img3, name: 'UrbanMart', rating: 5, reviews: 188, iconBg: 'bg-purple-100 text-purple-600', borderColor: 'border border-purple-200', shadowColor: 'shadow-[0_4px_12px_rgba(147,51,234,0.25)]' },
  { icon: Dumbbell, logo: img1, name: 'PowerHouse', rating: 5, reviews: 193, iconBg: 'bg-blue-100 text-blue-600', borderColor: 'border border-blue-200', shadowColor: 'shadow-[0_4px_12px_rgba(37,99,235,0.25)]' },
  { icon: Utensils, logo: img9, name: 'Savory Spot', rating: 4, reviews: 176, iconBg: 'bg-orange-100 text-orange-600', borderColor: 'border border-orange-200', shadowColor: 'shadow-[0_4px_12px_rgba(234,88,12,0.25)]' },
  { icon: Dumbbell, logo: img2, name: 'IronFit Gym', rating: 4, reviews: 128, iconBg: 'bg-blue-100 text-blue-600', borderColor: 'border border-blue-200', shadowColor: 'shadow-[0_4px_12px_rgba(37,99,235,0.25)]' },
  { icon: Hotel, logo: img5, name: 'OceanView', rating: 5, reviews: 98, iconBg: 'bg-green-100 text-green-600', borderColor: 'border border-green-200', shadowColor: 'shadow-[0_4px_12px_rgba(22,163,74,0.25)]' },
  { icon: School, logo: img7, name: 'Star Academy', rating: 5, reviews: 157, iconBg: 'bg-red-100 text-red-600', borderColor: 'border border-red-200', shadowColor: 'shadow-[0_4px_12px_rgba(220,38,38,0.25)]' },
  { icon: Utensils, logo: img9, name: 'TastyBite', rating: 5, reviews: 210, iconBg: 'bg-orange-100 text-orange-600', borderColor: 'border border-orange-200', shadowColor: 'shadow-[0_4px_12px_rgba(234,88,12,0.25)]' },
  { icon: ShoppingCart, logo: img4, name: 'ShopEase', rating: 4, reviews: 249, iconBg: 'bg-purple-100 text-purple-600', borderColor: 'border border-purple-200', shadowColor: 'shadow-[0_4px_12px_rgba(147,51,234,0.25)]' },
  { icon: Hotel, logo: img6, name: 'Luxury Stay', rating: 4, reviews: 134, iconBg: 'bg-green-100 text-green-600', borderColor: 'border border-green-200', shadowColor: 'shadow-[0_4px_12px_rgba(22,163,74,0.25)]' },
  { icon: School, logo: img8, name: 'Ace College', rating: 4, reviews: 122, iconBg: 'bg-red-100 text-red-600', borderColor: 'border border-red-200', shadowColor: 'shadow-[0_4px_12px_rgba(220,38,38,0.25)]' },
]

</script>
