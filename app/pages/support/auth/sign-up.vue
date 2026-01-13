<template>
 <div class="relative min-h-screen bg-green-100 flex items-center justify-center">
  
      <!-- Form Section -->
      <div class="relative w-full max-w-md px-6 py-8">
        <div class="bg-white rounded-2xl shadow-lg p-8">
        <div class="flex justify-center mb-2">
          <img src="~/assets/images/e-user-logo.png" alt="Welcome" class="h-12 w-auto object-contain" />
        </div>
        <div class="text-[#008253] text-center font-semibold text-[100%] mb-3">Clear reviews, Confident decisions.</div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col justify-center items-center text-gray-600">
          <img :src="spinner" class="h-10 w-10 object-center" />
          <p class="text-sm mt-2">Signing up...</p>
        </div>

        <form @submit.prevent="handleEndUserRegistration" class="space-y-3">
          <!-- Username -->
          <div>
            <input id="username" v-model="form.username" type="username"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              placeholder="Username"
              required />

          </div>
          <!-- Email -->
          <div>
            <input id="email" v-model="form.email" type="email"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              placeholder="Email"
              required />

          </div>

          <!-- Phone -->
          <div>
            <input id="phone" v-model="form.phone" type="tel" pattern="[0-9]{11}" placeholder="Phone Number"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required />
          </div>

            <!-- Password -->
             <div >
               <div>
                 <div class="relative mt-1">
                   <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                     class="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                     placeholder="Password"
                     required 
                     />
                   <button type="button" @click="showPassword = !showPassword"
                     class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary">
                     <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                   </button>
                 </div>
               </div>
             </div>
            <!-- Confirm Password -->
            <div>
              <div class="relative mt-1">
                <input id="confirmPassword" v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'"
                  class="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                  placeholder="Confirm Password"
                  required />
                <button type="button" @click="showConfirm = !showConfirm"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary">
                  <i :class="showConfirm ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
              </div>
            </div>
          <div class="mb-2">
            <button 
              class="btn btn-primary d-grid w-100" 
              type="submit"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Signing Up...' : 'Sign Up' }}
            </button>
          </div>
        </form>

        <div class="text-center mt-0">
          <p class="text-xs">By submitting this form you accept our <NuxtLink class="!text-blue-500 cursor-pointer hover:underline">privacy policy</NuxtLink></p> 
        </div>
        <p class="text-center text-sm text-gray-800 mb-0">
          <span>Already have an account? </span>
          <NuxtLink to="/support/auth/sign-in" class="text-blue-500 hover:underline font-medium">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import useMethods from '~/composables/useMethods'; 
import type { EndUser } from "~/types";
import spinner from '~/assets/svg/spinner.svg'

const { registerEndUser } = useMethods();
const confirmPassword = ref('')
const form = ref<EndUser>({ 
  username: "",
  email: "",
  phone: "",
  password: "",
  socialMedia: ""
});
const toast = useToast()
const isLoading = ref(false);
const registrationError = ref<string | null>(null);
const showPassword = ref(false);
const showConfirm = ref(false);

const validLength = ref(true);
const validComplexity = ref(true);
const validNumeric = ref(true);
const isValid = ref(false)
const allValid = computed(() => validLength.value && validNumeric.value && validComplexity.value);

watch(() => form.value.password, (newVal) => {
  validLength.value = newVal.length >= 8;
  validNumeric.value = /[0-9]/.test(newVal);
  validComplexity.value = /[@#&$_?]/.test(newVal);
});

watch([() => form.value.password, confirmPassword], () => {
  if (isValid.value) isValid.value = false;
});

const validateForm = (): { isValid: boolean; errorMessage?: string } => {
  // Validate username
  if (!form.value.username || form.value.username.trim().length === 0) {
    return { isValid: false, errorMessage: 'Username is required.' };
  }

  if (form.value.username.trim().length < 3) {
    return { isValid: false, errorMessage: 'Username must be at least 3 characters long.' };
  }

  if (form.value.username.trim().length > 30) {
    return { isValid: false, errorMessage: 'Username must not exceed 30 characters.' };
  }

  // Username should only contain alphanumeric characters, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(form.value.username.trim())) {
    return { isValid: false, errorMessage: 'Username can only contain letters, numbers, underscores, and hyphens.' };
  }

  // Validate email
  if (!form.value.email || form.value.email.trim().length === 0) {
    return { isValid: false, errorMessage: 'Email address is required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address.' };
  }

  // Validate phone
  if (!form.value.phone || form.value.phone.trim().length === 0) {
    return { isValid: false, errorMessage: 'Phone number is required.' };
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(form.value.phone)) {
    return { isValid: false, errorMessage: 'Please enter a valid phone number.' };
  }

  if (form.value.phone.replace(/\D/g, '').length < 10) {
    return { isValid: false, errorMessage: 'Phone number must be at least 10 digits.' };
  }

  // Validate social media if provided
  if (form.value.socialMedia && form.value.socialMedia.trim().length > 0) {
    // Basic URL validation for social media
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const handleRegex = /^@?[\w\.]+$/; // For handles like @username or username
    
    if (!urlRegex.test(form.value.socialMedia) && !handleRegex.test(form.value.socialMedia)) {
      return { isValid: false, errorMessage: 'Please enter a valid social media URL or handle.' };
    }
  }

  // Validate password
  if (!form.value.password || form.value.password.length === 0) {
    return { isValid: false, errorMessage: 'Password is required.' };
  }

  if (!allValid.value) {
    if (!validLength.value) {
      return { isValid: false, errorMessage: 'Password must be at least 8 characters long.' };
    }
    if (!validNumeric.value) {
      return { isValid: false, errorMessage: 'Password must contain at least one number.' };
    }
    if (!validComplexity.value) {
      return { isValid: false, errorMessage: 'Password must contain at least one special character (@, #, &, $, _, ?).' };
    }
  }

  // Validate password confirmation
  if (!confirmPassword.value || confirmPassword.value.length === 0) {
    return { isValid: false, errorMessage: 'Please confirm your password.' };
  }

  if (confirmPassword.value !== form.value.password) {
    return { isValid: false, errorMessage: 'Passwords do not match.' };
  }

  return { isValid: true };
};

const handleEndUserRegistration = async () => {
  // Clear previous errors
  registrationError.value = null;

  // Validate form
  const validation = validateForm();
  if (!validation.isValid) {
    registrationError.value = validation.errorMessage || 'Please check your input.';
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: registrationError.value,
      life: 4000
    });
    return;
  }

  try {
    isLoading.value = true;

    const res = await registerEndUser(form.value);
    
    if (res) {
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Account created successfully! Redirecting to login...', 
        life: 3000 
      });
      
      // Clear sensitive data
      form.value.password = '';
      confirmPassword.value = '';
      
      setTimeout(() => {
        navigateTo('sign-in');
      }, 1000);
    } else {
      registrationError.value = 'Registration failed. Please try again.';
      toast.add({
        severity: 'error',
        summary: 'Registration Failed',
        detail: registrationError.value,
        life: 3000
      });
    }
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle specific error responses from the API
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
          registrationError.value = errorMessage || 'Invalid registration data. Please check your input.';
          break;
        case 409:
          // Conflict - email or username already exists
          if (errorMessage?.toLowerCase().includes('email')) {
            registrationError.value = 'An account with this email already exists.';
          } else if (errorMessage?.toLowerCase().includes('username')) {
            registrationError.value = 'This username is already taken. Please choose another.';
          } else {
            registrationError.value = errorMessage || 'An account with these details already exists.';
          }
          break;
        case 422:
          registrationError.value = errorMessage || 'Please check that all required fields are filled correctly.';
          break;
        case 429:
          registrationError.value = 'Too many registration attempts. Please try again later.';
          break;
        case 500:
        case 502:
        case 503:
          registrationError.value = 'Server error. Please try again in a few moments.';
          break;
        default:
          registrationError.value = errorMessage || 'Registration failed. Please try again.';
      }
    } else if (error.request) {
      // Network error - request was made but no response received
      registrationError.value = 'Network error. Please check your internet connection and try again.';
    } else {
      // Other errors
      registrationError.value = error.message || 'An unexpected error occurred. Please try again.';
    }

    toast.add({
      severity: 'error',
      summary: 'Registration Error',
      detail: registrationError.value,
      life: 4000
    });
  } finally {
    isLoading.value = false;
  }
}
</script>