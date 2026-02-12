<template>
  <div class="settings-page">
    <div>
      <div class="flex sm:flex-row flex-col gap-2.5 pb-[20px]">
        <ButtonCustom
          v-for="(i, idx) in tabItems"
          :key="idx"
          :primary="i.key === currentTabKey ? true : false"
          :label="i.name"
          :icon="i.icon"
          @clicked="setTabKey(i.key)"
          :no-zoom="true"
          size="lg"
        />
      </div>
    </div>
    <div>
      <GeneralLoader v-if="isLoading" height="500px" />
      <KeepAlive v-else>
        <component
          :is="currentComponent"
          :can-dnd="canDnd"
          :can-auto-response="canAutoResponse"
          :can-private-reviews="canPrivateReviews"
          :allow-auto-response="businessSettings?.autoResponseEnabled"
        />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "business",
});

import useBusinessMethods from "~/composables/business/useBusinessMethods";
const { getBusinessSubscriptionSummary, getBusinessSettings } =
  useBusinessMethods();
import type {
  BusinessSettingsRequest,
  BusinessSubscription,
} from "~/types/business";

const SettingSecurity = defineAsyncComponent(
  () => import("~/components/BusinessSettings/Account.vue"),
);
const SettingResponse = defineAsyncComponent(
  () => import("~/components/BusinessSettings/Response.vue"),
);
const SettingSubscription = defineAsyncComponent(
  () => import("~/components/BusinessSettings/Subscription.vue"),
);
const componentMap = {
  security: SettingSecurity,
  response: SettingResponse,
  subscription: SettingSubscription,
};
const tabItems = [
  { key: "security", name: "Account & Security", icon: "lock" },
  { key: "response", name: "Auto Response", icon: "reply" },
  { key: "subscription", name: "Subscriptions", icon: "credit-card" },
];

const isLoading = ref(true);
const currentTabKey = ref("security");
const setTabKey = (key: string) => {
  currentTabKey.value = key;
};

const currentComponent = computed(() => {
  const key = currentTabKey.value as keyof typeof componentMap;
  return componentMap[key] || SettingSecurity;
});

const businessSettings = ref<BusinessSettingsRequest>();
const businessSubscription = ref<BusinessSubscription>();

const canDnd = ref(false);
const canAutoResponse = ref(false);
const canPrivateReviews = ref(false);

onBeforeMount(async () => {
  try {
    isLoading.value = true;

    const [res, businessRes] = await Promise.all([
      getBusinessSettings(),
      getBusinessSubscriptionSummary(),
    ]);

    if (res?.statusCode === 200) {
      businessSettings.value = res.data;
    }

    if (businessRes?.statusCode === 200) {
      businessSubscription.value = businessRes.data;

      // set tier 1
      if (
        businessSubscription.value?.tier &&
        businessSubscription.value?.tier > 0
      ) {
        canPrivateReviews.value = true;
      }

      // set tier two
      if (
        businessSubscription.value?.tier &&
        businessSubscription.value?.tier > 1
      ) {
        canDnd.value = true;
        canAutoResponse.value = true;
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
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
