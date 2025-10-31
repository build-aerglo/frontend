<template>
  <section class="bg-white dark:bg-gray-900 py-16">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="relative mb-12 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-[#008253] dark:text-white">
          Top Reviewed
        </h2>
        <a
          href="/"
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
          class="relative bg-gray-50 dark:bg-gray-800 p-3 shadow hover:shadow-md hover:-translate-y-1.5 transform transition-transform duration-150 ease-out scale-[0.9]"
          :class="card.borderColor"
          style="will-change: transform;"
        >
          <!-- Top-left icon -->
          <div
            class="absolute top-3 left-3 p-2 rounded-lg"
            :class="card.iconBg"
          >
            <component :is="card.icon" class="w-5 h-5" />
          </div>

          <!-- Logo -->
          <div class="flex justify-center mt-6 mb-3">
            <img
              :src="card.logo"
              alt="logo"
              class="w-16 h-16 rounded-full object-cover"
            />
          </div>

          <!-- Business name -->
          <h3 class="text-lg font-semibold text-center text-gray-800 dark:text-white">
            {{ card.name }}
          </h3>

          <!-- SVG Ratings -->
          <div class="flex items-center justify-center mt-2 space-x-1">
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
import { Dumbbell, Utensils, Hotel, School, ShoppingCart } from 'lucide-vue-next'
import img1 from '~/assets/images/gym1.jpg'
import img2 from '~/assets/images/gym2.jpg'
import img3 from '~/assets/images/shop1.jpg'
import img4 from '~/assets/images/shop2.jpg'
import img5 from '~/assets/images/hotel1.jpg'
import img6 from '~/assets/images/hotel2.jpg'
import img7 from '~/assets/images/school1.jpg'
import img8 from '~/assets/images/school2.png'
import img9 from '~/assets/images/rest1.jpg'

const cards = [
  { icon: ShoppingCart, logo: img4, name: 'UrbanMart', rating: 5, reviews: 188, iconBg: 'bg-purple-100 text-purple-600', borderColor: 'border border-purple-200' },
  { icon: Dumbbell, logo: img2, name: 'PowerHouse', rating: 5, reviews: 193, iconBg: 'bg-blue-100 text-blue-600', borderColor: 'border border-blue-200' },
  { icon: Utensils, logo: img9, name: 'Savory Spot', rating: 4, reviews: 176, iconBg: 'bg-orange-100 text-orange-600', borderColor: 'border border-orange-200' },
  { icon: Dumbbell, logo: img1, name: 'IronFit Gym', rating: 4, reviews: 128, iconBg: 'bg-blue-100 text-blue-600', borderColor: 'border border-blue-200' },
  { icon: Hotel, logo: img6, name: 'OceanView', rating: 5, reviews: 98, iconBg: 'bg-green-100 text-green-600', borderColor: 'border border-green-200' },
  { icon: School, logo: img7, name: 'Star Academy', rating: 5, reviews: 157, iconBg: 'bg-red-100 text-red-600', borderColor: 'border border-red-200' },
  { icon: Utensils, logo: img9, name: 'TastyBite', rating: 5, reviews: 210, iconBg: 'bg-orange-100 text-orange-600', borderColor: 'border border-orange-200' },
  { icon: ShoppingCart, logo: img3, name: 'ShopEase', rating: 4, reviews: 249, iconBg: 'bg-purple-100 text-purple-600', borderColor: 'border border-purple-200' },
  { icon: Hotel, logo: img5, name: 'Luxury Stay', rating: 4, reviews: 134, iconBg: 'bg-green-100 text-green-600', borderColor: 'border border-green-200' },
  { icon: School, logo: img8, name: 'Ace College', rating: 4, reviews: 122, iconBg: 'bg-red-100 text-red-600', borderColor: 'border border-red-200' },
]
</script>
