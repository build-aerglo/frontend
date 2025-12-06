<template>
  <div class="relative min-h-screen bg-green-100 flex items-center justify-center">
  
      <!-- Form Section -->
      <div class="relative w-full max-w-md px-6 py-8">
        <div class="bg-white rounded-2xl shadow-lg p-8">
        <div class="flex justify-center mb-4">
          <img
            src="~/assets/images/e-user-logo.png"
            class="h-12 w-auto object-contain"
          />
        </div>
        <div class="text-[#008253] text-center font-bold text-[100%] mt-2 mb-5">
          Clear reviews, Confident decisions.
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center text-gray-600">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
          <p class="mt-2">Signing in...</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {{ errorMessage }}
        </div>

        <form id="formAuthentication" @submit.prevent="HandleLogin" class="space-y-5">
          <div>
            <!-- Input -->
            <input
              id="email"
              v-model="userData.email"
              name="email"
              type="text"
              placeholder="Email"
              required
              class="block w-full rounded-md border border-gray-300 p-2 pr-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary outline-none transition"
            />
          </div>
          <div class="relative">
            <InputTextCustom
              v-model="userData.password"
              placeholder="Password"
              inputClass="border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none rounded-md p-2 w-full text-sm transition"
            />
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
          <NuxtLink to="/support/auth/sign-up" class="text-blue-500 hover:underline font-medium">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupportUserStore } from '@/store/supportUser'
import useMethods from '~/composables/useMethods';
import type { supportLoginData } from "~/types/support";


const { loginUser } = useMethods();
const store = useSupportUserStore(); 
const userData = ref<supportLoginData>({
  email: '',
  password: '',
});

const rememberMe = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");

const loginError = ref<string | null>(null);

const HandleLogin = async () => {
  isLoading.value = true;
  loginError.value = null; 

  const res = await loginUser(userData.value);

  if (res) {
    alert('login successful')
    console.log(res);
    if (store.accessToken) {
          navigateTo('./');
    } else {
        loginError.value = 'Login succeeded, but no token was stored.';
    }
  } else {
    loginError.value = 'Login failed. Please check your credentials and network connection.';
  }

  isLoading.value = false;
}
</script>