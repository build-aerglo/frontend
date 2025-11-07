<template>
  <section class="container mx-auto my-12 px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div
        v-for="(card, idx) in cards"
        :key="card.id"
        class="relative bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center"
      >
        <!-- Close Icon with hover tooltip -->
        <button
          class="absolute top-1 right-1 text-gray-900 hover:text-[#008253]"
          @click="closeCard(idx)"
          :aria-label="'Close suggestion for ' + card.name"
          title="close suggestion"
        >
          <i class="pi pi-times text-sm"></i>
        </button>

        <!-- Image (takes ~1/3 of the card visually) -->
        <div class="w-full h-40 mb-4">
          <img
            :src="card.image"
            :alt="card.name"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>

        <!-- Business Name -->
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 text-center">
          {{ card.name }}
        </h3>

        <!-- Question -->
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center">
          Do you recommend this business?
        </p>

        <!-- Star Ratings (clickable) -->
        <div class="flex justify-center space-x-1">
          <i
            v-for="n in 5"
            :key="n"
            class="pi cursor-pointer text-xl text-gold transition-colors duration-200"
            :class="card.rating >= n ? 'pi-star-fill' : 'pi-star'"
            @click="setRating(idx, n)"
            @keydown.enter.prevent="setRating(idx, n)"
            role="button"
            tabindex="0"
            :aria-label="`Set ${n} star(s) for ${card.name}`"
          ></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import img1 from '~/assets/images/cafe.jpg'
import img2 from '~/assets/images/techhub.jpg'
import img3 from '~/assets/images/spa.jpg'
import img4 from '~/assets/images/store.jpg'


interface Card {
  id: number
  name: string
  image: string
  rating: number
}

const cards = ref<Card[]>([
  { id: 1, name: 'Sunrise Café', image:img1, rating: 0 },
  { id: 2, name: 'TechHub Innovations', image: img2, rating: 0 },
  { id: 3, name: 'GreenLeaf Spa', image: img3, rating: 0 },
  { id: 4, name: 'Urban Styles', image: img4, rating: 0 }
])

function setRating(cardIndex: number, value: number) {
  const c = cards.value[cardIndex]
  if (!c) return
  // toggle: clicking same star again sets to 0
  c.rating = c.rating === value ? 0 : value
}

function closeCard(index: number) {
  // remove card from array
  cards.value.splice(index, 1)
}
</script>

<style scoped>
button i {
  transition: transform 0.18s ease;
}
button:hover i {
  transform: rotate(0deg);
}
</style>
