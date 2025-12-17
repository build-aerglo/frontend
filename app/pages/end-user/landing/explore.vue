<template>
<NavBar />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters -->
      <div class="bg-white rounded-2xl mt-0 shadow-sm border border-slate-200 p-6 mb-8 sticky top-[60px] z-30">
        <div class="flex flex-wrap gap-4">
          <!-- Business Name (AutoComplete) -->
          <div class="flex-1 min-w-[70px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <Dropdown 
              v-model="filters.businessName" 
              :options="businessNameOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All"
              filter
              filterPlaceholder="Search business..."
              class="w-full"
              :pt="{
                root: { class: 'border-slate-300 rounded-xl' },
                input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
              }"
            />
          </div>

          <!-- Category -->
          <div class="flex-1 min-w-[70px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <Dropdown 
              v-model="filters.category" 
              :options="categoryOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All"
              class="w-full"
              :pt="{
                root: { class: 'border-slate-300 rounded-xl' },
                input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
              }"
            />
          </div>

          <!-- Location -->
          <div class="flex-1 min-w-[70px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <Dropdown 
              v-model="filters.location" 
              :options="locationOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All"
              class="w-full"
              :pt="{
                root: { class: 'border-slate-300 rounded-xl' },
                input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
              }"
            />
          </div>

          <!-- Badges -->
          <div class="flex-1 min-w-[70px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Badges</label>
            <Dropdown 
              v-model="filters.badges" 
              :options="badgeOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All"
              class="w-full"
              :pt="{
                root: { class: 'border-slate-300 rounded-xl' },
                input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
              }"
            />
          </div>

          <!-- Stars -->
          <div class="flex-1 min-w-[100px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Ratings</label>
            <Dropdown 
              v-model="filters.stars" 
              :options="ratingOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Any"
              class="w-full"
              :pt="{
                root: { class: 'border-slate-300 rounded-xl' },
                input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
              }"
            />
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
              {{ getFilterLabel(key, value) }}
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
        <!-- Business Cards -->
        <div class="md:col-span-2 space-y-4">
          <template v-for="business in filteredBusinesses" :key="business.id">
            <div
            class="bg-white rounded-xl shadow-sm border-2 p-4 transition-all duration-300 border-slate-200 hover:shadow-lg hover:border-slate-300"
            >
            <div class="grid grid-cols-[auto_1fr] gap-4">
                <!-- Logo -->
                <div class="flex flex-col gap-1">
                <div class="relative w-24 h-24"> 
                    <a @click.stop="focusedBusinessId = business.id"
                    class="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-slate-200 overflow-hidden"
                    >
                    <img :src="business.logo" class="w-full h-full mb-0 cursor-pointer object-cover" />
                </a>

                    <!-- Badges -->
                    <div class="absolute -top-2 -right-2 flex flex-col gap-1">
                    <span
                        v-if="business.trusted"
                        class="bg-[#deae29] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                    >
                        <i class="pi pi-check-circle text-xs"></i> Trusted
                    </span>

                    <span
                        v-if="business.verified"
                        class="bg-[#008253] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                    >
                        <i class="pi pi-shield text-xs"></i> Verified
                    </span>
                    <span
                        v-if="business.standard"
                        class="bg-[#023dff] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                    >
                        <i class="pi pi-thumbs-up text-xs"></i> Standard
                    </span>
                    </div>
                </div>

                <!-- Rating -->
                <div class="text-center">
                    <div class="flex items-center gap-1 mt-0 justify-center">
                    <span class="text-lg font-bold text-slate-900">{{ business.rating }}</span>
                    <div class="flex">
                      <Star
                        v-for="n in 5"
                        :key="n"
                        :value="business.rating - (n - 1)"
                        :color-level="Math.ceil(business.rating)"
                        class="w-4 h-4"
                      />
                    </div>
                    </div>
                    <button
                    @click.stop="focusedBusinessId = business.id"
                    class="text-xs text-[#008253] mt-0 hover:text-[#006b44] font-semibold hover:underline transition-colors"
                    >
                    {{ business.reviewCount }} reviews
                    </button>
                </div>
                </div>

                <!-- Business Details -->
                <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl my-4 mr-4 p-4 border border-slate-200 relative">
                <div class="flex justify-between items-start">
                    <a @click.stop="focusedBusinessId = business.id">
                      <h3 class="text-xl font-bold cursor-pointer text-slate-900 mb-3">{{ business.name }}</h3>
                    </a>
                    <!-- Contact Icon -->
                    <div
                    class="relative group"
                    @mouseenter="showContact = business.id"
                    @mouseleave="hideContact()"
                    >
                    <i class="pi pi-phone text-gray-500 text-lg cursor-pointer hover:text-slate-800"></i>

                    <div
                        v-if="showContact === business.id"
                        class="absolute right-0 mt-2 w-48 bg-white text-sm text-slate-600 shadow-lg rounded-lg p-3 border border-slate-200 animate-fade"
                    >
                     <p><strong>Tel:</strong> {{ business.phone }}</p>   
                     <p><strong>Address:</strong> {{ business.address }}</p>
                    </div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-1">
                    <button
                    v-for="tag in business.tags"
                    :key="tag"
                    @click.stop="filterByTag(tag)"
                    class="text-sm bg-white px-2 py-1 rounded-lg text-slate-500 border border-slate-300 hover:bg-[#008253] hover:text-black hover:border-[#008253] transition-all cursor-pointer"
                    >
                    {{ tag }}
                    </button>
                </div>
                </div>
            </div>
            </div>

            <div v-if="focusedBusiness && focusedBusinessId === business.id" class="md:hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <!--header-->
            <div class="mb-6 pb-4 border-b border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <div>
                  <img 
                    :src="focusedBusiness?.logo" 
                  class="w-16 h-16 rounded-full object-cover border-2 border-primary-light flex-shrink-0"
                  /> 
                <p class="text-sm font-bold ml-2 text-slate-900">
                  {{ focusedBusiness?.rating }}
                  <Star 
                    :filled="true" 
                    :colorLevel="Math.floor(focusedBusiness?.rating) || 0" 
                    class="w-4 h-4 inline-block" 
                  />
                </p>
                </div> 
                <div class="ml-2">
                  <h3 class="text-sm font-bold mb-2 text-slate-900">{{ focusedBusiness.name }}</h3>
                  <p class="text-xs mb-1 text-slate-600">Review Summary</p>
                  <div class="bg-slate-50 mb-0 border border-slate-100 rounded-lg p-2 md:sticky md:top-2">
                    <p class="text-xs text-slate-700">{{ focusedBusiness.reviewSummary }}</p>
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
              <div class="text-xs text-slate-600 font-medium">
                {{ currentReviewIndex + 1 }} / {{ focusedBusinessReviews.length }}
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
                    <div class="flex items-center">
                      <Star
                        v-for="star in 5"
                        :key="star"
                        :filled="star <= currentReview.rating"
                        :colorLevel="star <= currentReview.rating ?  currentReview.rating : 0"
                        :class="'w-5 h-5'"
                      />
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
                <NuxtLink to="/end-user/profile/business" class="text-sm cursor-pointer text-blue-500 hover:underline">see more</NuxtLink>
              </div>   
          </div>
          </template>

          <div v-if="filteredBusinesses.length === 0" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <i class="pi pi-search text-5xl text-slate-300 mb-4"></i>
            <h3 class="text-xl font-bold text-slate-900 mb-2">No results found</h3>
            <p class="text-slate-600 mb-4">Try adjusting your filters</p>
            <button @click="clearAllFilters" class="px-6 py-2 bg-[#008253] text-white rounded-xl hover:bg-[#008258] transition-colors">
              Clear all filters
            </button>
          </div>
        </div>


        <!-- Right Section - Review Summary (1/3 width) -->
        <div v-if="filteredBusinesses.length > 0" class="hidden md:block md:col-span-1 sticky top-60 self-start">
            <div 
                v-if="focusedBusiness" 
                class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky md:top-8"
            >
            <!--header-->
            <div class="mb-2 pb-2 border-b border-slate-200">
              <div class="flex items-center gap-4 mb-2">
                <div >
                  <img 
                    :src="focusedBusiness?.logo" 
                  class="w-24 h-18 rounded-full mb-1 object-cover border-2 border-primary-light flex-shrink-0"
                  /> 
                <p class="text-sm font-bold ml-2 text-slate-900">
                  {{ focusedBusiness?.rating }}
                  <Star 
                    :filled="true" 
                    :colorLevel="Math.floor(focusedBusiness?.rating) || 0" 
                    class="w-4 h-4 inline-block" 
                  />
                </p>

                </div>
                <div class="ml-2">
                  <h3 class="text-sm mb-2 font-bold text-slate-900">{{ focusedBusiness.name }}</h3>
                  <p class="text-xs text-slate-500 mb-1">Review Summary</p>
                  <div class="bg-slate-50 rounded-lg p-4 md:sticky md:top-2">
                    <p class="text-xs text-slate-700">{{focusedBusiness.reviewSummary}}</p>
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
              <div class="text-xs text-slate-600 font-medium">
                {{ currentReviewIndex + 1 }} / {{ focusedBusinessReviews.length }}
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
                    <div class="flex items-center">
                      <Star
                        v-for="star in 5"
                        :key="star"
                        :filled="star <= currentReview.rating"
                        :colorLevel="star <= currentReview.rating ?  currentReview.rating : 0"
                        :class="'w-5 h-5'"
                      />
                    </div>
                  </div>
                </div>
                <p class="text-sm text-slate-700 leading-relaxed">
                  {{ currentReview.text }}
                </p>
                <p class="text-xs text-slate-500 mt-3">{{ currentReview.date }}</p>
              </div>
              <div>
                <NuxtLink to="/end-user/profile/business" class="text-sm cursor-pointer text-blue-500 hover:underline">see more</NuxtLink>
              </div>
            </div>
            </div>  
          <!-- No Business Selected -->
          <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center md:sticky md:top-8">
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
import Star from '~/components/Stars.vue' 

const showContact = ref<number | null>(null);

function hideContact() {
  setTimeout(() => {
    showContact.value = null;
  }, 2000);
}

const filters = ref({
  businessName: '',
  category: '',
  badges: '',
  location: '',
  stars: '',
  tag: ''
})

// Business name autocomplete
const filteredBusinessNames = ref<string[]>([])

function searchBusinessName(event: any) {
  const query = event.query.toLowerCase()
  if (!query) {
    filteredBusinessNames.value = businesses.value.map(b => b.name)
  } else {
    filteredBusinessNames.value = businesses.value
      .filter(b => b.name.toLowerCase().includes(query))
      .map(b => b.name)
  }
}

// Filter options
const categoryOptions = ref([
  { label: 'All', value: '' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Hotel', value: 'hotel' },
  { label: 'Retail', value: 'retail' },
  { label: 'Service', value: 'service' },
  { label: 'Cafe', value: 'cafe' }
])

const badgeOptions = ref([
  { label: 'All', value: '' },
  { label: 'Standard', value: 'standard' },
  { label: 'Verified', value: 'verified' },
  { label: 'Trusted', value: 'trusted' }
])

const locationOptions = ref([
  { label: 'All', value: '' },
  { label: 'Lagos', value: 'lagos' },
  { label: 'Kano', value: 'kano' },
  { label: 'Ogun', value: 'ogun' },
  { label: 'Jos', value: 'jos' }
])

const ratingOptions = ref([
  { label: 'Any', value: '' },
  { label: '4.5+ Stars', value: '4.5' },
  { label: '4+ Stars', value: '4' },
  { label: '3+ Stars', value: '3' },
  { label: '2+ Stars', value: '2' }
])

const focusedBusinessId = ref<number | null>(null)
const currentReviewIndex = ref(0)

import { useDummyReviews } from '~/composables/useDummyReviews'

const { businesses } = useDummyReviews()

const businessNameOptions = computed(() => {
  return [
    { label: 'All businesses', value: '' },
    ...businesses.value.map(b => ({ 
      label: b.name, 
      value: b.name 
    }))
  ]
})

const filteredBusinesses = computed(() => {
  return businesses.value.filter(b => {
    return (
      (!filters.value.businessName || b.name.toLowerCase().includes(filters.value.businessName.toLowerCase())) &&
      (!filters.value.category || b.category === filters.value.category) &&
      (!filters.value.badges || b.badges.includes(filters.value.badges)) &&
      (!filters.value.location || b.location === filters.value.location) &&
      (!filters.value.stars || b.rating >= parseFloat(filters.value.stars)) &&
      (!filters.value.tag || b.tags.includes(filters.value.tag))
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
  filters.value = { businessName: '', category: '', badges: '', location: '', stars: '', tag: '' }
}

function filterByTag(tag: string) {
  filters.value.tag = tag
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function getFilterLabel(key: string, value: string): string {
  if (key === 'businessName') {
    return value
  }
  
  const optionsMap: Record<string, any> = {
    category: categoryOptions.value,
    badges: badgeOptions.value,
    location: locationOptions.value,
    stars: ratingOptions.value
  }
  
  const option = optionsMap[key]?.find((opt: any) => opt.value === value)
  return option?.label || value
}
</script>

<style scoped>
.text-gold {
  color: #deae29;
}

@keyframes fadeInOut {
  0%   { opacity: 0; transform: translateY(4px); }
  10%  { opacity: 1; transform: translateY(0); }
  90%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(4px); }
}

.animate-fade {
  animation: fadeInOut 2.5s forwards;
}

/* PrimeVue Dropdown custom styling */
:deep(.p-dropdown) {
  background: rgb(248 250 252);
  border-color: rgb(203 213 225);
  border-radius: 0.75rem;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: #008253;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  outline: none;
  border-color: #008253;
  box-shadow: 0 0 0 2px rgba(0, 130, 83, 0.2);
}

:deep(.p-dropdown-label) {
  padding: 0.625rem 1rem;
}

:deep(.p-dropdown-panel) {
  border-radius: 0.75rem;
  border-color: rgb(203 213 225);
}

:deep(.p-dropdown-item) {
  padding: 0.625rem 1rem;
}

:deep(.p-dropdown-item:not(.p-disabled):hover) {
  background: rgb(248 250 252);
  color: #008253;
}

:deep(.p-dropdown-item.p-highlight) {
  background: #008253;
  color: white;
}

/* PrimeVue AutoComplete custom styling */
:deep(.p-autocomplete) {
  width: 100%;
}

:deep(.p-autocomplete .p-autocomplete-input) {
  background: rgb(248 250 252);
  border-color: rgb(203 213 225);
  border-radius: 0.75rem;
}

:deep(.p-autocomplete .p-autocomplete-input:hover) {
  border-color: #008253;
}

:deep(.p-autocomplete .p-autocomplete-input:focus) {
  outline: none;
  border-color: #008253;
  box-shadow: 0 0 0 2px rgba(0, 130, 83, 0.2);
}

:deep(.p-autocomplete-panel) {
  border-radius: 0.75rem;
  border-color: rgb(203 213 225);
  margin-top: 0.25rem;
}

:deep(.p-autocomplete-items) {
  padding: 0;
}

:deep(.p-autocomplete-item) {
  padding: 0.625rem 1rem;
}

:deep(.p-autocomplete-item:hover) {
  background: rgb(248 250 252);
  color: #008253;
}

:deep(.p-autocomplete-item.p-highlight) {
  background: #008253;
  color: white;
}
</style>