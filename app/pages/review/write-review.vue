<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mb-0">
      <NavBarReview />
    </div>

    <div class="w-full h-full px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10">

        <div class="md:col-span-6 md:order-2 rounded-xl bg-white p-6 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]">
          <h2 class="text-3xl font-bold text-center text-[#008253] mb-6">Share Your Experience</h2>

          <div class="space-y-4">
            <div ref="businessDropdownRef" class="relative">
              <label class="block text-sm font-medium text-gray-900 mb-1">Business Name</label>
              <div class="relative">
                <input type="text" v-model="businessName" @input="handleBusinessInput"
                  @focus="showBusinessDropdown = true" placeholder="Search for a business..."
                  class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] focus:outline-none" />

                <i v-if="isSearching"
                  class="pi pi-spin pi-spinner absolute right-10 top-1/2 -translate-y-1/2 text-gray-400"></i>

                <img v-if="selectedBusinessLogo" :src="selectedBusinessLogo" alt="Business Logo"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain" />
              </div>

              <ul v-if="showBusinessDropdown && filteredBusinesses.length"
                class="bg-white shadow-xl mt-1 rounded-lg border max-h-60 overflow-y-auto absolute z-50 w-full">
                <li v-for="(b, i) in filteredBusinesses" :key="i" @click="selectBusiness(b)"
                  class="px-4 py-3 cursor-pointer hover:bg-green-50 border-b last:border-none flex items-center gap-3">
                  <img v-if="b.logo" :src="b.logo" class="w-6 h-6 rounded-full object-cover" />
                  <span class="font-medium text-gray-800">{{ b.name }}</span>
                </li>
              </ul>
            </div>

            <div ref="branchDropdownRef" class="relative">
              <label class="block text-sm font-medium text-gray-900 mb-1">Business Branch</label>
              <div class="relative">
                <input type="text" v-model="branchSearch" @input="handleBranchInput" @focus="showBranchDropdown = true"
                  :disabled="!selectedBusinessId || isLoadingBranches"
                  :placeholder="!selectedBusinessId ? 'Select a business first' : isLoadingBranches ? 'Loading branches...' : 'Select a branch...'"
                  class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed" />
                <i v-if="isLoadingBranches"
                  class="pi pi-spin pi-spinner absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <i v-else-if="selectedBranchId"
                  class="pi pi-check absolute right-3 top-1/2 -translate-y-1/2 text-[#008253]"></i>
              </div>
              <ul v-if="showBranchDropdown && filteredBranches.length"
                class="bg-white shadow mt-1 rounded-lg border max-h-48 overflow-y-auto absolute z-10 w-full">
                <li v-for="branch in filteredBranches" :key="branch.id" @click="selectBranch(branch)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-100">
                  <div class="font-medium">{{ branch.name }}</div>
                  <div class="text-xs text-gray-500">
                    {{ [branch.branchStreet, branch.branchCityTown, branch.branchState].filter(Boolean).join(', ') }}
                  </div>
                </li>
              </ul>
              <p v-if="!selectedBusinessId" class="text-xs text-gray-500 mt-1">
                Select a business to see available branches
              </p>
              <p v-else-if="branches.length === 0 && !isLoadingBranches" class="text-xs text-gray-500 mt-1">
                No branches found for this business
              </p>
            </div>

            <div>
              <label class="block text-xs text-gray-900 mb-1">Rating</label>
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

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-900 mb-1">Your Review</label>
              <textarea v-model="reviewBody" maxlength="500" minlength="20" rows="4"
                placeholder="Tell us what you loved (or didn't)."
                class="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-[#008253] focus:outline-none"></textarea>
              <p class="text-xs text-gray-400 text-right">
                {{ reviewBody.length }}/500
              </p>
            </div>

            <ImageUploader v-model="images" path="reviews" label="Add Images" :max="3" />

            <div class="flex items-center space-x-2">
              <input type="checkbox" id="anonymous" v-model="anonymous" :disabled="isGuest"
                class="w-4 h-4 rounded border-gray-300 accent-[#008253] disabled:opacity-50 disabled:cursor-not-allowed" />
              <label for="anonymous" class="text-sm text-gray-700 cursor-pointer">
                Review as anonymous
                <span v-if="isGuest" class="text-xs text-gray-500">(Required for guest users)</span>
              </label>
            </div>

            <div v-if="isGuest || anonymous">
              <input type="email" v-model="email" placeholder="Email" required
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] focus:outline-none" />
            </div>

            <button @click="submitReview"
              class="w-full py-2 bg-[#008253] text-white rounded-lg hover:bg-[#006d47] transition">
              Submit Review
            </button>
          </div>
        </div>

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
import ImageUploader from '~/components/Input/ImageUploader.vue'
import type { Branch } from '~/types/business'

const { submitUserReview } = useReviewMethods();
const { search } = useSearch();
const { getBusinessBranches } = useBusinessMethods();
const store = useUser()

// Form state
const businessName = ref("");
const branchSearch = ref("");
const reviewBody = ref("");
const rating = ref(0);
const hoverRating = ref(0);
const anonymous = ref(false);
const email = ref("");
const images = ref<string[]>([]);
const showBusinessDropdown = ref(false);
const showBranchDropdown = ref(false);
const isSearching = ref(false);
const isLoadingBranches = ref(false);
const selectedBusinessLogo = ref<string>("");
const selectedBusinessId = ref<string>("");
const selectedBranchId = ref<string>("");
let debounceTimer: any = null;

// Search Results
const filteredBusinesses = ref<any[]>([]);
const branches = ref<Branch[]>([]);
const filteredBranches = ref<Branch[]>([]);

const businessDropdownRef = ref<HTMLElement | null>(null);
const branchDropdownRef = ref<HTMLElement | null>(null);

const featuredBusinesses = ref([
  { name: "KFC", location: "Yaba", rating: 0, hoverRating: 0, logo: "/images/logos/kfc.png" },
  { name: "Domino's Pizza", location: "Ikeja", rating: 0, hoverRating: 0, logo: "/images/logos/pizza.png" },
  { name: "Chicken Republic", location: "Victoria Island", rating: 0, hoverRating: 0, logo: "/images/logos/republic.png" },
]);

// Check if user is authenticated
const isAuthenticated = computed(() => store.isAuthenticated);
const isGuest = computed(() => !isAuthenticated.value);

// For guest users, anonymous checkbox is always checked and disabled
watch(isGuest, (guest) => {
  if (guest) {
    anonymous.value = true;
  }
}, { immediate: true });

// ELASTIC SEARCH HANDLER
const handleBusinessInput = () => {
  showBusinessDropdown.value = true;

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

// Fetch branches when business is selected
const fetchBranches = async (businessId: string) => {
  isLoadingBranches.value = true;
  try {
    const result = await getBusinessBranches(businessId);
    branches.value = result;
    filteredBranches.value = result;
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    branches.value = [];
    filteredBranches.value = [];
  } finally {
    isLoadingBranches.value = false;
  }
};

const selectBusiness = async (b: any) => {
  businessName.value = b.name;
  selectedBusinessId.value = b.id || b.businessId || "";
  selectedBusinessLogo.value = b.logo || "";
  showBusinessDropdown.value = false;
  filteredBusinesses.value = [];

  // Reset branch selection and fetch new branches
  branchSearch.value = "";
  selectedBranchId.value = "";
  branches.value = [];
  filteredBranches.value = [];

  if (selectedBusinessId.value) {
    await fetchBranches(selectedBusinessId.value);
  }
};

const handleBranchInput = () => {
  showBranchDropdown.value = true;
  filteredBranches.value = branches.value.filter(branch =>
    branch.name.toLowerCase().includes(branchSearch.value.toLowerCase()) ||
    branch.branchCityTown?.toLowerCase().includes(branchSearch.value.toLowerCase()) ||
    branch.branchState?.toLowerCase().includes(branchSearch.value.toLowerCase())
  );
};

const selectBranch = (branch: Branch) => {
  branchSearch.value = branch.name;
  selectedBranchId.value = branch.id;
  showBranchDropdown.value = false;
};

const ratingLabels: Record<number, string> = {
  1: "Not Great.", 2: "Needs Improvement.", 3: "Just Okay.", 4: "Really Good!", 5: "Fantastic!"
};

const getRatingLabel = (rating: number) => {
  return ratingLabels[Math.floor(rating)] || "";
};

const setRating = (value: number) => {
  rating.value = value > 4.5 ? 5 : Math.round(value * 10) / 10;
};

const submitReview = async () => {
  // Validation
  if (!selectedBusinessId.value) {
    alert("Please select a business from the dropdown");
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

  const data = {
    businessId: selectedBusinessId.value,
    locationId: selectedBranchId.value || null,
    reviewerId: isAuthenticated.value ? store.userId : null,
    email: isGuest.value ? email.value : null,
    starRating: rating.value,
    reviewBody: reviewBody.value,
    photoUrls: images.value.length > 0 ? images.value : null,
    reviewAsAnon: anonymous.value
  };

  try {
    await submitUserReview(data);
    alert("Review submitted successfully! It will be published after validation.");
    // Reset form
    businessName.value = "";
    selectedBusinessId.value = "";
    selectedBranchId.value = "";
    branchSearch.value = "";
    rating.value = 0;
    reviewBody.value = "";
    images.value = [];
    branches.value = [];
    filteredBranches.value = [];
    if (isGuest.value) email.value = "";
    else anonymous.value = false;
  } catch (error) {
    alert("Failed to submit review. Please try again.");
  }
};

const getFraction = (event: MouseEvent) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = event.clientX - rect.left;
  return Math.round((x / rect.width) / 0.1) * 0.1;
};

const handleClickOutside = (event: MouseEvent) => {
  if (businessDropdownRef.value && !businessDropdownRef.value.contains(event.target as Node)) showBusinessDropdown.value = false;
  if (branchDropdownRef.value && !branchDropdownRef.value.contains(event.target as Node)) showBranchDropdown.value = false;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const rateBusiness = (index: number, value: number) => {
  featuredBusinesses.value[index]!.rating = value > 4.5 ? 5 : Math.round(value * 10) / 10;
};

const removeBusiness = (index: number) => featuredBusinesses.value.splice(index, 1);

watch(businessName, (val) => {
  if (!val) {
    selectedBusinessLogo.value = "";
    selectedBusinessId.value = "";
    selectedBranchId.value = "";
    branchSearch.value = "";
    branches.value = [];
    filteredBranches.value = [];
  }
});
</script>