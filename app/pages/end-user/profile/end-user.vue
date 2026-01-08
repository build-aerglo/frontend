<template>
  <div class="min-h-screen bg-green-50">
    <NavBarProfile/>

    <!-- Loading State -->
    <div v-if="loading && !profileData" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-[#008253] mb-4"></i>
        <p class="text-gray-600">Loading profile...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !profileData" class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="pi pi-exclamation-triangle text-4xl text-red-600 mb-4"></i>
        <h3 class="text-lg font-semibold text-red-800 mb-2">Failed to Load Profile</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadProfile"
          class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Edit Profile View -->
    <div v-else-if="isEditingProfile && profileData" class="max-w-2xl mx-auto px-4 py-8">
      <div class="mb-6">
        <button 
          @click="cancelEdit"
          class="text-gray-700 font-medium flex items-center gap-2 hover:text-gray-900"
        >
          <i class="pi pi-arrow-left"></i>
          <span>Back to Profile</span>
        </button>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm p-8 space-y-3">
        <div>
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            class="hidden" 
            @change="handleFileUpload"
          />
          <div class="mt-2 flex flex-col items-center">
            <img
              :src="editForm.profileImageUrl || defaultProfileImage"
              alt="Profile Preview"
              class="w-24 h-24 rounded-full object-cover cursor-pointer border-2 border-gray-200 hover:opacity-80"
              @click="selectImage"
              @error="handleImageError"
            />
            <p class="text-xs text-gray-500 mt-1">Click image to change</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-user mr-2"></i>
            Username
          </label>
          <input
            v-model="editForm.username"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-phone mr-2"></i>
            Phone Number
          </label>
          <input
            v-model="editForm.phoneNumber"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-home mr-2"></i>
            Address
          </label>
          <input
            v-model="editForm.address"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
          />
        </div>

        <div class="pt-2 flex gap-3 justify-center items-center">
          <button
            @click="handleSaveProfile"
            :disabled="saving"
            class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="saving" class="pi pi-spin pi-spinner mr-2"></i>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
          <button
            @click="cancelEdit"
            :disabled="saving"
            class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <!-- Save Success Message -->
        <div v-if="saveSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <i class="pi pi-check-circle text-green-600 mr-2"></i>
          <span class="text-green-700">Profile updated successfully!</span>
        </div>

        <!-- Save Error Message -->
        <div v-if="saveError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
          <span class="text-red-700">{{ saveError }}</span>
        </div>
      </div>
    </div>

    <!-- Main Profile View -->
    <div v-else-if="profileData">
      <!-- User Profile Section -->
      <div class="bg-gradient-to-b from-blue-50 to-white py-8"> 
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            <!-- Profile Image -->
            <img 
              :src="profileData.profileImageUrl || defaultProfileImage"
              alt="Profile"
              class="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
              @error="handleImageError"
            />

            <!-- Text Section -->
            <div class="space-y-2">
              <div class="flex items-center text-bold text-2xl justify-center md:justify-start text-gray-800">
                <span>{{ profileData.username }}</span>
              </div>
              
              <div v-if="profileData.phoneNumber" class="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <i class="pi pi-phone text-gray-400"></i>
                <span>{{ profileData.phoneNumber }}</span>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <i class="pi pi-envelope text-gray-400"></i>
                <span class="text-sm sm:text-base">{{ profileData.email }}</span>
              </div>

              <div v-if="profileData.address" class="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <i class="pi pi-home text-gray-400"></i>
                <span class="text-sm">{{ profileData.address }}</span>
              </div>

              <button
                @click="startEdit"
                class="mt-2 text-blue-500 hover:text-[#008253] flex items-center gap-2 justify-center md:justify-start"
              >
                <i class="pi pi-pencil text-xs"></i>
                <span class="text-sm">Edit Profile</span>
              </button>
              <!-- Mobile Badges (360px and up) - Horizontal beside user info -->
<div class="mt-4 flex gap-2 overflow-x-auto pb-2 md:hidden max-[359px]:hidden">
  <div 
    v-for="(badge, idx) in badges" 
    :key="`mobile-${idx}`" 
    :class="[badge.color, 'rounded-lg p-2 flex items-center gap-2 whitespace-nowrap flex-shrink-0']"
  >
    <i :class="[badge.icon, 'text-lg']"></i>
    <span class="font-medium text-gray-700 text-xs">{{ badge.name }}</span>
  </div>
</div>
              <!-- Small Mobile Badges (under 360px) - Stacked under user info -->
              <div class="mt-4 hidden max-[359px]:flex max-[359px]:flex-col gap-2">
                <div 
                  v-for="(badge, idx) in badges" 
                  :key="`small-mobile-${idx}`" 
                  :class="[badge.color, 'rounded-lg p-2 flex items-center gap-2']"
                >
                  <i :class="[badge.icon, 'text-base']"></i>
                  <span class="font-medium text-gray-700 text-xs">{{ badge.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Bar (Desktop/Tablet) -->
      <div class="bg-white border-b border-gray-200 sticky top-16 z-40 hidden md:block">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-wrap items-center justify-between py-4 gap-4">
            <div class="flex flex-wrap gap-2 sm:gap-4">
              <button
                @click="activeTab = 'your-reviews'"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition',
                  activeTab === 'your-reviews'
                    ? 'bg-[#008253] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                <i class="pi pi-star mr-2"></i>
                Your Reviews
              </button>
              <button
                @click="activeTab = 'recent-reviews'"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition',
                  activeTab === 'recent-reviews'
                    ? 'bg-[#008253] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                <i class="pi pi-clock mr-2"></i>
                Recent Reviews
              </button>
              <button
                @click="activeTab = 'rewards'"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition',
                  activeTab === 'rewards'
                    ? 'bg-[#008253] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                <i class="pi pi-star mr-2"></i>
                Rewards
              </button>
              <button
                @click="activeTab = 'notifications'"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition',
                  activeTab === 'notifications'
                    ? 'bg-[#008253] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                <i class="pi pi-bell mr-2"></i>
                Notifications
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- Left Column -->
          <div class="md:col-span-3 space-y-6">
            <!-- Badges -->
            <div class="bg-white rounded-xl shadow-sm p-6 hidden md:block">
              <h5 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="pi pi-trophy text-gold"></i>
                Your Badges
              </h5>
              <div class="space-y-3">
                <div 
                  v-for="(badge, idx) in badges" 
                  :key="idx" 
                  :class="[badge.color, 'rounded-lg p-3 flex items-center gap-3']"
                >
                  <i :class="[badge.icon, 'text-2xl']"></i>
                  <span class="font-medium text-gray-700 text-sm">{{ badge.name }}</span>
                </div>
              </div>
            </div>

            <!-- Top Categories -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h5 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="pi pi-star-fill text-gold"></i>
                Top Reviewed Categories
              </h5>
              <ul class="space-y-2">
                <li 
                  v-for="(cat, idx) in topCategories" 
                  :key="idx" 
                  class="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span class="text-gold">●</span>
                  <span>{{ cat }}</span>
                </li>
              </ul>
            </div>

            <!-- Top Locations -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h5 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="pi pi-map-marker text-gold"></i>
                Top Reviewed Locations
              </h5>
              <ul class="space-y-2">
                <li 
                  v-for="(loc, idx) in topLocations" 
                  :key="idx" 
                  class="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span class="text-gold">●</span>
                  <span>{{ loc }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Middle Column -->
          <div class="md:col-span-6">
            <!-- Menu Bar (Mobile) -->
            <div class="md:hidden bg-white border-b border-gray-200 mb-6 -mx-4 px-4">
              <div class="flex flex-wrap gap-2 py-4">
                <button
                  @click="activeTab = 'your-reviews'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'your-reviews'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  <i class="pi pi-star mr-2"></i>
                  Your Reviews
                </button>
                <button
                  @click="activeTab = 'recent-reviews'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'recent-reviews'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  <i class="pi pi-clock mr-2"></i>
                  Recent Reviews
                </button>
                <button
                  @click="activeTab = 'rewards'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'rewards'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  <i class="pi pi-star mr-2"></i>
                  Rewards
                </button>
                <button
                  @click="activeTab = 'notifications'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'notifications'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  <i class="pi pi-bell mr-2"></i>
                  Notifications
                </button>
              </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm p-6">
              <!-- Your Reviews Tab -->
              <div v-if="activeTab === 'your-reviews'" class="space-y-6">
                <h2 class="text-2xl font-bold text-[#008253]">Your Reviews</h2>
                <div 
                  v-for="review in userReviews" 
                  :key="review.id" 
                  class="border-b border-gray-200 pb-6 last:border-0"
                >
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-gray-800">{{ review.businessName }}</h3>
                    <span 
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        review.status === 'Posted' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      ]"
                    >
                      {{ review.status }}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span class="flex items-center gap-1">
                      <i class="pi pi-map-marker"></i>
                      {{ review.location }}
                    </span>
                    <span class="flex items-center gap-2">
                      {{ review.date }}
                    </span>
                  </div>
                  <div class="flex">
                      <Stars
                        v-for="n in 5"
                        :key="n"
                        :filled="n <= review.rating"
                        :colorLevel="n <= review.rating ? review.rating : 0"
                         class="w-6 h-6"
                      />
                  </div>
                  <p class="text-gray-700">{{ review.body }}</p>
                </div>
              </div>

              <!-- Recent Reviews Tab -->
              <div v-if="activeTab === 'recent-reviews'" class="space-y-6">
                <h2 class="text-2xl font-bold text-[#008253]">Recent Reviews</h2>
                <div 
                  v-for="review in recentReviews" 
                  :key="review.id" 
                  class="border-b border-gray-200 pb-6 last:border-0"
                >
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {{ review.author?.charAt(0) || 'U' }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800 mb-1">{{ review.author }}</p>
                      <p class="text-sm text-gray-600">{{ review.date }}</p>
                    </div>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ review.businessName }}</h3>
                  <div class="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <i class="pi pi-map-marker"></i>
                    {{ review.location }}
                  </div>
                  <div class="flex">
                      <Stars
                        v-for="n in 5"
                        :key="n"
                        :filled="n <= review.rating"
                        :colorLevel="n <= review.rating ? review.rating : 0"
                        class="w-6 h-6"
                      />
                  </div>
                  <p class="text-gray-700">{{ review.body }}</p>
                </div>
              </div>

              <!-- Rewards Tab -->
              <div v-if="activeTab === 'rewards'" class="bg-white rounded-xl p-3 max-w-md mx-auto space-y-5">
                <div class="flex items-center gap-3 text-gray-700">
                  <i class="pi pi-trophy text-gold text-xl"></i>
                  <span class="font-medium">Badges Earned: <strong>3</strong></span>
                </div>

                <div class="flex items-center gap-3 text-gray-700">
                  <i class="pi pi-star-fill text-gold text-xl"></i>
                  <span class="font-medium">Points Earned: <strong>149</strong></span>
                </div>

                <div class="flex items-center gap-3 text-gray-700">
                  <i class="pi pi-thumbs-up text-gold text-xl"></i>
                  <span class="font-medium">Helpful Votes: <strong>67</strong></span>
                </div>

                <div class="flex items-center gap-3 text-gray-700">
                  <i class="pi pi-comment text-gold text-xl"></i>
                  <span class="font-medium">Number of Reviews: <strong>3</strong></span>
                </div>
              </div>

              <!-- Notifications Tab -->
              <div v-if="activeTab === 'notifications'" class="text-center py-12">
                <i class="pi pi-bell text-6xl text-gray-300 mb-4"></i>
                <h2 class="text-2xl font-bold text-[#008253] mb-2">Notifications</h2>
                <p class="text-gray-500">Nothing new yet</p>
              </div>
            </div>
          </div>

          <!-- Right Column - Ads -->
          <div class="md:col-span-3 space-y-6">
            <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm p-4 border border-yellow-200">
              <p class="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-2">
                <i class="pi pi-star"></i>
                Featured
              </p>
              <div 
                v-for="ad in ads" 
                :key="ad.id" 
                class="mb-4 last:mb-0"
              >
                <img 
                  :src="ad.image"
                  :alt="ad.business"
                  class="w-full h-32 object-cover rounded-lg mb-2"
                  @error="handleImageError"
                />
                <h4 class="font-semibold text-gray-800">{{ ad.business }}</h4>
                <p class="text-sm text-gray-600">{{ ad.tagline }}</p>
                <button class="mt-2 text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  Learn More
                  <i class="pi pi-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";
import useUser from "~/composables/useUser";

interface Badge {
  name: string
  icon: string
  color: string
}

interface Review {
  id: number
  businessName: string
  location: string
  date: string
  status?: string
  body: string
  rating: number
  author?: string
}

interface Ad {
  id: number
  business: string
  image: string
  tagline: string
}

interface EditFormData {
  username: string
  phoneNumber: string
  address: string
  profileImageUrl: string
}

interface ProfileData {
  userId: string
  username: string
  email: string
  phoneNumber: string | null
  address: string | null
  profileImageUrl: string | null
  userSettings: any | null
}

// Composables and Stores
const { getUserProfile, updateUserProfile } = useUserProfileMethods();
const userStore = useUser();
const route = useRoute();

// Get user ID from route parameter
const currentUserId = computed(() => route.params.id as string || '');

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const activeTab = ref<string>('your-reviews')
const isEditingProfile = ref<boolean>(false)
const saving = ref<boolean>(false)
const saveSuccess = ref<boolean>(false)
const saveError = ref<string | null>(null)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

// Profile data from API
const profileData = ref<ProfileData | null>(null)

const editForm = ref<EditFormData>({
  username: '',
  phoneNumber: '',
  address: '',
  profileImageUrl: ''
})

// Constants
const defaultProfileImage = 'https://via.placeholder.com/200'

// Static data (keep these as they were - these would eventually come from other API endpoints)
const badges = ref<Badge[]>([
  { name: 'Top Reviewer', icon: 'pi pi-trophy', color: 'bg-yellow-100' },
  { name: 'Helpful Member', icon: 'pi pi-star-fill', color: 'bg-blue-100' },
  { name: '100 Reviews', icon: 'pi pi-check-circle', color: 'bg-purple-100' }
])

const topCategories = ref<string[]>([
  'Restaurants',
  'Coffee & Cafes',
  'Shopping',
  'Hotels & Travel',
  'Beauty & Spas'
])

const topLocations = ref<string[]>([
  'Ewekoro',
  'Oju-ore',
  'Ikeja',
  'Yaba',
  'Abeokuta'
])

const userReviews = ref<Review[]>([
  {
    id: 1,
    businessName: 'The Cozy Cafe',
    location: 'Victoria Island',
    date: '2025-09-05',
    status: 'Posted',
    body: 'Amazing coffee and pastries! Staff is always friendly and attentive.',
    rating: 5
  },
  {
    id: 2,
    businessName: 'Sunset Grill',
    location: 'Abeokuta',
    date: '2025-11-01',
    status: 'Posted',
    body: 'Great food and wonderful outdoor seating. Highly recommend the grilled salmon.',
    rating: 4
  },
  {
    id: 3,
    businessName: 'Tech Hub Store',
    location: 'Ikeja',
    date: '2025-11-08',
    status: 'Pending',
    body: 'Good selection of electronics. Staff could be more knowledgeable about products, but prices are competitive.',
    rating: 3
  }
])

const recentReviews = ref<Review[]>([
  {
    id: 4,
    author: 'Ade Temi',
    businessName: 'Ilupeju Spa',
    location: 'Ogun State',
    date: '2025-11-07',
    body: 'Incredible massage therapy and relaxing atmosphere. Will definitely return!',
    rating: 5
  },
  {
    id: 5,
    author: 'Igwe Donald',
    businessName: 'Book Haven',
    location: 'Yaba',
    date: '2025-11-06',
    body: 'Cozy bookstore with a great selection. The staff recommendations are always spot-on.',
    rating: 5
  }
])

const ads = ref<Ad[]>([
  {
    id: 1,
    business: 'Prime Steakhouse',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop',
    tagline: 'Enjoy a fine dining experience'
  },
  {
    id: 2,
    business: 'Yoga Sanctuary',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
    tagline: 'Let us help you Relax and Unwind.'
  }
])

// Methods
const loadProfile = async () => {
  if (!currentUserId.value) {
    error.value = "User not logged in"
    return
  }

  loading.value = true
  error.value = null

  try {
    const result = await getUserProfile(currentUserId.value)
    
    if (result?.statusCode === 200 && result.data) {
      profileData.value = result.data
    } else {
      error.value = "Failed to load profile"
    }
  } catch (err: any) {
    console.error("Error loading profile:", err)
    error.value = err?.response?.data?.message || err.message || "Failed to load profile"
  } finally {
    loading.value = false
  }
}

const selectImage = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editForm.value.profileImageUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const startEdit = () => {
  if (profileData.value) {
    editForm.value = {
      username: profileData.value.username,
      phoneNumber: profileData.value.phoneNumber || '',
      address: profileData.value.address || '',
      profileImageUrl: profileData.value.profileImageUrl || ''
    }
  }
  isEditingProfile.value = true
  saveSuccess.value = false
  saveError.value = null
}

const cancelEdit = () => {
  isEditingProfile.value = false
  saveSuccess.value = false
  saveError.value = null
}

const handleSaveProfile = async () => {
  if (!currentUserId.value) {
    saveError.value = "User not logged in"
    return
  }

  saving.value = true
  saveSuccess.value = false
  saveError.value = null

  try {
    // Prepare update payload (only send fields that are filled)
    const updates: any = {}
    
    if (editForm.value.username) {
      updates.username = editForm.value.username
    }
    if (editForm.value.phoneNumber) {
      updates.phoneNumber = editForm.value.phoneNumber
    }
    if (editForm.value.address) {
      updates.address = editForm.value.address
    }
    if (editForm.value.profileImageUrl) {
      updates.profileImageUrl = editForm.value.profileImageUrl
    }

    const result = await updateUserProfile(currentUserId.value, updates)
    
    if (result?.statusCode === 200) {
      // Refresh profile data
      const refreshed = await getUserProfile(currentUserId.value)
      if (refreshed?.data) {
        profileData.value = refreshed.data
      }
      
      saveSuccess.value = true
      
      // Close edit mode after 2 seconds
      setTimeout(() => {
        isEditingProfile.value = false
        saveSuccess.value = false
      }, 2000)
    } else {
      saveError.value = "Failed to update profile"
    }
  } catch (err: any) {
    console.error("Error saving profile:", err)
    saveError.value = err?.response?.data?.message || err.message || "Failed to save profile"
  } finally {
    saving.value = false
  }
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = defaultProfileImage
}

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
/* Your existing styles */
</style>