<template>
  <NavBar/>

  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filter Criteria Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <div class="flex flex-wrap gap-4">
          <!-- Category Filter -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select 
              v-model="filters.category"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all"
            >
              <option value="">All Categories</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="cafe">Cafe</option>
            </select>
          </div>

          <!-- Tags Filter -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Tags</label>
            <select 
              v-model="filters.tags"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all"
            >
              <option value="">All Tags</option>
              <option value="family-friendly">Family Friendly</option>
              <option value="luxury">Luxury</option>
              <option value="budget">Budget</option>
              <option value="fast-service">Fast Service</option>
              <option value="romantic">Romantic</option>
              <option value="tech">Tech</option>
            </select>
          </div>

          <!-- Location Filter -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <select 
              v-model="filters.location"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all"
            >
              <option value="">All Locations</option>
              <option value="lagos">Lagos</option>
              <option value="kano">Kano</option>
              <option value="ogun">Ogun</option>
              <option value="jos">Jos</option>
            </select>
          </div>

          <!-- Stars Filter -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Minimum Rating</label>
            <select 
              v-model="filters.stars"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
            </select>
          </div>

          <!-- Price Range Filter -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
            <select 
              v-model="filters.priceRange"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all"
            >
              <option value="">All Prices</option>
              <option value="budget">Budget</option>
              <option value="moderate">Moderate</option>
              <option value="expensive">Expensive</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>
        
        <!-- Active Filters Display -->
        <div v-if="hasActiveFilters" class="mt-4 flex items-center gap-2 flex-wrap">
          <span class="text-sm text-slate-600">Active filters:</span>
          <button
            v-if="filters.category"
            @click="filters.category = ''"
            class="text-xs bg-blue-100 text-[#008253] px-3 py-1 rounded-full flex items-center gap-1 hover:bg-green-200 transition-colors"
          >
            {{ filters.category }}
            <i class="pi pi-times text-xs"></i>
          </button>
          <button
            v-if="filters.tags"
            @click="filters.tags = ''"
            class="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-purple-200 transition-colors"
          >
            {{ filters.tags }}
            <i class="pi pi-times text-xs"></i>
          </button>
          <button
            v-if="filters.location"
            @click="filters.location = ''"
            class="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-green-200 transition-colors"
          >
            {{ filters.location }}
            <i class="pi pi-times text-xs"></i>
          </button>
          <button
            v-if="filters.stars"
            @click="filters.stars = ''"
            class="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-amber-200 transition-colors"
          >
            {{ filters.stars }}+ stars
            <i class="pi pi-times text-xs"></i>
          </button>
          <button
            v-if="filters.priceRange"
            @click="filters.priceRange = ''"
            class="text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-rose-200 transition-colors"
          >
            {{ filters.priceRange }}
            <i class="pi pi-times text-xs"></i>
          </button>
          <button
            @click="clearAllFilters"
            class="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-300 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-4">
        <p class="text-sm text-slate-600">
          Showing <span class="font-semibold text-slate-900">{{ filteredBusinesses.length }}</span> results
        </p>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Left Section - Business Cards (2/3 width) -->
        <div class="md:col-span-2 space-y-6">
          <template v-for="business in filteredBusinesses" :key="business.id">
            <div 
              @click="focusedBusinessId = business.id"
              :class="[
                'bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-300 cursor-pointer',
                focusedBusinessId === business.id 
                  ? 'border-[#008253] shadow-lg ring-2 ring-green-200' 
                  : 'border-slate-200 hover:shadow-lg hover:border-slate-300'
              ]"
            >
            <div class="grid grid-cols-[auto_1fr] gap-6">
              <!-- Card 1: Square Logo with Badges -->
              <div class="relative w-32 h-32">
                <div class="w-full h-full bg-white rounded-2xl flex items-center justify-center border-2 border-slate-200 overflow-hidden">
                  <img 
                    :src="business.logo" 
                    :alt="business.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <!-- Badges -->
                <div class="absolute -top-2 -right-2 flex flex-col gap-1">
                  <span 
                    v-if="business.verified"
                    class="bg-[#deae29] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                  >
                    <i class="pi pi-check-circle text-xs"></i>
                    Verified
                  </span>
                  <span 
                    v-if="business.trusted"
                    class="bg-[#008253] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                  >
                    <i class="pi pi-shield text-xs"></i>
                    Trusted
                  </span>
                </div>
              </div>

              <!-- Right Column -->
              <div class="flex flex-col gap-4">
                <!-- Card 2: Business Name -->
                <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                  <h3 class="text-xl font-bold text-slate-900">{{ business.name }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-sm text-slate-600">{{ business.category }}</p>
                    <span class="text-slate-400">•</span>
                    <p class="text-sm text-slate-600">{{ business.location }}</p>
                    <span v-if="business.priceRange" class="text-slate-400">•</span>
                    <p v-if="business.priceRange" class="text-sm font-semibold text-[#008253]">{{ business.priceRange }}</p>
                  </div>
                </div>

                <!-- Cards 3 & 4: Tags and Rating -->
                <div class="grid grid-cols-2 gap-4">
                  <!-- Card 3: Tags -->
                  <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <div class="flex items-center gap-2 mb-2">
                      <i class="pi pi-tags text-[#deae29]"></i>
                      <span class="text-xs font-semibold text-slate-700 uppercase tracking-wide">Tags</span>
                    </div>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="tag in business.tags" 
                        :key="tag"
                        class="text-xs bg-white px-2 py-1 rounded-lg text-slate-700 border border-purple-200"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <!-- Card 4: Star Rating -->
                  <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                    <div class="flex items-center gap-2 mb-2">
                      <i class="pi pi-star-fill text-[#deae29]"></i>
                      <span class="text-xs font-semibold text-slate-700 uppercase tracking-wide">Rating</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xl font-bold text-slate-900">{{ business.rating }}</span>
                      <div class="flex">
                        <i 
                          v-for="star in 5" 
                          :key="star"
                          class="pi text-sm"
                          :class="star <= Math.floor(business.rating) ? 'pi-star-fill text-gold' : 'pi-star text-slate-300'"
                        ></i>
                      </div>
                    </div>
                    <p class="text-xs text-slate-600 mt-1">{{ business.reviewCount }} reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Review Summary for Mobile - Shows below clicked card -->
          <div 
            v-if="focusedBusinessId === business.id && focusedBusiness"
            class="md:hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <!--header-->
            <div class="mb-6 pb-4 border-b border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <img 
                  :src="focusedBusiness.logo" 
                  :alt="focusedBusiness.name"
                  class="w-12 h-12 rounded-lg object-cover border-2 border-slate-200"
                />
                <div>
                  <h3 class="text-lg font-bold text-slate-900">{{ focusedBusiness.name }}</h3>
                  <p class="text-xs text-slate-600">Review Highlights</p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-1">
                <span class="text-xl font-bold text-slate-900">{{ focusedBusiness.rating }}</span>
                <div class="flex">
                  <i 
                    v-for="star in 5" 
                    :key="star"
                    class="pi text-sm"
                    :class="star <= Math.floor(focusedBusiness.rating) ? 'pi-star-fill text-gold' : 'pi-star text-slate-300'"
                  ></i>
                </div>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="prevReview"
                  :disabled="focusedBusinessReviews.length <= 1"
                  class="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="pi pi-chevron-left text-slate-700 text-sm"></i>
                </button>
                <button 
                  @click="nextReview"
                  :disabled="focusedBusinessReviews.length <= 1"
                  class="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="pi pi-chevron-right text-slate-700 text-sm"></i>
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <!-- Review Card -->
              <div v-if="currentReview" :class="[
                'rounded-xl p-4 border transition-all',
                currentReview.rating >= 4 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
                  : currentReview.rating >= 3
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                    : 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-200'
              ]">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img 
                      :src="currentReview.avatar" 
                      :alt="currentReview.author"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ currentReview.author }}</p>
                    <div class="flex items-center gap-1">
                      <i 
                        v-for="star in 5" 
                        :key="star"
                        class="pi text-xs"
                        :class="star <= currentReview.rating ? 'pi-star-fill text-gold' : 'pi-star text-slate-300'"
                      ></i>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-slate-700 leading-relaxed">
                  {{ currentReview.text }}
                </p>
                <p class="text-xs text-slate-500 mt-3">{{ currentReview.date }}</p>
              </div>

              <!-- Review Stats -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-emerald-50 rounded-xl p-2 border border-emerald-200">
                  <div class="flex items-center gap-1">
                    <i class="pi pi-thumbs-up text-emerald-600 text-sm"></i>
                    <span class="text-xs font-semibold text-slate-700">Positive</span>
                  </div>
                  <p class="text-2xl font-bold text-slate-900">{{ focusedBusiness.positivePercent }}%</p>
                </div>
                <div class="bg-rose-50 rounded-xl p-2 border border-rose-200">
                  <div class="flex items-center gap-1">
                    <i class="pi pi-thumbs-down text-rose-600 text-sm"></i>
                    <span class="text-xs font-semibold text-slate-700">Negative</span>
                  </div>
                  <p class="text-2xl font-bold text-slate-900">{{ focusedBusiness.negativePercent }}%</p>
                </div>
              </div>

              <!-- Common Keywords -->
              <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p class="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Common Keywords</p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="keyword in focusedBusiness.keywords" 
                    :key="keyword"
                    class="text-xs bg-white px-3 py-1.5 rounded-lg text-slate-700 border border-slate-200"
                  >
                    {{ keyword }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          </template>

          <!-- No Results Message -->
          <div v-if="filteredBusinesses.length === 0" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <i class="pi pi-search text-5xl text-slate-300 mb-4"></i>
            <h3 class="text-xl font-bold text-slate-900 mb-2">No results found</h3>
            <p class="text-slate-600 mb-4">Try adjusting your filters to see more results</p>
            <button
              @click="clearAllFilters"
              class="px-6 py-2 bg-[#008253] text-white rounded-xl hover:bg-[#008258] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>

        <!-- Right Section - Review Summary (1/3 width) -->
        <div class="hidden md:block md:col-span-1">
            <div 
                v-if="focusedBusiness" 
                class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky md:top-8"
            >
            <!--header-->
            <div class="mb-6 pb-4 border-b border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <img 
                  :src="focusedBusiness.logo" 
                  :alt="focusedBusiness.name"
                  class="w-12 h-12 rounded-lg object-cover border-2 border-slate-200"
                />
                <div>
                  <h3 class="text-lg font-bold text-slate-900">{{ focusedBusiness.name }}</h3>
                  <p class="text-xs text-slate-600">Review Highlights</p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-1">
                <span class="text-xl font-bold text-slate-900">{{ focusedBusiness.rating }}</span>
                <div class="flex">
                  <i 
                    v-for="star in 5" 
                    :key="star"
                    class="pi text-sm"
                    :class="star <= Math.floor(focusedBusiness.rating) ? 'pi-star-fill text-gold' : 'pi-star text-slate-300'"
                  ></i>
                </div>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="prevReview"
                  :disabled="focusedBusinessReviews.length <= 1"
                  class="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="pi pi-chevron-left text-slate-700 text-sm"></i>
                </button>
                <button 
                  @click="nextReview"
                  :disabled="focusedBusinessReviews.length <= 1"
                  class="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="pi pi-chevron-right text-slate-700 text-sm"></i>
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <!-- Review Card -->
              <div v-if="currentReview" :class="[
                'rounded-xl p-4 border transition-all',
                currentReview.rating >= 4 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
                  : currentReview.rating >= 3
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                    : 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-200'
              ]">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img 
                      :src="currentReview.avatar" 
                      :alt="currentReview.author"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ currentReview.author }}</p>
                    <div class="flex items-center gap-1">
                      <i 
                        v-for="star in 5" 
                        :key="star"
                        class="pi text-xs"
                        :class="star <= currentReview.rating ? 'pi-star-fill text-gold' : 'pi-star text-slate-300'"
                      ></i>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-slate-700 leading-relaxed">
                  {{ currentReview.text }}
                </p>
                <p class="text-xs text-slate-500 mt-3">{{ currentReview.date }}</p>
              </div>

              <!-- Review Stats -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-emerald-50 rounded-xl p-2 border border-emerald-200">
                  <div class="flex items-center gap-1">
                    <i class="pi pi-thumbs-up text-emerald-600 text-sm"></i>
                    <span class="text-xs font-semibold text-slate-700">Positive</span>
                  </div>
                  <p class="text-2xl font-bold text-slate-900">{{ focusedBusiness.positivePercent }}%</p>
                </div>
                <div class="bg-rose-50 rounded-xl p-2 border border-rose-200">
                  <div class="flex items-center gap-1">
                    <i class="pi pi-thumbs-down text-rose-600 text-sm"></i>
                    <span class="text-xs font-semibold text-slate-700">Negative</span>
                  </div>
                  <p class="text-2xl font-bold text-slate-900">{{ focusedBusiness.negativePercent }}%</p>
                </div>
              </div>

              <!-- Common Keywords -->
              <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p class="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Common Keywords</p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="keyword in focusedBusiness.keywords" 
                    :key="keyword"
                    class="text-xs bg-white px-3 py-1.5 rounded-lg text-slate-700 border border-slate-200"
                  >
                    {{ keyword }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- No Business Selected -->
          <div 
                v-else 
                class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center md:sticky md:top-8"
            >
                <i class="pi pi-arrow-left text-4xl text-slate-300 mb-4"></i>
                <h3 class="text-lg font-bold text-slate-900 mb-2">Select a Business</h3>
                <p class="text-sm text-slate-600">Click on any business card to view review highlights</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Review {
  author: string
  avatar: string
  rating: number
  text: string
  date: string
}

interface Business {
  id: number
  name: string
  category: string
  logo: string
  rating: number
  reviewCount: number
  verified: boolean
  trusted: boolean
  tags: string[]
  location: string
  priceRange: string
  positivePercent: number
  negativePercent: number
  keywords: string[]
  reviews: Review[]
}

// Filter state
const filters = ref({
  category: '',
  tags: '',
  location: '',
  stars: '',
  priceRange: ''
})

// Focused business ID
const focusedBusinessId = ref<number | null>(null)

// Sample business data for display
const businesses = ref<Business[]>([
  {
    id: 1,
    name: "The Golden Spoon Restaurant",
    category: "restaurant",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 342,
    verified: true,
    trusted: true,
    tags: ["luxury", "romantic"],
    location: "lagos",
    priceRange: "expensive",
    positivePercent: 92,
    negativePercent: 8,
    keywords: ["Excellent Service", "Romantic Ambiance", "Fine Dining", "Great Wine"],
    reviews: [
      {
        author: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=5",
        rating: 5,
        text: "Absolutely fantastic experience! The service was impeccable and the atmosphere was perfect for our anniversary dinner. Every dish was a masterpiece.",
        date: "2 days ago"
      },
      {
        author: "Donald Williams",
        avatar: "https://i.pravatar.cc/150?img=13",
        rating: 5,
        text: "Best fine dining experience in the city. The chef's tasting menu was extraordinary!",
        date: "1 week ago"
      },
      {
        author: "Jennifer Eze",
        avatar: "https://i.pravatar.cc/150?img=47",
        rating: 4,
        text: "Beautiful ambiance and delicious food. Slightly pricey but the quality justifies it. Will return for special occasions.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 2,
    name: "Tech Hub Electronics",
    category: "retail",
    logo: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 218,
    verified: true,
    trusted: false,
    tags: ["tech", "fast-service"],
    location: "kano",
    priceRange: "moderate",
    positivePercent: 85,
    negativePercent: 15,
    keywords: ["Knowledgeable Staff", "Great Selection", "Fair Prices", "Fast Service"],
    reviews: [
      {
        author: "Yusuf Bada",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 5,
        text: "Great quality products and knowledgeable staff. They helped me choose the perfect laptop for my needs. Prices are reasonable and competitive.",
        date: "3 days ago"
      },
      {
        author: "David Kenny",
        avatar: "https://i.pravatar.cc/150?img=33",
        rating: 4,
        text: "Solid electronics store with good variety. Staff could be more attentive during busy hours, but overall good experience.",
        date: "1 week ago"
      }
    ]
  },
  {
    id: 3,
    name: "Wellness Spa & Retreat",
    category: "service",
    logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 456,
    verified: true,
    trusted: true,
    tags: ["luxury"],
    location: "ogun",
    priceRange: "luxury",
    positivePercent: 95,
    negativePercent: 5,
    keywords: ["Relaxing", "Professional", "Clean", "Rejuvenating"],
    reviews: [
      {
        author: "Emily Ade",
        avatar: "https://i.pravatar.cc/150?img=9",
        rating: 5,
        text: "Best decision ever! Professional team, excellent results, and a wonderful environment. The massage was heavenly and I left feeling completely refreshed.",
        date: "4 days ago"
      },
      {
        author: "Amanda Ben",
        avatar: "https://i.pravatar.cc/150?img=26",
        rating: 5,
        text: "Pure bliss! The spa treatments are top-notch and the staff is incredibly attentive. Worth every dollar for the quality of service.",
        date: "1 week ago"
      }
    ]
  },
  {
    id: 4,
    name: "Grand Plaza Hotel",
    category: "hotel",
    logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 589,
    verified: true,
    trusted: true,
    tags: ["luxury", "family-friendly"],
    location: "lagos",
    priceRange: "luxury",
    positivePercent: 88,
    negativePercent: 12,
    keywords: ["Comfortable", "Great Location", "Friendly Staff", "Clean Rooms"],
    reviews: [
      {
        author: "Robert Thompson",
        avatar: "https://i.pravatar.cc/150?img=15",
        rating: 5,
        text: "Fantastic stay! The rooms were spacious and immaculate. Staff went above and beyond to make our family vacation memorable.",
        date: "5 days ago"
      },
      {
        author: "Lisa Marvellous",
        avatar: "https://i.pravatar.cc/150?img=44",
        rating: 4,
        text: "Great hotel with excellent amenities. Breakfast buffet was impressive. Only minor issue was noise from the hallway at night.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 5,
    name: "Quick Bite Burger Joint",
    category: "restaurant",
    logo: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop",
    rating: 2.3,
    reviewCount: 89,
    verified: false,
    trusted: false,
    tags: ["budget", "fast-service"],
    location: "kano",
    priceRange: "budget",
    positivePercent: 35,
    negativePercent: 65,
    keywords: ["Slow Service", "Cold Food", "Dirty", "Rude Staff"],
    reviews: [
      {
        author: "Aminatu Fuhad",
        avatar: "https://i.pravatar.cc/150?img=52",
        rating: 1,
        text: "Terrible experience. Waited 45 minutes for a cold burger. The place was dirty and staff was incredibly rude when I complained. Never coming back!",
        date: "1 day ago"
      },
      {
        author: "Kunle Peters",
        avatar: "https://i.pravatar.cc/150?img=38",
        rating: 2,
        text: "Very disappointed. Food quality has gone downhill. My order was wrong and they refused to fix it. Save your money and go elsewhere.",
        date: "3 days ago"
      },
      {
        author: "Ogun Davis",
        avatar: "https://i.pravatar.cc/150?img=68",
        rating: 3,
        text: "It's okay if you're really hungry and have no other options. Nothing special. Fries were decent but burger was mediocre.",
        date: "1 week ago"
      }
    ]
  },
  {
    id: 6,
    name: "Discount Electronics Warehouse",
    category: "retail",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop",
    rating: 2.1,
    reviewCount: 156,
    verified: false,
    trusted: false,
    tags: ["budget"],
    location: "ogun",
    priceRange: "budget",
    positivePercent: 28,
    negativePercent: 72,
    keywords: ["Poor Quality", "No Returns", "Broken Items", "Unhelpful"],
    reviews: [
      {
        author: "James Obi",
        avatar: "https://i.pravatar.cc/150?img=59",
        rating: 1,
        text: "AVOID! Sold me a broken laptop and refused to accept returns. Customer service is non-existent.",
        date: "2 days ago"
      },
      {
        author: "Patricia Henry",
        avatar: "https://i.pravatar.cc/150?img=20",
        rating: 2,
        text: "Cheap prices but you get what you pay for. Half the products don't work and the warranty is worthless. Very frustrating experience.",
        date: "1 week ago"
      },
      {
        author: "Steven Bala",
        avatar: "https://i.pravatar.cc/150?img=70",
        rating: 3,
        text: "Hit or miss. Some deals are okay but quality control is terrible. Check everything carefully before leaving the store.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 7,
    name: "Cozy Corner Cafe",
    category: "cafe",
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop",
    rating: 4.3,
    reviewCount: 167,
    verified: false,
    trusted: true,
    tags: ["budget", "family-friendly"],
    location: "kano",
    priceRange: "budget",
    positivePercent: 78,
    negativePercent: 22,
    keywords: ["Great Coffee", "Friendly Staff", "Cozy Atmosphere", "Affordable"],
    reviews: [
      {
        author: "Robert Thompson",
        avatar: "https://i.pravatar.cc/150?img=15",
        rating: 5,
        text: "Fantastic stay! The rooms were spacious and immaculate. Staff went above and beyond to make our family vacation memorable.",
        date: "5 days ago"
      },
      {
        author: "Lisa Matthews",
        avatar: "https://i.pravatar.cc/150?img=44",
        rating: 4,
        text: "Great hotel with excellent amenities. Breakfast buffet was impressive. Only minor issue was noise from the hallway at night.",
        date: "2 weeks ago"
      }
    ]
  }
])

// --- Computed States ---
const hasActiveFilters = computed(() =>
  Object.values(filters.value).some(val => val !== '')
)

// Filtered businesses
const filteredBusinesses = computed(() => {
  return businesses.value.filter(biz => {
    const matchesCategory = !filters.value.category || biz.category === filters.value.category
    const matchesTags = !filters.value.tags || biz.tags.includes(filters.value.tags)
    const matchesLocation = !filters.value.location || biz.location === filters.value.location
    const matchesStars = !filters.value.stars || biz.rating >= parseFloat(filters.value.stars)
    const matchesPrice = !filters.value.priceRange || biz.priceRange === filters.value.priceRange

    return (
      matchesCategory &&
      matchesTags &&
      matchesLocation &&
      matchesStars &&
      matchesPrice
    )
  })
})

// --- Focused Business Logic ---
const focusedBusiness = computed(() =>
  businesses.value.find(b => b.id === focusedBusinessId.value) || null
)

// Review navigation state
const currentReviewIndex = ref(0)

const focusedBusinessReviews = computed(() =>
  focusedBusiness.value ? focusedBusiness.value.reviews : []
)

const currentReview = computed(() =>
  focusedBusinessReviews.value[currentReviewIndex.value] || null
)

// --- Methods ---
function clearAllFilters() {
  filters.value = {
    category: '',
    tags: '',
    location: '',
    stars: '',
    priceRange: ''
  }
}

function nextReview() {
  if (focusedBusinessReviews.value.length > 1) {
    currentReviewIndex.value =
      (currentReviewIndex.value + 1) % focusedBusinessReviews.value.length
  }
}

function prevReview() {
  if (focusedBusinessReviews.value.length > 1) {
    currentReviewIndex.value =
      (currentReviewIndex.value - 1 + focusedBusinessReviews.value.length) %
      focusedBusinessReviews.value.length
  }
}

// Reset review index when new business is focused
watch(focusedBusinessId, () => {
  currentReviewIndex.value = 0
})
</script>

<style scoped>
select:focus {
  outline: none !important;
  border-color: transparent !important;
  box-shadow: 0 0 0 2px #008253 !important;
}
</style>


