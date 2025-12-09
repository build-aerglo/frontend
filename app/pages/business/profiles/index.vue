<template>
  <div>
    <section class="bg-white w-full border border-b-2 border-gray-200 p-5 flex flex-col md:flex-row gap-5 relative items-start">
      <div class="relative flex-shrink-0">
        <ProfileImageUploader v-model="business.logo" :disabled="!isEditing" />

        <div class="absolute -top-2 -right-2">
          <Badge :type="business.isVerified ? 'verified' : 'standard'" />
        </div>
      </div>

      <div class="flex-1 flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3">
            <div class="flex-1">
              <div v-if="!isEditing" class="flex items-center gap-3">
                <h1 class="text-2xl font-semibold text-contrast m-0">{{ business.name || 'Business Name' }}</h1>
              </div>

              <div v-else>
                <ProfileField v-model="business.name" placeholder="Business Name" :is-editing="isEditing" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 mt-2">
            <Star :value="business.avgRating" :class="'w-6 h-6'"/>
            <div class="text-sm text-gray-600">
              <span class="font-semibold">{{ business.avgRating?.toFixed(1) ?? '0.0' }}</span>
              <span class="text-gray-500">({{ business.reviewCount ?? 0 }} reviews)</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <i class="pi pi-briefcase !text-primary"></i>
          <div class="flex-1">
            <div v-if="!isEditing" class="text-contrast">
              {{ selectedCategoryName || 'Sector' }}
            </div>
            <div v-else class="w-64">
              <Dropdown
                v-model="categoryId"
                :options="categories"
                optionLabel="name"
                optionValue="id"
                placeholder="Select sector"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <i class="pi pi-map-marker !text-primary"></i>
          <div class="flex-1">
            <div v-if="!isEditing" class="text-contrast">{{ business.businessAddress || 'Add location' }}</div>
            <div v-else>
              <input v-model="business.businessAddress" placeholder="Business address" class=" border rounded px-2 py-1" />
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-x-5 gap-y-3">
          <div class="flex items-center gap-2">
            <i class="pi pi-phone !text-primary"></i>
            <div>
              <div v-if="!isEditing">{{ business.businessPhoneNumber || 'Contact' }}</div>
              <div v-else><ProfileField v-model="business.businessPhoneNumber" placeholder="Phone" :is-editing="isEditing"/></div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <i class="pi pi-whatsapp !text-primary"></i>
            <div>
              <div v-if="!isEditing">{{ business.socialMediaLinks?.additionalProp1 || 'WhatsApp' }}</div>
              <div v-else><ProfileField v-model="business.socialMediaLinks.additionalProp1" placeholder="WhatsApp" :is-editing="isEditing"/></div>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <i class="pi pi-instagram !text-primary"></i>
            <div>
              <div v-if="!isEditing">{{ business.socialMediaLinks?.additionalProp2 || 'Instagram' }}</div>
              <div v-else><ProfileField v-model="business.socialMediaLinks.additionalProp2" placeholder="Instagram" :is-editing="isEditing"/></div>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <i class="pi pi-globe !text-primary"></i>
            <div>
              <div v-if="!isEditing">{{ business.website || 'Website URL' }}</div>
              <div v-else><ProfileField v-model="business.website" placeholder="Website" :is-editing="isEditing"/></div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <i class="pi pi-clock !text-primary"></i>
          <div class="flex-1">
            <div v-if="!isEditing">
              Opening Days: {{ business.openingHours?.additionalProp1 || 'Unknown' }} ||
              Opening Time: {{ business.openingHours?.additionalProp2 || 'Unknown' }}  {{ business.openingHours?.additionalProp3 || '' }}
            </div>
            <div v-else>
              <OpeningHoursPicker v-model="business.openingHours" :is-editing="isEditing"/>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute top-4 right-4">
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
    </section>

    <div class="sticky top-0 bg-white z-30 border-t">
      <div class="container-px py-4">
        <ul class="nav nav-pills flex gap-3 overflow-x-auto hide-scrollbar ml-4">
          <li v-for="tab in tabItems" :key="tab.key">
            <NuxtLink
              :to="{ path: $route.path, query: { tab: tab.key } }"
              class="nav-link"
              :class="{ active: currentTabKey === tab.key }"
            >
              {{ tab.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-6">
      <KeepAlive>
        <component
          :is="currentComponent"
          :business="business"
          :is-editing="isEditing"
          @update-section="handleSectionUpdate"
        />
      </KeepAlive>
    </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'business' })
import Badge from '~/components/Badge.vue';
import Star from '~/components/Stars.vue';
import OpeningHoursPicker from '~/components/OpeningHoursPicker.vue';
import useBusinessMethods from '~/composables/business/useBusinessMethods';
import useBusinessUser from '~/composables/business/useBusinessUser';
import type { BusinessProfileResponse } from '~/types/business';

const ProfileOverview = defineAsyncComponent(() => import('~/components/Profile/ProfileOverview.vue'));
const ProfileMedia = defineAsyncComponent(() => import('~/components/Profile/ProfileMedia.vue'));
const ProfileFaq = defineAsyncComponent(() => import('~/components/Profile/ProfileFaq.vue'));
const ProfileReview = defineAsyncComponent(() => import('~/components/Profile/ProfileReview.vue'));
const ProfileGetReview = defineAsyncComponent(() => import('~/components/Profile/ProfileGetReview.vue'));

const { getCategories, saveBusinessProfile, getBusinessProfile } = useBusinessMethods();

const store = useBusinessUser()
const businessId = store.id
const categories = ref<{ id: string; name: string }[]>([]);
const isLoading = ref(false);
const isEditing = ref(false)
const buttonLabel = computed(() => {
    return isEditing.value ? 'Save Changes' : 'Edit Profile';
});


const categoryId = ref<string | null>(null);

const business = ref<BusinessProfileResponse>({
    id: "",
    name: "",
    website: "",
    isBranch: false,
    avgRating: 0,
    reviewCount: 0,
    parentBusinessId: "",
    categories: [],
    businessAddress: "",
    logo: "",
    openingHours: null,
    businessEmail: "",
    businessPhoneNumber: "",
    cacNumber: "",
    accessUsername: "",
    accessNumber: "",
    socialMediaLinks: null,
    businessDescription: "",
    media: null,
    isVerified: false,
    reviewLink: "",
    preferredContactMethod: "",
    highlights: [],
    tags: [],
    averageResponseTime: null,
    profileClicks: 0,
    faqs: [],
    qrCodeBase64: "",
});

onBeforeMount(async () => {
    try {
        isLoading.value = true;

        const [res, categoryRes] = await Promise.all([
            getBusinessProfile(businessId || ""),
            getCategories()
        ]);

        if (res?.statusCode === 200 && res.data) {
            business.value = res.data;

            if (!business.value.tags) business.value.tags = [];
            if (!business.value.highlights) business.value.highlights = [];
            if (!business.value.faqs) business.value.faqs = [];

            if (!business.value.socialMediaLinks) {
                business.value.socialMediaLinks = {
                    additionalProp1: "",
                    additionalProp2: "",
                    additionalProp3: ""
                };
            }

            if (!business.value.openingHours) {
                business.value.openingHours = {
                    additionalProp1: "",
                    additionalProp2: "",
                    additionalProp3: ""
                };
            }

            categoryId.value = res.data.categoryId ?? null;
        }

        if (Array.isArray(categoryRes)) {
            categories.value = categoryRes;
        }

    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
});

const route = useRoute();
type TabKey = 'overview' | 'review' | 'media' | 'faq' | 'getreview';
const tabItems: { key: TabKey; name: string }[] = [
  { key: 'overview', name: 'Overview' },
  { key: 'review', name: 'Reviews' },
  { key: 'media', name: 'Photos' },
  { key: 'faq', name: 'FAQs' },
  { key: 'getreview', name: 'Get Reviews' }
];

const currentTabKey = computed<TabKey>(() => {
  const t = route.query.tab;
  const first = Array.isArray(t) ? t[0] : t;
  const key = first?.toString().toLowerCase() as TabKey;
  return key || tabItems[0]!.key;
});

const componentMap: Record<TabKey, any> = {
  overview: ProfileOverview,
  review: ProfileReview,
  media: ProfileMedia,
  faq: ProfileFaq,
  getreview: ProfileGetReview
};

const currentComponent = computed(() => componentMap[currentTabKey.value]);

const selectedCategoryName = computed(() => {
    const cat = categories.value.find(c => c.id === categoryId.value);
    return cat?.name ?? null;
});

const toast = useToast()
const updateProfile = async () => {
  console.log("UPDATE PROFILE CALLED");
    try {
        if (!businessId) {
            return toast.add({
                severity: 'error',
                summary: 'ERROR',
                detail: 'Business ID is missing',
                life: 3000
            });
        }
        const res = await saveBusinessProfile(businessId, business.value);
        if (res) {
            return toast.add({
                severity: 'success',
                summary: 'SUCCESS',
                detail: 'Profile Updated',
                life: 3000
            });
        }
    } catch (error) {
        console.log(error)
    }

}
const toggleEdit = async () => {
  isEditing.value = !isEditing.value;
    // When saving
    if (isEditing.value) {
        const payload = business.value
        // const profileData = await saveBusinessProfile(businessId ?? '', payload);
        console.log(payload)
        // store.setProfileData(profileData);
        await updateProfile();
    }
    
};

const handleSectionUpdate = (payload: { key: string; value: any }) => {
    if (!isEditing.value) return;
    (business.value as any)[payload.key] = payload.value;
};

</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.nav-link {
  @apply text-gray-600 px-4 py-2 rounded-lg transition-all duration-200;
}

.nav-link:hover {
  @apply bg-green-100 text-primary;
}

.nav-link.active {
  @apply bg-primary text-white !important;
}

</style>
