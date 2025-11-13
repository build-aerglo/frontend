

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Left Image Section -->
    <div class="hidden md:flex w-2/3 relative">
      <img
        src="~/assets/images/e-user-bg.png"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Right Form Section -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/3 px-4 bg-gray-50">
      <div class="w-full max-w-sm space-y-5">
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

        <form id="formAuthentication" @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              :disabled="isLoading"
              class="block w-full rounded-md border border-gray-300 p-2 pr-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div class="relative">
            <InputTextCustom
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              :disabled="isLoading"
              inputClass="border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none rounded-md p-2 w-full text-sm transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <i
              :class="showPassword ? 'pi pi-eye' : ''"
              class="absolute right-3 top-4 cursor-pointer text-gray-500"
              @click="togglePassword"
            ></i>
          </div>

          <div class="flex justify-between items-center text-xs text-gray-600">
            <label class="flex items-center space-x-1">
              <input 
                type="checkbox" 
                id="remember-me" 
                v-model="rememberMe" 
                :disabled="isLoading"
                class="accent-blue-500" 
              />
              <span>Remember Me</span>
            </label>
            <NuxtLink to="/" class="text-blue-500 hover:text-gray-600 font-medium">
              Forgot Password?
            </NuxtLink>
          </div>
          <div class="mb-6">
            <button 
              class="btn btn-primary d-grid w-100" 
              type="submit"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Signing In...' : 'Sign In' }}
            </button>
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

        <div class="flex justify-center space-x-4">
          <button @click="handleSocialLogin('facebook')" aria-label="Login with Facebook" :disabled="isLoading">
            <i class="pi pi-facebook text-black text-xl hover:text-blue-600 transition"></i>
          </button>
          <button @click="handleSocialLogin('twitter')" aria-label="Login with Twitter" :disabled="isLoading">
            <i class="pi pi-twitter text-black text-xl hover:text-blue-400 transition"></i>
          </button>
          <button @click="handleSocialLogin('github')" aria-label="Login with GitHub" :disabled="isLoading">
            <i class="pi pi-github text-gray-800 text-xl hover:text-gray-600 transition"></i>
          </button>
          <button @click="handleSocialLogin('google')" aria-label="Login with Google" :disabled="isLoading">
            <i class="pi pi-google text-black text-xl hover:text-red-600 transition"></i>
          </button>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/store/user"; 
import axios from "axios";

const router = useRouter();
const userStore = useUserStore();

const email = ref<string>("");
const password = ref<string>("");
const rememberMe = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleSubmit() {
  
  errorMessage.value = "";
  
  
  if (!email.value || !password.value) {
    errorMessage.value = "Please enter both email and password.";
    return;
  }

  isLoading.value = true;

  try {
    const loginUrl = "http://aerglotechnology.com/api/auth/login";

    const response = await axios.post(loginUrl, {
      email: email.value,
      password: password.value,
    });

    console.log("Login response:", response.data);

    const token = response.data.access_token;
    const userId = response.data.user?.id || response.data.id; 

    if (!token) {
      throw new Error("No authentication token received from server.");
    }

    // Save token 
    if (rememberMe.value) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }

    // Update user store with logged-in state
    userStore.setUser({ 
      id: userId || email.value // Use email as fallback if no ID
    });

  
    if (response.data.user) {
      
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    }

    // Redirect to profile page
    await router.push("/profile/end-user");
  } catch (error: any) {
    console.error("Login error:", error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error
      errorMessage.value = error.response.data?.message || 
                          error.response.data?.error || 
                          "Invalid email or password.";
    } else if (error.request) {
      // Request was made but no response
      errorMessage.value = "Unable to connect to server. Please check your internet connection.";
    } else {
      // Something else happens
      errorMessage.value = error.message || "Login failed. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
}

function handleSocialLogin(provider: string) {
  // Placeholder for social login implementation
  console.log(`Social login with ${provider} not yet implemented`);
  errorMessage.value = `${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`;
  
  // Clear error after 3 seconds
  setTimeout(() => {
    errorMessage.value = "";
  }, 3000);
}
</script>