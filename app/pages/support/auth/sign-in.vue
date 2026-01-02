<template>
  <div class="relative min-h-screen bg-green-100 flex items-center justify-center">
  
      <!-- Form Section -->
      <div class="relative w-full max-w-md px-6 py-8">
        <div class="bg-white rounded-2xl shadow-lg p-8">
        <div class="flex justify-center mb-2">
          <img
            src="~/assets/images/e-user-logo.png"
            class="h-12 w-auto object-contain"
          />
        </div>
        <div class="text-[#008253] text-center font-semibold text-[100%] mb-5">
          Clear reviews, Confident decisions.
        </div>
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col justify-center items-center text-gray-600">
          <img :src="spinner" class="h-10 w-10 object-center" />
          <p class="text-sm mt-2">Signing in...</p>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {{ errorMessage }}
        </div>

        <form id="formAuthentication" @submit.prevent="HandleLogin" class="space-y-5">
          <div>
            <input
              id="email"
              v-model="userData.email"
              name="email"
              type="email"
              placeholder="Email"
              required
              :disabled="isLoading"
              class="block w-full rounded-md border border-gray-300 p-2 pr-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              <input 
                type="checkbox" 
                id="remember-me" 
                v-model="rememberMe" 
                :disabled="isLoading"
                class="accent-blue-500" 
              />
              <span>Remember Me</span>
            </label>
            <NuxtLink to="/support/auth/password-reset" class="text-blue-500 hover:text-gray-600 font-medium">
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
          <NuxtLink to="/support/auth/sign-up" class="text-blue-500 hover:underline font-medium">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUser  from '~/composables/useUser' 
import useMethods from '~/composables/useMethods';
import type { LoginData } from "~/types";
import spinner from '~/assets/svg/spinner.svg'

const { loginUser } = useMethods();
const store = useUser(); 
const toast = useToast()
const userData = ref<LoginData>({
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
    console.log(res);
    if (store.accessToken && store.role === 'end_user') {
          toast.add({ severity: 'success', summary: 'SUCCESS', detail: 'Logged in successfully', life: 3000 });
          navigateTo('../../business-dashboard');
    } else {
        loginError.value = 'Login succeeded, but no token was stored.';
    }
  } else {
    loginError.value = 'Login failed. Please check your credentials and network connection.';
    toast.add({ severity: 'error', summary: 'ERROR', detail: 'sign in Failed', life: 3000});
  }

  isLoading.value = false;
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