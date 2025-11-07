<template>
  <div>
    <!-- Open Dialog Button -->
     <div class="justify-center items-center">
        <button
          @click="open = true"
          class="px-10 py-3 bg-[#008253] text-white rounded-lg shadow hover:bg-[#008260] transition"
        >
        Share Your Experience
        </button>
     </div>

    <!-- Dialog Overlay -->
    <div
      v-if="open"
      class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 z-50"
    >
      <!-- Dialog Box -->
      <div
        class="bg-white w-[90%] md:w-[1000px] shadow-xl p-4 relative animate-fadeIn max-h-[90vh] overflow-y-auto"
      >
        <!-- Close Button -->
        <i
          class="pi pi-times absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-black"
          @click="closeDialog"
        ></i>

        <!-- Form -->
        <form @submit.prevent="submitReview" class="space-y-2">

          <!-- Business Name -->
          <div ref="businessDropdownRef">
            <label class="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <div class="relative">
              <input
                type="text"
                v-model="businessName"
                @input="handleBusinessInput"
                @focus="showBusinessDropdown = true"
                placeholder="e.g KFC"
                class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] focus:outline-none"
              />
              <!-- Checkmark Icon -->
              <i
                v-if="businessName && isBusinessInList"
                class="pi pi-check absolute right-3 top-1/2 -translate-y-1/2 text-[#008253]"
              ></i>
            </div>
            <!-- Dropdown List -->
            <ul v-if="showBusinessDropdown && filteredBusinesses.length" class="bg-white shadow mt-1 rounded-lg border max-h-48 overflow-y-auto">
              <li
                v-for="(b, i) in filteredBusinesses"
                :key="i"
                @click="selectBusiness(b)"
                class="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                {{ b }}
              </li>
            </ul>
            <!-- Helper Text -->
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
                placeholder="Town/City, e.g Yaba, Anthony..."
                class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] focus:outline-none"
              />
              <!-- Checkmark Icon -->
              <i
                v-if="businessLocation && isLocationInList"
                class="pi pi-check absolute right-3 top-1/2 -translate-y-1/2 text-[#008253]"
              ></i>
            </div>
            <!-- Dropdown List -->
            <ul v-if="showLocationDropdown && filteredLocations.length" class="bg-white shadow mt-1 rounded-lg border max-h-48 overflow-y-auto">
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
            <label class="block text-xs font-medium text-gray-700 mb-1">Rating</label>
            <div class="flex items-center space-x-1">
              <template v-for="(star, i) in 5" :key="i">
                <i
                  class="pi text-2xl cursor-pointer transition-colors"
                  :class="getStarIcon(i)"
                  @click="setRating(i + 1)"
                  @mousemove="hoverRating = i + 1"
                  @mouseleave="hoverRating = 0"
                  :style="{ color: i < rating ? '#deae29' : '#d1d5db' }"
                ></i>
              </template>
              <span class="ml-2 text-sm text-gray-600">
                {{ rating > 0 ? ` ${ratingLabels[rating]}` : '' }}
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
          <div class="flex items-center space-x-2 mt-2">
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

          <!-- Email -->
          <div class="mt-2">
            <input
              type="email"
              v-model="email"
              placeholder="Email"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] focus:outline-none text-gray-700"
            />
          </div>

          <!-- Date -->
          <div class="text-xs text-gray-500 text-right mt-2">
            {{ formattedDate }}
          </div>

          <!-- Submit Button -->
           <NuxtLink to="/landing/end-user/home">
          <button
            type="submit"
            class="w-full py-2 mt-2 bg-[#008253] text-white rounded-lg hover:bg-[#008260] transition"
          >
            Submit Review
          </button>
          </NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const open = ref(false);
const businessName = ref("");
const businessLocation = ref("");
const reviewBody = ref("");
const rating = ref(0);
const hoverRating = ref(0);
const anonymous = ref(true);
const email = ref("");
const images = ref<string[]>([]);
const showBusinessDropdown = ref(false);
const showLocationDropdown = ref(false);

// Refs for dropdown containers
const businessDropdownRef = ref<HTMLElement | null>(null);
const locationDropdownRef = ref<HTMLElement | null>(null);

// Mock suggestions with more businesses
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

// Rating labels
const ratingLabels: Record<number, string> = {
  1: "Not Great",
  2: "Needs Improvement",
  3: "Just Okay",
  4: "Really Good",
  5: "Fantastic"
};

const filteredBusinesses = ref<string[]>([]);
const filteredLocations = ref<string[]>([]);

// Check if business name is in the list
const isBusinessInList = computed(() => {
  return businessList.some(b => b.toLowerCase() === businessName.value.toLowerCase());
});

// Check if location is in the list
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

const getStarIcon = (i: number) => {
  if (hoverRating.value >= i + 1 || rating.value >= i + 1) return "pi-star-fill";
  return "pi-star";
};

const setRating = (val: number) => {
  rating.value = val;
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

const formattedDate = computed(() =>
  new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
);

const closeDialog = () => {
  open.value = false;
};

const submitReview = () => {
  alert("Review submitted successfully!");
  closeDialog();
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}
</style>