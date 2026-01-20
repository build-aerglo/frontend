<template>
  <nav
    class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
    <div class="mx-auto px-8 flex items-center justify-between h-16">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <img src="~/assets/images/e-user-logo.png" alt="Welcome" class="h-10 w-auto object-contain" />
      </NuxtLink>

      <div class="flex items-right space-x-8">
        <ul class="hidden md:flex items-center space-x-8 dark:text-gray-200 font-medium">
          <li class="relative">
            <button @click="toggleBusinessDropdown" class="flex items-center hover:text-primary focus:outline-none after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
              hover:after:w-full">
              For Business
              <i class="pi pi-chevron-down ml-1 text-sm"></i>
            </button>

            <div v-if="showBusinessDropdown"
              class="absolute mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-56 z-50">
              <NuxtLink to="/business/auth/sign-up"
                class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <i class="pi pi-briefcase mr-2 text-primary"></i>
                Add a Business
              </NuxtLink>
              <NuxtLink to="/business/auth/sign-in"
                class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <i class="pi pi-sign-in mr-2 text-primary"></i>
                Log in to Your Business Account
              </NuxtLink>
              <NuxtLink to="/biz/[id]/claim-business"
                class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <i class="pi pi-id-card mr-2 text-primary"></i>
                Claim a Business
              </NuxtLink>
            </div>
          </li>
          <li>
            <button @click="handleWriteReviewClick" class="px-6 py-2 bg-[#008253] text-white rounded-lg shadow hover:bg-[#008260] transition">
              Write a review
            </button>
          </li>
        </ul>

        <button class="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none"
          @click="isOpen = !isOpen">
          <i :class="isOpen ? 'pi pi-bars text-sm' : 'pi pi-bars text-sm'"></i>
        </button>
      </div>
    </div>

    <div :class="[
      'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 md:hidden z-50',
      isOpen ? 'translate-y-0' : '-translate-x-full',
    ]">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <NuxtLink to="/links"><img src="/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" /></NuxtLink>
        <button @click="isOpen = false" class="text-gray-600 dark:text-gray-200">
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>

      <ul
        class="flex flex-col bg-white border-b border-gray-200 text-gray-800 dark:text-white font-medium p-8 space-y-4">
        <li>
          <button @click="handleWriteReviewClick" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
              hover:after:w-full">Write a Review</button>
        </li>
        <li>
          <NuxtLink to="/end-user/landing/categories" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
              hover:after:w-full">Categories</NuxtLink>
        </li>

        <li>
          <button @click="toggleBusinessDropdown"
            class="flex items-center justify-between w-full hover:text-primary focus:outline-none">
            <span>For Business</span>
            <i class="pi pi-chevron-down text-sm"></i>
          </button>

          <div v-if="showBusinessDropdown" class="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <NuxtLink to="/business/auth/sign-up"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="pi pi-briefcase mr-2 text-primary"></i>
              Add a Business
            </NuxtLink>
            <NuxtLink to="/business/auth/sign-in"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="pi pi-sign-in mr-2 text-primary"></i>
              Log in to Your Business Account
            </NuxtLink>
            <NuxtLink to="/biz/[id]/claim-business"
                class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <i class="pi pi-id-card mr-2 text-primary"></i>
                Claim a Business
              </NuxtLink>
          </div>
        </li>

        <li>
          <NuxtLink to="/end-user/auth/sign-in"
            class="inline-flex items-center justify-center bg-[#008253] text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition w-full text-center">
            Login/Register
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-30 md:hidden bg-black/5 backdrop-blur-sm transition-all duration-300"
      @click="isOpen = false"></div>

    <Teleport to="body">
      <div v-if="showReviewModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px] animate-in fade-in zoom-in duration-200">
          <button @click="closeModal" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600"><i class="pi pi-times text-xl"></i></button>
          
          <h2 class="text-2xl md:text-3xl font-bold text-center text-[#008253] mb-6">Share Your Experience</h2>
          
          <div class="space-y-4">
             <div class="relative">
              <label class="block text-sm font-medium text-gray-900 mb-1">Business Name *</label>
              <div class="relative">
                <input type="text" v-model="businessName" placeholder="search for a business.." @input="handleBusinessInput" @focus="showSearchDropdown = true" class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] outline-none" />
                <i v-if="isSearching" class="pi pi-spin pi-spinner absolute right-10 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <img v-if="selectedBusinessId" :src="selectedBusinessLogo || '/images/default-business-logo.png'" class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain rounded" />
              </div>
              <ul v-if="showSearchDropdown && filteredBusinesses.length" class="bg-white shadow-xl mt-1 rounded-lg border max-h-60 overflow-y-auto absolute z-50 w-full">
                <li v-for="(b, i) in filteredBusinesses" :key="i" @click="selectBusiness(b)" class="px-4 py-3 cursor-pointer hover:bg-green-50 border-b flex items-center gap-3">
                  <img v-if="b.logo" :src="b.logo" class="w-6 h-6 rounded-full object-cover" />
                  <span class="font-medium text-gray-800">{{ b.name }}</span>
                </li>
              </ul>
            </div>
            <p v-if="selectedBusinessId && !isAddingNewBusiness" class="text-xs text-green-600 mt-1 font-medium">
              ✓ Existing business selected
            </p>

            <div v-if="businessName.trim() && !isSearching && filteredBusinesses.length === 0 &&      !selectedBusinessId && !isAddingNewBusiness" 
                class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p class="text-xs text-amber-800 mb-2">Can't find "{{ businessName }}"?</p>
              <button @click="isAddingNewBusiness = true" class="text-xs bg-[#008253] text-white px-3 py-1.5 rounded-lg hover:bg-[#006d47]">
                + Add as New Business
              </button>
            </div>

            <div v-if="isAddingNewBusiness" class="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200 mt-2">
              <div class="flex justify-between items-center"><p class="text-xs font-semibold text-green-800">New Business Location</p>
              <button @click="isAddingNewBusiness = false" class="text-[10px] text-red-500 underline">Cancel</button></div>
              <select v-model="newBusinessState" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#008253] outline-none">
                <option value="">Select State *</option>
                <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
              </select>
              <select v-model="newBusinessCity" :disabled="!newBusinessState" class="w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 outline-none">
                <option value="">Select City *</option>
                <option v-for="c in newBusinessCities" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

           <div v-if="selectedBusinessId && !isAddingNewBusiness" class="space-y-3 mt-2">
              <label class="block text-sm font-medium text-gray-900">Branch/Location *</label>

              <select v-model="selectedBranchOption" :disabled="manualEntryEnabled || isLoadingBranches"
                class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#008253] outline-none disabled:bg-gray-50">
                <option value="">{{ isLoadingBranches ? 'Loading branches...' : 'Select a branch...' }}</option>

                <!-- ✅ Only show "Online" if it doesn't already exist -->
                <option v-if="!hasOnlineBranch" value="online">Online</option>

                <!-- ✅ Show all fetched branches -->
                <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                  {{ branch.branchCityTown }}, {{ branch.branchState }}
                </option>
              </select>

              <div class="flex items-center space-x-2">
                <input type="checkbox" id="navManual" v-model="manualEntryEnabled" class="w-3 h-3 accent-[#008253]" />
                <label for="navManual" class="text-xs text-gray-600 cursor-pointer">Branch not found? Enter
                  manually</label>
              </div>

              <div v-if="manualEntryEnabled"
                class="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200 transition-all">
                <select v-model="manualState" class="w-full border rounded-lg px-3 py-2 text-sm outline-none">
                  <option value="">Select State *</option>
                  <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
                </select>
                <select v-model="manualCity" :disabled="!manualState"
                  class="w-full border rounded-lg px-3 py-2 text-sm outline-none disabled:bg-gray-100">
                  <option value="">Select City *</option>
                  <option v-for="c in manualCities" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Rating *</label>
              <div class="flex items-center">
                <Stars v-for="n in 5" :key="n" :value="(hoverRating || rating) - (n - 1)" :color-level="Math.ceil(hoverRating || rating)" class="cursor-pointer"
                  @mousemove="hoverRating = n - 1 + getFraction($event)" @mouseleave="hoverRating = 0" @click="setRating(n - 1 + getFraction($event))" />
                <span class="ml-2 text-sm text-gray-700">{{ rating > 0 ? getRatingLabel(rating) : '' }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Your Review *</label>
              <textarea v-model="reviewBody" rows="4" class="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-[#008253] outline-none" placeholder="How was it?"></textarea>

            </div>

            <ImageUploader v-model="images" path="reviews" label="Add Images" :max="3" />

            <div v-if="!showEmailInput" class="grid grid-cols-2 gap-4 mt-6">
              <div class="flex flex-col gap-1">
                <button @click="showEmailInput = true" class="py-3 bg-[#008253] text-white  rounded-xl">Review as guest</button>
                <span class="text-center text-[12px] sm:text-xs md:text-sm">No account needed</span>
              </div>
              <div class="flex flex-col gap-1">
                <button @click="handleUserReviewRedirect" class="py-3 border-1 border-[#008253] text-[#008253]  rounded-xl hover:bg-green-50">Review as user</button>
                <span class="text-center text-[12px] sm:text-xs md:text-sm">Earn points and track your reviews</span>
              </div>
            </div>
            <div v-else class="pt-4 space-y-3 border-t">
              <label class="block text-sm font-medium text-gray-900 mb-1">Email address *</label>
              <input type="email" v-model="email" placeholder="submit your email to review as a guest" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] outline-none" />
              <div class="flex gap-2">
                <button @click="showEmailInput = false" class="flex-1 text-gray-500 underline">Back</button>
                <button @click="submitReview" class="flex-[2] py-3 bg-[#008253] text-white rounded-xl">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">

import { useUserStore } from '~/store/user'
import useBusinessMethods from '~/composables/business/useBusinessMethods'
import useNigerianLocations from '~/composables/useNigerianLocations'
import useSearch from '~/composables/search/useSearch'
import Stars from '~/components/Stars.vue'
import ImageUploader from '~/components/Input/ImageUploader.vue'
import useReviewMethods from '~/composables/review/useReviewMethods'

const { submitUserReview } = useReviewMethods();
// Sidebar/Nav Toggle States
const isOpen = ref(false)
const showBusinessDropdown = ref(false)
const userStore = useUserStore()
const router = useRouter()
const { search } = useSearch()

// Modal States
const showReviewModal = ref(false)
const showEmailInput = ref(false)
const businessName = ref("")
const selectedBusinessId = ref("")
const selectedBusinessLogo = ref("")
const isSearching = ref(false)
const showSearchDropdown = ref(false)
const rating = ref(0)
const hoverRating = ref(0)
const reviewBody = ref("")
const images = ref<string[]>([])
const email = ref("")
const filteredBusinesses = ref<any[]>([])

let debounceTimer: any = null
const { getBusinessBranches } = useBusinessMethods()
const { getStates, getCitiesByState } = useNigerianLocations()

// --- NEW STATE FOR BRANCHES & LOCATIONS ---
const isAddingNewBusiness = ref(false)
const isLoadingBranches = ref(false)
const branches = ref<any[]>([])
const selectedBranchOption = ref("")
const manualEntryEnabled = ref(false)

// Location Fields
const newBusinessState = ref("")
const newBusinessCity = ref("")
const manualState = ref("")
const manualCity = ref("")

const states = getStates()
const newBusinessCities = computed(() => newBusinessState.value ? getCitiesByState(newBusinessState.value) : [])
const manualCities = computed(() => manualState.value ? getCitiesByState(manualState.value) : [])
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleBusinessDropdown = (event: MouseEvent) => {
  event.stopPropagation()
  showBusinessDropdown.value = !showBusinessDropdown.value
}

const handleClickOutside = () => {
  showBusinessDropdown.value = false
  showSearchDropdown.value = false
}

const handleWriteReviewClick = () => {
  isOpen.value = false // Close sidebar if open
  if (userStore.isAuthenticated) {
    router.push('review/write-review')
  } else {
    showReviewModal.value = true
  }
}


const hasOnlineBranch = computed(() => {
  return branches.value.some(b =>
    b.name?.toLowerCase() === 'online' ||
    b.branchName?.toLowerCase() === 'online' ||
    (b.branchCityTown?.toLowerCase() === 'online' && b.branchState?.toLowerCase() === 'online')
  );
});

// --- UPDATED METHODS ---

const fetchBranches = async (businessId: string) => {
  isLoadingBranches.value = true
  branches.value = []

  try {
    // 1. Fetch existing branches
    const result = await getBusinessBranches(businessId)
    const branchData = Array.isArray(result) ? result : (result?.data || [])

    // 2. ALWAYS fetch business profile for main address
    const { getBusinessProfile } = useBusinessMethods()
    const businessProfile = await getBusinessProfile(businessId)

    // 3. Start with empty array
    const allBranches: any[] = []

    // 4. Add main business address as pseudo-branch (if exists)
    if (businessProfile?.data?.businessAddress) {
      const address = businessProfile.data.businessAddress
      const addressParts = address.split(',').map((s: string) => s.trim())

      let city = ""
      let state = ""
      if (addressParts.length >= 2) {
        state = addressParts[addressParts.length - 1]
        city = addressParts[addressParts.length - 2]
      }

      allBranches.push({
        id: 'business-address',
        branchName: 'Main Location',
        branchCityTown: city,
        branchState: state,
        branchStreet: ''
      })
    }

    // 5. Add real branches
    if (branchData && branchData.length > 0) {
      allBranches.push(...branchData)
    }

    // 6. Set final branches
    branches.value = allBranches

    console.log(`NavBar: Loaded ${allBranches.length} branch options`, allBranches)
  } catch (error) {
    console.error("Failed to fetch branches:", error)
  } finally {
    isLoadingBranches.value = false
  }
}


const selectBusiness = async (b: any) => {
  businessName.value = b.name;
  
  // Try all common ID fields returned by the search API
  selectedBusinessId.value = b.businessId || b.id || b._id || "";
  
  selectedBusinessLogo.value = b.logo || "";
  isAddingNewBusiness.value = false;
  showSearchDropdown.value = false;
  
  if (selectedBusinessId.value) {
    await fetchBranches(selectedBusinessId.value);
  } else {
    console.error("No ID found for selected business:", b);
  }
};

const handleBusinessInput = () => {
  showSearchDropdown.value = true
  // Reset location states when typing
  selectedBusinessId.value = ""
  isAddingNewBusiness.value = false 
  
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!businessName.value.trim()) return
  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    const res = await search(businessName.value)
    filteredBusinesses.value = Array.isArray(res) ? res : (res.companies || [])
    isSearching.value = false
  }, 400)
}

const getRatingLabel = (r: number) => {
  const labels: any = { 1: "Not Great.", 2: "Needs Improvement.", 3: "Just Okay.", 4: "Really Good!", 5: "Fantastic!" }
  return labels[Math.floor(r)] || ""
}

const setRating = (val: number) => { rating.value = val }
const getFraction = (event: MouseEvent) => (event.clientX - (event.target as HTMLElement).getBoundingClientRect().left) / (event.target as HTMLElement).getBoundingClientRect().width < 0.5 ? 0.5 : 1
const closeModal = () => { showReviewModal.value = false; showEmailInput.value = false }
// Update the redirect to include the new location data
const handleUserReviewRedirect = () => {
  const draft = {
    businessName: businessName.value,
    selectedBusinessId: selectedBusinessId.value,
    selectedBusinessLogo: selectedBusinessLogo.value,
    isAddingNewBusiness: isAddingNewBusiness.value,
    selectedBranchOption: selectedBranchOption.value,
    manualEntryEnabled: manualEntryEnabled.value,
    newBusinessState: newBusinessState.value,
    newBusinessCity: newBusinessCity.value,
    manualState: manualState.value,
    manualCity: manualCity.value,
    rating: rating.value,
    reviewBody: reviewBody.value,
    images: images.value
  }
  
  localStorage.setItem('review_draft', JSON.stringify(draft))
  router.push({
    path: '/end-user/auth/sign-in',
    query: { redirect: '/review/write-review' }
  })
  closeModal()
}
const submitReview = async () => {
  // 1. Basic Validation
  if (!businessName.value.trim()) {
    alert("Please enter a business name");
    return;
  }
  if (rating.value === 0) {
    alert("Please provide a rating");
    return;
  }
  if (reviewBody.value.length < 20) {
    alert("Review must be at least 20 characters");
    return;
  }
  if (!email.value) {
    alert("Email is required for guest reviews");
    return;
  }

  // 2. Build review data based on scenario
  let reviewData: any = {
    // Rating & Content
    starRating: rating.value,
    reviewBody: reviewBody.value,
    photoUrls: images.value.length > 0 ? images.value : null,

    // User / Guest Info
    reviewerId: userStore.isAuthenticated ? userStore.userId : null,
    email: email.value,
    reviewAsAnon: true, // Always true for guest reviews in this modal
  };

  // ✅ SCENARIO 1: NEW BUSINESS
  if (isAddingNewBusiness.value) {
    if (!newBusinessState.value || !newBusinessCity.value) {
      alert("Please select both state and city for the new business");
      return;
    }

    reviewData = {
      ...reviewData,
      businessId: null,
      businessName: businessName.value,
      isNewBusiness: true,
      locationId: null,
      isNewBranch: false,
      branchStreet: null,
      branchCityTown: newBusinessCity.value,
      branchState: newBusinessState.value,
    };
  }
  // ✅ SCENARIO 2: EXISTING BUSINESS
  else {
    if (!selectedBusinessId.value) {
      alert("Please select a business");
      return;
    }

    // ✅ SCENARIO 2A: ONLINE - Check if Online branch exists
    if (selectedBranchOption.value === 'online') {
      const existingOnlineBranch = branches.value.find(b =>
        b.name?.toLowerCase() === 'online' ||
        (b.branchCityTown?.toLowerCase() === 'online' && b.branchState?.toLowerCase() === 'online')
      );

      if (existingOnlineBranch) {
        // REUSE existing Online branch
        reviewData = {
          ...reviewData,
          businessId: selectedBusinessId.value,
          businessName: null,
          isNewBusiness: false,
          locationId: existingOnlineBranch.id,
          isNewBranch: false,
          branchStreet: null,
          branchCityTown: null,
          branchState: null,
        };
      } else {
        // CREATE new Online branch
        reviewData = {
          ...reviewData,
          businessId: selectedBusinessId.value,
          businessName: null,
          isNewBusiness: false,
          locationId: null,
          isNewBranch: true,
          branchStreet: null,
          branchCityTown: 'Online',
          branchState: 'Online',
        };
      }
    }
    // ✅ SCENARIO 2B: PSEUDO-BRANCH (business-address)
    else if (selectedBranchOption.value === 'business-address') {
      reviewData = {
        ...reviewData,
        businessId: selectedBusinessId.value,
        businessName: null,
        isNewBusiness: false,
        locationId: selectedBusinessId.value, // Use businessId as locationId
        isNewBranch: false,
        branchStreet: null,
        branchCityTown: null,
        branchState: null,
      };
    }
    // ✅ SCENARIO 2C: MANUAL BRANCH ENTRY
    else if (manualEntryEnabled.value) {
      if (!manualState.value || !manualCity.value) {
        alert("Please select both state and city for the new branch");
        return;
      }

      reviewData = {
        ...reviewData,
        businessId: selectedBusinessId.value,
        businessName: null,
        isNewBusiness: false,
        locationId: null,
        isNewBranch: true,
        branchStreet: null,
        branchCityTown: manualCity.value,
        branchState: manualState.value,
      };
    }
    // ✅ SCENARIO 2D: EXISTING BRANCH
    else if (selectedBranchOption.value) {
      reviewData = {
        ...reviewData,
        businessId: selectedBusinessId.value,
        businessName: null,
        isNewBusiness: false,
        locationId: selectedBranchOption.value,
        isNewBranch: false,
        branchStreet: null,
        branchCityTown: null,
        branchState: null,
      };
    }
    // ✅ VALIDATION: Must select something
    else {
      alert("Please select a branch/location or enable manual entry");
      return;
    }
  }

  try {
    // 3. Call API
    const response = await submitUserReview(reviewData);
    console.log(response);
    alert("Review submitted successfully! It will be published after validation.");

    // 4. Reset Form & Close Modal
    resetForm();
    closeModal();
  } catch (error: any) {
    const msg = error.response?.data?.error || "Failed to submit review. Please try again.";
    alert(msg);
    console.error("Review submission error:", error);
  }
};

const resetForm = () => {
  businessName.value = "";
  selectedBusinessId.value = "";
  rating.value = 0;
  reviewBody.value = "";
  images.value = [];
  email.value = "";
  isAddingNewBusiness.value = false;
  manualEntryEnabled.value = false;
  selectedBranchOption.value = "";
  newBusinessState.value = "";
  newBusinessCity.value = "";
  manualState.value = "";
  manualCity.value = "";
};
</script>