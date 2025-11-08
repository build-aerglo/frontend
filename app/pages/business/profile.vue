<template>
  <div>
    <div class="relative bg-white w-full h-[400px] rounded shadow-lg">
      <img src="/images/profile/profile-gradient-bg.jpg" alt="profile-gradient-bg" class="h-[65%] w-full object-cover rounded-t">
      <div class="bg-white w-[140px] h-[140px] rounded-[10px] p-[5px] absolute top-[37%] left-7 transform translate-y-1/2">
        <img  src="/images/profile/profile-picture.jpg" alt="" class="w-full h-full object-cover rounded-t">
      </div>
      <div class="absolute bottom-[4%] left-12 transform translate-y-1/2 flex flex-col items-center gap-1">
        <Rating v-model="value" :stars="5" style="--p-rating-icon-size: 13px; --p-rating-icon-color: #001ad6;" />
        <p class="text-[80%]">(120 Reviews)</p>
      </div>
      <p class="text-[170%] ml-[190px] mt-5">{{ business.name || 'John Doe' }}</p>
      <div class="ml-[190px] flex items-center gap-6">
        <div class="flex items-center gap-2">
          <i class=" pi pi-briefcase"></i>
          <span>{{ business.sector || 'Sector' }}</span>
        </div>

        <ProfileVerified :isVerified="true" size="sm" />
        <div class="flex items-center gap-2">
          <i class=" pi pi-tag"></i>
          <span>{{ business.tag || 'Tags' }}</span>
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
const value = ref(5)
const business = {
  name: '',
  sector: '',
  tag: ''
}
const isOpened = ref(true); // Start the button as "Opened"

const toggleStatus = () => {
  isOpened.value = !isOpened.value;
};
const SettingProfile = defineAsyncComponent(() => import('~/components/Setting/SettingProfile.vue'));
const SettingConnection = defineAsyncComponent(() => import('~/components/Setting/SettingConnection.vue'));
const SettingMedia = defineAsyncComponent(() => import('~/components/Setting/SettingMedia.vue'));
const ProfileStats = defineAsyncComponent(() => import('~/components/Profile/ProfileStats.vue'));

const componentMap = {
  profile: SettingProfile,
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
  return componentMap[key] || SettingProfile;
});
</script>

<style scoped>

</style>