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

      <button 
        type="button"
        @click="handleSocialLogin('Twitter')" 
        :disabled="isLoading" 
        class="w-full flex items-center justify-start gap-4 py-2.5 px-5 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm font-medium text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
        </svg>
        Continue with X
      </button>

      <button 
        type="button"
        @click="handleSocialLogin('Apple')" 
        :disabled="isLoading" 
        class="w-full flex items-center justify-start gap-4 py-2.5 px-5 border border-black rounded-lg bg-black hover:bg-gray-800 transition text-sm font-medium text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.202-.029 2.265-1.186c1.063-1.156.908-2.482.878-2.516zM9.194 1.517c.02-.036.085-.118.133-.147.188.18.36.382.508.605.497.746.774 1.504.815 2.198-.545-.039-1.24-.319-1.777-.771a3.393 3.393 0 0 1-.679-.685zM14.973 12.33c-.457 1.1-1.434 3.22-2.89 3.22-1.455 0-1.928-.99-3.58-.99-1.652 0-2.161.99-3.58.99-1.419 0-2.856-2.99-3.58-5.22-.724-2.23-.362-4.485.905-5.922 1.266-1.437 3.129-1.854 4.416-1.854 1.287 0 2.41.834 3.057.834.646 0 1.944-.834 3.056-.834 1.112 0 3.033.417 4.12 1.854a1.03 1.03 0 0 1 .25.362c-2.25 1.146-1.875 4.312.625 5.375.125.05.25.1.375.125-.125.688-.75 2.063-1.25 3.063z"/>
        </svg>
        Continue with Apple
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
  errorMessage.value = "";
  try {
    const validProviders = ['google-oauth2', 'Facebook', 'Twitter', 'GitHub', 'Apple'];
    
    if (!validProviders.includes(provider)) {
      throw new Error(`Invalid social login provider: ${provider}`);
    }

    localStorage.setItem('social_provider', provider);
    await initiateSocialLogin(provider);
    
  } catch (error: any) {
    console.error(`Social login error for ${provider}:`, error);
    
    const displayProviderName = provider === 'google-oauth2' ? 'Google' : provider;
    
    if (error.message?.includes('popup') || error.message?.includes('blocked')) {
      errorMessage.value = `Pop-up blocked. Please allow pop-ups for ${displayProviderName}.`;
    } else if (error.message?.includes('cancelled') || error.message?.includes('closed')) {
      errorMessage.value = `${displayProviderName} login was cancelled.`;
      return;
    } else {
      errorMessage.value = error.message || `Unable to connect with ${displayProviderName}.`;
    }
    
    toast.add({ severity: 'error', summary: 'Error', detail: errorMessage.value, life: 4000 });
  }
}

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