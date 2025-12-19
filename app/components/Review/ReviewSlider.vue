<template>
  <section class="bg-purple-50 py-7">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="relative mb-6">
        <h2 class="text-2xl md:text-3xl font-demibold text-left text-gray-700 dark:text-white">
          Recent Reviews
        </h2>
        <div class="absolute right-0 top-1/2 -translate-y-1/2">
          <div class="flex gap-3">
            <button
              @click="prevSlide"
              class="p-3 rounded-full border border-slate-900 hover:bg-[#008253]/10 text-slate-800 transition"
            >
              <i class="pi pi-chevron-left text-sm"></i>
            </button>
            <button
              @click="nextSlide"
              class="p-3 rounded-full border border-slate-900 hover:bg-[#008253]/10 text-slate-800 transition"
            >
              <i class="pi pi-chevron-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Review Slider -->
      <div class="relative w-full overflow-hidden">
        <div
          class="flex ease-in-out"
          :class="isTransitioning ? 'transition-transform duration-700' : ''"
          :style="{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }"
        >
          <div
            v-for="(review, index) in reviews"
            :key="index"
            :class="slideWidthClass"
            class="p-2"
          >
            <div
              class="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md p-6 h-full flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <p class="text-lg text-slate-800 dark:text-gray-100 font-semibold">
                  {{ review.business }}
                </p>
              <div class="flex mb-3">
                 <Stars
                    v-for="n in 5"
                    :key="n"
                    :value="review.rating - (n - 1)"
                    :color-level="Math.ceil(review.rating)"
                    class="w-5 h-5"
                  />
                </div>
                <p class="text-gray-500 dark:text-gray-200 italic">
                  “{{ review.text }}”
                </p>
              </div>
              <div class="flex items-center mt-2">
                <NuxtImg
                  :src="review.avatar"
                  alt="Avatar"
                  format="webp"
                  class="w-12 h-12 rounded-full object-cover mr-2"
                  loading="lazy"
                  :placeholder="false"
                    />
                <div class="mt-4">
                  <h6 class="font-semibold mb-0 text-gray-700 dark:text-white">
                    {{ review.name }}
                  </h6>
                  <p class="text-gray-400 text-sm">{{ review.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NuxtImg } from '#components'
import { ref, computed, onMounted, onBeforeUnmount,} from 'vue'

import img1 from '/images/profile-images/1.png'
import img2 from '/images/profile-images/2.png'
import img3 from '/images/profile-images/3.png'
import img4 from '/images/profile-images/4.jpg'

interface Review {
  business: string
  rating: number
  text: string
  avatar: string
  name: string
  time: string
}

const baseReviews: Review[] = [
  { business: 'OceanView',rating: 4.6, text: "Ocean View is hands down the best!", avatar: img1, name: 'Nduka John', time: '2 days ago' },
  { business: 'ShopEase',rating: 4.0, text: "I still can't imagine a better place to shop for everything at once.", avatar: img2, name: 'Eugenia Moore', time: '28 hours ago' },
  { business: 'Tasty Bites', rating: 5.0, text: "The Sanitation and customer service here is top-notch!", avatar: img3, name: 'Tife Ryan', time: '1 day ago' },
  { business: 'Eazi Travels', rating: 3.8, text: "Eazi Travels made my trip so much easier and stress-free. I totally recommend!", avatar: img4, name: 'Sarah Betsy', time: '15 minutes ago' },
  { business: 'Star Academy', rating: 4.5, text: "A great school with outstanding teaching quality.", avatar: img2, name: 'Sarah Moses', time: '45 minutes ago' },
  { business: 'Paula Motors', rating: 4.9, text: "Paula Motors make all my journeys so much easier and stress-free!", avatar: img2, name: 'Julia Mamoa', time: '10 minutes ago' },
  { business: 'IronFit Gym', rating: 5.0, text: "All the motivation and equipment required? It's all at IFG!", avatar: img4, name: 'Faiza Musa', time: '15 minutes ago' },
]

const visibleCount = ref(5)
const currentIndex = ref(visibleCount.value) // start after prepended clones
const isTransitioning = ref(true)
let interval: NodeJS.Timeout

const updateVisibleCount = () => {
  if (window.innerWidth < 640) visibleCount.value = 1
  else if (window.innerWidth < 1006) visibleCount.value = 3
  else visibleCount.value = 5
}

// Clone slides for infinite looping
const reviews = computed(() => {
  return [
    ...baseReviews.slice(-visibleCount.value),
    ...baseReviews,
    ...baseReviews.slice(0, visibleCount.value)
  ]
})

const slideWidthClass = computed(() => {
  if (visibleCount.value === 1) return 'min-w-full'
  if (visibleCount.value === 3) return 'min-w-1/3'
  return 'min-w-[20%]'
})

const nextSlide = async () => {
  isTransitioning.value = true
  currentIndex.value++
  if (currentIndex.value === baseReviews.length + visibleCount.value) {
    // jump instantly back to real first slide
    await new Promise(r => setTimeout(r, 700)) // wait for transition
    isTransitioning.value = false
    currentIndex.value = visibleCount.value
  }
}

const prevSlide = async () => {
  isTransitioning.value = true
  currentIndex.value--
  if (currentIndex.value === 0) {
    await new Promise(r => setTimeout(r, 700))
    isTransitioning.value = false
    currentIndex.value = baseReviews.length
  }
}

onMounted(() => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  interval = setInterval(nextSlide, 3000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
  window.removeEventListener('resize', updateVisibleCount)
})
</script>
