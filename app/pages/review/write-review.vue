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
                <input
                  type="text"
                  v-model="businessName"
                  @input="handleBusinessInput"
                  @focus="showBusinessDropdown = true"
                  placeholder="Search for a business..."
                  class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] focus:outline-none"
                />
                
                <i v-if="isSearching" class="pi pi-spin pi-spinner absolute right-10 top-1/2 -translate-y-1/2 text-gray-400"></i>
                
                <img
                  v-if="selectedBusinessLogo"
                  :src="selectedBusinessLogo"
                  alt="Business Logo"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain"
                /> 
              </div>

              <ul v-if="showBusinessDropdown && filteredBusinesses.length" class="bg-white shadow-xl mt-1 rounded-lg border max-h-60 overflow-y-auto absolute z-50 w-full">
                <li
                  v-for="(b, i) in filteredBusinesses"
                  :key="i"
                  @click="selectBusiness(b)"
                  class="px-4 py-3 cursor-pointer hover:bg-green-50 border-b last:border-none flex items-center gap-3"
                >
                  <img v-if="b.logo" :src="b.logo" class="w-6 h-6 rounded-full object-cover" />
                  <span class="font-medium text-gray-800">{{ b.name }}</span>
                </li>
              </ul>
            </div>

            <div ref="locationDropdownRef" class="relative">
              <label class="block text-sm font-medium text-gray-900 mb-1">Business Location</label>
              <div class="relative">
                <input
                  type="text"
                  v-model="businessLocation"
                  @input="handleLocationInput"
                  @focus="showLocationDropdown = true"
                  placeholder="Town/City. e.g, Yaba, Anthony..."
                  class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] focus:outline-none"
                />
                <i v-if="businessLocation && isLocationInList" class="pi pi-check absolute right-3 top-1/2 -translate-y-1/2 text-[#008253]"></i>
              </div>
              <ul v-if="showLocationDropdown && filteredLocations.length" class="bg-white shadow mt-1 rounded-lg border max-h-48 overflow-y-auto absolute z-10 w-full">
                <li
                  v-for="(l, i) in filteredLocations"
                  :key="i"
                  @click="selectLocation(l)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {{ l }}
                </li>
              </ul>
            </div>

            <div>
              <label class="block text-xs text-gray-900 mb-1">Rating</label>
              <div class="flex items-center">
                <Star
                    v-for="n in 5"
                    :key="n"
                    :value="(hoverRating || rating) - (n - 1)"
                    :color-level="Math.ceil(hoverRating || rating)"
                    class="cursor-pointer"
                    @mousemove="hoverRating = n - 1 + getFraction($event)"
                    @mouseleave="hoverRating = 0"
                    @click="setRating(n - 1 + getFraction($event))"
                  />
                <span class="ml-2 text-sm text-gray-700">
                  {{ rating > 0 ? getRatingLabel(rating) : ' ' }}
                  <span v-if="rating > 0" class="text-sm text-gray-500">({{ rating.toFixed(1) }})</span>
                </span>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-900 mb-1">Your Review</label>
              <textarea
                v-model="reviewBody"
                maxlength="500"
                minlength="20"
                rows="4"
                placeholder="Tell us what you loved (or didn't)."
                class="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-[#008253] focus:outline-none"
              ></textarea>
              <p class="text-xs text-gray-400 text-right">
                {{ reviewBody.length }}/500
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Add Images (max 3)</label>
              <input type="file" multiple accept="image/*" @change="handleImages" class="text-sm text-gray-600" />
              <div class="flex mt-2 gap-2 flex-wrap">
                <div v-for="(img, index) in images" :key="index" class="relative w-20 h-20 rounded-lg overflow-hidden border">
                  <img :src="img" class="object-cover w-full h-full" />
                  <i class="pi pi-times absolute top-1 right-1 bg-white rounded-full p-1 text-xs cursor-pointer" @click="removeImage(index)"></i>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <input type="checkbox" id="anonymous" v-model="anonymous" class="w-4 h-4 rounded border-gray-300 accent-[#008253]" />
              <label for="anonymous" class="text-sm text-gray-700 cursor-pointer">Review as anonymous</label>
            </div>

            <div v-if="anonymous">
              <input type="email" v-model="email" placeholder="Email" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] focus:outline-none" />
            </div>

            <button @click="submitReview" class="w-full py-2 bg-[#008253] text-white rounded-lg hover:bg-[#006d47] transition">
              Submit Review
            </button>
          </div>
        </div>

        <div class="md:col-span-3 md:order-1 bg-white rounded-lg shadow-md p-2">
          <h2 class="text-xl font-bold text-center text-gray-400 mb-6">Featured Businesses</h2>
          <div class="space-y-3">
            <div v-for="(business, index) in featuredBusinesses" :key="index" class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
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
                <Star v-for="n in 5" :key="n" :value="(business.hoverRating || business.rating) - (n - 1)" :color-level="Math.ceil(business.hoverRating || business.rating)" class="cursor-pointer mb-0" @mousemove="business.hoverRating = n - 1 + getFraction($event)" @mouseleave="business.hoverRating = 0" @click="rateBusiness(index, n - 1 + getFraction($event))" />
              </div>
            </div>
          </div>
        </div>

        <div class="md:col-span-3 md:order-3 space-y-4">
          <div v-for="i in 5" :key="i" class="bg-white rounded-lg shadow-md p-6 h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
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

const { submitUserReview } = useReviewMethods();
const { search } = useSearch(); 
const store = useUser()

// Form state
const businessName = ref("");
const businessLocation = ref("");
const reviewBody = ref("");
const rating = ref(0);
const hoverRating = ref(0);
const anonymous = ref(false);
const email = ref("");
const images = ref<string[]>([]);
const showBusinessDropdown = ref(false);
const showLocationDropdown = ref(false);
const isSearching = ref(false);
const selectedBusinessLogo = ref<string>("");
let debounceTimer: any = null;

// Search Results
const filteredBusinesses = ref<any[]>([]); 
const filteredLocations = ref<string[]>([]);

const businessDropdownRef = ref<HTMLElement | null>(null);
const locationDropdownRef = ref<HTMLElement | null>(null);

const featuredBusinesses = ref([
  { name: "KFC", location: "Yaba", rating: 0, hoverRating: 0, logo: "/images/logos/kfc.png" },
  { name: "Domino's Pizza", location: "Ikeja", rating: 0, hoverRating: 0, logo: "/images/logos/pizza.png" },
  { name: "Chicken Republic", location: "Victoria Island", rating: 0, hoverRating: 0, logo: "/images/logos/republic.png" },
]);

const locationList = ["Yaba", "Anthony", "Port Harcourt", "Benin City", "Ikeja", "Victoria Island"];

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

const selectBusiness = (b: any) => {
  businessName.value = b.name;
  selectedBusinessLogo.value = b.logo || "";
  showBusinessDropdown.value = false;
  filteredBusinesses.value = [];
};

const handleLocationInput = () => {
  showLocationDropdown.value = true;
  filteredLocations.value = locationList.filter(l =>
    l.toLowerCase().includes(businessLocation.value.toLowerCase())
  );
};

const selectLocation = (l: string) => {
  businessLocation.value = l;
  showLocationDropdown.value = false;
};

const isLocationInList = computed(() => {
  return locationList.some(l => l.toLowerCase() === businessLocation.value.toLowerCase());
});

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
  const data = {
    businessId: businessName.value,
    locationId: businessLocation.value,
    reviewerId: store.userId || "",
    email: email.value,
    starRating: rating.value,
    reviewBody: reviewBody.value,
    photoUrls: [...images.value],
    reviewAsAnon: anonymous.value
  };
  
  try {
    await submitUserReview(data);
    alert("Review Submitted successfully!");
  } catch (error) {
    alert("Failed to submit review.");
  }
};

const getFraction = (event: MouseEvent) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = event.clientX - rect.left;
  return Math.round((x / rect.width) / 0.1) * 0.1;
};

const handleClickOutside = (event: MouseEvent) => {
  if (businessDropdownRef.value && !businessDropdownRef.value.contains(event.target as Node)) showBusinessDropdown.value = false;
  if (locationDropdownRef.value && !locationDropdownRef.value.contains(event.target as Node)) showLocationDropdown.value = false;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const handleImages = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => images.value.push(e.target?.result as string);
    reader.readAsDataURL(file);
  });
};

const removeImage = (index: number) => images.value.splice(index, 1);
const rateBusiness = (index: number, value: number) => {
  featuredBusinesses.value[index]!.rating = value > 4.5 ? 5 : Math.round(value * 10) / 10;
};
const removeBusiness = (index: number) => featuredBusinesses.value.splice(index, 1);

watch(businessName, (val) => {
  if (!val) selectedBusinessLogo.value = "";
});
</script>