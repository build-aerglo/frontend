<template>
<NavBar />

  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <div class="flex flex-wrap gap-4">
          <!-- Category -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select v-model="filters.category" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all">
              <option value="">All Categories</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="cafe">Cafe</option>
            </select>
          </div>

          <!-- Tags -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Tags</label>
            <select v-model="filters.tags" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all">
              <option value="">All Tags</option>
              <option value="family-friendly">Family Friendly</option>
              <option value="luxury">Luxury</option>
              <option value="budget">Budget</option>
              <option value="fast-service">Fast Service</option>
              <option value="romantic">Romantic</option>
              <option value="tech">Tech</option>
            </select>
          </div>

          <!-- Location -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <select v-model="filters.location" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all">
              <option value="">All Locations</option>
              <option value="lagos">Lagos</option>
              <option value="kano">Kano</option>
              <option value="ogun">Ogun</option>
              <option value="jos">Jos</option>
            </select>
          </div>

          <!-- Stars -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Minimum Rating</label>
            <select v-model="filters.stars" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all">
              <option value="">Any Rating</option>
              <option value="4.5">4.5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
            </select>
          </div>

          <!-- Price -->
          <div class="flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
            <select v-model="filters.priceRange" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all">
              <option value="">All Prices</option>
              <option value="budget">Budget</option>
              <option value="moderate">Moderate</option>
              <option value="expensive">Expensive</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="mt-4 flex items-center gap-2 flex-wrap">
          <span class="text-sm text-slate-600">Active filters:</span>
          <template v-for="(value, key) in filters" :key="key">
            <button
              v-if="value"
              @click="filters[key] = ''"
              class="text-xs bg-slate-100 text-[#008253] px-3 py-1 rounded-full flex items-center gap-1 hover:bg-green-200 transition-colors"
            >
              {{ value }}
              <i class="pi pi-times text-xs"></i>
            </button>
          </template>
          <button @click="clearAllFilters" class="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-300 transition-colors">
            Clear all
          </button>
        </div>
      </div>

      <!-- Results -->
      <div class="mb-4">
        <p class="text-sm text-slate-600">
          Showing <span class="font-semibold text-slate-900">{{ filteredBusinesses.length }}</span> result(s)
        </p>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- No Results Message -->
      <div v-if="filteredBusinesses.length === 0" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center mt-8">
        <i class="pi pi-search text-5xl text-slate-300 mb-4"></i>
        <h3 class="text-xl font-bold text-slate-900 mb-2">No results found</h3>
        <p class="text-slate-600 mb-4">Try adjusting your filters</p>
        <button @click="clearAllFilters" class="px-6 py-2 bg-[#008253] text-white rounded-xl hover:bg-[#008258] transition-colors">
          Clear all filters
        </button>
      </div>
        <!-- Business Cards Column 1 -->
        <div class="space-y-2">
          <template v-for="(business, index) in filteredBusinesses" :key="business.id">
            <div
              v-if="index % 2 === 0"
              class="bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-300 border-slate-200 hover:shadow-lg hover:border-slate-300 cursor-pointer"
              @click="focusedBusinessId = business.id"
            >
              <div class="flex flex-col items-center">
                <!-- Logo with Badges -->
                <div class="relative w-24 h-24">
                  <div class="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-slate-200 overflow-hidden">
                    <img :src="business.logo" :alt="business.name" class="w-full h-full object-cover" />
                  </div>

                  <!-- Badges -->
                  <div class="absolute -top-2 -right-2 flex flex-col gap-1">
                    <span
                      v-if="business.verified"
                      class="bg-[#deae29] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                    >
                      <i class="pi pi-check-circle text-xs"></i>Verified
                    </span>

                    <span
                      v-if="business.trusted"
                      class="bg-[#008253] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                    >
                      <i class="pi pi-shield text-xs"></i>Trusted
                    </span>
                  </div>
                </div>
                <!-- Business Name -->
                <h3 class="text-sm font-bold text-slate-900 my-0 text-center">{{ business.name }}</h3>
                <!-- Rating -->
                <div class="flex items-center">
                  <span class="text-lg font-bold text-slate-900">{{ business.rating }}</span>
                  <div class="flex">
                    <i
                      v-for="star in 5"
                      :key="star"
                      class="pi text-xs"
                      :class="star <= Math.floor(business.rating) ? 'pi-star-fill text-gold' : 'pi-star text-slate-300'"
                    ></i>
                  </div>
                </div>

                <!-- Reviews Link -->
                <button
                  @click.stop="focusedBusinessId = business.id"
                  class="text-sm text-[#008253] hover:text-[#006b44] font-semibold hover:underline transition-colors"
                >
                  {{ business.reviewCount }} reviews
                </button>

                        <!--Mobile view-->
                <div v-if="business && focusedBusinessId === business.id" class="md:hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-4">
            <!--header-->
            <div class="mb-6 pb-4 border-b border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <div>
                  <img 
                    :src="focusedBusiness?.logo" 
                    class="w-14 h-14 object-cover border-2 border-slate-200 rounded-full"
                  /> 
                  <span class="text-lg font-bold ml-2 text-slate-900">{{ focusedBusiness?.rating }}</span>
                  <i class="pi pi-star-fill ml-1 text-[#deae29]"></i>
                </div>
                <div class="ml-2">
                  <h3 class="text-sm font-bold mb-2 text-slate-900">{{ focusedBusiness?.name }}</h3>
                  <p class="text-xs mb-1 text-slate-600">Review Summary</p>
                  <div class="bg-slate-50 mb-0 border border-slate-100 rounded-lg p-2">
                    <p class="text-xs text-slate-700">{{ focusedBusiness?.reviewSummary }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between mb-2">
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
            </div>
            <div>
              <NuxtLink to="/profile/business-profile-user-pov" class="text-sm cursor-pointer text-blue-500 hover:underline">see more</NuxtLink>
            </div>   
          </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Business Cards Column 2 -->
        <div class="space-y-2">
          <template v-for="(business, index) in filteredBusinesses" :key="business.id">
            <div
              v-if="index % 2 === 1"
              class="bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-300 border-slate-200 hover:shadow-lg hover:border-slate-300 cursor-pointer"
              @click="focusedBusinessId = business.id"
            >
              <div class="flex flex-col items-center">
                <!-- Logo with Badges -->
                <div class="relative w-24 h-24">
                  <div class="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-slate-200 overflow-hidden">
                    <img :src="business.logo" :alt="business.name" class="w-full h-full object-cover" />
                  </div>

                  <!-- Badges -->
                  <div class="absolute -top-2 -right-2 flex flex-col gap-1">
                    <span
                      v-if="business.verified"
                      class="bg-[#deae29] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                    >
                      <i class="pi pi-check-circle text-xs"></i>Verified
                    </span>

                    <span
                      v-if="business.trusted"
                      class="bg-[#008253] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                    >
                      <i class="pi pi-shield text-xs"></i>Trusted
                    </span>
                  </div>
                </div>
                <!-- Business Name -->
                <h3 class="text-sm font-bold text-slate-900 my-0 text-center">{{ business.name }}</h3>
                <!-- Rating -->
                <div class="flex items-center">
                  <span class="text-lg font-bold text-slate-900">{{ business.rating }}</span>
                  <div class="flex">
                    <i
                      v-for="star in 5"
                      :key="star"
                      class="pi text-xs"
                      :class="star <= Math.floor(business.rating) ? 'pi-star-fill text-gold' : 'pi-star text-slate-300'"
                    ></i>
                  </div>
                </div>

                <!-- Reviews Link -->
                <button
                  @click.stop="focusedBusinessId = business.id"
                  class="text-sm text-[#008253] hover:text-[#006b44] font-semibold hover:underline transition-colors"
                >
                  {{ business.reviewCount }} reviews
                </button>
                <!--Mobile view-->
                <div v-if="business && focusedBusinessId === business.id" class="md:hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-4">
            <!--header-->
            <div class="mb-6 pb-4 border-b border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <div>
                  <img 
                    :src="focusedBusiness?.logo" 
                    class="w-14 h-14 object-cover border-2 border-slate-200 rounded-full"
                  /> 
                  <span class="text-lg font-bold ml-2 text-slate-900">{{ focusedBusiness?.rating }}</span>
                  <i class="pi pi-star-fill ml-1 text-[#deae29]"></i>
                </div>
                <div class="ml-2">
                  <h3 class="text-sm font-bold mb-2 text-slate-900">{{ focusedBusiness?.name }}</h3>
                  <p class="text-xs mb-1 text-slate-600">Review Summary</p>
                  <div class="bg-slate-50 mb-0 border border-slate-100 rounded-lg p-2">
                    <p class="text-xs text-slate-700">{{ focusedBusiness?.reviewSummary }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between mb-2">
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
            </div>
            <div>
              <NuxtLink to="/profile/business-profile-user-pov" class="text-sm cursor-pointer text-blue-500 hover:underline">see more</NuxtLink>
            </div>   
          </div>
              </div>
            </div>
            
          </template>
        </div>

        <!-- Right Column - Review Summary (1/3 width) -->
        <div v-if="filteredBusinesses.length > 0" class="md:col-span-1">
          <!-- Desktop View -->
          <div 
            v-if="focusedBusiness" 
            class="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8"
          >
            <!--header-->
            <div class="mb-2 pb-2 border-b border-slate-200">
              <div class="flex items-center gap-4 mb-2">
                <div>
                  <img 
                    :src="focusedBusiness.logo" 
                    :alt="focusedBusiness.name"
                    class="w-24 h-14 object-cover border-2 border-slate-200 rounded-full"
                  /> 
                  <span class="text-lg font-bold ml-2 text-slate-900">{{ focusedBusiness.rating }}</span>
                  <i class="pi pi-star-fill ml-1 text-[#deae29]"></i>
                </div>
                <div class="ml-2">
                  <h3 class="text-sm mb-2 font-bold text-slate-900">{{ focusedBusiness.name }}</h3>
                  <p class="text-xs text-slate-500 mb-1">Review Summary</p>
                  <div class="bg-slate-50 rounded-lg p-4">
                    <p class="text-xs text-slate-700">{{ focusedBusiness.reviewSummary }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="items-left justify-between mb-2">
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
              <div>
                <NuxtLink to="/profile/business-profile-user-pov" class="text-sm cursor-pointer text-blue-500 hover:underline">see more</NuxtLink>
              </div>
            </div>
          </div>  

          <!-- No Business Selected -->
          <div 
            v-else 
            class="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center sticky top-8"
          >
            <i class="pi pi-arrow-left text-4xl text-slate-300 mb-4"></i>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Select a Business</h3>
            <p class="text-sm text-slate-600">Click on number of reviews to view highlights</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const filters = ref({
  category: '',
  tags: '',
  location: '',
  stars: '',
  priceRange: ''
})

const focusedBusinessId = ref<number | null>(null)
const currentReviewIndex = ref(0)

import { useDummyReviews } from '~/composables/useDummyReviews'

const { businesses } = useDummyReviews()

const filteredBusinesses = computed(() => {
  return businesses.value.filter(b => {
    return (
      (!filters.value.category || b.category === filters.value.category) &&
      (!filters.value.tags || b.tags.includes(filters.value.tags)) &&
      (!filters.value.location || b.location === filters.value.location) &&
      (!filters.value.stars || b.rating >= parseFloat(filters.value.stars)) &&
      (!filters.value.priceRange || b.priceRange === filters.value.priceRange)
    )
  })
})

const hasActiveFilters = computed(() =>
  Object.values(filters.value).some(v => v)
)

const focusedBusiness = computed(() =>
  businesses.value.find(b => b.id === focusedBusinessId.value)
)

const focusedBusinessReviews = computed(() =>
  focusedBusiness.value ? focusedBusiness.value.reviews : []
)

const currentReview = computed(() =>
  focusedBusinessReviews.value[currentReviewIndex.value]
)

function nextReview() {
  if (focusedBusinessReviews.value.length > 1)
    currentReviewIndex.value = (currentReviewIndex.value + 1) % focusedBusinessReviews.value.length
}

function prevReview() {
  if (focusedBusinessReviews.value.length > 1)
    currentReviewIndex.value =
      (currentReviewIndex.value - 1 + focusedBusinessReviews.value.length) %
      focusedBusinessReviews.value.length
}

function clearAllFilters() {
  filters.value = { category: '', tags: '', location: '', stars: '', priceRange: '' }
}
</script>

<style scoped>
.text-gold {
  color: #deae29;
}
select:focus {
  outline: none !important;
  border-color: transparent !important;
  box-shadow: 0 0 0 2px #008253 !important;
}
</style>