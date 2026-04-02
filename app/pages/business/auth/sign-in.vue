<template>
  <Toast />
  <div
    class="flex justify-center items-center min-h-screen sm:p-[50px] p-[30px]"
  >
    <div
      class="rounded-[20px] shadow-sm w-full sm:max-w-[1000px] flex rounded-r-[10px]"
    >
      <div
        class="w-full sm:w-[65%] flex flex-col p-[30px] rounded-r-[10px] bg-white"
      >
        <NuxtLink
          to="/"
          class="uppercase w-max text-[80%] text-primary mb-[30px] flex items-center gap-[5px]"
        >
          <i class="pi pi-angle-left mt-[5px]"></i> CleReview
        </NuxtLink>
        <div class="flex-1 text-center py-[20px]">
          <div class="text-primary sm:text-[200%] text-[150%] font-bold">
            Welcome Back!
          </div>
          <div class="mb-[20px]">
            Sign in to manage reviews and track your business growth.
          </div>

          <form @submit.prevent="HandleLogin">
            <div>
              <InputTextCustom
                v-model="loginData.email"
                label="Email"
                type="email"
                required
              />
            </div>
            <div>
              <InputTextCustom
                v-model="loginData.password"
                label="Password"
                type="password"
                required
              />
            </div>

            <div class="mb-6 mt-8">
              <div class="d-flex justify-content-between">
                <div class="form-check mb-0 ms-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="remember-me"
                  />
                  <label class="form-check-label" for="remember-me">
                    Remember Me
                  </label>
                </div>
                <NuxtLink to="/auth/password-reset">
                  <p class="mb-0 !text-primary">Forgot Password?</p>
                </NuxtLink>
              </div>
            </div>

            <ButtonCustom
              :label="
                isLoading
                  ? 'Authenticating Account Details...'
                  : 'Sign in to Account'
              "
              :disabled="isLoading"
              size="lg"
              primary="true"
              input-class="p-3 text-[15px]"
              type="submit"
              :no-zoom="TrendingUpDownIcon"
            />

            <div class="mt-[30px]">
              <div class="text-center md:text[100%] pt-1">
                <span>New to ClerReview?</span>
                <NuxtLink to="sign-up">
                  <span class="ms-1 hover:underline !text-primary"
                    >Create an account</span
                  >
                </NuxtLink>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        class="w-full sm:w-[35%] sm:block hidden !bg-primary text-white border rounded-r-[10px]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import useVerificationMethods from "~/composables/verification/useVerificationMethods";
import useBusinessUser from "~/composables/business/useBusinessUser";

const { getBusinessProfile, getBusinessSubscriptionSummary } =
  useBusinessMethods();
const { getBusinessVerification } = useVerificationMethods();

import useMethods from "~/composables/useMethods";
import type { LoginData } from "~/types";
import { TrendingUpDownIcon } from "lucide-vue-next";

const { loginUser } = useMethods();
const store = useBusinessUser();
const toast = useToast();

const loginData = ref<LoginData>({
  email: "",
  password: "",
});

const isLoading = ref(false);
const loginError = ref<string | null>(null);

const HandleLogin = async () => {
  loginError.value = null;

  if (!loginData.value.email || !loginData.value.password) {
    loginError.value = "Please enter both email and password.";
    toast.add({
      severity: "error",
      summary: "Validation Error",
      detail: loginError.value,
      life: 3000,
    });
    return;
  }

  isLoading.value = true;

  try {
    await loginUser(loginData.value, "business_user");

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Logged in successfully",
      life: 3000,
    });

    // do not delete
    await Promise.all([
      getBusinessProfile(store.id!),
      getBusinessSubscriptionSummary(),
      getBusinessVerification(store.id!),
    ]);

    navigateTo("/business/dashboard");
  } catch (err: any) {
    loginError.value = err.message;

    toast.add({
      severity: "error",
      summary: "Login Error",
      detail: err.message,
      life: 4000,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  content: none !important;
  display: none !important;
}
</style>
