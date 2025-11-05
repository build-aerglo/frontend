<template>
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
</template>

<script setup>
const tabItems = [
  { key: 'security', name: 'Account & Security', icon: 'pi pi-lock' },
  { key: 'subscription', name: 'Subscriptions', icon: 'pi pi-subscribe' },
]
const route = useRoute()
const currentTabKey = computed(() => route.query.tab?.toLowerCase() || tabItems[0].key)
</script>
