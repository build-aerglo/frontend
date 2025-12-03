<template>
  <div>
    <div
      :class="[isEditing? 'bg-white w-full h-[800px] md:h-[400px] border border-b-2 border-gray-500 p-5 flex flex-col md:flex-row gap-5 md:gap-8 relative mb-8': 'bg-white w-full h-[650px] md:h-[400px] border border-b-2 border-gray-500 p-5 flex flex-col md:flex-row gap-5 md:gap-8 relative mb-8' ] "
    >
      <div 
        class="relative image-slot-profile"
        :class="{ 'cursor-pointer': isEditing }"
        @click="isEditing && triggerFileInput()"
      >
        <img
          :src="previewUrl || '/images/profile/profile-picture.jpg'"
          alt="Profile"
          class="w-full h-[250px] md:w-[260px] rounded-[20px] object-cover"
        />

        <div v-if="isEditing">
          <div 
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 flex items-center justify-center rounded-[20px] h-[250px] overlay-profile"
          >
            <i class="pi pi-camera text-white text-3xl"></i>
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

      <div class="flex flex-col gap-[10px] items-start justify-start">
        <div class="flex gap-2 items-center">
          <template v-if="!isEditing">
            <span class="text-contrast text-[150%] font-bold">
              {{ business.name || 'Business Name' }}
            </span>
            <ProfileVerified :isVerified="false" size="sm" />
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

        <div class="flex gap-1">
          <Rating
            v-model="ratingValue"
            :stars="5"
            style="--p-rating-icon-size: 16px;"
            :ptOptions="{ mergeProps: true }"
            :pt="{
              onIcon: { class: '!text-gold' },
              offIcon: { class: '!text-gray-500' }
            }"
          />
          <span class="text-[100%] text-gray-500">(120 Reviews)</span>
        </div>

        <div class="flex items-center gap-2">
            <i class="pi pi-briefcase !text-primary text-lg flex-shrink-0"></i> <div class="w-full">
                <template v-if="!isEditing">
                    <span class="text-contrast">
                        {{ categoryNames.length > 0 ? categoryNames.join(', ') : 'Sector' }}
                    </span>
                </template>

                <template v-else>
                    <MultiSelect 
                        v-model="business.categoryIds" 
                        :options="categories" 
                        optionLabel="name" 
                        optionValue="id" 
                        filter 
                        required
                        placeholder="Select Sector"
                        :maxSelectedLabels="3" 
                        class="w-[200px] h-[30px] p-0 mt-1 border border-gray-300 outline-none rounded-[5px] 
                        focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300 
                        bg-secondaryLinen" 
                    /> 
                </template>
            </div>
        </div> 

        <ProfileField
          v-model="uiData.tag"
          icon="pi pi-tag"
          placeholder="Tags"
          :is-editing="isEditing"
        />

        <ProfileField
          v-model="uiData.location"
          icon="pi pi-map-marker"
          placeholder="Location"
          :is-editing="isEditing"
        />

        <div :class="[isEditing ? 'flex flex-col md:flex-row gap-2': 'flex gap-2 items-center']">
          <ProfileField
            v-model="uiData.contact"
            icon="pi pi-phone"
            placeholder="Contact"
            :is-editing="isEditing"
          />
          <span v-if="!isEditing" class="text-gray-400 text-sm mx-1">||</span>
          <ProfileField
            v-model="uiData.contact"
            icon="pi pi-whatsapp"
            placeholder="WhatsApp"
            :is-editing="isEditing"
          />
        </div>

        <div :class="[isEditing ? 'flex flex-col md:flex-row gap-2': 'flex gap-2 items-center']">
          <ProfileField
            v-model="business.website"
            icon="pi pi-globe"
            placeholder="Website URL"
            :is-editing="isEditing"
          />
          <span v-if="!isEditing" class="text-gray-400 text-sm mx-1">||</span>
          <ProfileField
            v-model="business.website"
            icon="pi pi-instagram"
            placeholder="Instagram"
            :is-editing="isEditing"
          />
        </div>

        <div :class="[isEditing ? 'flex flex-col md:flex-row gap-2': 'flex gap-2']">
          <ProfileField
              v-if="!isEditing"
              v-model="uiData.openDays"
              icon="pi pi-clock"
              placeholder="Open Now - Closes at 10:00 PM"
              :is-editing="isEditing"
          />
          
          <template v-else>
              <ProfileField
                  v-model="uiData.openDaysDetails" 
                  icon="pi pi-calendar"
                  placeholder="Select Opening Days (e.g., Mon-Fri)"
                  :is-editing="true"
                  input-class="cursor-pointer" 
                  @click="triggerDayPicker" 
              />
              
              <ProfileField
                  v-model="uiData.closeTime"
                  icon="pi pi-clock"
                  placeholder="Closing Time (e.g., 10:00 PM)"
                  :is-editing="true"
                  input-class="cursor-pointer" 
                  @click="triggerTimePicker"
              />
          </template>
        </div>
      </div>

      <div
        :class="[isEditing? 'absolute top-[33%] right-0 md:top-0 md:right-[10px] transform translate-y-1/2 px-5': 'absolute top-[41%] right-0 md:top-0 md:right-[10px] transform translate-y-1/2 px-5']"
      >
        <ButtonCustom
          :label="isEditing ? 'Save Changes' : 'Edit Profile'"
          :primary="true"
          size="lg"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"  input-class="text-[15px] w-auto hidden md:block"
          @click="toggleEdit"
        />
        <ButtonCustom
          :primary="true"
          size="lg"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"  input-class="text-[15px] w-auto md:hidden"
          @click="toggleEdit"
        />
      </div>
  
      <div
        class="absolute bottom-[5%] md:bottom-[8%] left-[2px] transform translate-y-1/2 border-t-[1px] border-gray-200 w-full"
      >
        <div class="relative flex items-center py-4 px-4 md:px-0 md:justify-start">
          
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
      </div>
    
    <div class="md:grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="col-span-1 md:col-span-2 ">
        <KeepAlive>
          <component :is="currentComponent" />
        </KeepAlive>
      </div>
      
      <div class="col-span-1 mb-6 md:mb-0">
        <div class="card p-6 bg-white rounded-lg shadow sticky top-1">
          <h1 class="text-xl font-bold text-contrast mb-4">Quick Stats</h1>
          
          <ul class="flex flex-col gap-4 text-gray-700">
            
            <li class="flex justify-between items-center pb-2 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <i class="pi pi-star-fill text-yellow-500"></i>
                <span class="font-semibold text-base">Total Reviews</span>
              </div>
              <span class="text-xl font-bold text-contrast">1,250</span>
            </li>
            
            <li class="flex justify-between items-center pb-2 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <i class="pi pi-clock !text-primary"></i>
                <span class="font-semibold text-base">Avg. Response Time</span>
              </div>
              <span class="text-lg font-bold text-contrast">12 hours</span>
            </li>
            
            <li class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <i class="pi pi-eye !text-primary"></i>
                <span class="font-semibold text-base">Profile Hits (30 Days)</span>
              </div>
              <span class="text-xl font-bold text-contrast">3,450</span>
            </li>
            
          </ul>
          
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import useBusinessMethods from '~/composables/business/useBusinessMethods';
import type { BusinessProfile } from "~/types/business";
import { useBusinessProfileStore } from "~/store/business/businessProfile";
import { useRoute } from 'vue-router'; 

definePageMeta({ layout: 'business' })
const store = useBusinessProfileStore();
const { saveBusinessProfile, getCategories  } = useBusinessMethods();
const categories = ref<{ id: string; name: string }[]>([]);
onMounted(async () => {
  try {
    const res = await getCategories();
    categories.value = res;
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
});

const categoryNames = computed(() => {
    // Check if categories are loaded and selection exists
    if (!categories.value || business.value.categoryIds.length === 0) {
        return [];
    }
    
    // Filter the full category list to find the names of the selected IDs
    return categories.value
        .filter(cat => business.value.categoryIds.includes(cat.id))
        .map(cat => cat.name);
});

const isEditing = ref(false)
const toggleEdit = async () => {
  // When saving
  if (isEditing.value) {
    const payload = business.value
    const profileData = await saveBusinessProfile(payload);
    store.setProfileData(profileData);
  }
  isEditing.value = !isEditing.value;
};

// Rating, images
const ratingValue = ref(4)
const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const business = ref<BusinessProfile>({
  name: '',
  website: '',
  sector: '',
  contact: '',
  location: {
    street: '',
    city: '',
    state: ''
  },
  openingHours: {
    dayKey: 'mon-sat',
    startTime: '07:00',
    endTime: '23:00'
  },
  categoryIds: [],
  parentBusinessId: null
});

const uiData = reactive ({
  tag: '',
  location: '',
  contact: '',
  openDays: 'Open Now - Closes at 10:00 PM',
  openDaysDetails: 'Mon, Tue, Wed, Thu, Fri',
  closeTime: '22:00',
})
// Image handler
const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) previewUrl.value = URL.createObjectURL(file)
}
const triggerFileInput = () => fileInput.value?.click()

// Placeholder methods
const triggerDayPicker = () => console.log("Day Picker triggered!");
const triggerTimePicker = () => console.log("Time Picker triggered!");

// Components
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

const scrollLeft = () => {
  if (tabsContainer.value) {
    tabsContainer.value.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  }
};
const scrollRight = () => {
  if (tabsContainer.value) {
    tabsContainer.value.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
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