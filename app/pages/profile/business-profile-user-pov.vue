<template>
  <div class="min-h-screen bg-green-50">
    <NavBar/>

    <!-- Business Header Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Business Image -->
          <div class="flex-shrink-0">
            <img 
              :src="businessData.image"
              :alt="businessData.name"
              class="w-full md:w-48 h-48 object-cover rounded-xl shadow-lg"
              @error="handleImageError"
            />
          </div>

          <!-- Business Info -->
          <div class="flex-1">
            <div class="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ businessData.name }}</h1>
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex items-center">
                    <i 
                      v-for="n in 5" 
                      :key="n" 
                      :class="[
                        'pi',
                        n <= Math.floor(businessData.rating) ? 'pi-star-fill text-gold' : 'pi-star text-gray-300'
                      ]"
                    ></i>
                  </div>
                  <span class="text-lg font-semibold text-gray-700">{{ businessData.rating }}</span>
                  <span class="text-gray-500">({{ businessData.reviewCount }} reviews)</span>
                </div>
                <p class="text-gray-600 mb-2">
                  <i class="pi pi-tag text-[#008253] mr-2"></i>
                  {{ businessData.category }}
                </p>
              </div>
              
            </div>

            <div class="space-y-2 text-gray-700">
              <div class="flex items-start gap-2">
                <i class="pi pi-map-marker text-[#008253] mt-1"></i>
                <span>{{ businessData.address }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-phone text-[#008253]"></i>
                <span>{{ businessData.phone }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-globe text-[#008253]"></i>
                <a :href="businessData.website" target="_blank" class="text-blue-600 hover:underline">
                  {{ businessData.website }}
                </a>
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-clock text-[#008253]"></i>
                <span :class="businessData.isOpen ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                  {{ businessData.isOpen ? 'Open Now' : 'Closed' }} • {{ businessData.hours }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons (Mobile) -->
    <div class="md:hidden bg-white border-b border-gray-200 py-3">
      <div class="max-w-7xl mx-auto px-4 flex gap-2">
        <button class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
          <i class="pi pi-phone mr-1"></i>
          Call
        </button>
        <button class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
          <i class="pi pi-directions mr-1"></i>
          Directions
        </button>
        <button class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
          <i class="pi pi-bookmark mr-1"></i>
          Save
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-2 sm:gap-6 py-4 overflow-x-auto">
          <button
            @click="activeTab = 'overview'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap',
              activeTab === 'overview'
                ? 'bg-[#008253] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Overview
          </button>
          <button
            @click="activeTab = 'reviews'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap',
              activeTab === 'reviews'
                ? 'bg-[#008253] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Reviews ({{ businessData.reviewCount }})
          </button>
          <button
            @click="activeTab = 'photos'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap',
              activeTab === 'photos'
                ? 'bg-[#008253] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Photos
          </button>
          <button
            @click="activeTab = 'about'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap',
              activeTab === 'about'
                ? 'bg-[#008253] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            About
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content Area -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <!-- About Section -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <p class="text-gray-800 leading-relaxed">{{ businessData.description }}</p>
            </div>

            <!-- Highlights -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Highlights</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  v-for="(highlight, idx) in businessData.highlights" 
                  :key="idx"
                  class="flex items-center gap-2 text-gray-700"
                >
                  <i class="pi pi-check-circle text-green-600"></i>
                  <span>{{ highlight }}</span>
                </div>
              </div>
            </div>

            <!-- Popular Services -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Popular Services</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(service, idx) in businessData.services" 
                  :key="idx"
                  class="px-4 py-2 bg-green-50 text-[#008253] rounded-full text-sm font-medium"
                >
                  {{ service }}
                </span>
              </div>
            </div>

            <!-- Recent Reviews Preview -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-900">Recent Reviews</h3>
                <button 
                  @click="activeTab = 'reviews'"
                  class="text-[#008253] font-medium hover:underline"
                >
                  See All
                </button>
              </div>
              <div class="space-y-4">
                <div 
                  v-for="review in businessReviews.slice(0, 3)" 
                  :key="review.id"
                  class="border-b border-gray-200 pb-4 last:border-0"
                >
                  <div class="flex items-start gap-3 mb-2">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {{ review.author.charAt(0) }}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <p class="font-semibold text-gray-900">{{ review.author }}</p>
                        <span class="text-sm text-gray-500">{{ review.date }}</span>
                      </div>
                      <div class="flex items-center mb-2">
                        <i 
                          v-for="n in review.rating" 
                          :key="n" 
                          class="pi pi-star-fill text-gold text-sm"
                        ></i>
                      </div>
                      <p class="text-gray-700 text-sm">{{ review.body }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">All Reviews</h3>
              
              <!-- Review Summary -->
              <div class="bg-green-50 rounded-lg p-4 mb-6">
                <div class="flex items-center gap-4">
                  <div class="text-center">
                    <div class="text-4xl font-bold text-gray-900">{{ businessData.rating }}</div>
                    <div class="flex items-center justify-center mt-1">
                      <i 
                        v-for="n in 5" 
                        :key="n" 
                        :class="[
                          'pi text-sm',
                          n <= Math.floor(businessData.rating) ? 'pi-star-fill text-gold' : 'pi-star text-gray-300'
                        ]"
                      ></i>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ businessData.reviewCount }} reviews</p>
                  </div>
                  <div class="flex-1 space-y-1">
                    <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-2">
                      <span class="text-sm text-gray-600 w-8">{{ star }}★</span>
                      <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          class="bg-gold h-2 rounded-full" 
                          :style="{ width: `${getStarPercentage(star)}%` }"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-600 w-12">{{ getStarCount(star) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Individual Reviews -->
              <div class="space-y-6">
                <div 
                  v-for="review in businessReviews" 
                  :key="review.id"
                  class="border-b border-gray-200 pb-6 last:border-0"
                >
                  <div class="flex items-start gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {{ review.author.charAt(0) }}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <p class="font-semibold text-gray-900">{{ review.author }}</p>
                        <span class="text-sm text-gray-500">{{ review.date }}</span>
                      </div>
                      <div class="flex items-center mb-2">
                        <i 
                          v-for="n in review.rating" 
                          :key="n" 
                          class="pi pi-star-fill text-gold"
                        ></i>
                      </div>
                      <p class="text-gray-700 mb-3">{{ review.body }}</p>
                      <div class="flex items-center gap-4 text-sm">
                        <button class="text-gray-600 hover:text-[#008253] flex items-center gap-1">
                          <i class="pi pi-thumbs-up"></i>
                          <span>Helpful ({{ review.helpful }})</span>
                        </button>
                        <button class="text-gray-600 hover:text-[#008253] flex items-center gap-1">
                          <i class="pi pi-flag"></i>
                          <span>Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Photos Tab -->
          <div v-if="activeTab === 'photos'" class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <img 
                  v-for="(photo, idx) in businessPhotos" 
                  :key="idx"
                  :src="photo"
                  alt="Business photo"
                  class="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>

          <!-- About Tab -->
          <div v-if="activeTab === 'about'" class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-xl font-bold text-[#008253] mb-4">Business Information</h3>
              <div class="space-y-4">
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Description</h4>
                  <p class="text-gray-700">{{ businessData.description }}</p>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Business Hours (Weekly)</h4>
                  <div class="space-y-1">
                    <div 
                      v-for="(hours, day) in businessData.businessHours" 
                      :key="day"
                      class="flex justify-between text-gray-700"
                    >
                      <span class="font-medium">{{ day }}</span>
                      <span>{{ hours }}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Amenities</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div 
                      v-for="(amenity, idx) in businessData.amenities" 
                      :key="idx"
                      class="flex items-center gap-2 text-gray-700"
                    >
                      <i class="pi pi-check text-[#008253]"></i>
                      <span>{{ amenity }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Quick Actions (Desktop) -->
          <div class="hidden md:block bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h4 class="font-bold text-gray-900 mb-4">Quick Actions</h4>
            <div class="space-y-3">
              <button class="w-full px-4 py-3 bg-[#008253] text-white rounded-lg hover:bg-[#008260] transition font-medium">
                <i class="pi pi-phone mr-2"></i>
                Call Now
              </button>
              <button class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                <i class="pi pi-directions mr-2"></i>
                Get Directions
              </button>
              <button class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                <i class="pi pi-bookmark mr-2"></i>
                Save Business
              </button>
              <button class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                <i class="pi pi-share-alt mr-2"></i>
                Share
              </button>
            </div>
          </div>

          <!-- Location Map Placeholder -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h4 class="font-bold text-gray-900 mb-4">Location</h4>
            <div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-3">
              <i class="pi pi-map text-4xl text-gray-400"></i>
            </div>
            <p class="text-sm text-gray-700">{{ businessData.address }}</p>
          </div>

          <!-- Similar Businesses -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h4 class="font-bold text-gray-900 mb-4">Similar Businesses</h4>
            <div class="space-y-4">
              <div 
                v-for="business in similarBusinesses" 
                :key="business.id"
                class="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
              >
                <img 
                  :src="business.image"
                  :alt="business.name"
                  class="w-16 h-16 object-cover rounded-lg"
                  @error="handleImageError"
                />
                <div class="flex-1">
                  <h5 class="font-semibold text-gray-900 text-sm">{{ business.name }}</h5>
                  <div class="flex items-center gap-1 text-xs">
                    <i class="pi pi-star-fill text-gold"></i>
                    <span class="text-gray-600">{{ business.rating }}</span>
                  </div>
                  <p class="text-xs text-gray-500">{{ business.category }}</p>
                </div>
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

interface BusinessData {
  name: string
  image: string
  rating: number
  reviewCount: number
  category: string
  address: string
  phone: string
  website: string
  isOpen: boolean
  hours: string
  description: string
  highlights: string[]
  services: string[]
  businessHours: Record<string, string>
  amenities: string[]
}

interface Review {
  id: number
  author: string
  date: string
  rating: number
  body: string
  helpful: number
}

interface SimilarBusiness {
  id: number
  name: string
  image: string
  rating: number
  category: string
}

const activeTab = ref<string>('overview')

const businessData = ref<BusinessData>({
  name: 'The Cozy Cafe',
  image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop',
  rating: 4.5,
  reviewCount: 127,
  category: 'Coffee & Cafes',
  address: '45 Marina Road, Victoria Island, Lagos',
  phone: '+234 809-456-7890',
  website: 'www.cozycafe.ng',
  isOpen: true,
  hours: 'Closes at 10:00 PM',
  description: 'The Cozy Cafe is your perfect spot for premium coffee, delicious pastries, and a warm atmosphere. Whether you\'re looking for a quiet place to work, catch up with friends, or simply enjoy a great cup of coffee, we\'ve got you covered. Our skilled baristas craft each drink with care, using only the finest locally-sourced beans.',
  highlights: [
    'Free Wi-Fi',
    'Outdoor Seating',
    'Air Conditioned',
    'Pet Friendly',
    'Wheelchair Accessible',
    'Parking Available'
  ],
  services: [
    'Espresso',
    'Cappuccino',
    'Latte',
    'Fresh Pastries',
    'Sandwiches',
    'Smoothies'
  ],
  businessHours: {
    'Monday': '7:00 AM - 11:00 PM',
    'Tuesday': '7:00 AM - 10:00 PM',
    'Wednesday': '7:00 AM - 10:00 PM',
    'Thursday': '7:00 AM - 10:00 PM',
    'Friday': '7:00 AM - 11:00 PM',
    'Saturday': '8:00 AM - 11:00 PM',
    'Sunday': '9:00 AM - 9:00 PM'
  },
  amenities: [
    'Free Wi-Fi',
    'Outdoor Seating',
    'Air Conditioning',
    'Wheelchair Accessible',
    'Pet Friendly',
    'Parking',
    'Takeout Available',
    'Delivery'
  ]
})

const businessReviews = ref<Review[]>([
  {
    id: 1,
    author: 'Chioma Okafor',
    date: '2025-11-08',
    rating: 5,
    body: 'Absolutely love this place! The coffee is exceptional and the staff are so friendly. Perfect spot for remote work with fast Wi-Fi.',
    helpful: 12
  },
  {
    id: 2,
    author: 'Tunde Adebayo',
    date: '2025-11-06',
    rating: 4,
    body: 'Great coffee and nice ambiance. Can get a bit crowded during lunch hours but overall a solid choice.',
    helpful: 8
  },
  {
    id: 3,
    author: 'Sarah Manuel',
    date: '2025-11-04',
    rating: 5,
    body: 'The best cafe in VI! Their cappuccino is to die for and the pastries are always fresh. Highly recommend!',
    helpful: 15
  },
  {
    id: 4,
    author: 'Coker Yusuf',
    date: '2025-11-02',
    rating: 4,
    body: 'Good coffee and pleasant atmosphere. Prices are a bit high but worth it for the quality.',
    helpful: 5
  },
  {
    id: 5,
    author: 'Johnson Eze',
    date: '2025-10-30',
    rating: 5,
    body: 'My favorite spot in Lagos! The outdoor seating is lovely and the service is always excellent.',
    helpful: 10
  }
])

const businessPhotos = ref<string[]>([
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop',
])

const similarBusinesses = ref<SimilarBusiness[]>([
  {
    id: 1,
    name: 'Cafe Neo',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=100&h=100&fit=crop',
    rating: 4.3,
    category: 'Coffee & Cafes'
  },
  {
    id: 2,
    name: 'Mocha House',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=100&h=100&fit=crop',
    rating: 4.6,
    category: 'Coffee & Cafes'
  },
  {
    id: 3,
    name: 'Beatrice Bistro',
    image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=100&h=100&fit=crop',
    rating: 4.2,
    category: 'Coffee & Cafes'
  }
])

const goBack = () => {
  console.log('Go back')
  // Navigate back to previous page
}

const handleShare = () => {
  console.log('Share business')
  // Implement share functionality
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop'
}

const getStarPercentage = (star: number): number => {
  const total = businessReviews.value.length
  const count = businessReviews.value.filter(r => r.rating === star).length
  return (count / total) * 100
}

const getStarCount = (star: number): number => {
  return businessReviews.value.filter(r => r.rating === star).length
}
</script>

<style scoped>
.text-gold {
  color: #deae29;
}
</style>