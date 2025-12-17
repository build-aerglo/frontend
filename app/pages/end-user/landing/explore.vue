<template>
  <NavBar />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl mt-0 shadow-sm border border-slate-200 p-6 mb-8 sticky top-[60px] z-30">
        <div class="flex flex-wrap gap-4">
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

          <div class="flex-1 min-w-[70px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Prices</label>
            <Dropdown 
              v-model="filters.priceRange" 
              :options="priceOptions" 
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
        </div>

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

      <div class="mb-4">
        <p class="text-sm text-slate-600">
          Showing <span class="font-semibold text-slate-900">{{ filteredBusinesses.length }}</span> result(s)
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <i class="pi pi-spin pi-spinner text-4xl text-[#008253]"></i>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 space-y-4">
          <template v-for="business in filteredBusinesses" :key="business.businessId">
            <div
              class="bg-white rounded-xl shadow-sm border-2 p-4 transition-all duration-300 border-slate-200 hover:shadow-lg hover:border-slate-300"
            >
              <div class="grid grid-cols-[auto_1fr] gap-4">
                <div class="flex flex-col gap-1">
                  <div class="relative w-24 h-24"> 
                    <a @click.stop="focusedBusinessId = business.businessId"
                      class="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-slate-200 overflow-hidden"
                    >
                      <img :src="business.logo || '/images/default-logo.png'" class="w-full h-full mb-0 cursor-pointer object-cover" />
                    </a>

                    <div class="absolute -top-2 -right-2 flex flex-col gap-1">
                      <span
                        v-if="business.isVerified"
                        class="bg-[#008253] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                      >
                        <i class="pi pi-shield text-xs"></i> Verified
                      </span>
                    </div>
                  </div>

                  <div class="text-center">
                    <div class="flex items-center gap-1 mt-0 justify-center">
                      <span class="text-lg font-bold text-slate-900">{{ business.avgRating }}</span>
                      <div class="flex">
                        <Star
                          v-for="n in 5"
                          :key="n"
                          :value="business.avgRating - (n - 1)"
                          class="w-4 h-4"
                        />
                      </div>
                    </div>
                    <button
                      @click.stop="focusedBusinessId = business.businessId"
                      class="text-xs text-[#008253] mt-0 hover:text-[#006b44] font-semibold hover:underline transition-colors"
                    >
                      {{ business.reviewCount }} reviews
                    </button>
                  </div>
                </div>

                <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl my-4 mr-4 p-4 border border-slate-200 relative">
                  <div class="flex justify-between items-start">
                    <a @click.stop="focusedBusinessId = business.businessId">
                      <h3 class="text-xl font-bold cursor-pointer text-slate-900 mb-3">{{ business.name }}</h3>
                    </a>
                    <div
                      class="relative group"
                      @mouseenter="showContact = business.businessId"
                      @mouseleave="hideContact()"
                    >
                      <i class="pi pi-phone text-gray-500 text-lg cursor-pointer hover:text-slate-800"></i>
                      <div
                        v-if="showContact === business.businessId"
                        class="absolute right-0 mt-2 w-48 bg-white text-sm text-slate-600 shadow-lg rounded-lg p-3 border border-slate-200 animate-fade z-50"
                      >
                        <p><strong>Tel:</strong> {{ business.phone || 'N/A' }}</p>   
                        <p><strong>Address:</strong> {{ business.address || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-1">
                    <button
                      v-for="cat in business.categories"
                      :key="cat.id"
                      @click.stop="filterByTag(cat.name)"
                      class="text-sm bg-white px-2 py-1 rounded-lg text-slate-500 border border-slate-300 hover:bg-[#008253] hover:text-white hover:border-[#008253] transition-all cursor-pointer"
                    >
                      {{ cat.name }}
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-if="focusedBusinessId === business.businessId" class="md:hidden mt-4 bg-white rounded-2xl border border-slate-200 p-6">
                 <h3 class="text-sm font-bold mb-2">Review Summary</h3>
                 <div class="bg-slate-50 p-3 rounded-lg text-xs text-slate-700">
                    {{ business.description || 'No summary available.' }}
                 </div>
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

        <div class="hidden md:block md:col-span-1 sticky top-60 self-start">
            <div v-if="focusedBusiness" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div class="flex items-center gap-4 mb-2 pb-2 border-b border-slate-200">
                  <img :src="focusedBusiness.logo" class="w-16 h-16 rounded-full object-cover border border-slate-200" />
                  <div>
                    <h3 class="text-sm font-bold">{{ focusedBusiness.name }}</h3>
                    <p class="text-xs text-slate-500">Review Summary</p>
                  </div>
                </div>
                <div class="bg-slate-50 rounded-lg p-4">
                  <p class="text-xs text-slate-700">{{ focusedBusiness.description || 'No description provided.' }}</p>
                </div>
            </div> 
            <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <i class="pi pi-arrow-left text-4xl text-slate-300 mb-4"></i>
                <h3 class="text-lg font-bold text-slate-900 mb-2">Select a Business</h3>
                <p class="text-sm text-slate-600">Click on a business to view details</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Star from '~/components/Stars.vue' 
import useSearch from '~/composables/search/useSearch'

const route = useRoute()
const { search } = useSearch()

// API Data State
const businesses = ref<any[]>([])
const isLoading = ref(false)
const showContact = ref<string | null>(null)
const focusedBusinessId = ref<string | null>(null)

function hideContact() {
  setTimeout(() => {
    showContact.value = null;
  }, 2000);
}

// Logic: Fetch from API
const fetchResults = async (q: string) => {
  if (!q) return
  isLoading.value = true
  try {
    const res = await search(q)
    businesses.value = Array.isArray(res) ? res : (res.companies || [])
  } catch (error) {
    console.error("Search API failed", error)
    businesses.value = []
  } finally {
    isLoading.value = false
  }
}

const filters = ref({
  category: '',
  badges: '',
  location: '',
  stars: '',
  priceRange: '',
  tag: ''
})

const filteredBusinesses = computed(() => {
  return businesses.value.filter(b => {
    const matchesCategory = !filters.value.category || b.categories?.some((c: any) => c.name.toLowerCase() === filters.value.category.toLowerCase())
    const matchesBadge = !filters.value.badges || (filters.value.badges === 'verified' && b.isVerified)
    const matchesStars = !filters.value.stars || b.avgRating >= parseFloat(filters.value.stars)
    const matchesTag = !filters.value.tag || b.categories?.some((c: any) => c.name.toLowerCase() === filters.value.tag.toLowerCase())

    return matchesCategory && matchesBadge && matchesStars && matchesTag
  })
})

const focusedBusiness = computed(() =>
  businesses.value.find(b => b.businessId === focusedBusinessId.value)
)

const hasActiveFilters = computed(() =>
  Object.values(filters.value).some(v => v)
)

// Options (Hardcoded for UI as before)
const categoryOptions = ref([{ label: 'All', value: '' }, { label: 'Restaurant', value: 'restaurant' }, { label: 'Hotel', value: 'hotel' }])
const badgeOptions = ref([{ label: 'All', value: '' }, { label: 'Verified', value: 'verified' }])
const locationOptions = ref([{ label: 'All', value: '' }, { label: 'Lagos', value: 'lagos' }])
const ratingOptions = ref([{ label: 'Any', value: '' }, { label: '4.5+', value: '4.5' }, { label: '4+', value: '4' }])
const priceOptions = ref([{ label: 'All', value: '' }, { label: 'Budget', value: 'budget' }])

function clearAllFilters() {
  filters.value = { category: '', badges: '', location: '', stars: '', priceRange: '', tag: '' }
}

function filterByTag(tag: string) {
  filters.value.tag = tag
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function getFilterLabel(key: string, value: string): string {
  const optionsMap: Record<string, any> = {
    category: categoryOptions.value,
    badges: badgeOptions.value,
    location: locationOptions.value,
    stars: ratingOptions.value,
    priceRange: priceOptions.value
  }
  const option = optionsMap[key]?.find((opt: any) => opt.value === value)
  return option?.label || value
}

watch(() => route.query.q, (newQ) => {
  if (newQ) fetchResults(newQ as string)
})

onMounted(() => {
  const q = route.query.q as string
  if (q) fetchResults(q)
})
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
</style>