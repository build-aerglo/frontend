<template>
  <section class="bg-white dark:bg-gray-900 py-16">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-[#008253] dark:text-white">
          Top Reviewed
        </h2>
      </div>

      <!-- Card Grid -->
      <div
        class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      >
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="relative bg-gray-50 dark:bg-gray-800 p-6 shadow hover:shadow-lg hover:-translate-y-1 transition duration-100"
          :class="card.borderColor"
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

          <!-- Ratings -->
          <div class="flex items-center justify-center mt-2 space-x-1"> 
            <span
              v-for="n in 5"
              :key="n"
              class="text-gold"
            >
              <i
                class="fas"
                :class="n <= card.rating ? 'fa-star' : 'fa-star text-gray-300 dark:text-gray-600'"
              ></i>
            </span>
           </div>
           <div class="text-center text-[80%]" >
            <p class=" text-gray-400 dark:text-gray-300">
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
  { icon: ShoppingCart, logo: img4 , name: 'UrbanMart', rating: 5, reviews: 188, iconBg: 'bg-purple-100 text-purple-600', borderColor: 'border-1 border-purple-200 ' },
  { icon: Dumbbell, logo: img2, name: 'PowerHouse', rating: 5, reviews: 193, iconBg: 'bg-blue-100 text-blue-600',  borderColor: 'border-1 border-blue-200 ' },
  { icon: Utensils, logo: img9, name: 'Savory Spot', rating: 4, reviews: 176, iconBg: 'bg-orange-100 text-orange-600',  borderColor: 'border-1 border-orange-200 ' },
  { icon: Dumbbell, logo: img1, name: 'IronFit Gym', rating: 4, reviews: 128, iconBg: 'bg-blue-100 text-blue-600',  borderColor: 'border-1 border-blue-200 ' },
  { icon: Hotel, logo: img6, name: 'OceanView', rating: 5, reviews: 98, iconBg: 'bg-green-100 text-green-600',  borderColor: 'border-1 border-green-200  ' },
  { icon: School, logo: img7, name: 'Star Academy', rating: 5, reviews: 157, iconBg: 'bg-red-100 text-red-600',  borderColor: 'border-1 border-red-200 ' },
  { icon: Utensils, logo: img9, name: 'TastyBite', rating: 5, reviews: 210, iconBg: 'bg-orange-100 text-orange-600',  borderColor: 'border-1 border-orange-200 '},
  { icon: ShoppingCart, logo: img3, name: 'ShopEase', rating: 4, reviews: 249, iconBg: 'bg-purple-100 text-purple-600',  borderColor: 'border-1 border-purple-200 ' },
  { icon: Hotel, logo: img5, name: 'Luxury Stay', rating: 4, reviews: 134, iconBg: 'bg-green-100 text-green-600',  borderColor: 'border-1 border-green-200 ' },
  { icon: School, logo: img8, name: 'Ace College', rating: 4, reviews: 122, iconBg: 'bg-red-100 text-red-600',  borderColor: 'border-1 border-red-200 ' },
]
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
</style>
