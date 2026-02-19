<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900">Sign In to Your Account</h2>
    </div>

    <div class="space-y-3">
      <button 
        type="button"
        @click="handleSocialLogin('google-oauth2')" 
        :disabled="isLoading" 
        class="w-full flex items-center justify-start gap-4 py-2.5 px-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 bg-white"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" alt="Google" />
        Continue with Google
      </button>
    </div>

    <div class="relative flex items-center">
      <div class="flex-grow border-t border-gray-100"></div>
      <span class="flex-shrink mx-4 text-gray-400 text-sm">Or continue with email</span>
      <div class="flex-grow border-t border-gray-100"></div>
    </div>

    <form @submit.prevent="HandleLogin" class="space-y-4">
      <div>
        <label class="block text-sm text-gray-700 mb-1">Email</label>
        <input 
          v-model="userData.email" 
          type="email" 
          placeholder="your@email.com" 
          required 
          :disabled="isLoading"
          class="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:ring-1 focus:ring-[#008253] focus:border-[#008253] transition" 
        />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Password</label>
        <div class="relative">
          <input 
            v-model="userData.password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="••••••••" 
            required 
            :disabled="isLoading"
            class="w-full border border-gray-200 rounded-lg p-3 pr-10 text-sm outline-none focus:ring-1 focus:ring-[#008253] focus:border-[#008253] transition" 
          />
          <i 
            :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'" 
            class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400" 
            @click="showPassword = !showPassword"
          ></i>
        </div>
      </div>

      <div class="text-right">
        <NuxtLink to="/end-user/auth/forgot-password" class="text-[14px] text-blue-600 hover:text-gray-500 transition">
          Forgot password?
        </NuxtLink>
      </div>

      <button 
        type="submit" 
        :disabled="isLoading" 
        class="btn btn-primary w-full"
      >
        {{ isLoading ? 'Signing In...' : 'Sign In' }}
      </button>
    </form>

    <p class="text-center text-[13px] pb-2">
      Don't have an account? 
      <button @click="$emit('switch-to-signup')" class="text-blue-600 hover:underline">Sign up</button>
    </p>
  </div>
</template>

<script setup lang="ts">
import useSocialAuth from '~/composables/useSocialAuth';
import useUser from '~/composables/useUser';
import useMethods from '~/composables/useMethods';
import type { LoginData } from "~/types";

const emit = defineEmits(['close', 'switch-to-signup', 'success']);
const { loginUser } = useMethods();
const store = useUser(); 
const toast = useToast();
const userData = ref<LoginData>({ email: '', password: '' });

const rememberMe = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const { initiateSocialLogin } = useSocialAuth();

/**
 * SOCIAL LOGIN HANDLER
 */
const handleSocialLogin = async (provider: string) => {
  errorMessage.value = null;
  isLoading.value = true;

  try {
    const validProviders = ['google-oauth2', 'Facebook', 'Twitter', 'GitHub', 'Apple'];
    if (!validProviders.includes(provider)) {
      throw new Error(`Invalid social login provider: ${provider}`);
    }

    localStorage.setItem('social_provider', provider);

    // ✅ Now returns true/false after popup closes
    const success = await initiateSocialLogin(provider);

    if (success) {
      toast.add({ severity: 'success', summary: 'Welcome!', detail: 'You are now logged in.', life: 3000 });
      emit('success'); // ✅ Closes modal, user stays on page
    }
    // If false (user closed popup or error), do nothing - just stay on modal

  } catch (error: any) {
    console.error(`Social login error for ${provider}:`, error);
    
    const displayProviderName = provider === 'google-oauth2' ? 'Google' : provider;
    
    if (error.message?.includes('popup') || error.message?.includes('blocked')) {
      errorMessage.value = `Pop-up blocked. Please allow pop-ups for this site.`;
    } else if (error.message?.includes('cancelled') || error.message?.includes('closed')) {
      errorMessage.value = null; // User cancelled, no need to show error
      return;
    } else {
      errorMessage.value = error.message || `Unable to connect with ${displayProviderName}.`;
    }

    if (errorMessage.value) {
      toast.add({ severity: 'error', summary: 'Error', detail: errorMessage.value, life: 4000 });
    }
  } finally {
    isLoading.value = false;
  }
};

/**
 * EMAIL/PASSWORD LOGIN HANDLER
 */
const HandleLogin = async () => {
  errorMessage.value = "";

  // 1. Client-side Validation
  if (!userData.value.email || !userData.value.password) {
    errorMessage.value = 'Please enter both email and password.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.value.email)) {
    errorMessage.value = 'Please enter a valid email address.';
    return;
  }

  if (userData.value.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.';
    return;
  }

  isLoading.value = true;

  try {
    // Pass 'end_user' as the expected role
    const res = await loginUser(userData.value, 'end_user');
    
    if (res) {
      // Handle Remember Me logic
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', userData.value.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }
      toast.add({ severity: 'success', summary: 'Welcome!', detail: 'You are now logged in.', life: 3000 })
      emit('success'); 
    } else {
      errorMessage.value = 'Invalid credentials. Please try again.';
    }
  } catch (error: any) {
    console.error('Login error:', error);

    // Handle role mismatch with generic message
    if (error.message === 'Invalid credentials') {
      errorMessage.value = 'Invalid credentials. Please try again.';
    } else if (error.response) {
      const status = error.response.status;
      const apiMsg = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
        case 401:
        case 404:
        case 422:
          errorMessage.value = 'Invalid credentials. Please try again.';
          break;
        case 403:
          if (apiMsg?.toLowerCase().includes('suspended')) {
            errorMessage.value = 'Your account has been suspended.';
          } else if (apiMsg?.toLowerCase().includes('verified')) {
            errorMessage.value = 'Please verify your email address first.';
          } else {
            errorMessage.value = 'Invalid credentials. Please try again.';
          }
          break;
        case 429:
          errorMessage.value = 'Too many attempts. Try again later.';
          break;
        case 500:
          errorMessage.value = 'Server error. Please try again later.';
          break;
        default:
          errorMessage.value = 'Invalid credentials. Please try again.';
      }
    } else {
      errorMessage.value = 'Network error. Please check your connection.';
    }

    toast.add({ 
      severity: 'error', 
      summary: 'Login Error', 
      detail: errorMessage.value, 
      life: 4000 
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  const remembered = localStorage.getItem('rememberMe');
  const savedEmail = localStorage.getItem('userEmail');
  if (remembered === 'true' && savedEmail) {
    rememberMe.value = true;
    userData.value.email = savedEmail;
  }
});
</script>