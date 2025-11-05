<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="mb-0">
      <NavBarReview />
    </div>

    <!-- Three Column Layout -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <!-- LEFT SECTION - Featured Businesses (3 columns on md+) -->
        <div class="md:col-span-3 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-[#008253] mb-6">Featured Businesses</h2>
          
          <div class="space-y-4">
            <div
              v-for="(business, index) in featuredBusinesses"
              :key="index"
              class="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-800">{{ business.name }}</h3>
                  <p class="text-xs text-gray-500">{{ business.location }}</p>
                </div>
                <button
                  @click="removeBusiness(index)"
                  class="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <i class="pi pi-times text-sm"></i>
                </button>
              </div>
              
              <!-- Star Rating -->
              <div class="flex items-center space-x-1 mt-2">
                <template v-for="star in 5" :key="star">
                  <i
                    class="pi text-lg cursor-pointer transition-colors"
                    :class="star <= (business.hoverRating || business.rating) ? 'pi-star-fill' : 'pi-star'"
                    :style="{ color: star <= (business.hoverRating || business.rating) ? '#deae29' : '#d1d5db' }"
                    @click="rateBusiness(index, star)"
                    @mouseenter="business.hoverRating = star"
                    @mouseleave="business.hoverRating = 0"
                  ></i>
                </template>
              </div>
              <p v-if="business.rating > 0" class="text-xs text-gray-600 mt-1">
                {{ ratingLabels[business.rating] }}
              </p>
            </div>
          </div>
        </div>

        <!-- MIDDLE SECTION - Review Form (6 columns on md+) -->
        <div class="md:col-span-6 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-[#008253] mb-6">Share Your Experience</h2>
          
          <div class="space-y-4">
            <!-- Business Name -->
            <div ref="businessDropdownRef">
              <label class="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <div class="relative">
                <input
                  type="text"
                  v-model="businessName"
                  @input="handleBusinessInput"
                  @focus="showBusinessDropdown = true"
                  placeholder="e.g, KFC"
                  class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] focus:outline-none"
                />
                <i
                  v-if="businessName && isBusinessInList"
                  class="pi pi-check absolute right-3 top-1/2 -translate-y-1/2 text-[#008253]"
                ></i>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Business Location</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div class="flex items-center space-x-1">
                <template v-for="star in 5" :key="star">
                  <i
                    class="pi text-2xl cursor-pointer transition-colors"
                    :class="star <= (hoverRating || rating) ? 'pi-star-fill' : 'pi-star'"
                    @click="rating = star"
                    @mouseenter="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                    :style="{ color: star <= (hoverRating || rating) ? '#deae29' : '#d1d5db' }"
                  ></i>
                </template>
                <span class="ml-2 text-sm text-gray-600">
                  {{ rating > 0 ? ratingLabels[rating] : '' }}
                </span>
              </div>
            </div>

            <!-- Review Body -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Review Body</label>
              <textarea
                v-model="reviewBody"
                maxlength="500"
                minlength="20"
                rows="4"
                placeholder="Share your experience. Tell us what you loved (or didn't)."
                class="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-[#008253] focus:outline-none"
              ></textarea>
              <p class="text-xs text-gray-500 text-right">
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

            <!-- Date -->
            <div class="text-xs text-gray-500 text-right">
              {{ formattedDate }}
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

        <!-- RIGHT SECTION - Ads Placeholder (3 columns on md+) -->
        <div class="md:col-span-3 space-y-4">
          <div class="bg-white rounded-lg shadow-md p-6 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-400">
              <i class="pi pi-image text-4xl mb-2"></i>
              <p class="text-sm">Ad Space</p>
              <p class="text-xs">300x250</p>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-400">
              <i class="pi pi-image text-4xl mb-2"></i>
              <p class="text-sm">Ad Space</p>
              <p class="text-xs">300x250</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// Form state
const businessName = ref("");
const businessLocation = ref("");
const reviewBody = ref("");
const rating = ref(0);
const hoverRating = ref(0);
const anonymous = ref(false);
const images = ref<string[]>([]);
const showBusinessDropdown = ref(false);
const showLocationDropdown = ref(false);


// Refs for dropdown containers
const businessDropdownRef = ref<HTMLElement | null>(null);
const locationDropdownRef = ref<HTMLElement | null>(null);

// Featured businesses
const featuredBusinesses = ref([
  { name: "KFC", location: "Yaba", rating: 0, hoverRating: 0 },
  { name: "McDonald's", location: "Ikeja", rating: 0, hoverRating: 0 },
  { name: "Domino's Pizza", location: "Victoria Island", rating: 0, hoverRating: 0 },
  { name: "Chicken Republic", location: "Anthony", rating: 0, hoverRating: 0 },
]);

// Business and location lists
const businessList = [
  "KFC",
  "McDonald's",
  "Domino's Pizza",
  "Chicken Republic",
  "Blue Cafe",
  "Tech Hub",
  "Green Bakery",
  "City Lounge"
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
  1: "Not Great",
  2: "Needs Improvement",
  3: "Just Okay",
  4: "Really Good",
  5: "Fantastic"
};

const filteredBusinesses = ref<string[]>([]);
const filteredLocations = ref<string[]>([]);

const isBusinessInList = computed(() => {
  return businessList.some(b => b.toLowerCase() === businessName.value.toLowerCase());
});

const isLocationInList = computed(() => {
  return locationList.some(l => l.toLowerCase() === businessLocation.value.toLowerCase());
});

const formattedDate = computed(() =>
  new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
);

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

const selectBusiness = (b: string) => {
  businessName.value = b;
  showBusinessDropdown.value = false;
  filteredBusinesses.value = [];
};

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

const rateBusiness = (index: number, stars: number) => {
  featuredBusinesses[index].rating = stars;
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
</script>