<template>
  <section class="bg-white dark:bg-gray-900 py-16">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
        <div class="mb-6 md:mb-0">
          <h2 class="text-3xl font-extrabold mt-2 text-[#008253]">Recent Reviews</h2>
          <p class="text-gray-800 mt-3">
            See what people have to say about specific places.
          </p>
          <div class="flex gap-3 mt-6">
            <button
              @click="prevSlide"
              class="p-3 rounded-full border border-gray-300 hover:bg-blue-50 text-[#008253] transition"
            >
              <i class="pi pi-chevron-left text-lg"></i>
            </button>
            <button
              @click="nextSlide"
              class="p-3 rounded-full border border-gray-300 hover:bg-blue-50 text-[#008253] transition"
            >
              <i class="pi pi-chevron-right text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Review Slides -->
        <div class="relative w-full md:w-2/3 overflow-hidden">
          <div
            class="flex transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div
              v-for="(review, index) in reviews"
              :key="index"
              class="min-w-full p-6"
            >
              <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md p-6 h-full flex flex-col justify-between">
                <div>
                  <p class="text-md text-gray-800">{{ review.business }}</p>
                  <div class="flex text-gold mb-4">
                    <i v-for="i in 5" :key="i" class="pi pi-star-fill mr-1"></i>
                  </div>
                  <p class="text-gray-700 dark:text-white mb-4 italic">
                    “{{ review.text }}”
                  </p>
                </div>
                <div class="flex items-center mt-4">
                  <img
                    :src="review.avatar"
                    alt="Avatar"
                    class="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h6 class="font-sm text-gray-900 dark:text-white">
                      {{ review.name }}
                    </h6>
                  </div>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Review {
  business: string
  text: string
  avatar: string
  name: string
  
}

const reviews = ref<Review[]>([
  {
    business: 'Comfy Airbnb',
    text: "Comfy Airbnb is hands down the best!",
    avatar: '/assets/images/1.png',
    name: 'Nduka John',  
  },
  {
    business: 'The Mall',
    text: "I still can't imagine a better place to shop for everything at once.",
    avatar: '/assets/images/2.png',
    name: 'Eugenia Moore',
    
  },
  {
    business: 'The Pork Place',
    text: "The Sanitation and customer service here is top-notch!",
    avatar: '/assets/images/3.png',
    name: 'Tife Ryan',
    
  },
  {
    business: 'Eazi Travels',
    text: "Eazi Travels made my trip so much easier and stress-free. I totally recommend!",
    avatar: '/assets/images/ONE.jpg',
    name: 'Sarah Betsy',
  }
])

const currentIndex = ref(0)
let interval: NodeJS.Timeout

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % reviews.value.length
}

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + reviews.value.length) % reviews.value.length
}

onMounted(() => {
  interval = setInterval(nextSlide, 4000) // auto slide every 4s
})

onBeforeUnmount(() => clearInterval(interval))
</script>
