import useBusinessMethods from "~/composables/business/useBusinessMethods";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getBusinessUser } = useBusinessMethods();

  const user = getBusinessUser();

  if (to.path.startsWith("/business/")) {
    //   !user?.loggedIn ||
    if (user?.id === null) {
      return await navigateTo("/business/auth/sign-in");
    }
  }
});
