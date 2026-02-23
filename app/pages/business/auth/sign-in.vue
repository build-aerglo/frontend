<template>
  <Toast />
  <NavBar />
  <div
    class="h-[calc(100vh-4rem)] overflow-hidden relative bg-[url('/images/auth/b-user-bg.png')] bg-cover bg-center"
  >
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="h-full flex items-center justify-center relative z-10">
      <div class="card w-full max-w-md -translate-y-6">
        <div class="card-body">
          <div class="app-brand justify-content-center mb-3">
            <NuxtLink to="/" class="md:text-center">
              <NavLogo />
            </NuxtLink>
          </div>
          <p class="mb-6 text-[95%] sm:text-[100%] text-center text-contrast">
            Sign in to manage reviews and track your business growth.
          </p>

          <form
            @submit.prevent="HandleLogin"
            id="formAuthentication"
            class="mb-2"
          >
            <div class="form-control-validation">
              <InputTextCustom
                v-model="loginData.email"
                label="Email"
                type="email"
                required
              />
            </div>

            <div class="form-password-toggle form-control-validation">
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
                <NuxtLink to="/business/auth/password-reset">
                  <p class="mb-0 text-link">Forgot Password?</p>
                </NuxtLink>
              </div>
            </div>
            <ButtonCustom
              :label="isLoading ? 'Authenticating...' : 'Login'"
              :disabled="isLoading"
              size="lg"
              primary="true"
              input-class="p-3 text-[15px]"
              type="submit"
            />
          </form>

          <p class="text-center md:text[100%] pt-1">
            <span>New on our platform?</span>
            <NuxtLink to="sign-up">
              <span class="ms-1 hover:underline text-link"
                >Create an account</span
              >
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBusinessUser from "~/composables/business/useBusinessUser";
import useMethods from "~/composables/useMethods";
import type { LoginData } from "~/types";

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
  // Clear previous errors
  loginError.value = null;

  // Client-side validation
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

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(loginData.value.email)) {
    loginError.value = "Please enter a valid email address.";
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
    // Pass 'business_user' as the expected role
    const res = await loginUser(loginData.value, "business_user");

    if (res) {
      // Check if we have the required authentication data
      if (!store.accessToken) {
        throw new Error("Authentication failed - no access token received");
      }

      // Successful login
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Logged in successfully",
        life: 3000,
      });

      if (store.id) {
        navigateTo("/business/dashboard");
      } else {
        navigateTo("sign-up");
      }
    } else {
      // Login returned false - generic failure
      loginError.value = "Invalid credentials. Please try again.";
      toast.add({
        severity: "error",
        summary: "Login Failed",
        detail: loginError.value,
        life: 3000,
      });
    }
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle specific error responses from the API
    if (error.message === "Invalid credentials") {
      // This covers both wrong password AND wrong role
      loginError.value = "Invalid credentials. Please try again.";
    } else if (error.response) {
      const status = error.response.status;
      const errorMessage =
        error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
          loginError.value = "Invalid credentials. Please try again.";
          break;
        case 401:
          loginError.value = "Invalid credentials. Please try again.";
          break;
        case 403:
          loginError.value =
            "Your account has been suspended. Please contact support.";
          break;
        case 404:
          loginError.value = "Invalid credentials. Please try again.";
          break;
        case 422:
          loginError.value = "Invalid credentials. Please try again.";
          break;
        case 429:
          loginError.value = "Too many login attempts. Please try again later.";
          break;
        case 500:
        case 502:
        case 503:
          loginError.value = "Server error. Please try again in a few moments.";
          break;
        default:
          loginError.value =
            errorMessage || "An unexpected error occurred. Please try again.";
      }
    } else if (error.request) {
      // Network error - request was made but no response received
      loginError.value =
        "Network error. Please check your internet connection.";
    } else {
      // Other errors
      loginError.value = "Invalid credentials. Please try again.";
    }

    toast.add({
      severity: "error",
      summary: "Login Error",
      detail: loginError.value,
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
