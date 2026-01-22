<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900">Sign In to Your Account</h2>
    </div>

    <div v-if="errorMessage" class="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-xs text-center">
      {{ errorMessage }}
    </div>

    <div class="space-y-3">
      <button 
        type="button"
        @click="handleSocialLogin('google-oauth2')" 
        :disabled="isLoading" 
        class="w-full flex items-center justify-center gap-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-4 h-4" alt="Google" />
        Continue with Google
      </button>

      <button 
        type="button"
        @click="handleSocialLogin('Facebook')" 
        :disabled="isLoading" 
        class="w-full flex items-center justify-center gap-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1877F2" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Continue with Facebook
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
          v-model="userData.email" type="email" placeholder="your@email.com" required :disabled="isLoading"
          class="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:ring-1 focus:ring-[#008253] focus:border-[#008253] transition" 
        />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Password</label>
        <div class="relative">
          <input 
            v-model="userData.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required :disabled="isLoading"
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
        type="submit" :disabled="isLoading" 
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
import useUser from '~/composables/useUser' 
import useMethods from '~/composables/useMethods';
import type { LoginData } from "~/types";
import spinner from '~/assets/svg/spinner.svg'

const emit = defineEmits(['close', 'switch-to-signup']);
const { loginUser } = useMethods();
const store = useUser(); 
const toast = useToast();

const userData = ref<LoginData>({ email: '', password: '' });
const rememberMe = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const { initiateSocialLogin } = useSocialAuth();

const handleSocialLogin = async (provider: string) => {
  errorMessage.value = "";
  try {
    const validProviders = ['google-oauth2', 'Facebook', 'Twitter', 'GitHub'];
    if (!validProviders.includes(provider)) throw new Error(`Invalid provider: ${provider}`);
    localStorage.setItem('social_provider', provider);
    await initiateSocialLogin(provider);
  } catch (error: any) {
    errorMessage.value = error.message || "Social login failed";
    toast.add({ severity: 'error', summary: 'Error', detail: errorMessage.value, life: 4000 });
  }
}

const HandleLogin = async () => {
  errorMessage.value = "";
  if (!userData.value.email || !userData.value.password) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Fields required', life: 3000 });
    return;
  }

  isLoading.value = true;
  try {
    const res = await loginUser(userData.value);
    if (res) {
      if (store.role !== 'end_user') {
        errorMessage.value = 'Not authorized for user access.';
        return;
      }
      toast.add({ severity: 'success', summary: 'Success', detail: 'Logged in successfully', life: 3000 });
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', userData.value.email);
      }
      emit('close'); // Close modal on success
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || "Login failed";
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