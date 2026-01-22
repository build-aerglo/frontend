<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900">Create Your Account</h2>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center">
      <img :src="spinner" class="h-8 w-8" />
    </div>

    <div class="space-y-3">
      <button 
        type="button"
        @click="handleSocialLogin('google-oauth2')" 
        class="w-full flex items-center justify-center gap-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-4 h-4" alt="Google" />
        Continue with Google
      </button>

      <button 
        type="button"
        @click="handleSocialLogin('Facebook')" 
        class="w-full flex items-center justify-center gap-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
      >
        <i class="pi pi-facebook text-blue-600 text-lg"></i>
        Continue with Facebook
      </button>
    </div>

    <div class="relative flex items-center">
      <div class="flex-grow border-t border-gray-100"></div>
      <span class="flex-shrink mx-4 text-gray-400 text-sm uppercase">Or with email</span>
      <div class="flex-grow border-t border-gray-100"></div>
    </div>

    <form @submit.prevent="handleEndUserRegistration" class="space-y-4">
      <div>
        <label class="block text-sm text-gray-700 mb-1">Username</label>
        <input v-model="form.username" type="text" placeholder="johndoe" required 
          class="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#008253] focus:border-[#008253] transition" />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Email Address</label>
        <input v-model="form.email" type="email" placeholder="your@email.com" required 
          class="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#008253] focus:border-[#008253] transition" />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Phone Number</label>
        <input v-model="form.phone" type="tel" placeholder="08012345678" required 
          class="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-[#008253] focus:border-[#008253] transition" />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Password</label>
        <div class="relative">
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required 
            class="w-full border border-gray-200 rounded-lg p-3 pr-10 text-sm outline-none focus:ring-1 focus:ring-[#008253] focus:border-[#008253] transition" />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>
        
        <div v-if="form.password && !allValid" class="mt-2 text-[11px] space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div :class="validLength ? 'text-green-600' : 'text-red-500'" class="flex items-center gap-1">
            <i :class="validLength ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i> 8+ Characters
          </div>
          <div :class="validNumeric ? 'text-green-600' : 'text-red-500'" class="flex items-center gap-1">
            <i :class="validNumeric ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i> Contains Number
          </div>
          <div :class="validComplexity ? 'text-green-600' : 'text-red-500'" class="flex items-center gap-1">
            <i :class="validComplexity ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i> Special Character (@#&$_?)
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Confirm Password</label>
        <div class="relative">
          <input v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'" placeholder="••••••••" required 
            class="w-full border border-gray-200 rounded-lg p-3 pr-10 text-sm outline-none focus:ring-1 focus:ring-[#00aa00] focus:border-[#00aa00] transition" />
          <button type="button" @click="showConfirm = !showConfirm" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <i :class="showConfirm ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </button>
        </div>
      </div>

      <button type="submit" :disabled="isLoading" class="w-full btn btn-primary">
        {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
      </button>
    </form>

    <div class="text-center space-y-4">
      <p class="text-[13px] px-4 leading-relaxed">
        By submitting this form, you accept our <span class="text-blue-600 font-medium cursor-pointer hover:underline">privacy policy</span> and terms of service.
      </p>
      <p class="text-[13px]">
        Already have an account? 
        <button @click="$emit('switch-to-signin')" class="text-blue-600 hover:underline">Sign in</button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMethods from '~/composables/useMethods'; 
import useSocialAuth from '~/composables/useSocialAuth'; // Added social auth
import type { EndUser } from "~/types";
import spinner from '~/assets/svg/spinner.svg'

const emit = defineEmits(['close', 'switch-to-signin']);
const { registerEndUser } = useMethods();
const { initiateSocialLogin } = useSocialAuth(); // Added social auth
const toast = useToast();

const confirmPassword = ref('');
const form = ref<EndUser>({ username: "", email: "", phone: "", password: "", socialMedia: "" });
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);

const validLength = ref(false);
const validComplexity = ref(false);
const validNumeric = ref(false);
const allValid = computed(() => validLength.value && validNumeric.value && validComplexity.value);

watch(() => form.value.password, (newVal) => {
  validLength.value = newVal.length >= 8;
  validNumeric.value = /[0-9]/.test(newVal);
  validComplexity.value = /[@#&$_?]/.test(newVal);
});

// Added social login handler
const handleSocialLogin = async (provider: string) => {
  try {
    const validProviders = ['google-oauth2', 'Facebook', 'Twitter', 'GitHub'];
    if (!validProviders.includes(provider)) throw new Error(`Invalid provider: ${provider}`);
    localStorage.setItem('social_provider', provider);
    await initiateSocialLogin(provider);
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message || "Social login failed", life: 4000 });
  }
}

const handleEndUserRegistration = async () => {
  if (form.value.password !== confirmPassword.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match', life: 3000 });
    return;
  }
  if (!allValid.value) return;

  isLoading.value = true;
  try {
    const res = await registerEndUser(form.value);
    if (res) {
      toast.add({ severity: 'success', summary: 'Account Created', detail: 'Redirecting to login...', life: 2000 });
      setTimeout(() => emit('switch-to-signin'), 1500);
    }
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Failed', detail: error.response?.data?.message || "Registration failed", life: 4000 });
  } finally {
    isLoading.value = false;
  }
}
</script>