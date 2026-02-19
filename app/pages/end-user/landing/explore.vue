<template>
  <NavBar />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl mt-0 shadow-sm border border-slate-200 hidden md:block p-6 mb-8 sticky top-[60px] z-30">
        <div class="grid grid-cols-6 md:flex md:flex-wrap gap-4">
          
          <div class="col-span-4 md:flex-1 md:min-w-[200px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
            <input 
              v-model="filters.name"
              type="text"
              placeholder="Filter by name..."
              class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all text-sm"
            />
          </div>

          <div class="col-span-2 md:flex-1 md:min-w-[70px]">
            <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <Dropdown 
              v-model="filters.categoryId" 
              :options="categoryOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All"
              class="w-full"
              :pt="{
                root: { class: 'border-slate-300 rounded-xl' },
                input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
              }"
              @change="onCategoryDropdownChange"
            />
          </div>

          <div class="col-span-2 md:flex-1 md:min-w-[70px]">
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

          <div class="col-span-2 md:flex-1 md:min-w-[70px]">
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

          <div class="col-span-2 md:flex-1 md:min-w-[100px]">
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

        <div v-if="hasActiveFilters" class="mt-4 flex items-center gap-2 flex-wrap">
          <span class="text-sm text-slate-600">Active filters:</span>
          <template v-for="(value, key) in filters" :key="key">
            <button
              v-if="value && !['tag', 'tagId', 'category'].includes(String(key))"
              @click="clearFilter(String(key))"
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

      <!-- MOBILE FILTER BAR (< md) -->
      <div class="md:hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 sticky top-[60px] z-30">
        <div class="flex gap-3">
          <div class="flex-1">
            <input 
              v-model="filters.name"
              type="text"
              placeholder="Search businesses..."
              class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all text-sm"
            />
          </div>

          <button
            @click="showFilterDrawer = true"
            class="flex items-center gap-2 px-4 py-2.5 bg-[#008253] text-white rounded-xl hover:bg-[#006f45] transition-colors font-medium text-sm relative"
          >
            <i class="pi pi-filter"></i>
            <span>Filters</span>
            <span v-if="activeFilterCount > 0" class="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {{ activeFilterCount }}
            </span>
          </button>
        </div>

        <!-- Active Filters Pills (Mobile) -->
        <div v-if="hasActiveFilters" class="mt-3 flex items-center gap-2 flex-wrap">
          <span class="text-xs text-slate-600">Active:</span>
          <template v-for="(value, key) in filters" :key="String(key)">
            <button
              v-if="value && !['tag', 'tagId', 'name', 'category'].includes(key as string)"
              @click="clearFilter(key as string)"
              class="text-xs bg-slate-100 text-[#008253] px-2 py-1 rounded-full flex items-center gap-1 hover:bg-green-200 transition-colors"
            >
              {{ getFilterLabel(key, value) }}
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </template>
        </div>
      </div>

      <!-- MOBILE FILTER DRAWER -->
      <Teleport to="body">
        <Transition name="drawer">
          <div v-if="showFilterDrawer" class="fixed inset-0 z-50">
            <div 
              @click="showFilterDrawer = false" 
              class="absolute inset-0 bg-black bg-opacity-50"
            ></div>
            
            <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl">
              <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 class="text-lg font-bold text-slate-900">Filter Results</h3>
                <button @click="showFilterDrawer = false" class="text-slate-500 hover:text-slate-700">
                  <i class="pi pi-times text-lg"></i>
                </button>
              </div>
              
              <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-24">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <Dropdown 
                    v-model="tempFilters.categoryId" 
                    :options="categoryOptions" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="All Categories"
                    class="w-full"
                    :pt="{
                      root: { class: 'border-slate-300 rounded-xl' },
                      input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
                    }"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Badges</label>
                  <Dropdown 
                    v-model="tempFilters.badges" 
                    :options="badgeOptions" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="All Badges"
                    class="w-full"
                    :pt="{
                      root: { class: 'border-slate-300 rounded-xl' },
                      input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
                    }"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <Dropdown 
                    v-model="tempFilters.location" 
                    :options="locationOptions" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="All Locations"
                    class="w-full"
                    :pt="{
                      root: { class: 'border-slate-300 rounded-xl' },
                      input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
                    }"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Minimum Rating</label>
                  <Dropdown 
                    v-model="tempFilters.stars" 
                    :options="ratingOptions" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="Any Rating"
                    class="w-full"
                    :pt="{
                      root: { class: 'border-slate-300 rounded-xl' },
                      input: { class: 'px-4 py-2.5 focus:ring-2 focus:ring-[#008253]' }
                    }"
                  />
                </div>
              </div>

              <div class="border-t border-slate-200 p-4 flex gap-3 bg-white">
                <button 
                  @click="clearTempFilters" 
                  class="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  @click="applyFilters" 
                  class="flex-1 px-4 py-3 bg-[#008253] text-white rounded-xl font-medium hover:bg-[#006f45] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <div class="mb-4">
        <p class="text-sm text-slate-600">
          Showing <span class="font-semibold text-slate-900">{{ filteredBusinesses.length }}</span> result(s)
          <!-- <span v-if="filters.category" class="text-slate-400"> in <span class="text-[#008253] font-semibold">{{ filters.category }}</span></span>
          <span v-else-if="filters.tagName" class="text-slate-400"> tagged <span class="text-[#008253] font-semibold">{{ filters.tagName }}</span></span> -->
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 space-y-4">
          
          <template v-if="isLoading">
            <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-sm border-2 p-4 border-slate-100 animate-pulse">
              <div class="grid grid-cols-[auto_1fr] gap-4">
                <div class="w-24 h-24 bg-slate-200 rounded-full"></div>
                <div class="bg-slate-50 rounded-xl my-4 mr-4 p-4 space-y-3">
                  <div class="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div class="h-3 bg-slate-200 rounded w-full"></div>
                  <div class="flex gap-2">
                    <div class="h-6 bg-slate-200 rounded w-16"></div>
                    <div class="h-6 bg-slate-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="filteredBusinesses.length > 0">
            <div
              v-for="business in filteredBusinesses" 
              :key="business.id || (business as any).businessId"
              @click="navigateToBiz(business)"
              class="bg-white space-y-4 rounded-xl shadow-sm border-2 p-4 transition-all duration-300 border-slate-200 hover:shadow-lg hover:border-slate-300 cursor-pointer"
            >
              <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                <div class="flex flex-col gap-1">
                  <div class="relative w-24 h-24 max-[430px]:w-16 max-[430px]:h-16"> 
                    <div class="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-slate-200 overflow-hidden">
                      <img 
                        @click.stop="focusedBusinessId = business.id || (business as any).businessId" 
                        :src="('logo' in business ? business.logo : null) || '/images/default-business-logo.png'" 
                        class="w-full h-full object-cover" 
                      />
                    </div>
                    <div class="absolute -top-2 -right-2">
                      <Badge :type="('isVerified' in business && business.isVerified) ? 'verified' : 'standard'" />
                    </div>
                  </div>

                  <div class="text-center">
                    <div class="flex items-center gap-1 justify-center">
                      <span class="text-lg font-bold text-slate-900">{{ getDisplayRating(business.avgRating) }}</span>
                      <div class="hidden min-[401px]:flex">
                        <Star :count="business?.avgRating || 0" :rounded="true"/>
                      </div>
                      <div class="flex min-[401px]:hidden">
                        <Star :count="business?.avgRating || 0" :rounded="true"/>
                      </div>
                    </div>
                    <button @click.stop="focusedBusinessId = business.id || (business as any).businessId" class="text-xs text-[#008253] font-semibold hover:underline">
                      {{ business.reviewCount ?? 0 }} reviews
                    </button>
                  </div>
                </div>

                <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl my-4 mr-4 p-4 border border-slate-200 relative min-w-0">
                  <div class="flex justify-between items-start gap-2">
                    <div class="min-w-0 flex-1">
                      <h3 
                        @click.stop="focusedBusinessId = business.id || (business as any).businessId" 
                        class="text-xl font-bold text-slate-900 mb-3 break-words max-[430px]:text-sm"
                      >
                        {{ business.name }}
                      </h3>
                    </div>
                    <div 
                      class="relative group flex-shrink-0" 
                      @mouseenter="showContact = business.id || (business as any).businessId" 
                      @mouseleave="hideContact()"
                    >
                      <i @click.stop class="pi pi-phone text-gray-500 text-lg cursor-pointer hover:text-slate-800"></i>
                      <div 
                        v-if="showContact === (business.id || (business as any).businessId)" 
                        class="absolute right-0 mt-2 w-56 bg-white text-sm text-slate-600 shadow-lg rounded-lg p-3 border border-slate-200 animate-fade z-50"
                      >
                        <p><strong>Tel:</strong> {{ ('businessPhoneNumber' in business ? business.businessPhoneNumber : 'N/A') ?? 'N/A' }}</p>   
                        <p><strong>Address:</strong> {{ ('businessAddress' in business ? business.businessAddress : 'N/A') ?? 'N/A' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-1">
                    <template v-if="'categories' in business && business.categories">
                      <button
                        v-for="cat in business.categories"
                        :key="cat.id"
                        @click.stop="filterByCategoryName(cat.name)"
                        class="text-sm bg-white px-2 py-1 rounded-lg text-slate-500 border border-slate-300 hover:bg-[#008253] hover:text-primary transition-all"
                      >
                        {{ cat.name }}
                      </button>
                    </template>
                  </div>
                </div>
              </div>

              <div 
                v-if="focusedBusinessId === (business.id || (business as any).businessId)"
                class="md:hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              >
                <div class="flex items-center gap-4 mb-2 pb-2 border-b border-slate-200">
                  <img 
                    :src="('logo' in business ? business.logo : null) || '/images/default-business-logo.png'" 
                    class="w-12 h-12 rounded-full object-cover border border-slate-200" 
                  />
                  <div>
                    <h3 class="text-sm font-demibold mb-1">{{ business.name }}</h3>
                    <div class="flex flex-wrap gap-1">
                      <template v-if="business.tags && business.tags.length > 0">
                        <span 
                          v-for="tag in business.tags" 
                          :key="typeof tag === 'object' ? tag.id : tag"
                          class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-md uppercase tracking-wider"
                        >
                          {{ typeof tag === 'object' ? tag.name : tag }}
                        </span>
                      </template>
                      <span v-else class="text-[10px] text-slate-400 italic font-medium">No tags</span>
                    </div>
                  </div>
                </div>

                <div class="bg-slate-50 rounded-lg p-4">
                  <div class="flex items-center gap-1 mb-1">
                    <i class="pi pi-sparkles text-[#008253] text-[10px]"></i>
                    <span class="text-[10px] font-bold text-slate-500 uppercase">Review Summary</span>
                  </div>
                  <p class="text-xs text-slate-700 leading-relaxed">
                    No review summary available yet.
                  </p>
                </div>

                <button 
                  @click="navigateToBiz(business)"
                  class="w-full mt-4 py-2 bg-[#008253] text-white rounded-xl text-sm font-bold hover:bg-[#006f45] transition-colors"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </template>

          <div v-if="!isLoading && !isSearchingName && filteredBusinesses.length === 0" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <i class="pi pi-search text-5xl text-slate-300 mb-4"></i>
            <h3 class="text-xl font-bold text-slate-900 mb-2">No results found</h3>
            <p class="text-slate-600 mb-4">Try adjusting your filters</p>
            <button @click="clearAllFilters" class="px-6 py-2 bg-[#008253] text-white rounded-xl hover:bg-[#008258]">
              Clear all filters
            </button>
          </div>
        </div>

        <div class="hidden md:block md:col-span-1 sticky top-60 self-start">
          <div v-if="focusedBusiness" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center gap-4 mb-2 pb-2 border-b border-slate-200">
              <img 
                :src="('logo' in focusedBusiness && focusedBusiness.logo) ? String(focusedBusiness.logo) : '/images/default-business-logo.png'" 
                class="w-16 h-16 rounded-full object-cover border border-slate-200" 
              />
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-bold truncate">{{ focusedBusiness.name }}</h3>
                <div class="flex flex-wrap gap-1 mt-1">
                  <template v-if="focusedBusiness.tags && focusedBusiness.tags.length > 0">
                    <span 
                      v-for="tag in focusedBusiness.tags" 
                      :key="typeof tag === 'object' ? tag.id : tag"
                      class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-medium"
                    >
                      {{ typeof tag === 'object' ? tag.name : tag }}
                    </span>
                  </template>
                  <span v-else class="text-[10px] text-slate-400 italic">No tags</span>
                </div>
              </div>
            </div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Review Summary</p>
            <div class="bg-slate-50 rounded-lg p-4">
              <p class="text-xs text-slate-700 leading-relaxed">
                {{ ('businessDescription' in focusedBusiness ? focusedBusiness.businessDescription : null) ?? 'No summary available for this business.' }}
              </p>
            </div>
            <button 
              @click="navigateToBiz(focusedBusiness)"
              class="w-full mt-4 py-2 bg-[#008253] text-white rounded-xl text-sm font-bold hover:bg-[#006f45] transition-colors"
            >
              View Full Profile
            </button>
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
import Badge from '~/components/Badge.vue'
import useSearch from '~/composables/search/useSearch'
import useBusinessMethods from '~/composables/business/useBusinessMethods';
import type { Business } from '~/types/business';

const route = useRoute()
const router = useRouter();
const { search } = useSearch()
const { getCategories, getBusinessByCategory, getBusinessByTag } = useBusinessMethods(); 

const businesses = ref<Business[]>([])
const categories = ref<any[]>([]) 
const isLoading = ref(true) 
const isSearchingName = ref(false)
const showContact = ref<string | null>(null)
const focusedBusinessId = ref<string | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Mobile filter drawer state
const showFilterDrawer = ref<boolean>(false)
const tempFilters = ref<{
  categoryId: string
  badges: string
  location: string
  stars: string
}>({
  categoryId: '',
  badges: '',
  location: '',
  stars: ''
})

const filters = ref<any>({
  name: route.query.name || route.query.q || '',
  categoryId: route.query.categoryId || '',  // Read categoryId from URL
  category: route.query.category || '',      // Read category name from URL
  badges: '',
  location: '',
  stars: '',
  tagId: route.query.tagId || '',
  tagName: route.query.tagName || ''
})

const activeFilterCount = computed<number>(() => {
  let count = 0
  if (filters.value.categoryId) count++  // Count ID only, not name
  if (filters.value.badges) count++
  if (filters.value.location) count++
  if (filters.value.stars) count++
  return count
})

// When category dropdown changes, also update the category name
const onCategoryDropdownChange = (event: any) => {
  const selectedId = event.value;
  if (!selectedId) {
    filters.value.category = '';
    return;
  }
  const match = categories.value.find(c => (c.categoryId || c.id) === selectedId);
  if (match) {
    filters.value.category = match.name;
  }
};

// Also sets category name when clicking category tags on business cards
const filterByCategoryName = (name: string) => {
  const match = categories.value.find(
    c => (c.name || '').toLowerCase() === name.toLowerCase()
  );

  if (match) {
    filters.value.categoryId = match.categoryId || match.id;
    filters.value.category = match.name;  // Set name alongside ID
    filters.value.tagId = ''; 
    filters.value.tagName = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const applyFilters = (): void => {
  //  Also resolve category name when applying from mobile drawer
  const selectedId = tempFilters.value.categoryId;
  if (selectedId) {
    const match = categories.value.find(c => (c.categoryId || c.id) === selectedId);
    filters.value.category = match ? match.name : '';
  } else {
    filters.value.category = '';
  }

  filters.value.categoryId = tempFilters.value.categoryId
  filters.value.badges = tempFilters.value.badges
  filters.value.location = tempFilters.value.location
  filters.value.stars = tempFilters.value.stars
  showFilterDrawer.value = false
}

const clearTempFilters = (): void => {
  tempFilters.value = {
    categoryId: '',
    badges: '',
    location: '',
    stars: ''
  }
}

const navigateToBiz = (input: any) => {
  const id = (typeof input === 'object' && input !== null) 
    ? (input.id || input.businessId) 
    : input;
  if (!id) return;
  return navigateTo(`/biz/${id}`);
};

const performMainFetch = async () => {
  isLoading.value = true;
  businesses.value = []; 

  try {
    if (filters.value.categoryId) {
      const res = await getBusinessByCategory(filters.value.categoryId);
      businesses.value = res?.data || [];
    } else {
      const res = await search(filters.value.name || 'a');
      businesses.value = Array.isArray(res) ? res : (res.companies || []);
    }
  } catch (e) { 
    businesses.value = []; 
  } finally { 
    isLoading.value = false; 
  }
}

const fetchByTag = async (tagId: string) => {
  isLoading.value = true;
  businesses.value = [];
  try {
    const res = await getBusinessByTag(tagId);
    businesses.value = res?.data || [];
  } catch (error) {
    businesses.value = [];
  } finally {
    isLoading.value = false;
  }
}

const fetchResults = async (q: string) => {
  try {
    const res = await search(q)
    businesses.value = Array.isArray(res) ? res : (res.companies || [])
  } catch (error) {
    businesses.value = []
  } finally {
    isLoading.value = false
  }
}

//  When categoryId changes, clear category name if ID was cleared
watch(() => filters.value.categoryId, async (newId) => {
  if (!newId) {
    filters.value.category = '';
  }
  filters.value.tagId = '';
  filters.value.tagName = '';
  await performMainFetch();
})

watch(() => filters.value.name, (newVal: string) => {
  if (filters.value.categoryId || filters.value.tagId) return; 
  if (newVal) {
    isSearchingName.value = true
  }
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (newVal) {
      await fetchResults(newVal)
    } else {
      await performMainFetch()
    }
    isSearchingName.value = false
  }, 400)
})

// Sync temp filters when drawer opens
watch(showFilterDrawer, (isOpen: boolean) => {
  if (isOpen) {
    tempFilters.value = {
      categoryId: filters.value.categoryId,
      badges: filters.value.badges,
      location: filters.value.location,
      stars: filters.value.stars
    }
  }
})

const categoryOptions = computed(() => {
  const baseOptions = [{ label: 'All', value: '' }]
  const dynamicOptions = categories.value.map(cat => ({
    label: cat.name,
    value: cat.categoryId || cat.id 
  }))
  return [...baseOptions, ...dynamicOptions]
})

const filteredBusinesses = computed(() => {
  if (isLoading.value) return [];
  
  return businesses.value.filter((b: Business) => {
    const searchName = (filters.value.name || '').toLowerCase();
    const matchesName = !filters.value.name || (b.name || '').toLowerCase().includes(searchName);
    const matchesBadge = !filters.value.badges || (filters.value.badges === 'verified' && ('isVerified' in b && b.isVerified));
    const rating = typeof b.avgRating === 'string' ? parseFloat(b.avgRating) : (b.avgRating ?? 0);
    const matchesStars = !filters.value.stars || rating >= parseFloat(filters.value.stars);
    
    return matchesName && matchesBadge && matchesStars;
  });
})

// Exclude 'category' from hasActiveFilters - it's display-only
const hasActiveFilters = computed(() => 
  Object.entries(filters.value).some(([key, v]) => 
    v && !['category'].includes(key)
  )
);

const focusedBusiness = computed(() => {
  if (!focusedBusinessId.value) return null;
  return businesses.value.find(b => {
    const currentId = b.id || (b as any).businessId;
    return currentId === focusedBusinessId.value;
  });
});

const badgeOptions = ref([{ label: 'All', value: '' }, { label: 'Verified', value: 'verified' }])
const locationOptions = ref([{ label: 'All', value: '' }, { label: 'Lagos', value: 'lagos' }])
const ratingOptions = ref([{ label: 'Any', value: '' }, { label: '4.5+', value: '4.5' }, { label: '4+', value: '4' }])

const clearFilter = (key: string): void => {
  filters.value[key] = '';
  if (key === 'categoryId') {
    filters.value.category = '';   // Clear name when ID is cleared
    filters.value.tagId = '';
    filters.value.tagName = '';
    performMainFetch();
  }
  if (key === 'tagName') {
    filters.value.tagId = '';
    filters.value.tagName = '';
    performMainFetch();
  }
};

const clearAllFilters = () => {
  filters.value = { 
    name: '', 
    categoryId: '', 
    category: '',    //  Clear name too
    badges: '', 
    location: '', 
    stars: '', 
    tagId: '', 
    tagName: '' 
  };
  performMainFetch();
};

function getFilterLabel(key: any, value: any): string {
  const k = String(key);
  if (k === 'name') return String(value); 
  if (k === 'tagName') return String(value);
  // Show category name directly instead of looking up by ID
  if (k === 'categoryId') return filters.value.category || categoryOptions.value.find(opt => opt.value === value)?.label || 'Category';
  
  const optionsMap: Record<string, any[]> = { 
    badges: badgeOptions.value, 
    location: locationOptions.value, 
    stars: ratingOptions.value 
  };
  return optionsMap[k]?.find((opt: any) => opt.value === value)?.label || value;
}

function hideContact() { 
  setTimeout(() => { showContact.value = null; }, 2000); 
}

onMounted(async () => { 
  isLoading.value = true
  try {
    const res = await getCategories();
    categories.value = Array.isArray(res) ? res : (res.data || []);
    
    // ✅ Sync all filters from URL query params including category name
    if (Object.keys(route.query).length > 0) {
      Object.keys(filters.value).forEach(key => {
        if (route.query[key]) {
          filters.value[key] = route.query[key];
        }
      });
    }

    // ✅ If categoryId is in URL but category name isn't, resolve it from categories
    if (filters.value.categoryId && !filters.value.category) {
      const match = categories.value.find(
        c => (c.categoryId || c.id) === filters.value.categoryId
      );
      if (match) filters.value.category = match.name;
    }

    if (filters.value.tagId) {
      await fetchByTag(filters.value.tagId);
    } else {
      await performMainFetch();
    }
  } catch (error) {
    console.error("Init error:", error);
  } finally {
    isLoading.value = false;
  }
})

// ✅ Keep URL in sync with filters, excluding internal-only keys
watch(filters, (newFilters) => {
  const query = { ...newFilters };

  Object.keys(query).forEach(key => {
    if (!query[key] || key === 'tagId') { 
      delete query[key];
    }
  });

  router.push({ query, replace: true });
}, { deep: true });
const getDisplayRating = (rating: number | string | undefined): string => {
  const numRating = typeof rating === 'string' ? parseFloat(rating) : (rating ?? 0);
  
  const integerPart = Math.floor(numRating);
  const decimalPart = numRating - integerPart;
  const decimal = Math.round(decimalPart * 100) / 100;
  
  let displayValue;
  if (decimal <= 0.35) {
    // Round down: 1.35 → 1.0, 2.35 → 2.0
    displayValue = integerPart;
  } else if (decimal <= 0.65) {
    // Half star: 1.4-1.65 → 1.5, 2.4-2.65 → 2.5
    displayValue = integerPart + 0.5;
  } else {
    // Round up: 1.7 → 2.0, 2.7 → 3.0
    displayValue = integerPart + 1;
  }
  
  return displayValue.toFixed(1);
};
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .absolute.bottom-0,
.drawer-leave-to .absolute.bottom-0 {
  transform: translateY(100%);
}

:deep(.mobile-filter-drawer .p-sidebar) {
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}

:deep(.mobile-filter-drawer .p-sidebar-content) {
  overflow-y: auto;
  max-height: calc(85vh - 140px);
}

.text-gold { color: #deae29; }

@keyframes fadeInOut {
  0%   { opacity: 0; transform: translateY(4px); }
  10%  { opacity: 1; transform: translateY(0); }
  90%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(4px); }
}
.animate-fade { animation: fadeInOut 2.5s forwards; }

:deep(.p-dropdown) { background: rgb(248 250 252); border-color: rgb(203 213 225); border-radius: 0.75rem; }
:deep(.p-dropdown:not(.p-disabled):hover) { border-color: #008253; }
:deep(.p-dropdown:not(.p-disabled).p-focus) { outline: none; border-color: #008253; box-shadow: 0 0 0 2px rgba(0, 130, 83, 0.2); }
:deep(.p-dropdown-label) { padding: 0.625rem 1rem; }
:deep(.p-dropdown-panel) { border-radius: 0.75rem; border-color: rgb(203 213 225); }
:deep(.p-dropdown-item) { padding: 0.625rem 1rem; }
:deep(.p-dropdown-item:not(.p-disabled):hover) { background: rgb(248 250 252); color: #008253; }
:deep(.p-dropdown-item.p-highlight) { background: #008253; color: white; }
</style>