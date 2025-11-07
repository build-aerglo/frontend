<template>
    
     <!--Header-->
    <NavBarProfile/>
    <!--Header-->

  <main class="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 flex flex-col items-center text-center">
    <!-- Header Section -->
    <header class="bg-white w-[90%]  dark:bg-gray-800 shadow-md py-10 px-6 sm:px-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
      <!-- Profile Info -->
      <div class="flex flex-col items-start gap-4 w-full sm:w-auto text-left">
  <!-- Profile Image -->
  <div class="relative group self-start">
    <img
      :src="user.avatar"
      alt="Avatar"
      class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-green-600 shadow-md"
    />
    <label
      for="avatarUpload"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
    >
      <i class="pi pi-camera text-white text-xl"></i>
    </label>
    <input
      id="avatarUpload"
      type="file"
      class="hidden"
      accept="image/*"
      @change="handleAvatarUpload"
    />
  </div>

  <!-- Profile Info -->
  <div class="space-y-1">
    <h1 class="text-xl font-semibold">{{ user.username }}</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.phone }}</p>
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.address }}</p>
  </div>
</div>


      <!-- Stats Summary -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center w-full sm:w-auto">
        <div>
          <p class="text-2xl font-bold text-green-600">{{ user.stats.reviews }}</p>
          <span class="text-gray-500 text-sm">Reviews</span>
        </div>
        <div>
          <p class="text-2xl font-bold text-green-600">{{ user.stats.helpfulVotes }}</p>
          <span class="text-gray-500 text-sm">Helpful Votes</span>
        </div>
        <div>
          <p class="text-2xl font-bold text-green-600">{{ user.stats.points }}</p>
          <span class="text-gray-500 text-sm">Points</span>
        </div>
        <div>
          <p class="text-2xl font-bold text-green-600">{{ user.stats.badges.length }}</p>
          <span class="text-gray-500 text-sm">Badges</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <section class="px-6 sm:px-12 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Left Column -->
      <div class="space-y-8">
        <!-- Top Reviewed Sectors -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <i class="pi pi-briefcase text-green-600"></i> Top 3 Reviewed Sectors
          </h2>
          <ul class="space-y-3">
            <li v-for="sector in user.topSectors" :key="sector" class="flex justify-between">
              <span>{{ sector }}</span>
              <i class="pi pi-star text-yellow-400"></i>
            </li>
          </ul>
        </div>

        <!-- Top Reviewed Locations -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <i class="pi pi-map-marker text-green-600"></i> Top 5 Reviewed Locations
          </h2>
          <ul class="space-y-3">
            <li v-for="loc in user.topLocations" :key="loc" class="flex justify-between">
              <span>{{ loc }}</span>
              <i class="pi pi-star text-yellow-400"></i>
            </li>
          </ul>
        </div>

        <!-- Badges -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <i class="pi pi-trophy text-green-600"></i> Badges Earned
          </h2>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="badge in user.stats.badges"
              :key="badge"
              class="bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ badge }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right Column: All Reviews -->
      <div class="lg:col-span-2 text-left">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
            <i class="pi pi-comments text-green-600"></i> All Reviews Posted
          </h2>
          <div class="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
            <div
              v-for="review in user.reviews"
              :key="review.id"
              class="border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <h3 class="font-semibold text-gray-800 dark:text-white">{{ review.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ review.location }} • {{ review.date }}</p>
              <p class="mt-2 text-gray-700 dark:text-gray-300">{{ review.content }}</p>
              <div class="flex items-center gap-2 mt-2">
                <i v-for="n in review.rating" :key="n" class="pi pi-star-fill text-yellow-400 text-sm"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  avatar: 'app/assets/images/1.png',
  username: 'Jane Doe',
  phone: '+234 234-9876-888',
  email: 'janedoe@mail.com',
  address: '13 Maple Street, Ikeja, Lagos',
  stats: {
    reviews: 3,
    helpfulVotes: 128,
    points: 720,
    badges: ['Top Reviewer', 'Helpful Member', 'Community Star']
  },
  topSectors: ['Restaurants', 'Hotels', 'Electronics'],
  topLocations: ['Abulegba', 'Ikorodu', 'Oju elegba', 'Ikeja', 'Abeokuta'],
  reviews: [
    {
      id: 1,
      title: 'Amazing Stay at Oceanview Hotel',
      location: 'Ikeja',
      date: 'Oct 20, 2025',
      rating: 5,
      content:
        'Had a wonderful stay with excellent service and beautiful ocean views. Highly recommend!'
    },
    {
      id: 2,
      title: 'Good but pricey headphones',
      location: 'BestBuy - Abeokuta',
      date: 'Sep 18, 2025',
      rating: 4,
      content: 'Sound quality is excellent, but the price feels a bit high for what it offers.'
    },
    {
      id: 3,
      title: 'Delicious food, slow service',
      location: 'Sunset Diner',
      date: 'Aug 30, 2025',
      rating: 3,
      content: 'Loved the food! But the waiting time was longer than expected.'
    }
  ]
})

// Avatar upload
const handleAvatarUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => (user.value.avatar = reader.result as string)
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
/* Custom scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  border-radius: 10px;
}
</style>
