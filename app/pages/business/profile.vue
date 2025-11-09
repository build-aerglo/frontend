<template>
  <div>
    <div class="relative bg-white w-full h-[270px] rounded shadow-lg flex">
      <div class=" flex flex-col items-center gap-2 absolute bottom-[40%] left-[30px] transform translate-y-1/2">
        <div class="relative w-[120px] h-[120px]">
          <!-- Profile image -->
          <img
            :src="previewUrl || '/images/profile/profile-picture.jpg'"
            alt="Profile"
            class="w-full h-full object-cover rounded-full border-3 !border-primary"
          />

          <!-- Pencil Button -->
          <button
            @click="triggerFileInput"
            class="absolute bottom-1 right-1 !bg-primary text-white rounded-full 
                  w-8 h-8 flex items-center justify-center shadow-md hover:bg-link transition-colors duration-200"
          >
            <i class="pi pi-pencil text-sm"></i>
          </button>

          <!-- Hidden Input -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
        <div class="flex flex-col items-center gap-1">
          <Rating v-model="ratingValue" :stars="5" style="--p-rating-icon-size: 13px;"
          :ptOptions="{ mergeProps: true }"
          :pt="{
            onIcon: { class: '!text-gold' }, // Use !important
            offIcon: { class: '!text-gray-500' } // Use !important

          }"
          />
          <p class="text-[80%]">(120 Reviews)</p>
        </div>
      </div>

      <div class="absolute bottom-[50%] left-[190px] transform translate-y-1/2">
        <p class="text-[170%] mt-5">{{ business.name || 'John Doe' }}</p>
        <div class="flex items-center gap-5">
          <div class="flex items-center gap-2">
            <i class=" pi pi-briefcase"></i>
            <span>{{ business.sector || 'Sector' }}</span>
          </div>
  
          <ProfileVerified :isVerified="false" size="sm" />
          <div class="flex items-center gap-2">
            <i class=" pi pi-tag"></i>
            <span>{{ business.tag || 'Tags' }}</span>
          </div>
        </div>
      </div>

      <div class="absolute top-[5%] right-7 transform translate-y-1/2">
        <ButtonCustom 
        :label="isOpened ? 'Opened' : 'Closed'" 
        @click="toggleStatus"
        primary="true" 
        size="lg" />
      </div>
    </div>

    <div>
      <ul
        class="nav nav-pills flex flex-col md:flex-row mb-6 flex-wrap mt-8 gap-2"
      >
        <li v-for="tab in tabItems" :key="tab.key" class="nav-item">
          <NuxtLink 
            :to="{ path: $route.path, query: { tab: tab.key } }" 
            class="nav-link flex items-center" 
            :class="{ 'active': currentTabKey === tab.key }"
          >
            <i v-if="tab.icon" :class="[tab.icon, 'me-2']"></i> 
            {{ tab.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      <KeepAlive>
        <component :is="currentComponent" />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'business' 
});
import { useRoute } from 'vue-router'; 
const ratingValue = ref(4)

const business = {
  name: '',
  sector: '',
  tag: ''
}
const isOpened = ref(true); // Start the button as "Opened"

const toggleStatus = () => {
  isOpened.value = !isOpened.value;
};
const ProfileDetails = defineAsyncComponent(() => import('~/components/Profile/ProfileDetails.vue'));
const SettingConnection = defineAsyncComponent(() => import('~/components/Setting/SettingConnection.vue'));
const SettingMedia = defineAsyncComponent(() => import('~/components/Setting/SettingMedia.vue'));
const ProfileStats = defineAsyncComponent(() => import('~/components/Profile/ProfileStats.vue'));

const componentMap = {
  profile: ProfileDetails,
  connections: SettingConnection,
  media: SettingMedia,
  stats: ProfileStats,
};

const tabItems = [
  { key: 'profile', name: 'Profile', icon: 'pi pi-users' },
  { key: 'connections', name: 'Connections', icon: 'pi pi-link' },
  { key: 'media', name: 'Media & Branding', icon: 'pi pi-image' },
  { key: 'stats', name: 'Stats & Reviews', icon: 'pi pi-chart-bar' },
]

const route = useRoute();
const currentTabKey = computed(() => {
  const tab = route.query.tab;
  const tabValue = Array.isArray(tab) ? tab[0] : tab;
  return (tabValue?.toString().toLowerCase() || tabItems[0]!.key);
});
const currentComponent = computed(() => {
  const key = currentTabKey.value as keyof typeof componentMap;
  return componentMap[key] || ProfileDetails;
});
const fileInput = ref(null);
const previewUrl = ref("");

// Open file picker
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Show image preview
const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }
};
</script>

<style scoped>

</style>