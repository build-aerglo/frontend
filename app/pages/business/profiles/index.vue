<template>
  <div>
    <section class="bg-white w-full border border-b-2 border-gray-200 p-5 flex flex-col md:flex-row gap-5 relative items-start">
      <div class="relative flex-shrink-0">
        <ProfileImageUploader v-model="business.logo" :disabled="!isEditing" />

        <div class="absolute -top-2 -right-2">
          <Badge :type="business.isVerified ? 'verified' : 'standard'" />
        </div>
        <div class="flex items-center mt-2">
                 <Star
                    v-for="n in 5"
                    :key="n"
                    :value="business.avgRating - (n - 1)"
                    :color-level="Math.ceil(business.avgRating)"
                    class="w-5 h-5"
                    />
                    <span class="font-semibold text-sm text-gray-500">{{ business.avgRating?.toFixed(1) ?? '0.0' }}</span>
        </div>
        <div class="text-sm text-gray-600">
          <span class="text-gray-500">({{ business.reviewCount ?? 0 }} reviews)</span>
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
    :icon="isEditing ? 'pi pi-check' : 'pi pi-pencil'"
    :primary="true"
    size="lg"
    input-class="text-[15px] w-auto"
    class="whitespace-nowrap"
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

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content Area (2/3) -->
      <div class="lg:col-span-2">
      <KeepAlive>
        <component
          :is="currentComponent"
          :business="business"
          :is-editing="isEditing"
          @update-section="handleSectionUpdate"
        />
      </KeepAlive>
    </div>

    <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Quick Actions (Desktop) -->
          <div class="bg-white rounded-xl shadow-sm p-6 md:sticky md:top-24">
            <h4 class="font-bold text-gray-900 text-center mt-2 mb-4">Quick Stats</h4>
            <div class="space-y-3">
              <button class="w-full px-2 py-3 text-sm  bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                Total Reviews 1K
              </button>
              <button class="w-full text-sm px-2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                Average Response Time: 12hours
              </button>
              <button class="w-full text-sm px-2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                Profile clicks(30 days) 3450
              </button>
            </div>
          </div>
          </div>
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
  if (isEditing.value) {
    await updateProfile();
  }
  isEditing.value = !isEditing.value;
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
