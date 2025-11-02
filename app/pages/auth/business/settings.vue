<template>
  <div class="settings-page">

    <ul
      v-if="isMobile"
      class="nav nav-pills flex-col sm:flex-row mb-6 flex-wrap space-y-2 sm:space-y-0 sm:space-x-2"
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

    <template v-if="!isMobile">
      <Teleport to=".nav"> 
        <div class="flex items-center space-x-2 h-full px-4"> 
          <ul class="flex flex-row flex-wrap space-x-2 nav nav-pills">
            <li v-for="tab in tabItems" :key="tab.key" class="nav-item">
              <NuxtLink
                :to="{ path: $route.path, query: { tab: tab.key } }"
                class="nav-link flex items-center text-[15px] px-3 py-1 rounded-md transition-colors duration-200"
                :class="{
                  '!bg-primary text-white': currentTabKey === tab.key,
                  'text-contrast hover:bg-gray-100 border border-gray-200': currentTabKey !== tab.key
                }"
              >
                <i v-if="tab.icon" :class="[tab.icon, 'me-2 text-[16px]']"></i>
                {{ tab.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </Teleport>
    </template>

    <div>
      <KeepAlive>
        <component :is="currentComponent" />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'; 

// Lazy load the components
const SettingWeblink = defineAsyncComponent(() => import('~/components/Setting/SettingWeblink.vue'));
const SettingMedia = defineAsyncComponent(() => import('~/components/Setting/SettingMedia.vue'));
const SettingSecurity = defineAsyncComponent(() => import('~/components/Setting/SettingSecurity.vue'));

// Map tab keys to components
const componentMap = {
  weblinks: SettingWeblink,
  media: SettingMedia,
  security: SettingSecurity,
};

// Define tabs
const tabItems = [
  { key: 'weblinks', name: 'Connections', icon: 'pi pi-link' },
  { key: 'media', name: 'Media & Branding', icon: 'pi pi-images' },
  { key: 'security', name: 'Account & Security', icon: 'pi pi-lock' },
];

// Get route
const route = useRoute();
const currentTabKey = computed(() => route.query.tab?.toLowerCase() || tabItems[0].key);
const currentComponent = computed(() => componentMap[currentTabKey.value] || SettingWeblink);

// Detect screen width manually (Re-added for conditional rendering)
const isMobile = ref(false)
const checkScreen = () => {
  // Use the 1200px breakpoint established in your CSS
  isMobile.value = window.innerWidth < 1200
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})
</script>

<style scoped>
/* Optionally style nav pills */
.nav-link.active {
  background-color: var(--primary, #008253);
  color: white !important;
}
</style>