<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="mb-0">
      <NavBarReview />
    </div>

    <!-- Three Column Layout -->
    <div class="w-full h-full px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        <!-- MIDDLE SECTION - Review Form (appears FIRST on mobile, middle on desktop) -->
        <div class="md:col-span-6 md:order-2 rounded-xl bg-white p-6 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]">
          <h2 class="text-3xl font-bold text-center text-[#008253] mb-6">Share Your Experience</h2>
          
          <div class="space-y-4">
            <!-- Business Name -->
            <div ref="businessDropdownRef">
              <label class="block text-sm font-medium text-gray-900 mb-1">Business Name</label>
              <div class="relative">
                <input
                  type="text"
                  v-model="businessName"
                  @input="handleBusinessInput"
                  @focus="showBusinessDropdown = true"
                  placeholder="e.g, KFC"
                  class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] focus:outline-none"
                />
                <img
                  v-if="selectedBusinessLogo"
                  :src="selectedBusinessLogo"
                  alt="Business Logo"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain"
                /> 
              </div>
              <ul v-if="showBusinessDropdown && filteredBusinesses.length" class="bg-white shadow mt-1 rounded-lg border max-h-48 overflow-y-auto absolute z-10 w-full md:w-auto">
                <li
                  v-for="(b, i) in filteredBusinesses"
                  :key="i"
                  @click="selectBusiness(b)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {{ b }}
                </li>
              </ul>
              <p
                v-if="businessName && !isBusinessInList && filteredBusinesses.length === 0"
                class="text-xs text-gray-500 mt-1"
              >
                New on our list? No problem, review away!
              </p>
            </div>

            <!-- Business Location -->
            <div ref="locationDropdownRef">
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
                <i
                  v-if="businessLocation && isLocationInList"
                  class="pi pi-check absolute right-3 top-1/2 -translate-y-1/2 text-[#008253]"
                ></i>
              </div>
              <ul v-if="showLocationDropdown && filteredLocations.length" class="bg-white shadow mt-1 rounded-lg border max-h-48 overflow-y-auto absolute z-10 w-full md:w-auto">
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

            <!-- Star Rating -->
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
                <span class="ml-2 text-sm text-gray-800">
                  {{ rating > 0 ? getRatingLabel(rating) : ' ' }}
                </span>
              </div>
            </div>

            <!-- Review Body -->
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

            <!-- Add Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Add Images (max 3)</label>
              <input type="file" multiple accept="image/*" @change="handleImages" class="text-sm text-gray-600" />
              <div class="flex mt-2 gap-2 flex-wrap">
                <div
                  v-for="(img, index) in images"
                  :key="index"
                  class="relative w-20 h-20 rounded-lg overflow-hidden border"
                >
                  <img :src="img" class="object-cover w-full h-full" />
                  <i
                    class="pi pi-times absolute top-1 right-1 bg-white rounded-full p-1 text-xs cursor-pointer"
                    @click="removeImage(index)"
                  ></i>
                </div>
              </div>
            </div>

            <!-- Anonymous Checkbox -->
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                v-model="anonymous"
                class="w-4 h-4 rounded border-gray-300 accent-[#008253]"
              />
              <label for="anonymous" class="text-sm text-gray-700 cursor-pointer">
                Review as anonymous
              </label>
            </div>

            <!-- Email Field -->
            <div  v-if="anonymous">
              <input
                type="email"
                v-model="email"
                placeholder="Email"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] focus:outline-none"
              />
            </div>

            <!-- Submit Button -->
            <button
              @click="submitReview"
              class="w-full py-2 bg-[#008253] text-white rounded-lg hover:bg-[#006d47] transition"
            >
              Submit Review
            </button>
          </div>
        </div>

        <!-- LEFT SECTION - Featured Businesses (appears SECOND on mobile, left on desktop) -->
        <div class="md:col-span-3 md:order-1 bg-white rounded-lg shadow-md p-2">
          <h2 class="text-xl font-bold text-center text-gray-400 mb-6">Featured Businesses</h2>
          
          <div class="space-y-3">
            <div
              v-for="(business, index) in featuredBusinesses"
              :key="index"
              class="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div class="flex items-start justify-between mb-1">
                <div class="flex-1">
                  <h4 class="font-semibold mb-0 text-lg text-gray-400">{{ business.name }}</h4>
                  <p class="text-xs mt-0 text-gray-400">{{ business.location }}</p>
                </div>
                <button
                  @click="removeBusiness(index)"
                  class="text-gray-400 hover:text-gray-800 transition-colors"
                >
                  <i class="pi pi-times text-xs"></i>
                </button>
              </div>
              
              <!-- Star Rating -->
              <div class="flex items-center mt-2">
                <Star
                    v-for="n in 5"
                    :key="n"
                    :value="(business.hoverRating || business.rating) - (n - 1)"
                    :color-level="Math.ceil(business.hoverRating || business.rating)"
                    class="cursor-pointer"
                    @mousemove="business.hoverRating = n - 1 + getFraction($event)"
                    @mouseleave="business.hoverRating = 0"
                    @click="rateBusiness(index, n - 1 + getFraction($event))"
                />
              </div>
              <p v-if="business.rating > 0" class="text-xs text-gray-500 mt-0">
                {{ getRatingLabel(business.rating) }}
              </p>
            </div>
          </div>
        </div>

        <!-- RIGHT SECTION - Ads Placeholder (appears THIRD on mobile, right on desktop) -->
        <div class="md:col-span-3 md:order-3 space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6 h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-400">
              <i class="pi pi-image text-3xl mb-2"></i>
              <p class="text-sm">Ad Space</p>
              
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6 h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-400">
              <i class="pi pi-image text-3xl mb-2"></i>
              <p class="text-sm">Ad Space</p>
              
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-400">
              <i class="pi pi-image text-3xl mb-2"></i>
              <p class="text-sm">Ad Space</p>
              
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-400">
              <i class="pi pi-image text-3xl mb-2"></i>
              <p class="text-sm">Ad Space</p>
              
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { watch } from "vue";
import Star from '~/components/Stars.vue'

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


// Refs for dropdown containers
const businessDropdownRef = ref<HTMLElement | null>(null);
const locationDropdownRef = ref<HTMLElement | null>(null);

// Featured businesses
const featuredBusinesses = ref([
  { name: "KFC", location: "Yaba", rating: 0, hoverRating: 0, logo: "/images/logos/kfc.png" },
  { name: "Domino's Pizza", location: "Ikeja", rating: 0, hoverRating: 0, logo: "/images/logos/pizza.png" },
  { name: "Chicken Republic", location: "Victoria Island", rating: 0, hoverRating: 0, logo: "/images/logos/republic.png" },
  { name: "T-Pizza", location: "Anthony", rating: 0, hoverRating: 0, logo: "/images/logos/res1.jpg" },
]);


// Business and location lists
const businessList = [
  "KFC", 
  "Domino's Pizza",
  "Chicken Republic",
  "Oceanview",
  "Tech Hub",
  "Green Bakery",
  "City Lounge",
];

const locationList = [
  "Yaba",
  "Anthony",
  "Port Harcourt",
  "Benin City",
  "Ikeja",
  "Victoria Island"
];

const ratingLabels: Record<number, string> = {
  1: "Not Great.",
  2: "Needs Improvement.",
  3: "Just Okay.",
  4: "Really Good!",
  5: "Fantastic!"
};

const getRatingLabel = (rating: number) => {
  const key = Math.min(6, Math.max(1, Math.floor(rating)));
  return ratingLabels[key] || "";
};

const setRating = (value: number) => {
  if (value > 4.5) {
    rating.value = 5;
  } else {
    rating.value = Math.round(value * 10) / 10;
  }
};

const filteredBusinesses = ref<string[]>([]);
const filteredLocations = ref<string[]>([]);

const isBusinessInList = computed(() => {
  return businessList.some(b => b.toLowerCase() === businessName.value.toLowerCase());
});

const isLocationInList = computed(() => {
  return locationList.some(l => l.toLowerCase() === businessLocation.value.toLowerCase());
});

// Handle click outside to close dropdowns
const handleClickOutside = (event: MouseEvent) => {
  if (businessDropdownRef.value && !businessDropdownRef.value.contains(event.target as Node)) {
    showBusinessDropdown.value = false;
  }
  if (locationDropdownRef.value && !locationDropdownRef.value.contains(event.target as Node)) {
    showLocationDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleBusinessInput = () => {
  showBusinessDropdown.value = true;
  filteredBusinesses.value = businessList.filter(b =>
    b.toLowerCase().includes(businessName.value.toLowerCase())
  );
};

const handleLocationInput = () => {
  showLocationDropdown.value = true;
  filteredLocations.value = locationList.filter(l =>
    l.toLowerCase().includes(businessLocation.value.toLowerCase())
  );
};

const selectedBusinessLogo = ref<string>("");

const selectBusiness = (b: string) => {
  businessName.value = b;
  showBusinessDropdown.value = false;
  filteredBusinesses.value = [];

  // Find logo for the selected business (falls back to empty string)
  const found = featuredBusinesses.value.find(biz => biz.name === b);
  selectedBusinessLogo.value = found ? found.logo ?? "" : "";
};

watch(businessName, (val) => {
  if (!val) selectedBusinessLogo.value = "";
});


const selectLocation = (l: string) => {
  businessLocation.value = l;
  showLocationDropdown.value = false;
  filteredLocations.value = [];
};

const handleImages = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  if (files.length + images.value.length > 3) {
    alert("You can upload a maximum of 3 images.");
    return;
  }
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => images.value.push(e.target?.result as string);
    reader.readAsDataURL(file);
  });
};

const removeImage = (index: number) => {
  images.value.splice(index, 1);
};

const rateBusiness = (index: number, value: number) => {
  if (value > 4.5) {
    featuredBusinesses.value[index]!.rating = 5;
  } else {
    featuredBusinesses.value[index]!.rating = Math.round(value * 10) / 10;
  }
};

const removeBusiness = (index: number) => {
  featuredBusinesses.value.splice(index, 1);
};

const submitReview = () => {
  alert("Review submitted successfully!");
  // Reset form
  businessName.value = "";
  businessLocation.value = "";
  reviewBody.value = "";
  rating.value = 0;
  anonymous.value = false;
  images.value = [];
};

const getFraction = (event: MouseEvent) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const width = rect.width

  const raw = x / width
  const step = 0.1

  return Math.min(1, Math.max(0, Math.round(raw / step) * step))
}

</script>