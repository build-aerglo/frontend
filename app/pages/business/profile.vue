<template>
  <div></div>
  <div>
    <div
      class="bg-white w-full border border-b-2 border-gray-500 p-5 flex flex-col md:flex-row gap-5 md:gap-8 relative">
      <div class="relative image-slot-profile flex-shrink-0 w-[140px] h-[140px] md:w-[160px] md:h-[160px]"
        :class="{ 'cursor-pointer': isEditing }" @click="isEditing && triggerFileInput()">
        <img :src="previewUrl || '/images/profile/profile-picture.jpg'" alt="Profile"
          class="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-[20px] object-cover" />
        <div class="absolute -top-2 -right-2 flex flex-col gap-1">
          <Badge type="standard" />
        </div>
        <div v-if="isEditing">
          <div
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 flex items-center justify-center rounded-[20px] overlay-profile">
            <i class="pi pi-camera text-white text-xl"></i>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
        </div>
      </div>

      <div class="flex flex-col gap-[10px] items-start justify-start flex-1">
        <div class="flex gap-2 items-center">
          <template v-if="!isEditing">
            <span class="text-contrast text-[150%] font-bold">
              {{ business.name || 'Business Name' }}
            </span>
          </template>
          <template v-else>
            <input v-model="business.name" type="text" placeholder="Business Name"
              class="border border-gray-400 rounded-md px-2 py-1 w-[220px]" />
          </template>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <div class="flex">
            <Star v-for="n in 5" :key="n" :value="businessData.rating - (n - 1)"
              :color-level="Math.ceil(businessData.rating)" class="w-6 h-6" />
          </div>
          <span class="text-lg font-semibold text-gray-700">{{ businessData.rating }}</span>
          <span class="text-gray-500">({{ businessData.reviewCount }} reviews)</span>
        </div>

        <div class="flex items-center gap-2">
          <i class="pi pi-briefcase !text-primary text-lg flex-shrink-0"></i>
          <div class="w-full">
            <template v-if="!isEditing">
              <span class="text-contrast">
                {{ categoryNames.length > 0 ? categoryNames.join(', ') : 'Sector' }}
              </span>
            </template>

            <template v-else>
              <MultiSelect v-model="categoryIds" :options="categories" optionLabel="name" optionValue="id" filter
                required placeholder="Select Sector" :maxSelectedLabels="3" class="w-[200px] h-[30px] p-0 mt-1 border border-gray-300 outline-none rounded-[5px] 
                        focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300 
                        bg-secondaryLinen" />
            </template>
          </div>
        </div>

        <ProfileLocation v-model="business.businessAddress" :is-editing="isEditing" />

        <div :class="[isEditing ? 'flex flex-col md:flex-row gap-2' : 'flex gap-2 items-center']">
          <ProfileField v-model="business.businessPhoneNumber" icon="pi pi-phone" placeholder="Contact"
            :is-editing="isEditing" />
          <span v-if="!isEditing" class="text-gray-400 text-sm mx-1">||</span>
          <ProfileField v-model="business.socialMediaLinks.additionalProp1" icon="pi pi-whatsapp" placeholder="WhatsApp"
            :is-editing="isEditing" />
        </div>

        <div :class="[isEditing ? 'flex flex-col md:flex-row gap-2' : 'flex gap-2 items-center']">
          <ProfileField v-model="business.website" icon="pi pi-globe" placeholder="Website URL"
            :is-editing="isEditing" />
          <span v-if="!isEditing" class="text-gray-400 text-sm mx-1">||</span>
          <ProfileField v-model="business.socialMediaLinks.additionalProp2" icon="pi pi-instagram"
            placeholder="Instagram" :is-editing="isEditing" />
        </div>
        <OpeningHoursPicker v-model="business.openingHours" :is-editing="isEditing" />
      </div>

      <div class="absolute top-5 right-5">
        <ButtonCustom :label="isEditing ? 'Save Changes' : 'Edit Profile'" :primary="true" size="lg"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'" input-class="text-[15px] w-auto hidden md:block"
          @click="toggleEdit" />
        <ButtonCustom :primary="true" size="lg" :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"
          input-class="text-[15px] w-auto md:hidden" @click="toggleEdit" />
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class=" sticky top-10 z-50 pt-3 bg-white w-full border-t mb-4 border-gray-200 shadow-sm">
      <div class="relative flex items-center py-4 px-4 md:px-0 md:justify-start">

        <div class="hidden sm:flex items-center justify-center p-2 text-gray-600 cursor-pointer z-10 md:hidden"
          id="scroll-left-btn" @click="scrollLeft">
          <i class="pi pi-chevron-left text-lg"></i>
        </div>

        <ul
          class="nav nav-pills flex flex-nowrap gap-2 overflow-x-scroll hide-scrollbar scroll-smooth w-full px-4 md:px-4"
          id="tabs-scroll-container" ref="tabsContainer">
          <li v-for="tab in tabItems" :key="tab.key" class="nav-item flex-shrink-0">
            <NuxtLink :to="{ path: $route.path, query: { tab: tab.key } }" class="nav-link"
              :class="{ active: currentTabKey === tab.key }">
              {{ tab.name }}
            </NuxtLink>
          </li>
        </ul>

        <div class="hidden sm:flex items-center justify-center p-2 text-gray-600 cursor-pointer z-10 md:hidden"
          id="scroll-right-btn" @click="scrollRight">
          <i class="pi pi-chevron-right text-lg"></i>
        </div>

      </div>
    </div>

    <div class="md:grid grid-cols-1 md:grid-cols-3 gap-6">

      <div class="col-span-1 md:col-span-2 ">
        <KeepAlive>
          <component :is="currentComponent" v-bind="getPropsForComponent(currentTabKey)"
            @update="handleComponentUpdate" />
        </KeepAlive>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Quick Actions (Desktop) -->
        <div class="hidden md:block bg-white rounded-xl shadow-sm p-6 sticky top-24">
          <h4 class="font-bold text-gray-900 text-center mt-2 mb-4">Quick Stats</h4>
          <div class="space-y-3">
            <button
              class="w-full px-2 py-3 text-sm  bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
              Total Reviews 1K
            </button>
            <button
              class="w-full text-sm px-2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
              Average Response Time: 12hours
            </button>
            <button
              class="w-full text-sm px-2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
              Profile clicks(30 days) 3450
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBusinessMethods from '~/composables/business/useBusinessMethods';
import type { BusinessProfile } from "~/types/business";
import { useBusinessProfileStore } from "~/store/business/businessProfile";
import useBusinessUser from '~/composables/business/useBusinessUser';
import Badge from '~/components/Badge.vue'
import Star from '~/components/Stars.vue'
import { useBusinessData } from '@/composables/useBusinessSampleData'
import OpeningHoursPicker from '~/components/OpeningHoursPicker.vue'
import ProfileLocation from '~/components/Profile/ProfileLocation.vue'
const businessUserStore = useBusinessUser()

const {
  businessData,
} = useBusinessData()

definePageMeta({ layout: 'business', middleware: 'businessauth' })
const store = useBusinessProfileStore();
const { saveBusinessProfile, getCategories } = useBusinessMethods();
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
  if (!categories.value || categoryIds.value.length === 0) {
    return [];
  }

  // Filter the full category list to find the names of the selected IDs
  return categories.value
    .filter(cat => categoryIds.value.includes(cat.id))
    .map(cat => cat.name);
});

const isEditing = ref(false)


// Rating, images
const ratingValue = ref(4)
const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const business = ref<BusinessProfile>({
  name: "",
  website: "",
  businessAddress: "",
  logo: "",
  openingHours: {
    additionalProp1: "",
    additionalProp2: "",
    additionalProp3: ""
  },
  businessEmail: "",
  businessPhoneNumber: "",
  cacNumber: "",
  accessUsername: "",
  accessNumber: "",
  socialMediaLinks: {
    additionalProp1: "",
    additionalProp2: "",
    additionalProp3: ""
  },
  businessDescription: "",
  media: [],
  isVerified: true,
  reviewLink: "",
  preferredContactMethod: "",
  highlights: [],
  tags: [],
  averageResponseTime: "",
  profileClicks: 0,
  faqs: []
});
const categoryIds = ref<string[]>([])
const businessId = businessUserStore.businessId
console.log(businessId)
const toggleEdit = async () => {
  // When saving
  if (isEditing.value) {
    const payload = business.value
    const profileData = await saveBusinessProfile(businessId ?? '', payload);
    console.log(payload)
    store.setProfileData(profileData);
  }
  isEditing.value = !isEditing.value;
};
const getPropsForComponent = (tabKey: string) => {
  switch (tabKey) {
    case 'overview':
      return {
        description: business.value.businessDescription,
        // 🚨 Pass the MERGED list here
        highlights: computedHighlightsForOverview.value,
        // 🚨 Pass the MERGED list here
        tags: computedTagsForOverview.value
      };
    case 'media':
      return {
        media: business.value.media
      };
    case 'faq':
      return {
        faqs: business.value.faqs
      };
    // case 'getreview':
    //   return {
    //     reviewLink: business.value.reviewLink
    //   };
    default:
      return {};
  }
};
const handleComponentUpdate = (update: { key: string; value: any }) => {
  // Use a type guard for safety, but essentially you're updating the business ref
  if (update.key in business.value) {
    // Use 'as any' to bypass TypeScript checking the dynamic key update
    (business.value as any)[update.key] = update.value;
  }
};
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
const ALL_AVAILABLE_HIGHLIGHTS = [
  { id: 1, name: 'Wi-Fi' },
  { id: 2, name: 'Order online' },
  { id: 3, name: 'Accomodates groups' },
  { id: 4, name: 'Restrooms' },
  { id: 5, name: 'Wheelchair Accessible' },
  { id: 6, name: 'Parking Available' },
  { id: 7, name: 'Card Payment' },
  { id: 8, name: 'Baby-Changing Facility' },
];

const ALL_AVAILABLE_TAGS = [
  { id: 1, name: 'Fast Service' },
  { id: 2, name: 'Gourmet Coffee' },
  { id: 3, name: 'Live Music' },
  { id: 4, name: 'Budget Friendly' },
  { id: 5, name: 'Event Space' },
  { id: 6, name: 'Takeaway Only' },
];


// --- New Computed Properties to Merge Saved Data with All Options ---

const computedHighlightsForOverview = computed(() => {
  // business.value.highlights holds the saved list of highlight strings (e.g., ['Wi-Fi', 'Parking Available'])
  const savedHighlights = business.value.highlights || [];

  return ALL_AVAILABLE_HIGHLIGHTS.map(h => ({
    id: h.id,
    name: h.name,
    // Check if the name exists in the saved array
    checked: savedHighlights.includes(h.name)
  }));
});

const computedTagsForOverview = computed(() => {
  // business.value.tags holds the saved list of tag strings
  const savedTags = business.value.tags || [];

  return ALL_AVAILABLE_TAGS.map(t => ({
    id: t.id,
    name: t.name,
    // Check if the name exists in the saved array
    checked: savedTags.includes(t.name)
  }));
});


// --- Update getPropsForComponent ---


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