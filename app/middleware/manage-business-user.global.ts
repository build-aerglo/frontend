import useBusinessMethods from "~/composables/business/useBusinessMethods";
import { useBusinessProfileStore } from "~/store/business/businessProfile";
import { useBusinessSubscription } from "~/store/business/businessSubscription";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!to.path.startsWith("/business")) return;

  const { getBusinessUser, getBusinessSubscriptionFromStore } =
    useBusinessMethods();
  const profileStore = useBusinessProfileStore();
  const businessSubscriptionStore = useBusinessSubscription();

  const biz = getBusinessUser();
  const biz_subscription = await getBusinessSubscriptionFromStore();
  if (!biz || !biz.id) {
    // clear store and sign out
    profileStore.clearProfile();
    businessSubscriptionStore.clearPlan();

    navigateTo("/business/auth/sign-in");
  }

  if (!biz_subscription || !biz_subscription.subscriptionPlanId) {
    // clear store and sign out
    profileStore.clearProfile();
    businessSubscriptionStore.clearPlan();

    navigateTo("/business/auth/sign-in");
  }
});
