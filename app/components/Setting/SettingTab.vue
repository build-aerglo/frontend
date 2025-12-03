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

<script setup lang="ts">
// Define valid tab keys
type TabKey = 'security' | 'response' | 'subscription'

interface TabItem {
  key: TabKey
  name: string
  icon: string
}

const tabItems: TabItem[] = [
  { key: 'security', name: 'Account & Security', icon: 'pi pi-lock' },
  { key: 'response', name: 'Auto Response', icon: 'pi pi-reply' },
  { key: 'subscription', name: 'Subscriptions', icon: 'pi pi-credit-card' },
]

const route = useRoute()

const currentTabKey = computed<TabKey>(() => {
  const tab = route.query.tab as string | undefined
  const key = tab?.toLowerCase() as TabKey
  return (key && (key === 'security' || key === 'response' || key === 'subscription')) 
    ? key 
    : 'security'
})
</script>