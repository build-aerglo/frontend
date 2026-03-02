import useBusinessMethods from "~/composables/business/useBusinessMethods";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path.includes("/business/dashboard")) return;
  if (!to.path.startsWith("/business")) return;

  const {
    getBusinessUser,
    getBusinessSubscriptionFromStore,
    getBusinessVerificationFromStore,
  } = useBusinessMethods();

  const { logoutUser } = useMethods();

  const biz = getBusinessUser();
  const biz_subscription = await getBusinessSubscriptionFromStore();
  const biz_verification = await getBusinessVerificationFromStore();

  if (
    !biz ||
    !biz.id ||
    !biz_subscription ||
    !biz_subscription.subscriptionPlanId ||
    !biz_verification ||
    !biz_verification.id
  ) {
    // // clear store and sign out
    // profileStore.clearProfile();
    // businessSubscriptionStore.clearPlan();

    // navigateTo("/business/auth/sign-in");
    await logoutUser();
  }
});
