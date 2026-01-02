<template>
  <NavBar />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl mt-0 shadow-sm border border-slate-200 p-6 mb-8 sticky top-[60px] z-30">
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
              v-if="value && String(key) !== 'tagName' && String(key) !== 'tag'"
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

      <div class="mb-4">
        <p class="text-sm text-slate-600">
          Showing <span class="font-semibold text-slate-900">{{ filteredBusinesses.length }}</span> result(s)
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 space-y-4">
          
          <template v-if="isLoading || isSearchingName">
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
              :key="business.id"
              @click="navigateToBiz(business)"
              class="bg-white rounded-xl shadow-sm border-2 p-4 transition-all duration-300 border-slate-200 hover:shadow-lg hover:border-slate-300 cursor-pointer"
            >
              <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                <div class="flex flex-col gap-1">
                  <div class="relative w-24 h-24"> 
                    <div class="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-slate-200 overflow-hidden">
                      <img :src="('logo' in business ? business.logo : null) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&h=200&auto=format&fit=crop'" class="w-full h-full object-cover" />
                    </div>
                    <div class="absolute -top-2 -right-2">
                      <Badge 
                        :type="('isVerified' in business && business.isVerified) ? 'verified' : 'standard'" 
                      />
                    </div>
                  </div>

                  <div class="text-center">
                    <div class="flex items-center gap-1 justify-center">
                      <span class="text-lg font-bold text-slate-900">{{ business.avgRating ?? 0 }}</span>
                      <div class="flex">
                        <Star v-for="n in 5" :key="n" :value="(business.avgRating ?? 0) - (n - 1)" class="w-4 h-4" :color-level="Math.floor(business.avgRating ?? 0)" />
                      </div>
                    </div>
                    <button @click.stop="focusedBusinessId = business.id" class="text-xs text-[#008253] font-semibold hover:underline">
                      {{ business.reviewCount ?? 0 }} reviews
                    </button>
                  </div>
                </div>

                <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl my-4 mr-4 p-4 border border-slate-200 relative min-w-0">
                  <div class="flex justify-between items-start gap-2">
                    <div class="min-w-0 flex-1">
                      <h3 class="text-xl font-bold text-slate-900 mb-3 break-words">{{ business.name }}</h3>
                    </div>
                    <div class="relative group flex-shrink-0" @mouseenter="showContact = business.id" @mouseleave="hideContact()">
                      <i @click.stop class="pi pi-phone text-gray-500 text-lg cursor-pointer hover:text-slate-800"></i>
                      <div v-if="showContact === business.id" class="absolute right-0 mt-2 w-56 bg-white text-sm text-slate-600 shadow-lg rounded-lg p-3 border border-slate-200 animate-fade z-50">
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
                        @click.stop="filterByTag(cat.name)"
                        class="text-sm bg-white px-2 py-1 rounded-lg text-slate-500 border border-slate-300 hover:bg-[#008253] hover:text-white transition-all"
                      >
                        {{ cat.name }}
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-if="filteredBusinesses.length === 0 && !isSearchingName && !isLoading" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
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
                  <img :src="('logo' in focusedBusiness ? focusedBusiness.logo : null) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&h=200&auto=format&fit=crop'" class="w-16 h-16 rounded-full object-cover border border-slate-200" />
                  <div>
                    <h3 class="text-sm font-bold">{{ focusedBusiness.name }}</h3>
                    <p class="text-xs text-slate-500">Review Summary</p>
                  </div>
                </div>
                <div class="bg-slate-50 rounded-lg p-4">
                  <p class="text-xs text-slate-700">{{ ('businessDescription' in focusedBusiness ? focusedBusiness.businessDescription : null) ?? 'No description provided.' }}</p>
                </div>
                <button 
                  @click="navigateToBiz(focusedBusiness.id)"
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
import Star from '~/components/Stars.vue' 
import Badge from '~/components/Badge.vue'
import useSearch from '~/composables/search/useSearch'
import useBusinessMethods from '~/composables/business/useBusinessMethods';
import type { Business } from '~/types/business';

const route = useRoute()
const { search } = useSearch()
const { getCategories, getBusinessByCategory, getBusinessByTag } = useBusinessMethods(); 

// State
const businesses = ref<Business[]>([])
const categories = ref<any[]>([]) 
const isLoading = ref(true) 
const isSearchingName = ref(false)
const showContact = ref<string | null>(null)
const focusedBusinessId = ref<string | null>(null)
let debounceTimer: any = null

const filters = ref<any>({
  name: route.query.q || '',
  category: '', 
  badges: '',
  location: '',
  stars: '',
  tag: '',
  tagId: route.query.tagId || '',
  tagName: route.query.tagName || ''
})

// --- API ACTIONS ---
const performMainFetch = async () => {
  isLoading.value = true;
  if (filters.value.category) {
    const targetCategory = categories.value.find(
      c => (c.name || '').toLowerCase() === filters.value.category.toLowerCase()
    );
    const categoryId = targetCategory?.categoryId || targetCategory?.id;

    if (categoryId) {
      try {
        const res = await getBusinessByCategory(categoryId);
        businesses.value = res?.data || [];
      } catch (e) { 
        businesses.value = []; 
      } finally { 
        isLoading.value = false; 
      }
      return;
    }
  }
  await fetchResults(filters.value.name || 'a');
}

const fetchByTag = async (tagId: string) => {
  isLoading.value = true;
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
  isLoading.value = true
  try {
    const res = await search(q)
    businesses.value = Array.isArray(res) ? res : (res.companies || [])
  } catch (error) {
    businesses.value = []
  } finally {
    isLoading.value = false
  }
}

watch(() => filters.value.category, async (newVal) => {
  if (newVal === undefined) return;
  filters.value.tagId = '';
  await performMainFetch();
})

watch(() => filters.value.name, (newVal) => {
  if (filters.value.category || filters.value.tagId) return; 

  isSearchingName.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    await fetchResults(newVal || 'a')
    isSearchingName.value = false
  }, 400)
})

watch(categories, (newVal) => {
  if (newVal.length > 0 && route.query.category) {
    const matchingCat = newVal.find(c => c.name.toLowerCase() === (route.query.category as string).toLowerCase());
    if (matchingCat) {
      filters.value.category = matchingCat.name;
    }
  }
}, { immediate: true })

// --- COMPUTED ---
const categoryOptions = computed(() => {
  const baseOptions = [{ label: 'All', value: '' }]
  const dynamicOptions = categories.value.map(cat => ({
    label: cat.name,
    value: cat.name 
  }))
  return [...baseOptions, ...dynamicOptions]
})

const filteredBusinesses = computed(() => {
  return businesses.value.filter(b => {
    const searchName = (filters.value.name || '').toLowerCase();
    const matchesName = !filters.value.name || (b.name || '').toLowerCase().includes(searchName);

    const matchesCategory = !filters.value.category || 
      ('categories' in b && b.categories?.some((c: any) => c.name.toLowerCase() === filters.value.category.toLowerCase()));

    const matchesBadge = !filters.value.badges || (filters.value.badges === 'verified' && 'isVerified' in b && b.isVerified);
    
    const rating = typeof b.avgRating === 'string' ? parseFloat(b.avgRating) : (b.avgRating ?? 0);
    const matchesStars = !filters.value.stars || rating >= parseFloat(filters.value.stars);
    
    const matchesTag = !filters.value.tag || ('categories' in b && b.categories?.some((c: any) => c.name.toLowerCase() === filters.value.tag.toLowerCase()));

    return matchesName && matchesCategory && matchesBadge && matchesStars && matchesTag;
  });
})

const hasActiveFilters = computed(() => Object.values(filters.value).some(v => v));
const focusedBusiness = computed(() => businesses.value.find(b => b.id === focusedBusinessId.value));

// --- UTILS ---
const badgeOptions = ref([{ label: 'All', value: '' }, { label: 'Verified', value: 'verified' }])
const locationOptions = ref([{ label: 'All', value: '' }, { label: 'Lagos', value: 'lagos' }])
const ratingOptions = ref([{ label: 'Any', value: '' }, { label: '4.5+', value: '4.5' }, { label: '4+', value: '4' }])

const navigateToBiz = (business: any) => {
  // Check for all possible ID variations
  const id = business.id || business.businessId;
  
  if (!id) {
    console.warn("Navigation attempted but no ID found in:", business);
    return;
  }
  
  return navigateTo(`/biz/${id}`);
};
const clearAllFilters = () => filters.value = { name: '', category: '', badges: '', location: '', stars: '', tag: '', tagId: '', tagName: '' };
const filterByTag = (tag: string) => { filters.value.tag = tag; window.scrollTo({ top: 0, behavior: 'smooth' }); };

function getFilterLabel(key: any, value: any): string {
  const k = String(key);
  const v = String(value);
  
  if (k === 'name') return v; 

  // If the key is tagId, return the tagName from our filters if we have it
  if (k === 'tagId') {
    return filters.value.tagName || 'Selected Tag';
  }

  // We don't want to show a separate chip for 'tagName' itself
  if (k === 'tagName') return '';
  
  const optionsMap: Record<string, any> = { 
    category: categoryOptions.value, 
    badges: badgeOptions.value, 
    location: locationOptions.value, 
    stars: ratingOptions.value 
  };
  
  return optionsMap[k]?.find((opt: any) => opt.value === v)?.label || v;
}

function hideContact() { setTimeout(() => { showContact.value = null; }, 2000); }

onMounted(async () => { 
  isLoading.value = true
  try {
    const res = await getCategories();
    categories.value = Array.isArray(res) ? res : (res.data || []);
    const tagId = route.query.tagId as string;
    
    if (tagId) {
      filters.value.tagId = tagId;
      await fetchByTag(tagId);
    } else {
      await performMainFetch();
    }
    
  } catch (error) {
    isLoading.value = false;
  }
})
const clearFilter = (key: string) => {
  filters.value[key] = '';
  if (key === 'tagId') {
    filters.value.tagName = '';
  }
};
</script>

<style scoped>
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