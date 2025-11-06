<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header with Sign Out -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <button
          @click="handleSignOut"
          class="flex items-center gap-2 px-4 py-2 text-[#008253] hover:bg-green-50 dark:hover:bg-red-900/20 rounded-lg transition"
        >
          <i class="pi pi-sign-out"></i>
          <span class="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Header Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-8 mb-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div class="flex items-center gap-6">
            <!-- Avatar with Upload -->
            <div class="relative group">
              <img
                :src="user.avatar"
                alt="Profile"
                class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#008253] shadow-lg"
              />
              <label
                for="avatarUpload"
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                <i class="pi pi-camera text-white text-2xl"></i>
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
            <div class="space-y-2">
              <input
                v-if="isEditing"
                v-model="editForm.username"
                type="text"
                class="text-xl font-semibold border-b-2 border-[#008253] focus:outline-none px-2 py-1 bg-transparent dark:text-white"
                placeholder="Username"
              />
              <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ user.username }}
              </h2>
              
              <p class="text-gray-600 dark:text-gray-400">{{ user.email }}</p>
              
              <input
                v-if="isEditing"
                v-model="editForm.phone"
                type="tel"
                class="text-sm text-gray-600 dark:text-gray-400 border-b-2 border-[#008253] focus:outline-none px-2 py-1 w-full bg-transparent"
                placeholder="Phone"
              />
              <p v-else class="text-sm text-gray-600 dark:text-gray-400">{{ user.phone }}</p>
              
              <input
                v-if="isEditing"
                v-model="editForm.address"
                type="text"
                class="text-sm text-gray-600 dark:text-gray-400 border-b-2 border-[#008253] focus:outline-none px-2 py-1 w-full bg-transparent"
                placeholder="Address"
              />
              <p v-else class="text-sm text-gray-600 dark:text-gray-400">{{ user.address }}</p>
            </div>
          </div>

          <!-- Edit/Save Buttons -->
          <div class="flex gap-2">
            <template v-if="isEditing">
              <button
                @click="handleSaveProfile"
                class="flex items-center gap-2 px-4 py-2 bg-[#008253] text-white rounded-lg hover:bg-green-700 transition"
              >
                <i class="pi pi-check"></i>
                Save
              </button>
              <button
                @click="handleEditToggle"
                class="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                <i class="pi pi-times"></i>
                Cancel
              </button>
            </template>
            <button
              v-else
              @click="handleEditToggle"
              class="flex items-center gap-2 px-4 py-2 bg-[#008253] text-white rounded-lg hover:bg-green-700 transition"
            >
              <i class="pi pi-pencil"></i>
              Edit Profile
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <p class="text-3xl font-bold text-[#008253]">{{ user.stats.reviews }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Reviews</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-[#008253]">{{ user.stats.helpfulVotes }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Helpful Votes</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-[#008253]">{{ user.stats.points }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Points</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-[#008253]">{{ user.stats.badges.length }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Badges</p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Sidebar -->
        <div class="space-y-6">
          <!-- Top Sectors -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <i class="pi pi-briefcase text-[#008253]"></i>
              Top Reviewed Sectors
            </h3>
            <ul class="space-y-3">
              <li
                v-for="(sector, idx) in user.topSectors"
                :key="idx"
                class="flex items-center justify-between text-gray-700 dark:text-gray-300"
              >
                <span>{{ sector }}</span>
                <i class="pi pi-star-fill text-yellow-400"></i>
              </li>
            </ul>
          </div>

          <!-- Top Locations -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <i class="pi pi-map-marker text-[#008253]"></i>
              Top Reviewed Locations
            </h3>
            <ul class="space-y-3">
              <li
                v-for="(location, idx) in user.topLocations"
                :key="idx"
                class="flex items-center justify-between text-gray-700 dark:text-gray-300"
              >
                <span>{{ location }}</span>
                <i class="pi pi-star-fill text-yellow-400"></i>
              </li>
            </ul>
          </div>

          <!-- Badges -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <i class="pi pi-trophy text-[#008253]"></i>
              Badges Earned
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(badge, idx) in user.stats.badges"
                :key="idx"
                class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#008253] px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ badge }}
              </span>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 class="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <i class="pi pi-comments text-[#008253]"></i>
              All Reviews Posted
            </h3>
            <div class="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
              <div
                v-for="review in user.reviews"
                :key="review.id"
                class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-gray-900 dark:text-white">{{ review.title }}</h4>
                  <div class="flex gap-1">
                    <i
                      v-for="n in 5"
                      :key="n"
                      class="text-sm"
                      :class="n <= review.rating ? 'pi pi-star-fill text-gold' : 'pi pi-star text-gray-500'"
                    ></i>
                  </div>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {{ review.location }} • {{ review.date }}
                </p>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NuxtImg } from '#components'

interface Review {
  id: number
  title: string
  location: string
  date: string
  rating: number
  content: string
}

interface UserStats {
  reviews: number
  helpfulVotes: number
  points: number
  badges: string[]
}

interface User {
  avatar: string
  username: string
  phone: string
  email: string
  address: string
  stats: UserStats
  topSectors: string[]
  topLocations: string[]
  reviews: Review[]
}

const user = ref<User>({
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  username: 'Jane Doe',
  phone: '+234 810-9876-888',
  email: 'janedoe@mail.com',
  address: '13 Akinwale Street, Ikeja, Lagos',
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
      content: 'Had a wonderful stay with excellent service and beautiful ocean views. Highly recommend!'
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

const isEditing = ref(false)
const editForm = ref({
  username: user.value.username,
  phone: user.value.phone,
  address: user.value.address
})

const handleAvatarUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      user.value.avatar = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleEditToggle = () => {
  if (isEditing.value) {
    // Reset form to current user data if canceling
    editForm.value = {
      username: user.value.username,
      phone: user.value.phone,
      address: user.value.address
    }
  }
  isEditing.value = !isEditing.value
}

const handleSaveProfile = () => {
  user.value.username = editForm.value.username
  user.value.phone = editForm.value.phone
  user.value.address = editForm.value.address
  isEditing.value = false
  
  // TODO: Add API call to save profile
  // Example:
  // await $fetch('/api/profile', {
  //   method: 'PUT',
  //   body: {
  //     username: editForm.value.username,
  //     phone: editForm.value.phone,
  //     address: editForm.value.address
  //   }
  // })
}

const handleSignOut = () => {
  if (confirm('Are you sure you want to sign out?')) {
    console.log('User signed out')
    // TODO: Add sign out logic
    // Example:
    // await $fetch('/api/auth/logout', { method: 'POST' })
    // navigateTo('/login')
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
.scrollbar-thumb-green-600::-webkit-scrollbar-thumb {
  background-color: #008253;
}
.scrollbar-track-gray-200::-webkit-scrollbar-track {
  background-color: #e5e7eb;
}
.dark .scrollbar-track-gray-700::-webkit-scrollbar-track {
  background-color: #008253;
}
</style>

