<template>
  <div class="min-h-screen bg-green-50">
    <NavBar/>

    <!-- Edit Profile View -->
    <div v-if="isEditingProfile" class="max-w-2xl mx-auto px-4 py-8">
      <div class="mb-6">
        <button 
          @click="isEditingProfile = false"
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
              :src="editForm.image"
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
            v-model="editForm.phone"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
          />
        </div>

        <div class="pt-2 justify-center text-center items-center">
          <button
            @click="handleSaveProfile"
            class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#008253] transition font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Main Profile View -->
    <div v-else>
      <!-- User Profile Section -->
      <div class="bg-gradient-to-b from-blue-50 to-white py-8"> 
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Use flex-row instead of flex-col -->
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            <!-- Profile Image -->
            <img 
              :src="profileData.image"
              alt="Profile"
              class="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
              @error="handleImageError"
            />

            <!-- Text Section -->
            <div class="text-left md:text-left space-y-2">
              <h2 class="text-2xl font-bold text-gray-800">{{ profileData.username }}</h2>
              
              <div class="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <i class="pi pi-phone text-gray-400"></i>
                <span>{{ profileData.phone }}</span>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <i class="pi pi-envelope text-gray-400"></i>
                <span class="text-sm sm:text-base">{{ profileData.email }}</span>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <i class="pi pi-home text-gray-400"></i>
                <span class="text-sm">{{ profileData.address }}</span>
              </div>

              <button
                @click="isEditingProfile = true"
                class="mt-2 text-blue-500 hover:text-[#008253] text-sm font-medium flex items-center gap-2 justify-center md:justify-start"
              >
                <i class="pi pi-pencil text-xs"></i>
                Edit Profile
              </button>
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

      <!-- Review Business Button (Mobile) -->
      

      <!-- Main Content Grid -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- Left Column -->
          <div class="md:col-span-3 space-y-6">
            <!-- Badges -->
            <div class="bg-white rounded-xl shadow-sm p-6">
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
                  <div class="mb-2">
                    <i 
                      v-for="n in review.rating" 
                      :key="n" 
                      class="pi pi-star-fill text-gold"
                    ></i>
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
                  <div class="mb-2">
                    <i 
                      v-for="n in review.rating" 
                      :key="n" 
                      class="pi pi-star-fill text-gold"
                    ></i>
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
import { ref } from 'vue'

interface ProfileData {
  username: string
  phone: string
  email: string
  address: string
  image: string
}

interface EditForm {
  username: string
  phone: string
  image: string
}

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

const fileInput = ref<HTMLInputElement | null>(null)

const selectImage = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editForm.value.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}


const activeTab = ref<string>('your-reviews')
const isEditingProfile = ref<boolean>(false)

const profileData = ref<ProfileData>({
  username: 'Sarah Betsy',
  phone: '+234 810-1230-567',
  email: 'sarahbetsy111@gmail.com',
  address: '160 Main Street, Yaba, Lagos State.',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
})

const editForm = ref<EditForm>({
  username: profileData.value.username,
  phone: profileData.value.phone,
  image: profileData.value.image
})

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

const handleSaveProfile = () => {
  profileData.value.username = editForm.value.username
  profileData.value.phone = editForm.value.phone
  profileData.value.image = editForm.value.image
  isEditingProfile.value = false
}

const handleSignOut = () => {
  console.log('Sign out clicked')
}

const handleReviewBusiness = () => {
  console.log('Review business clicked')
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/200'
}
</script>

<style scoped>

</style>