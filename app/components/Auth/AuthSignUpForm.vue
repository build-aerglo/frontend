<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900">Create Your Account</h2>
    </div>
    <!-- <div v-if="isLoading" class="flex flex-col items-center">
      <img :src="spinner" class="h-8 w-8" />
    </div> -->

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
import useSocialAuth from '~/composables/useSocialAuth'; 
import type { EndUser } from "~/types";

const emit = defineEmits(['close', 'switch-to-signin', 'success']);
const { registerEndUser, loginUser } = useMethods();
const { initiateSocialLogin } = useSocialAuth();
const toast = useToast();

const confirmPassword = ref('');
const registrationError = ref<string | null>(null);
const form = ref<EndUser>({ username: "", email: "", phone: "", password: "", socialMedia: "" });
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);

const validLength = ref(false);
const validComplexity = ref(false);
const validNumeric = ref(false);
const allValid = computed(() => validLength.value && validNumeric.value && validComplexity.value);

// Password Watcher
watch(() => form.value.password, (newVal) => {
  validLength.value = newVal.length >= 8;
  validNumeric.value = /[0-9]/.test(newVal);
  validComplexity.value = /[@#&$_?]/.test(newVal);
});

/**
 * FORM VALIDATION LOGIC
 */
const validateForm = (): { isValid: boolean; errorMessage?: string } => {
  if (form.value.username.trim().length < 3) return { isValid: false, errorMessage: 'Username must be at least 3 characters.' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) return { isValid: false, errorMessage: 'Please enter a valid email address.' };

  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(form.value.phone) || form.value.phone.replace(/\D/g, '').length < 10) {
    return { isValid: false, errorMessage: 'Please enter a valid phone number (min 10 digits).' };
  }

  if (!allValid.value) return { isValid: false, errorMessage: 'Please fulfill all password requirements.' };
  
  if (confirmPassword.value !== form.value.password) return { isValid: false, errorMessage: 'Passwords do not match.' };

  return { isValid: true };
};

/**
 * SOCIAL LOGIN
 */
const handleSocialLogin = async (provider: string) => {
  registrationError.value = null;
  try {
    const validProviders = ['google-oauth2', 'Facebook', 'Twitter', 'GitHub', 'Apple'];
    if (!validProviders.includes(provider)) throw new Error(`Invalid provider: ${provider}`);
    localStorage.setItem('social_provider', provider);
    await initiateSocialLogin(provider);
  } catch (error: any) {
    registrationError.value = error.message || "Social login failed";
    toast.add({ severity: 'error', summary: 'Error', detail: registrationError.value, life: 4000 });
  }
}

/**
 * MAIN REGISTRATION
 */
const handleEndUserRegistration = async () => {
  registrationError.value = null;

  const validation = validateForm();
  if (!validation.isValid) {
    registrationError.value = validation.errorMessage!;
    return;
  }

  isLoading.value = true;
  try {
    const res = await registerEndUser(form.value);
    
    if (res) {
      // Silent Login
      const loginRes = await loginUser({ 
        email: form.value.email, 
        password: form.value.password 
      });

      if (loginRes) {
        toast.add({ severity: 'success', summary: 'Success!', detail: 'Account created and logged in.', life: 2000 });
        emit('success'); 
      }
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.response) {
      const status = error.response.status;
      const apiMsg = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 409:
          if (apiMsg?.toLowerCase().includes('email')) registrationError.value = 'Email already exists.';
          else if (apiMsg?.toLowerCase().includes('username')) registrationError.value = 'Username is taken.';
          else registrationError.value = 'An account with these details already exists.';
          break;
        case 422:
          registrationError.value = 'Check that all fields are filled correctly.';
          break;
        default:
          registrationError.value = apiMsg || 'Registration failed.';
      }
    } else {
      registrationError.value = 'Network error. Please check your connection.';
    }
    toast.add({ severity: 'error', summary: 'Registration Error', detail: registrationError.value, life: 4000 });
  } finally {
    isLoading.value = false;
  }
}
</script>