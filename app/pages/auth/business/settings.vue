<template>
  <div class="settings-page">

    <!-- Mobile nav -->
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

    <!-- Desktop nav -->
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

    <!-- Edit / Cancel button -->
    <div class="flex justify-start mb-4">
      <button
        @click="toggleEdit"
        class="px-0 py-1 rounded !text-primary hover:underline"
      >
        {{ isEditing ? 'Cancel' : editButtonText }}
      </button>
    </div>

    <!-- Render settings content -->
    <div>
      <KeepAlive>
        <component :is="currentComponent" :is-editing="isEditing" />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'; 

const isEditing = ref(false)
const toggleEdit = () => (isEditing.value = !isEditing.value)

const SettingSecurity = defineAsyncComponent(() => import('~/components/Setting/SettingSecurity.vue'));
const SettingSubscription = defineAsyncComponent(() => import('~/components/Setting/SettingSubscription.vue'));

const componentMap = {
  security: SettingSecurity,
  subscription: SettingSubscription,
};

const tabItems = [
  { key: 'security', name: 'Account & Security', icon: 'pi pi-lock' },
  { key: 'subscription', name: 'Subscription', icon: 'pi pi-subscribe' },
];

const route = useRoute();
const currentTabKey = computed(() => route.query.tab?.toLowerCase() || tabItems[0].key);
const currentComponent = computed(() => componentMap[currentTabKey.value] || SettingSecurity);

// 🔹 Dynamic edit button text based on active tab
const editButtonText = computed(() => {
  switch (currentTabKey.value) {
    case 'subscription':
      return 'Edit Subscription'
    case 'security':
    default:
      return 'Edit Profile'
  }
})

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
</style>
