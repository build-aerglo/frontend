<template>
  <div class="settings-page">

    <ul
      class="nav nav-pills flex-col md:hidden mb-6 flex-wrap"
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


    <div class="flex justify-end mb-4">
      <button
        @click="toggleEdit"
        class="px-4 py-1 rounded bg-link text-white hover:bg-[#336be6]"
      >
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>

    <div>
      <KeepAlive>
        <component :is="currentComponent" :is-editing="isEditing" />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'business' 
});
import { useRoute } from 'vue-router'; 
const prop = defineProps(['isMobile'])
const isEditing = ref(false)
const toggleEdit = () => (isEditing.value = !isEditing.value)

const SettingSecurity = defineAsyncComponent(() => import('~/components/Setting/SettingSecurity.vue'));
const SettingResponse = defineAsyncComponent(() => import('~/components/Setting/SettingResponse.vue'));
const SettingSubscription = defineAsyncComponent(() => import('~/components/Setting/SettingSubscription.vue'));
const componentMap = {
  security: SettingSecurity,
  response: SettingResponse,
  subscription: SettingSubscription,
};
const tabItems = [
  { key: 'security', name: 'Account & Security', icon: 'pi pi-lock' },
  { key: 'response', name: 'Auto Response', icon: 'pi pi-reply' },
  { key: 'subscription', name: 'Subscriptions', icon: 'pi pi-credit-card' },
]

const route = useRoute();
const currentTabKey = computed(() => {
  const tab = route.query.tab;
  const tabValue = Array.isArray(tab) ? tab[0] : tab;
  return (tabValue?.toString().toLowerCase() || tabItems[0]!.key);
});
const currentComponent = computed(() => {
  const key = currentTabKey.value as keyof typeof componentMap;
  return componentMap[key] || SettingSecurity;
});

const isMobile = ref(false)
const checkScreen = () => (isMobile.value = window.innerWidth < 1200)
onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})
onUnmounted(() => window.removeEventListener('resize', checkScreen))
</script>

<style scoped>
.nav-link.active {
  background-color: var(--primary, #008253);
  color: white !important; 
}
@media (min-width: 768px) {
  .nav-pills {
    display: none;
  }
}
</style>