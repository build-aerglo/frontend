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
import useMethods from '~/composables/useMethods';
import type { LoginData } from "~/types";

const emit = defineEmits(['close', 'switch-to-signup', 'success']);
const { loginUser } = useMethods();
const { initiateSocialLogin } = useSocialAuth();
const toast = useToast();

const userData = ref<LoginData>({ email: '', password: '' });
const rememberMe = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

/**
 * SOCIAL LOGIN
 */
const handleSocialLogin = async (provider: string) => {
  errorMessage.value = null;
  isLoading.value = true;

  try {
    const success = await initiateSocialLogin(provider);

    if (success) {
      toast.add({
        severity: 'success',
        summary: 'Welcome!',
        detail: 'You are now logged in.',
        life: 3000
      });
      emit('success');
    }

  } catch (err: any) {
    errorMessage.value = err.message;
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.message,
      life: 4000
    });
  } finally {
    isLoading.value = false;
  }
};

/**
 * EMAIL LOGIN
 */
const HandleLogin = async () => {
  errorMessage.value = null;

  // Basic UX validation only
  if (!userData.value.email || !userData.value.password) {
    errorMessage.value = 'Please enter both email and password.';
    return;
  }

  isLoading.value = true;

  try {
    await loginUser(userData.value, 'end_user');

    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('userEmail', userData.value.email);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userEmail');
    }

    toast.add({
      severity: 'success',
      summary: 'Welcome!',
      detail: 'You are now logged in.',
      life: 3000
    });

    emit('success');

  } catch (err: any) {
    errorMessage.value = err.message;

    toast.add({
      severity: 'error',
      summary: 'Login Error',
      detail: err.message,
      life: 4000
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const remembered = localStorage.getItem('rememberMe');
  const savedEmail = localStorage.getItem('userEmail');

  if (remembered === 'true' && savedEmail) {
    rememberMe.value = true;
    userData.value.email = savedEmail;
  }
});
</script>
