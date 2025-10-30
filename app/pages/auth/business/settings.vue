<template>
  <div class="settings-page">

    <ul class="nav nav-pills flex-col sm:flex-row mb-6 flex-wrap space-y-2 sm:space-y-0 sm:space-x-2">
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

    <div class="card shadow-lg rounded-lg">
      <div class="card-body px-3 py-1">
        <KeepAlive>
          <component :is="currentComponent" />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router'; 


const SettingProfile = defineAsyncComponent(() => import('~/components/Setting/SettingProfile.vue'));
const SettingContact = defineAsyncComponent(() => import('~/components/Setting/SettingContact.vue'));
const SettingWeblink = defineAsyncComponent(() => import('~/components/Setting/SettingWeblink.vue'));
const SettingMedia = defineAsyncComponent(() => import('~/components/Setting/SettingMedia.vue'));
const SettingSecurity = defineAsyncComponent(() => import('~/components/Setting/SettingSecurity.vue'));



const componentMap = {
  account: SettingProfile,
  contact: SettingContact,
  weblinks: SettingWeblink,
  media: SettingMedia,
  security: SettingSecurity,
};


const tabItems = [
  { key: 'account', name: 'Account', icon: 'pi pi-user' },
  { key: 'contact', name: 'Contact', icon: 'pi pi-phone' },
  { key: 'weblinks', name: 'Web Links', icon: 'pi pi-link' },
  { key: 'media', name: 'Media & Branding', icon: 'pi pi-images' },
  { key: 'security', name: 'Security', icon: 'pi pi-lock' },
];


const route = useRoute();
const currentTabKey = computed(() => route.query.tab?.toLowerCase() || tabItems[0].key);

const currentComponent = computed(() => {
  return componentMap[currentTabKey.value] || SettingProfile; 
});

const currentTabName = computed(() => {
  const activeTab = tabItems.find(item => item.key === currentTabKey.value);
  return activeTab ? activeTab.name : tabItems[0].name;
});
</script>
<style scoped>

</style>