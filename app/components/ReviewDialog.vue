<template>
  <div>
    <!-- Open Dialog Button -->
    <button
      @click="open = true"
      class="px-10 py-3 bg-[#008253] text-white rounded-lg shadow hover:bg-[#008260] transition"
    >
     Share Your Experience
    </button>

    <!-- Dialog Overlay -->
    <div
      v-if="open"
      class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 z-50"
    >
      <!-- Dialog Box -->
      <div
        class="bg-white w-[90%] md:w-[600px] rounded-2xl shadow-xl p-4 relative animate-fadeIn max-h-[90vh] overflow-y-auto"
      >
        <!-- Close Button -->
        <i
          class="pi pi-times absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-black"
          @click="closeDialog"
        ></i>

        <!-- Form -->
        <form @submit.prevent="submitReview" class="space-y-2">

          <!-- Business Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              v-model="businessName"
              @input="filterBusinessNames"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] focus:outline-none"
            />
            <ul v-if="filteredBusinesses.length" class="bg-white shadow mt-1 rounded-lg">
              <li
                v-for="(b, i) in filteredBusinesses"
                :key="i"
                @click="selectBusiness(b)"
                class="px-3 py-1 cursor-pointer hover:bg-gray-100"
              >
                {{ b }}
              </li>
            </ul>
          </div>

          <!-- Business Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Business Location</label>
            <input
              type="text"
              v-model="businessLocation"
              @input="filterLocations"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] focus:outline-none"
            />
            <ul v-if="filteredLocations.length" class="bg-white shadow mt-1 rounded-lg">
              <li
                v-for="(l, i) in filteredLocations"
                :key="i"
                @click="selectLocation(l)"
                class="px-3 py-1 cursor-pointer hover:bg-gray-100"
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
              <span class="ml-2 text-sm text-gray-600">{{ rating.toFixed(1) }}</span>
            </div>
          </div>

          <!-- Review Body -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Review Body</label>
            <textarea
              v-model="reviewBody"
              maxlength="200"
              minlength="20"
              rows="4"
              placeholder="Write your review..."
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



          <div class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    v-model="anonymous"
                    id="anonymous"
                    class="w-4 h-4 text-gray-600"
                />
  
                <!-- Label + login link -->
                <div class="flex items-center space-x-1 text-sm text-gray-700">
                    <label for="anonymous" class="cursor-pointer">Review as a guest? / </label>
                    <a
                    href="/auth/end-user/sign-in"
                    @click.stop
                    class="text-[#008253] hover:underline"
                    >
                    login
                    </a>
                </div>
            </div>

<div v-if="anonymous" class="mt-2">
  <input
    type="email"
    v-model="email"
    placeholder="Enter email..."
    class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] focus:outline-none text-gray-700"
  />
</div>


          <!-- Date -->
          <div class="text-xs text-gray-500 text-right">
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
import { ref, computed } from "vue";

const open = ref(false);
const businessName = ref("");
const businessLocation = ref("");
const reviewBody = ref("");
const rating = ref(0);
const hoverRating = ref(0);
const anonymous = ref(false);
const email = ref("");
const images = ref<string[]>([]);

// Mock suggestions
const businessList = ["Blue Cafe", "Tech Hub", "Green Bakery", "City Lounge"];
const locationList = ["Lagos", "Abuja", "Port Harcourt", "Benin City"];

const filteredBusinesses = ref<string[]>([]);
const filteredLocations = ref<string[]>([]);

const filterBusinessNames = () => {
  filteredBusinesses.value = businessList.filter(b =>
    b.toLowerCase().includes(businessName.value.toLowerCase())
  );
};
const filterLocations = () => {
  filteredLocations.value = locationList.filter(l =>
    l.toLowerCase().includes(businessLocation.value.toLowerCase())
  );
};
const selectBusiness = (b: string) => {
  businessName.value = b;
  filteredBusinesses.value = [];
};
const selectLocation = (l: string) => {
  businessLocation.value = l;
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
