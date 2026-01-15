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
const errorMessage = ref<string | null>(null);
const loginError = ref<string | null>(null);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

const HandleLogin = async () => {
  // Clear previous errors
  loginError.value = null;
  errorMessage.value = "";

  // Client-side validation
  if (!userData.value.email || !userData.value.password) {
    loginError.value = 'Please enter both email and password.';
    errorMessage.value = loginError.value;
    toast.add({ 
      severity: 'error', 
      summary: 'Validation Error', 
      detail: loginError.value, 
      life: 3000 
    });
    return;
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.value.email)) {
    loginError.value = 'Please enter a valid email address.';
    errorMessage.value = loginError.value;
    toast.add({ 
      severity: 'error', 
      summary: 'Validation Error', 
      detail: loginError.value, 
      life: 3000 
    });
    return;
  }

  // Password minimum length check
  if (userData.value.password.length < 6) {
    loginError.value = 'Password is too short.';
    errorMessage.value = loginError.value;
    toast.add({ 
      severity: 'error', 
      summary: 'Validation Error', 
      detail: loginError.value, 
      life: 3000 
    });
    return;
  }

  isLoading.value = true;

  try {
    const res = await loginUser(userData.value);

    if (res) {
      console.log(res);
      
      // Check if we have the required authentication data
      if (!store.accessToken) {
        throw new Error('Authentication failed - no access token received');
      }

      if (store.role !== 'end_user') {
        loginError.value = 'This account is not authorized for user access.';
        errorMessage.value = loginError.value;
        toast.add({ 
          severity: 'error', 
          summary: 'Access Denied', 
          detail: loginError.value, 
          life: 4000 
        });
        return;
      }

      // Successful login
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Logged in successfully', 
        life: 3000 
      });

      // Handle remember me functionality if needed
      if (rememberMe.value) {
        // Store user preference (you might want to implement this)
        localStorage.setItem('rememberMe', 'true');
      }

      navigateTo('../../business-dashboard');
    } else {
      // Login returned false - generic failure
      loginError.value = 'Invalid email or password. Please try again.';
      errorMessage.value = loginError.value;
      toast.add({ 
        severity: 'error', 
        summary: 'Login Failed', 
        detail: loginError.value, 
        life: 3000 
      });
    }
  } catch (error: any) {
    console.error('Login error:', error);

    // Handle specific error responses from the API
    if (error.response) {
      const status = error.response.status;
      const errorMsg = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
          loginError.value = errorMsg || 'Invalid request. Please check your credentials.';
          break;
        case 401:
          loginError.value = 'Invalid email or password.';
          break;
        case 403:
          loginError.value = 'Your account has been suspended. Please contact support.';
          break;
        case 404:
          loginError.value = 'Account not found. Please check your email address.';
          break;
        case 422:
          loginError.value = errorMsg || 'Invalid credentials format.';
          break;
        case 429:
          loginError.value = 'Too many login attempts. Please try again in a few minutes.';
          break;
        case 500:
        case 502:
        case 503:
          loginError.value = 'Server error. Please try again in a few moments.';
          break;
        default:
          loginError.value = errorMsg || 'An unexpected error occurred. Please try again.';
      }
      
    } else if (error.request) {
      // Network error - request was made but no response received
      loginError.value = 'Network error. Please check your internet connection.';
    } else {
      // Other errors (e.g., thrown errors)
      loginError.value = error.message || 'An unexpected error occurred. Please try again.';
    }

    errorMessage.value = loginError.value || 'An unexpected error occurred. Please try again.';
    
    toast.add({ 
      severity: 'error', 
      summary: 'Login Error', 
      detail: loginError.value || 'An unexpected error occurred. Please try again.', 
      life: 4000 
    });
  } finally {
    isLoading.value = false;
  }
}

function handleSocialLogin(provider: string) {
  // Clear any previous errors
  errorMessage.value = "";
  loginError.value = null;

  try {
    // Placeholder for social login implementation
    console.log(`Social login with ${provider} not yet implemented`);
    
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    errorMessage.value = `${providerName} login coming soon!`;
    
    toast.add({
      severity: 'info',
      summary: 'Coming Soon',
      detail: `${providerName} login will be available soon.`,
      life: 3000
    });
    
    // Clear error after 3 seconds
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  } catch (error: any) {
    console.error(`Social login error for ${provider}:`, error);
    errorMessage.value = `Unable to connect with ${provider}. Please try again.`;
    
    toast.add({
      severity: 'error',
      summary: 'Social Login Error',
      detail: errorMessage.value,
      life: 3000
    });
  }
}
</script>