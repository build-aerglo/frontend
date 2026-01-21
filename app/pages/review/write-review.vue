<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mb-0">
      <NavBarReview />
    </div>

    <div class="w-full h-full px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10">

        <div class="md:col-span-6 md:order-2 rounded-xl bg-white p-6 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]">
          <h2 class="text-2xl md:text-3xl font-bold text-center text-[#008253] mb-6">Share Your Experience</h2>

          <div class="space-y-4">
            <!-- Business Name Input -->
            <div ref="businessDropdownRef" class="relative">
              <label class="block text-sm font-medium text-gray-900 mb-1">Business Name *</label>
              <div class="relative">
                <input type="text" v-model="businessName" @input="handleBusinessInput"
                  @focus="showBusinessDropdown = true" placeholder="Search for a business..."
                  class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] focus:outline-none" />

                <i v-if="isSearching"
                  class="pi pi-spin pi-spinner absolute right-10 top-1/2 -translate-y-1/2 text-gray-400"></i>

                <img 
                  v-if="selectedBusinessId || isAddingNewBusiness" 
                  :src="selectedBusinessLogo || '/images/default-business-logo.png'" 
                  alt="Business Logo"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain rounded" 
                />
              </div>

              <!-- Search Results Dropdown -->
              <ul v-if="showBusinessDropdown && filteredBusinesses.length"
                class="bg-white shadow-xl mt-1 rounded-lg border max-h-60 overflow-y-auto absolute z-50 w-full">
                <li v-for="(b, i) in filteredBusinesses" :key="i" @click="selectBusiness(b)"
                  class="px-4 py-3 cursor-pointer hover:bg-green-50 border-b last:border-none flex items-center gap-3">
                  <img v-if="b.logo" :src="b.logo || '/images/default-business-logo.png'" class="w-6 h-6 rounded-full object-cover" />
                  <span class="font-medium text-gray-800">{{ b.name }}</span>
                </li>
              </ul>

              <!-- "Can't find business" message -->
              <div
                v-if="businessName.trim() && !isSearching && filteredBusinesses.length === 0 && !selectedBusinessId && !isAddingNewBusiness"
                class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p class="text-sm text-amber-800 mb-2">Can't find "{{ businessName }}"?</p>
                <button @click="confirmAddNewBusiness"
                  class="text-sm bg-[#008253] text-white px-4 py-2 rounded-lg hover:bg-[#006d47] transition">
                  + Add as New Business
                </button>
              </div>

              <!-- Confirmation that new business will be created -->
              <p v-if="isAddingNewBusiness" class="text-xs text-green-600 mt-1 font-medium">
                ✓ New business "{{ businessName }}" will be created
              </p>
              <p v-else-if="selectedBusinessId" class="text-xs text-green-600 mt-1">
                ✓ Existing business selected
              </p>
            </div>

            <!-- Location fields for new business -->
            <div v-if="isAddingNewBusiness" class="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-green-800">New Business Location</p>
                <button @click="cancelAddNewBusiness" class="text-xs text-red-600 hover:text-red-800 underline">
                  Cancel
                </button>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">State *</label>
                <select v-model="newBusinessState"
                  class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#008253] focus:outline-none">
                  <option value="">Select state...</option>
                  <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">City/Town *</label>
                <select v-model="newBusinessCity" :disabled="!newBusinessState"
                  class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#008253] focus:outline-none disabled:bg-gray-100">
                  <option value="">Select city...</option>
                  <option v-for="city in newBusinessCities" :key="city" :value="city">{{ city }}</option>
                </select>
              </div>
            </div>

            <!-- Branch Selection (Only shown for existing business) -->
            <div v-if="selectedBusinessId && !isAddingNewBusiness">
              <label class="block text-sm font-medium text-gray-900 mb-1">Select Branch/Location *</label>

              <select v-model="selectedBranchOption" :disabled="manualEntryEnabled || isLoadingBranches"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed">
                <option value="">{{ isLoadingBranches ? 'Loading branches...' : 'Select a branch...' }}</option>

                <!-- ✅ Only show "Online" option if it doesn't already exist in branches -->
                <option v-if="!hasOnlineBranch" value="online">Online</option>

                <!-- ✅ Show all fetched branches (including pseudo-branch and real branches) -->
                <option v-for="option in branchOptions" :key="option.id" :value="option.id">
                  {{ option.display }}
                </option>
              </select>

              <!-- Manual Entry Checkbox -->
              <div class="mt-3 flex items-center space-x-2">
                <input type="checkbox" id="manualEntry" v-model="manualEntryEnabled" :disabled="isLoadingBranches"
                  class="w-4 h-4 rounded border-gray-300 accent-[#008253] disabled:opacity-50" />
                <label for="manualEntry" class="text-sm text-gray-700 cursor-pointer">
                  Branch not found? Manually enter branch
                </label>
              </div>

              <!-- Manual Entry Form -->
              <div v-if="manualEntryEnabled" class="mt-4 space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-sm font-medium text-blue-800 mb-2">Enter Branch Location</p>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">State *</label>
                  <select v-model="manualState"
                    class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#008253] focus:outline-none">
                    <option value="">Select state...</option>
                    <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">City/Town *</label>
                  <select v-model="manualCity" :disabled="!manualState"
                    class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#008253] focus:outline-none disabled:bg-gray-100">
                    <option value="">Select city...</option>
                    <option v-for="city in manualCities" :key="city" :value="city">{{ city }}</option>
                  </select>
                </div>
              </div>

              <!-- Confirmation messages -->
              <p v-if="selectedBranchOption === 'online'" class="text-xs text-green-600 mt-2 font-medium">
                ✓ Online business selected
              </p>
              <p v-else-if="selectedBranchOption === 'business-address'"
                class="text-xs text-green-600 mt-2 font-medium">
                ✓ Main business location selected
              </p>
              <p v-else-if="selectedBranchOption && !manualEntryEnabled"
                class="text-xs text-green-600 mt-2 font-medium">
                ✓ Branch selected
              </p>
              <p v-else-if="manualEntryEnabled && manualState && manualCity"
                class="text-xs text-green-600 mt-2 font-medium">
                ✓ New branch will be added: {{ manualCity }}, {{ manualState }}
              </p>
            </div>

            <!-- Rating -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Rating *</label>
              <div class="flex items-center">
                <Star v-for="n in 5" :key="n" :value="(hoverRating || rating) - (n - 1)"
                  :color-level="Math.ceil(hoverRating || rating)" class="cursor-pointer"
                  @mousemove="hoverRating = n - 1 + getFraction($event)" @mouseleave="hoverRating = 0"
                  @click="setRating(n - 1 + getFraction($event))" />
                <span class="ml-2 text-sm text-gray-700">
                  {{ rating > 0 ? getRatingLabel(rating) : ' ' }}
                  <span v-if="rating > 0" class="text-sm text-gray-500">({{ rating.toFixed(1) }})</span>
                </span>
              </div>
            </div>

            <!-- Review Body -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-900 mb-1">Your Review *</label>
              <textarea v-model="reviewBody" maxlength="500" minlength="20" rows="4"
                placeholder="Tell us what you loved (or didn't)."
                class="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-[#008253] focus:outline-none"></textarea>
              <p class="text-xs text-gray-400 text-right">
                {{ reviewBody.length }}/500
              </p>
            </div>

            <!-- Image Uploader -->
            <ImageUploader v-model="images" path="reviews" label="Add Images" :max="3" />

            <!-- Submit Button -->
            <button @click="submitReview"
              class="w-full py-2 bg-[#008253] text-white rounded-lg hover:bg-[#006d47] transition">
              Submit Review
            </button>
          </div>
        </div>

        <!-- Featured Businesses -->
        <div class="md:col-span-3 md:order-1 bg-white rounded-lg shadow-md p-2">
          <h2 class="text-xl font-bold text-center text-gray-400 mb-6">Featured Businesses</h2>
          <div class="space-y-3">
            <div v-for="(business, index) in featuredBusinesses" :key="index"
              class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between mb-1">
                <div class="flex-1">
                  <h4 class="font-semibold mb-0 text-lg text-gray-400">{{ business.name }}</h4>
                  <p class="text-xs mt-0 text-gray-400">{{ business.location }}</p>
                </div>
                <button @click="removeBusiness(index)" class="text-gray-400 hover:text-gray-800 transition-colors">
                  <i class="pi pi-times text-xs"></i>
                </button>
              </div>
              <div class="flex items-center mt-2">
                <Star v-for="n in 5" :key="n" :value="(business.hoverRating || business.rating) - (n - 1)"
                  :color-level="Math.ceil(business.hoverRating || business.rating)" class="cursor-pointer mb-0"
                  @mousemove="business.hoverRating = n - 1 + getFraction($event)" @mouseleave="business.hoverRating = 0"
                  @click="rateBusiness(index, n - 1 + getFraction($event))" />
              </div>
            </div>
          </div>
        </div>

        <!-- Ad Space -->
        <div class="md:col-span-3 md:order-3 space-y-4">
          <div v-for="i in 5" :key="i"
            class="bg-white rounded-lg shadow-md p-6 h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-400">
              <i class="pi pi-image text-3xl mb-2"></i>
              <p class="text-sm">Ad Space</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Star from '~/components/Stars.vue'
import useUser from '~/composables/useUser'
import useReviewMethods from '~/composables/review/useReviewMethods'
import useSearch from '~/composables/search/useSearch'
import useBusinessMethods from '~/composables/business/useBusinessMethods'
import useNigerianLocations from '~/composables/useNigerianLocations'
import ImageUploader from '~/components/Input/ImageUploader.vue'
import type { Branch } from '~/types/business'

const { submitUserReview } = useReviewMethods();
const { search } = useSearch();
const { getBusinessBranches, getBusinessProfile } = useBusinessMethods();
const { getStates, getCitiesByState } = useNigerianLocations();
const store = useUser();

// Form state
const businessName = ref("");
const reviewBody = ref("");
const rating = ref(0);
const hoverRating = ref(0);
const anonymous = ref(false);
const email = ref("");
const images = ref<string[]>([]);

// New business location (state/city selects)
const newBusinessState = ref("");
const newBusinessCity = ref("");

// Branch selection
const selectedBranchOption = ref("");
const manualEntryEnabled = ref(false);
const manualState = ref("");
const manualCity = ref("");

// UI state
const showBusinessDropdown = ref(false);
const isSearching = ref(false);
const isLoadingBranches = ref(false);

// Selected business
const selectedBusinessLogo = ref<string>("");
const selectedBusinessId = ref<string>("");

// Flag for new business
const isAddingNewBusiness = ref(false);

let debounceTimer: any = null;

// Search Results
const filteredBusinesses = ref<any[]>([]);
const branches = ref<Branch[]>([]);

// Nigerian states and cities
const states = getStates();

// Computed cities based on selected state
const newBusinessCities = computed(() => {
  return newBusinessState.value ? getCitiesByState(newBusinessState.value) : [];
});

const manualCities = computed(() => {
  return manualState.value ? getCitiesByState(manualState.value) : [];
});

// Branch options for dropdown
const branchOptions = computed(() => {
  const options: { id: string; display: string }[] = [];

  branches.value.forEach(branch => {
    // Build display text
    const cityState = [branch.branchCityTown, branch.branchState]
      .filter(Boolean)
      .join(', ');

    options.push({
      id: branch.id,
      display: cityState || branch.name || 'Unknown Location'
    });
  });

  return options;
});

const businessDropdownRef = ref<HTMLElement | null>(null);

const featuredBusinesses = ref([
  { name: "KFC", location: "Yaba", rating: 0, hoverRating: 0, logo: "/images/logos/kfc.png" },
  { name: "Domino's Pizza", location: "Ikeja", rating: 0, hoverRating: 0, logo: "/images/logos/pizza.png" },
  { name: "Chicken Republic", location: "Victoria Island", rating: 0, hoverRating: 0, logo: "/images/logos/republic.png" },
]);

const isAuthenticated = computed(() => store.isAuthenticated);
const isGuest = computed(() => !isAuthenticated.value);

watch(isGuest, (guest) => {
  if (guest) {
    anonymous.value = true;
  }
}, { immediate: true });

// Reset manual entry when checkbox is unchecked
watch(manualEntryEnabled, (enabled) => {
  if (!enabled) {
    manualState.value = "";
    manualCity.value = "";
  } else {
    // Clear branch selection when manual entry is enabled
    selectedBranchOption.value = "";
  }
});

// Reset cities when state changes
watch(newBusinessState, () => {
  newBusinessCity.value = "";
});

watch(manualState, () => {
  manualCity.value = "";
});

// User confirms they want to add a new business
const confirmAddNewBusiness = () => {
  isAddingNewBusiness.value = true;
  showBusinessDropdown.value = false;
};

// User cancels adding new business
const cancelAddNewBusiness = () => {
  isAddingNewBusiness.value = false;
  newBusinessState.value = "";
  newBusinessCity.value = "";
};

// Handle business input with Elasticsearch search
const handleBusinessInput = () => {
  showBusinessDropdown.value = true;

  // Reset states when user types
  selectedBusinessId.value = "";
  selectedBusinessLogo.value = "";
  isAddingNewBusiness.value = false;

  if (debounceTimer) clearTimeout(debounceTimer);
  if (!businessName.value.trim()) {
    isSearching.value = false;
    filteredBusinesses.value = [];
    return;
  }

  isSearching.value = true;
  debounceTimer = setTimeout(async () => {
    try {
      if (!businessName.value.trim()) {
        isSearching.value = false;
        return;
      }

      const res = await search(businessName.value);
      filteredBusinesses.value = Array.isArray(res) ? res : (res.companies || []);
    } catch (error) {
      console.error("Search failed", error);
      filteredBusinesses.value = [];
    } finally {
      isSearching.value = false;
    }
  }, 400);
};

// Fetch branches for selected business
const fetchBranches = async (businessId: string) => {
  isLoadingBranches.value = true;
  branches.value = [];

  try {
    // 1. Fetch existing branches from API
    const result = await getBusinessBranches(businessId);
    const branchData = Array.isArray(result) ? result : (result?.data || []);

    // 2. ALWAYS fetch business profile for main address
    const businessProfile = await getBusinessProfile(businessId);

    // 3. Start with empty branches array
    const allBranches: Branch[] = [];

    // 4. Add main business address as pseudo-branch (if it exists)
    if (businessProfile?.data?.businessAddress) {
      const address = businessProfile.data.businessAddress;
      const addressParts = address.split(',').map((s: string) => s.trim());

      let city = "";
      let state = "";
      if (addressParts.length >= 2) {
        state = addressParts[addressParts.length - 1];
        city = addressParts[addressParts.length - 2];
      }

      allBranches.push({
        id: 'business-address',
        name: 'Main Location',
        branchCityTown: city,
        branchState: state,
        branchStreet: ''
      } as Branch);
    }

    // 5. Add real branches (if any exist)
    if (branchData && branchData.length > 0) {
      allBranches.push(...branchData);
    }

    // 6. Set the final branches array
    branches.value = allBranches;

    console.log(`Loaded ${allBranches.length} branch options for business ${businessId}:`, allBranches);
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    branches.value = [];
  } finally {
    isLoadingBranches.value = false;
  }
};

// ========================================
// UPDATED: Computed property to check if "Online" already exists
// ========================================

const hasOnlineBranch = computed(() => {
  return branches.value.some(b =>
    b.name?.toLowerCase() === 'online' ||
    (b.branchCityTown?.toLowerCase() === 'online' && b.branchState?.toLowerCase() === 'online')
  );
});

// Select business from search results
const selectBusiness = async (b: any) => {
  businessName.value = b.name;
  selectedBusinessId.value = b.id || b.businessId || "";
  selectedBusinessLogo.value = b.logo || "";
  isAddingNewBusiness.value = false;
  showBusinessDropdown.value = false;
  filteredBusinesses.value = [];

  // Reset branch selection
  selectedBranchOption.value = "";
  manualEntryEnabled.value = false;
  manualState.value = "";
  manualCity.value = "";
  branches.value = [];

  // Fetch branches for existing business
  if (selectedBusinessId.value) {
    await fetchBranches(selectedBusinessId.value);
  }
};

const ratingLabels: Record<number, string> = {
  1: "Not Great.", 2: "Needs Improvement.", 3: "Just Okay.", 4: "Really Good!", 5: "Fantastic!"
};

const getRatingLabel = (rating: number) => {
  return ratingLabels[Math.floor(rating)] || "";
};

const setRating = (value: number) => {
  rating.value = Math.round(value * 2) / 2; // Rounds to nearest 0.5
};

// Submit review
const submitReview = async () => {
  // Validation
  if (!businessName.value.trim()) {
    alert("Please enter a business name");
    return;
  }

  // Branch/Location validation
  if (selectedBusinessId.value && !isAddingNewBusiness.value) {
    if (!manualEntryEnabled.value && !selectedBranchOption.value) {
      alert("Please select a branch/location or enable manual entry");
      return;
    }

    if (manualEntryEnabled.value && (!manualState.value || !manualCity.value)) {
      alert("Please select both state and city for manual branch entry");
      return;
    }
  }

  // New business validation
  if (isAddingNewBusiness.value && (!newBusinessState.value || !newBusinessCity.value)) {
    alert("Please select both state and city for the new business");
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

  if (isGuest.value && !email.value) {
    alert("Email is required for guest reviews");
    return;
  }

  // Build submission data
  let locationData: any = {};

  if (isAddingNewBusiness.value) {
    // ✅ SCENARIO 1: NEW BUSINESS + NEW BRANCH
    locationData = {
      businessId: null,
      businessName: businessName.value,
      isNewBusiness: true,
      locationId: null,
      isNewBranch: false,
      branchCityTown: newBusinessCity.value,
      branchState: newBusinessState.value,
      branchStreet: null
    };
  } else if (selectedBranchOption.value === 'online') {
    // ✅ SCENARIO 2: ONLINE - Check if Online branch exists in fetched branches
    const existingOnlineBranch = branches.value.find(b =>
      b.name?.toLowerCase() === 'online' ||
      (b.branchCityTown?.toLowerCase() === 'online' && b.branchState?.toLowerCase() === 'online')
    );

    if (existingOnlineBranch) {
      // ✅ REUSE existing Online branch
      locationData = {
        businessId: selectedBusinessId.value,
        businessName: null,
        isNewBusiness: false,
        locationId: existingOnlineBranch.id,
        isNewBranch: false,
        branchCityTown: null,
        branchState: null,
        branchStreet: null
      };
    } else {
      // ✅ CREATE new Online branch
      locationData = {
        businessId: selectedBusinessId.value,
        businessName: null,
        isNewBusiness: false,
        locationId: null,
        isNewBranch: true,
        branchCityTown: 'Online',
        branchState: 'Online',
        branchStreet: null
      };
    }
  } else if (selectedBranchOption.value === 'business-address') {
    // ✅ SCENARIO 3: PSEUDO-BRANCH (use businessId as locationId)
    locationData = {
      businessId: selectedBusinessId.value,
      businessName: null,
      isNewBusiness: false,
      locationId: selectedBusinessId.value, // Use businessId as locationId
      isNewBranch: false,
      branchCityTown: null,
      branchState: null,
      branchStreet: null
    };
  } else if (manualEntryEnabled.value) {
    // ✅ SCENARIO 4: NEW BRANCH FOR EXISTING BUSINESS
    locationData = {
      businessId: selectedBusinessId.value,
      businessName: null,
      isNewBusiness: false,
      locationId: null,
      isNewBranch: true,
      branchCityTown: manualCity.value,
      branchState: manualState.value,
      branchStreet: null
    };
  } else if (selectedBranchOption.value) {
    // ✅ SCENARIO 5: EXISTING BUSINESS + EXISTING BRANCH
    locationData = {
      businessId: selectedBusinessId.value,
      businessName: null,
      isNewBusiness: false,
      locationId: selectedBranchOption.value,
      isNewBranch: false,
      branchCityTown: null,
      branchState: null,
      branchStreet: null
    };
  }

  const data = {
    ...locationData,
    reviewerId: isAuthenticated.value ? store.userId : null,
    email: (isGuest.value || anonymous.value) ? email.value : null,
    starRating: rating.value,
    reviewBody: reviewBody.value,
    photoUrls: images.value.length > 0 ? images.value : null,
    reviewAsAnon: anonymous.value,
  };

  try {
    const response = await submitUserReview(data);

    let message = "Review submitted successfully! It will be published after validation.";
    if (isAddingNewBusiness.value) {
      message = "Business created and review submitted successfully! It will be published after validation.";
    } else if (manualEntryEnabled.value || (selectedBranchOption.value === 'online' && !branches.value.find(b => b.name?.toLowerCase() === 'online'))) {
      message = "New branch added and review submitted successfully! It will be published after validation.";
    }

    alert(message);

    // Reset form
    businessName.value = "";
    selectedBusinessId.value = "";
    selectedBranchOption.value = "";
    newBusinessState.value = "";
    newBusinessCity.value = "";
    manualState.value = "";
    manualCity.value = "";
    rating.value = 0;
    reviewBody.value = "";
    images.value = [];
    branches.value = [];
    isAddingNewBusiness.value = false;
    manualEntryEnabled.value = false;

    if (isGuest.value) email.value = "";
    else anonymous.value = false;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Failed to submit review. Please try again.";
    alert(errorMessage);
    console.error("Review submission error:", error);
  }
};

const getFraction = (event: MouseEvent): number => {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = event.clientX - rect.left;
  const fraction = x / rect.width;
  // Snap to 0, 0.5, or 1 based on position
  return fraction < 0.25 ? 0 : (fraction < 0.75 ? 0.5 : 1);
};

const handleClickOutside = (event: MouseEvent) => {
  if (businessDropdownRef.value && !businessDropdownRef.value.contains(event.target as Node))
    showBusinessDropdown.value = false;
};

const route = useRoute();

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);

  // 1. FIRST: Check for saved drafts from the Navbar modal
  const savedDraft = localStorage.getItem('review_draft');
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      
      // Populate basic fields
      businessName.value = draft.businessName || "";
      reviewBody.value = draft.reviewBody || "";
      rating.value = draft.rating || 0;
      images.value = draft.images || [];
      
      // Handle business selection and fetch branches automatically
      if (draft.selectedBusinessId) {
        selectedBusinessId.value = draft.selectedBusinessId;
        selectedBusinessLogo.value = draft.selectedBusinessLogo || "";
        isAddingNewBusiness.value = false;
        
        // This triggers the branch loading logic you already have
        await fetchBranches(draft.selectedBusinessId);
      }

      // 2. CLEANUP: Remove the draft so it doesn't persist on next refresh
      localStorage.removeItem('review_draft');
    } catch (e) {
      console.error("Failed to parse review draft", e);
    }
  }

  // 3. EXISTING LOGIC: Handle pre-population from query params (don't remove this)
  const { bizId, bizName, bizLogo } = route.query;

  if (bizName && !businessName.value) { // Added check to prioritize draft over query
    businessName.value = bizName as string;
  }

  if (bizId && !selectedBusinessId.value) { // Added check to prioritize draft over query
    selectedBusinessId.value = bizId as string;
    selectedBusinessLogo.value = (bizLogo as string) || "";
    await fetchBranches(selectedBusinessId.value);
    showBusinessDropdown.value = false;
    isAddingNewBusiness.value = false;
  }
});

onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const rateBusiness = (index: number, value: number) => {
  featuredBusinesses.value[index]!.rating = Math.round(value * 2) / 2;
};

const removeBusiness = (index: number) => featuredBusinesses.value.splice(index, 1);

// Watch business name to reset when cleared
watch(businessName, (val) => {
  if (!val) {
    selectedBusinessLogo.value = "";
    selectedBusinessId.value = "";
    selectedBranchOption.value = "";
    branches.value = [];
    isAddingNewBusiness.value = false;
    manualEntryEnabled.value = false;
    manualState.value = "";
    manualCity.value = "";
  }
});
</script>