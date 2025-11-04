<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
    <div class="max-w-6xl mx-auto space-y-8">
      
      <!-- Profile Header -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 flex flex-col items-center text-center">
        <!-- Avatar -->
        <img
          src="assets/images/1.png"
          alt="User Avatar"
          class="w-28 h-28 rounded-full object-cover mb-3 border-4 border-[#008253]"
        />

        <!-- User Info -->
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          {{ user.username }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-2">
          📞 {{ user.phone }} | ✉️ {{ user.email }} | 📍 {{ user.address }}
        </p>

        <!-- Buttons -->
        <div class="mt-4 flex flex-wrap justify-center gap-3">
          <button
            @click="openEditModal = true"
            class="px-4 py-2 bg-[#008253] text-white rounded-lg hover:bg-[#006b44] transition"
          >
            Edit Profile
          </button>
          <button
            @click="goToSettings"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Settings
          </button>
          <button
            @click="logout"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="bg-white dark:bg-gray-800 shadow rounded-xl p-5 text-center hover:shadow-lg transition"
        >
          <h3 class="text-xl font-semibold text-[#008253]">{{ stat.label }}</h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
        <h3 class="text-xl font-semibold text-[#008253] mb-4">All Reviews</h3>
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li
            v-for="(review, i) in reviews"
            :key="i"
            class="py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition px-2"
          >
            <p class="text-gray-700 dark:text-gray-300">{{ review.text }}</p>
            <span class="text-sm text-gray-500 dark:text-gray-400">📍 {{ review.location }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div
      v-if="openEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-96 text-center">
        <h3 class="text-lg font-semibold mb-4 text-[#008253]">Edit Profile</h3>

        <input
          type="text"
          placeholder="Enter new username"
          v-model="user.username"
          class="w-full px-3 py-2 border rounded-md mb-3 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Enter new phone"
          v-model="user.phone"
          class="w-full px-3 py-2 border rounded-md mb-3 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="email"
          placeholder="Enter new email"
          v-model="user.email"
          class="w-full px-3 py-2 border rounded-md mb-3 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Enter new address"
          v-model="user.address"
          class="w-full px-3 py-2 border rounded-md mb-4 dark:bg-gray-700 dark:border-gray-600"
        />

        <button
          @click="saveProfile"
          class="w-full py-2 bg-[#008253] text-white rounded-lg hover:bg-[#006b44] transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openEditModal = ref(false)

const user = ref({
  username: 'Erhovwosere Precious',
  phone: '+234 801 234 5678',
  email: 'erhovwosere@example.com',
  address: 'Warri, Delta State, Nigeria',
})

const stats = ref([
  { label: 'Total Reviews', value: 27 },
  { label: 'Helpful Votes', value: 142 },
  { label: 'Badges Earned', value: 5 },
  { label: 'Points Earned', value: 860 },
  { label: 'Top 3 Sectors', value: 'Food, Hotels, Tech' },
  { label: 'Top 5 Locations', value: 'Warri, Lagos, Abuja, Benin, PH' },
])

const reviews = ref([
  { text: 'Excellent service at XYZ restaurant!', location: 'Warri' },
  { text: 'Loved the clean rooms at ABC Hotel.', location: 'Lagos' },
  { text: 'The delivery experience could be better.', location: 'Abuja' },
])

const goToSettings = () => {
  navigateTo('/settings')
}

const logout = () => {
  console.log('Logging out...')
  // Add real logout logic (clear token, redirect)
  navigateTo('/login')
}

const saveProfile = () => {
  openEditModal.value = false
  console.log('Profile updated:', user.value)
}
</script>
