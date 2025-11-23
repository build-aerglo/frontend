<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Left Image Section -->
    <div class="hidden md:flex w-2/3 relative">
      <img
        src="~/assets/images/e-user-bg.png"
        alt="Welcome background"
        class="w-full h-full object-cover"
      />
       <div class="absolute bottom-3 left-3">
          <p class="text-blue-800 text-sm drop-shadow">
            Earn points by writing reviews, making referrals and unlocking achievements across the platform... 
          </p>
       </div>
    </div>

    <!-- Right Form Section -->
    <div class="flex flex-col justify-center items-center bg-gray-50 w-full md:w-1/3 px-4">
      <div class="w-full max-w-sm space-y-5">
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
            <input
              v-model="userData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="w-full border border-gray-300 rounded-lg p-2 pr-10 
                        focus:outline-none hover:border-gray-400 
                        focus:border-primary focus:ring-2 focus:ring-primary"
              required
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
            <NuxtLink to="/auth/end-user/forgot-password" class="text-blue-500 hover:text-gray-600 font-medium">
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
          <NuxtLink to="/auth/end-user/sign-up" class="text-blue-500 hover:underline font-medium">
            Sign up
          </NuxtLink>
        </p>

        <div class="flex items-center">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="px-2 text-gray-400 text-xs">or sign in with</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <div class="flex justify-center space-x-5">
          <NuxtLink to="/" aria-label="Login with Facebook">
            <i class="pi pi-facebook text-blue-600 text-2xl"></i>
          </NuxtLink>
          <NuxtLink to="/" aria-label="Login with Twitter">
            <i class="pi pi-twitter text-slate-600 text-2xl"></i>
          </NuxtLink>
          <NuxtLink to="/" aria-label="Login with GitHub">
            <i class="pi pi-github text-gray-800 text-2xl"></i>
          </NuxtLink>
          <NuxtLink to="/" aria-label="Login with Google">
            <i class="pi pi-google text-amber-600 text-2xl"></i>
          </NuxtLink>
        </div>
        <p class="text-center mt-4 text-sm text-gray-800">
          <NuxtLink to="/review/write-review" class="text-blue-500 font-medium hover:underline">
            Review as a Guest
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user' 
import useMethods from '~/composables/useMethods';
import type { userLoginData } from "~/types";

const { loginUser } = useMethods();
const store = useUserStore(); 

const userData = ref<userLoginData>({
  email: '',
  password: '',
});

const rememberMe = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");

const loginError = ref<string | null>(null);
function togglePassword() {
  showPassword.value = !showPassword.value;
}

const HandleLogin = async () => {
  isLoading.value = true;
  loginError.value = null; 

  const res = await loginUser(userData.value);

  if (res) {
    alert('login successful')
    console.log(res);
    if (store.accessToken) {
          navigateTo('../../');
    } else {
        loginError.value = 'Login succeeded, but no token was stored.';
    }
  } else {
    loginError.value = 'Login failed. Please check your credentials and network connection.';
  }

  isLoading.value = false;
}
</script>