<template>
   <NavBar />
  <div class="container-xxl relative bg-[url('/images/auth/b-user-bg.png')] bg-cover bg-center">
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="authentication-wrapper authentication-basic container-py">
      <div class="authentication-inner py-6">

        <div class="card">
          <div class="card-body">

            <div class="app-brand justify-content-center mb-2">
              <NuxtLink to="/">
                <NavLogo />
              </NuxtLink>
            </div>

            <p class="mb-6 text-[95%] sm:text-[100%] text-contrast text-center">
              Build customer trust through real feedback!
            </p>

            <form @submit.prevent="handleRegistration" class="mb-6">

              <div class="form-control-validation">
                <InputTextCustom v-model="businessData.name" label="Business Name" type="text" required />
              </div>

              <div class="form-control-validation">
                <InputTextCustom v-model="businessData.email" label="Email" type="email" required />
              </div>

              <div class="form-control-validation">
                <InputTextCustom v-model="businessData.phone" label="Phone Number" type="tel" required />
              </div>

              <!-- FIXED: MULTIPLE SELECT -->
              <div class="form-control-validation">
                <span class="text-contrast text-[95%] mb-1">Business Sector</span>
                <MultiSelect v-model="businessData.categoryIds" :options="categories" optionLabel="name" optionValue="id" filter required
                :maxSelectedLabels="3" class="w-full mt-1 mb-3 border border-gray-300 outline-none rounded-[5px] 
                focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300 
                bg-secondaryLinen" />               
              </div>

              <div class="form-password-toggle form-control-validation">
                <InputTextCustom v-model="password" label="Password" type="password" required />

                <div v-if="!allValid" class="flex flex-col mt-[10px] mb-[10px]">
                  <div class="flex items-center gap-2">
                    <i class="text-[10px]" :class="validLength ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                    Password must be greater than 8 characters
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="text-[10px]" :class="validNumeric ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                    Password must contain a number
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="text-[10px]" :class="validComplexity ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                    Password must contain a special character (@#&_$?)
                  </div>
                </div>
              </div>

              <div class="form-password-toggle form-control-validation">
                <InputTextCustom v-model="confirmPassword" label="Confirm Password" type="password" required />
              </div>

              <div v-if="registrationError" class="text-red-500">{{ registrationError }}</div>

              <ButtonCustom
                :label="isLoading ? 'Registering...' : 'Register your business'"
                :disabled="isLoading"
                size="lg"
                primary="true"
                input-class="p-[10px] text-[15px] mt-8"
                type="submit"
              />
            </form>

            <p class="text-center md:text-[100%]">
              <span class="text-contrast">Already have an account?</span>
              <NuxtLink to="sign-in">
                <span class="ms-1 hover:underline text-link">Sign in instead</span>
              </NuxtLink>
            </p>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMethods from '~/composables/useMethods';
import useBusinessMethods from '~/composables/business/useBusinessMethods';
import type { BusinessUser } from "~/types/business";

const { getCategories } = useBusinessMethods();
const { registerBusiness } = useMethods();
const toast = useToast();

const categories = ref<{ id: string; name: string }[]>([]);

onMounted(async () => {
  try {
    const res = await getCategories();
    if (res && res.length > 0) {
      categories.value = res;
    } else {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No categories available at the moment',
        life: 3000
      });
    }
  } catch (error: any) {
    console.error("Failed to load categories:", error);
    
    let errorMessage = 'Unable to fetch categories. Please refresh the page.';
    
    if (error.response?.status === 503 || error.response?.status === 500) {
      errorMessage = 'Server is temporarily unavailable. Please try again later.';
    } else if (error.request && !error.response) {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 4000
    });
  }
});

const businessData = ref<BusinessUser>({
  name: '',
  email: '',
  phone: '',
  userType: 'business_user',
  password: '',
  categoryIds: [],
  address: null,
  branchName: null,
  branchAddress: null,
  website: null
});

const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const registrationError = ref<string | null>(null);

const validLength = ref(true);
const validComplexity = ref(true);
const validNumeric = ref(true);
const isValid = ref(false);

const allValid = computed(() => validLength.value && validNumeric.value && validComplexity.value);

watch(password, (newVal) => {
  validLength.value = newVal.length >= 8;
  validNumeric.value = /[0-9]/.test(newVal);
  validComplexity.value = /[@#&$_?]/.test(newVal);
});

watch([password, confirmPassword], () => {
  if (isValid.value) isValid.value = false;
});

const validateForm = (): { isValid: boolean; errorMessage?: string } => {
  // Validate business name
  if (!businessData.value.name || businessData.value.name.trim().length === 0) {
    return { isValid: false, errorMessage: 'Business name is required.' };
  }

  if (businessData.value.name.trim().length < 2) {
    return { isValid: false, errorMessage: 'Business name must be at least 2 characters long.' };
  }

  // Validate email
  if (!businessData.value.email || businessData.value.email.trim().length === 0) {
    return { isValid: false, errorMessage: 'Email address is required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(businessData.value.email)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address.' };
  }

  // Validate phone
  if (!businessData.value.phone || businessData.value.phone.trim().length === 0) {
    return { isValid: false, errorMessage: 'Phone number is required.' };
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(businessData.value.phone)) {
    return { isValid: false, errorMessage: 'Please enter a valid phone number.' };
  }

  if (businessData.value.phone.replace(/\D/g, '').length < 10) {
    return { isValid: false, errorMessage: 'Phone number must be at least 10 digits.' };
  }

  // Validate website if provided
  if (businessData.value.website) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(businessData.value.website)) {
      return { isValid: false, errorMessage: 'Please enter a valid website URL.' };
    }
  }

  // Validate password
  if (!password.value || password.value.length === 0) {
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

  if (confirmPassword.value !== password.value) {
    return { isValid: false, errorMessage: 'Passwords do not match.' };
  }

  // Validate categories
  if (!businessData.value.categoryIds || businessData.value.categoryIds.length === 0) {
    return { isValid: false, errorMessage: 'Please select at least one business category.' };
  }

  return { isValid: true };
};

const handleRegistration = async () => {
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

  businessData.value.password = password.value;

  try {
    isLoading.value = true;

    const res = await registerBusiness(businessData.value);
    
    if (res) {
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Business registered successfully! Redirecting to login...', 
        life: 3000 
      });
      
      // Clear sensitive data
      password.value = '';
      confirmPassword.value = '';
      businessData.value.password = '';
      
      setTimeout(() => {
        navigateTo('./sign-in');
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
          // Conflict - usually means email or business already exists
          registrationError.value = errorMessage || 'An account with this email already exists.';
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
};
</script>

<style scoped>
.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  content: none !important;
  display: none !important;
}
</style>
