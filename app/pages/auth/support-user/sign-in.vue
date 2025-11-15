<template>
<div class="relative min-h-screen bg-green-100 flex items-center justify-center">

    <!-- Form Section -->
    <div class="relative w-full max-w-md px-6 py-8">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <div class="flex justify-center mb-4">
          <img
            src="~/assets/images/e-user-logo.png"
            alt="Welcome"
            class="h-12 w-auto object-contain"
          />
        </div>
        <div class="text-[#008253] text-center font-bold text-[100%] mt-2 mb-5">
          Clear reviews, Confident decisions.
        </div>
        <form id="formAuthentication" @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <!-- Input -->
            <input
              id="email"
              v-model="email"
              name="email"
              type="text"
              placeholder="Email"
              required
              class="block w-full rounded-md border border-gray-300 p-2 pr-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary outline-none transition"
            />
          </div>
          <div class="relative">
            <InputTextCustom
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              inputClass="border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none rounded-md p-2 w-full text-sm transition"
            />
            <i
              :class="showPassword ? 'pi pi-eye' : 'pi pi-slash'"
              class="absolute right-3 top-4 cursor-pointer text-gray-500"
              @click="togglePassword"
            ></i>
          </div>

          <div class="flex justify-between items-center text-xs text-gray-600">
            <label class="flex items-center space-x-1">
              <input type="checkbox" id="remember-me" v-model="rememberMe" class="accent-blue-500" />
              <span>Remember Me</span>
            </label>
            <NuxtLink to="/" class="text-blue-500 hover:text-gray-600 font-medium">
              Forgot Password?
            </NuxtLink>
          </div>
          <div class="mb-6">
            <div class="mb-6">
            <button 
              class="btn btn-primary d-grid w-100" 
              type="submit"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Signing In...' : 'Sign In' }}
            </button>
          </div>
          </div>
        </form>

        <p class="text-center text-sm text-gray-800">
          <span>Don't have an account? </span>
          <NuxtLink to="/auth/support-user/sign-up" class="text-blue-500 hover:underline font-medium">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useSupportUser"; 

const router = useRouter();
const { login } = useAuth();  

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isLoading = ref(false);
const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleSubmit() {
  isLoading.value = true;

  try {
    await login(email.value, password.value, rememberMe.value);
    router.push("/links");
  } catch (error: any) {
    alert(
      error.response?.data?.message ||
      error.message ||
      "Login failed. Please try again."
    );
  } finally {
    isLoading.value = false;
  }
}
</script>