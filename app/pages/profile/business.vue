<template>
  <div>
    <div
      class="bg-white w-full border border-b-2 border-gray-500 p-5 flex flex-col md:flex-row gap-5 md:gap-8 relative"
    >
      <div 
        class="relative image-slot-profile flex-shrink-0 w-[140px] h-[140px] md:w-[160px] md:h-[160px]"
        :class="{ 'cursor-pointer': isEditing }"
        @click="isEditing && triggerFileInput()"
      >
        <img
          :src="previewUrl || '/images/profile/profile-picture.jpg'"
          alt="Profile"
          class="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-[20px] object-cover"
        />
        <div v-if="isEditing">
          <div 
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 flex items-center justify-center rounded-[20px] overlay-profile"
          >
            <i class="pi pi-camera text-white text-xl"></i>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>

      <div class="flex flex-col gap-[10px] items-start justify-start flex-1">
        <div class="flex gap-2 items-center">
          <template v-if="!isEditing">
            <span class="text-contrast text-[150%] font-bold">
              {{ business.name || 'Business Name' }}
            </span>
            <Badge type="standard" />
          </template>
          <template v-else>
            <input
              v-model="business.name"
              type="text"
              placeholder="Business Name"
              class="border border-gray-400 rounded-md px-2 py-1 w-[220px]"
            />
          </template>
        </div>
        <div class="flex items-center gap-2 mb-2">
            <div class="flex">
                 <Star
                    v-for="n in 5"
                    :key="n"
                    :value="businessData.rating - (n - 1)"
                    :color-level="Math.ceil(businessData.rating)"
                    class="w-6 h-6"
                    />
            </div>
            <span class="text-lg font-semibold text-gray-700">{{ businessData.rating }}</span>
            <span class="text-gray-500">({{ businessData.reviewCount }} reviews)</span>
        </div>

        <ProfileField
          v-model="business.sector"
          icon="pi pi-briefcase"
          placeholder="Sector"
          :is-editing="isEditing"
        />

        <ProfileField
          v-model="business.location"
          icon="pi pi-map-marker"
          placeholder="Location"
          :is-editing="isEditing"
        />

        <div :class="[isEditing ? 'flex flex-col md:flex-row gap-2': 'flex gap-2 items-center']">
          <ProfileField
            v-model="business.contact"
            icon="pi pi-phone"
            placeholder="Contact"
            :is-editing="isEditing"
          />
          <span v-if="!isEditing" class="text-gray-400 text-sm mx-1">||</span>
          <ProfileField
            v-model="business.contact"
            icon="pi pi-whatsapp"
            placeholder="WhatsApp"
            :is-editing="isEditing"
          />
        </div>

        <div :class="[isEditing ? 'flex flex-col md:flex-row gap-2': 'flex gap-2 items-center']">
          <ProfileField
            v-model="business.websiteUrl"
            icon="pi pi-globe"
            placeholder="Website URL"
            :is-editing="isEditing"
          />
          <span v-if="!isEditing" class="text-gray-400 text-sm mx-1">||</span>
          <ProfileField
            v-model="business.websiteUrl"
            icon="pi pi-instagram"
            placeholder="Instagram"
            :is-editing="isEditing"
          />
        </div>

        <div :class="[isEditing ? 'flex flex-col md:flex-row gap-2': 'flex gap-2']">
          <ProfileField
              v-if="!isEditing"
              v-model="business.openDays"
              icon="pi pi-clock"
              placeholder="Open Now - Closes at 10:00 PM"
              :is-editing="isEditing"
          />
          
          <template v-else>
              <ProfileField
                  v-model="business.openDaysDetails" 
                  icon="pi pi-calendar"
                  placeholder="Select Opening Days (e.g., Mon-Fri)"
                  :is-editing="true"
                  input-class="cursor-pointer" 
                  @click="triggerDayPicker" 
              />
              
              <ProfileField
                  v-model="business.closeTime"
                  icon="pi pi-clock"
                  placeholder="Closing Time (e.g., 10:00 PM)"
                  :is-editing="true"
                  input-class="cursor-pointer" 
                  @click="triggerTimePicker"
              />
          </template>
        </div>
      </div>

      <div class="absolute top-5 right-5">
        <ButtonCustom
          :label="isEditing ? 'Save Changes' : 'Edit Profile'"
          :primary="true"
          size="lg"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"  
          input-class="text-[15px] w-auto hidden md:block"
          @click="toggleEdit"
        />
        <ButtonCustom
          :primary="true"
          size="lg"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"  
          input-class="text-[15px] w-auto md:hidden"
          @click="toggleEdit"
        />
      </div>
    </div>
    
    <!-- Sticky Navigation Tabs -->
    <div 
      class="sticky top-10 z-40 bg-white border-b border-gray-200 shadow-sm mb-8"
    >
      <div class="relative flex items-center py-4 px-4 md:px-0 md:justify-start max-w-7xl mx-auto">
        
        <div 
          class="hidden sm:flex items-center justify-center p-2 text-gray-600 cursor-pointer z-10 md:hidden"
          id="scroll-left-btn"
          @click="scrollLeft"
        >
          <i class="pi pi-chevron-left text-lg"></i>
        </div>
        
        <ul 
          class="nav nav-pills flex flex-nowrap gap-2 overflow-x-scroll hide-scrollbar scroll-smooth w-full px-4 md:px-4"
          id="tabs-scroll-container"
          ref="tabsContainer"
        >
          <li v-for="tab in tabItems" :key="tab.key" class="nav-item flex-shrink-0">
            <NuxtLink
              :to="{ path: $route.path, query: { tab: tab.key } }"
              class="nav-link"
              :class="{ active: currentTabKey === tab.key }"
            >
              {{ tab.name }}
            </NuxtLink>
          </li>
        </ul>

        <div 
          class="hidden sm:flex items-center justify-center p-2 text-gray-600 cursor-pointer z-10 md:hidden"
          id="scroll-right-btn"
          @click="scrollRight"
        >
          <i class="pi pi-chevron-right text-lg"></i>
        </div>

      </div>
    </div>
    
    <div class="md:grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="col-span-1 md:col-span-2 ">
        <KeepAlive>
          <component :is="currentComponent" />
        </KeepAlive>
      </div>
      
       <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Quick Actions (Desktop) -->
          <div class="hidden md:block bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h4 class="font-bold text-gray-900 text-center mb-4">Quick Stats</h4>
            <div class="space-y-3">
              <button class="w-full px-2 py-3 text-sm  bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                Total Reviews 1K
              </button>
              <button class="w-full text-sm px-2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                Average Response Time: 12hours
              </button>
              <button class="w-full text-sm px-2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                Profile hits(30 days) 3450
              </button>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'; 
import { ref, reactive, computed, defineAsyncComponent } from 'vue';
import Badge from '~/components/Badge.vue'
import Star from '~/components/Stars.vue'
import { useBusinessData } from '@/composables/useBusinessSampleData'

const { 
  activeTab, 
  businessData, 
  businessReviews, 
  businessPhotos, 
  similarBusinesses 
} = useBusinessData()


definePageMeta({ layout: 'business' })

const isEditing = ref(false)
const toggleEdit = () => (isEditing.value = !isEditing.value)

const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const business = reactive({
  name: '',
  sector: '',
  location: '',
  contact: '',
  websiteUrl: '',
  openDays: 'Open Now - Closes at 10:00 PM', 
  openDaysDetails: 'Mon, Tue, Wed, Thu, Fri',
  closeTime: '22:00', 
})

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) previewUrl.value = URL.createObjectURL(file)
}
const triggerFileInput = () => fileInput.value?.click()

// NEW Placeholder Methods for Day/Time Selection
const triggerDayPicker = () => {
    console.log("Day Picker component triggered!");
};

const triggerTimePicker = () => {
    console.log("Time Picker component triggered!");
};

const ProfileOverview = defineAsyncComponent(() => import('~/components/Profile/ProfileOverview.vue'));
const ProfileReview = defineAsyncComponent(() => import('~/components/Profile/ProfileReview.vue'));
const ProfileMedia = defineAsyncComponent(() => import('~/components/Profile/ProfileMedia.vue'));
const ProfileFaq = defineAsyncComponent(() => import('~/components/Profile/ProfileFaq.vue'));
const ProfileGetReview = defineAsyncComponent(() => import('~/components/Profile/ProfileGetReview.vue'));

const route = useRoute();

const componentMap = {
  overview: ProfileOverview,
  review: ProfileReview,
  media: ProfileMedia,
  faq: ProfileFaq,
  getreview: ProfileGetReview,
};

const tabItems = [
  { key: 'overview', name: 'Overview' },
  { key: 'review', name: 'Reviews' },
  { key: 'media', name: 'Photos' },
  { key: 'faq', name: 'FAQs' },
  { key: 'getreview', name: 'Get Reviews' }
]

const currentTabKey = computed(() => {
  const tab = route.query.tab;
  const tabValue = Array.isArray(tab) ? tab[0] : tab;
  return (tabValue?.toString().toLowerCase() || tabItems[0]!.key);
});

const currentComponent = computed(() => {
  const key = currentTabKey.value as keyof typeof componentMap;
  return componentMap[key] || ProfileOverview;
});
const tabsContainer = ref<HTMLUListElement | null>(null); 
const SCROLL_AMOUNT = 150; 

// --- Scrolling Methods ---

const scrollLeft = () => {
  if (tabsContainer.value) {
    tabsContainer.value.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: 'smooth'
    });
  }
};

const scrollRight = () => {
  if (tabsContainer.value) {
    tabsContainer.value.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: 'smooth'
    });
  }
};
</script>

<style scoped>
.overlay-profile {
    opacity: 0;
}

.image-slot-profile:hover .overlay-profile {
    opacity: 1;
}

.hide-scrollbar {
    -ms-overflow-style: none; 
    scrollbar-width: none;  
}
.hide-scrollbar::-webkit-scrollbar {
    display: none; 
}


@media (max-width: 767px) {
    #scroll-left-btn,
    #scroll-right-btn {
        display: flex !important;
    }
    
    .relative.flex.items-center.py-4.px-4 {
        padding-left: 0;
        padding-right: 0;
    }
    
    #tabs-scroll-container {
        padding-left: 8px; 
        padding-right: 8px; 
    }

}


</style>