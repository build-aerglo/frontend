<template>
  <section class="bg-green-50 dark:bg-gray-900 py-7">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="relative mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-left text-gray-700 dark:text-white">
          Recent Reviews
        </h2>
        <div class="absolute right-0 top-1/2 -translate-y-1/2">
          <div class="flex gap-3">
            <button
              @click="prevSlide"
              class="p-3 rounded-full border border-gray-500 hover:bg-[#008253]/10 text-gray-700 transition"
            >
              <i class="pi pi-chevron-left text-sm"></i>
            </button>
            <button
              @click="nextSlide"
              class="p-3 rounded-full border border-gray-500 hover:bg-[#008253]/10 text-gray-700 transition"
            >
              <i class="pi pi-chevron-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Review Slider -->
      <div class="relative w-full overflow-hidden">
        <div
          class="flex transition-transform duration-700 ease-in-out"
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
                <p class="text-md text-gray-800 dark:text-gray-100 font-semibold">
                  {{ review.business }}
                </p>
                <div class="flex text-gold mb-3">
                  <i v-for="i in 5" :key="i" class="pi pi-star-fill mr-1"></i>
                </div>
                <p class="text-gray-700 dark:text-gray-200 italic">
                  “{{ review.text }}”
                </p>
              </div>
              <div class="flex items-center mt-2">
                <img
                  :src="review.avatar"
                  alt="Avatar"
                  class="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div class="mt-4">
                  <h6 class="font-semibold mb-0 text-gray-900 dark:text-white">
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import img1 from '~/assets/images/1.png'
import img2 from '~/assets/images/2.png'
import img3 from '~/assets/images/3.png'
import img4 from '~/assets/images/4.jpg'

interface Review {
  business: string
  text: string
  avatar: string
  name: string
  time: string
}

const reviews = ref<Review[]>([
  { business: 'OceanView', text: "Ocean View is hands down the best!", avatar: img1, name: 'Nduka John', time: '2 days ago' },
  { business: 'ShopEase', text: "I still can't imagine a better place to shop for everything at once.", avatar: img2, name: 'Eugenia Moore', time: '28 hours ago' },
  { business: 'Tasty Bites', text: "The Sanitation and customer service here is top-notch!", avatar: img3, name: 'Tife Ryan', time: '1 day ago' },
  { business: 'Eazi Travels', text: "Eazi Travels made my trip so much easier and stress-free. I totally recommend!", avatar: img4, name: 'Sarah Betsy', time: '15 minutes ago' },
  { business: 'ShopEase', text: "I still can't imagine a better place to shop for everything at once.", avatar: img2, name: 'Eugenia Moore', time: '28 hours ago' },
  { business: 'Tasty Bites', text: "The Sanitation and customer service here is top-notch!", avatar: img3, name: 'Tife Ryan', time: '1 day ago' },
  { business: 'Eazi Travels', text: "Eazi Travels made my trip so much easier and stress-free. I totally recommend!", avatar: img4, name: 'Sarah Betsy', time: '15 minutes ago' },
  { business: 'Star Academy', text: "A great school with outstanding teaching quality.", avatar: img2, name: 'Sarah Moses', time: '45 minutes ago' },
  { business: 'Paula Motors', text: "Paula Motors make all my journeys so much easier and stress-free!", avatar: img2, name: 'Julia Mamoa', time: '10 minutes ago' },
  { business: 'IronFit Gym', text: "All the motivation and equipment required? It's all at IFG!", avatar: img4, name: 'Faiza Musa', time: '15 minutes ago' },
  { business: 'ShopEase', text: "I still can't imagine a better place to shop for everything at once.", avatar: img2, name: 'Eugenia Moore', time: '28 hours ago' },
  { business: 'Tasty Bites', text: "The Sanitation and customer service here is top-notch!", avatar: img3, name: 'Tife Ryan', time: '1 day ago' },
  { business: 'Eazi Travels', text: "Eazi Travels made my trip so much easier and stress-free. I totally recommend!", avatar: img4, name: 'Sarah Betsy', time: '15 minutes ago' },
])

const currentIndex = ref(0)
const visibleCount = ref(5)
let interval: NodeJS.Timeout

const updateVisibleCount = () => {
  if (window.innerWidth < 768) visibleCount.value = 1
  else if (window.innerWidth < 1024) visibleCount.value = 3
  else visibleCount.value = 5
}

const slideWidthClass = computed(() => {
  if (visibleCount.value === 1) return 'min-w-full'
  if (visibleCount.value === 3) return 'min-w-1/3'
  return 'min-w-[20%]'
})

const nextSlide = () => {
  currentIndex.value =
    (currentIndex.value + 1) % (reviews.value.length - visibleCount.value + 1)
}
const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + (reviews.value.length - visibleCount.value + 1)) %
    (reviews.value.length - visibleCount.value + 1)
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
