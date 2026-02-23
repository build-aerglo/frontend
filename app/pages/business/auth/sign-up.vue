<template>
  <Toast />
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

            <!-- CLAIM BUSINESS SECTION -->
            <div v-if="showClaimOption && unclaimedBusiness" class="text-center py-8">
              <div class="mb-4">
                <i class="pi pi-info-circle text-blue-500 text-5xl mb-4"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-800">Business Profile Available to Claim</h3>
              <p class="text-gray-600 mb-2">
                A business profile for <strong>"{{ unclaimedBusiness.name }}"</strong> already exists on Clereview.
              </p>
              <p class="text-gray-600 mb-6">
                Claim this profile to respond to reviews, update your details, and manage your business reputation on Clereview.
              </p>
              
              <div class="flex flex-col gap-3 max-w-md mx-auto">
                <ButtonCustom
                  label="Claim My Business"
                  primary="true"
                  size="lg"
                  input-class="p-3 text-[15px]"
                  @clicked="handleClaimRedirect"
                />
                <ButtonCustom
                  label="Register Different Business"
                  size="lg"
                  input-class="p-3 text-[15px]"
                  @clicked="resetSearch"
                />
              </div>
            </div>

            <!-- BUSINESS CLAIMED SECTION -->
            <div v-else-if="showClaimedWarning && claimedBusiness" class="text-center py-8">
              <div class="mb-4">
                <i class="pi pi-check-circle text-green-500 text-5xl mb-4"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-800">Business Already Claimed</h3>
              <p class="text-gray-600 mb-2">
                This business already exists and has been claimed.
              </p>
              <p class="text-gray-600 mb-4">
                Confirm the business name is correct and contact us at 
                <a href="mailto:support@clereview.com" class="text-primary underline font-semibold">
                  support@clereview.com
                </a> 
                if you think there's been an issue.
              </p>
              
              <div class="flex flex-col gap-3 max-w-md mx-auto">
                <ButtonCustom
                  label="Try Different Name"
                  primary="true"
                  size="lg"
                  input-class="p-3 text-[15px]"
                  @clicked="resetSearch"
                />
                <a href="mailto:support@clereview.com" class="text-sm text-primary underline">
                  Contact Support
                </a>
              </div>
            </div>

            <!-- REGISTRATION FORM -->
            <form v-else @submit.prevent="handleRegistration" class="mb-6">

              <div class="form-control-validation relative">
                <InputTextCustom 
                  v-model="businessData.name" 
                  label="Business Name" 
                  type="text" 
                  required 
                  @focus="handleInputFocus"
                  @input="handleBusinessNameInput"
                  @keydown.escape="closeDropdown"
                  autocomplete="off"
                />
                
                <!-- ✅ Search Loading Indicator (right side of input) -->
                <div v-if="isSearching" class="absolute right-3 top-10">
                  <i class="pi pi-spin pi-spinner text-primary"></i>
                </div>

                <!-- ✅ Available Checkmark (right side of input) -->
                <div 
                  v-else-if="businessNameAvailable && searchCompleted && !isSearching && businessData.name.trim().length >= 2" 
                  class="absolute right-3 top-10"
                >
                  <i class="pi pi-check-circle text-green-500 text-lg"></i>
                </div>

                <!-- Business Suggestions Dropdown -->
                <div 
                  v-if="showDropdown && searchResults.length > 0 && !isSearching" 
                  class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  @click.stop
                >
                  <div
                    v-for="business in searchResults"
                    :key="business.businessId"
                    @click="handleBusinessSelect(business)"
                    class="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div class="flex items-start gap-3">
                      <!-- Business Logo/Icon -->
                      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img 
                          v-if="business.logo" 
                          :src="business.logo" 
                          :alt="business.name"
                          class="w-full h-full object-cover"
                        />
                        <i v-else class="pi pi-building text-gray-400"></i>
                      </div>
                      
                      <!-- Business Info -->
                      <div class="flex-1 min-w-0">
                        <div class="font-semibold text-gray-800 truncate">{{ business.name }}</div>
                        <div class="text-xs text-gray-500 truncate" v-if="business.categories && business.categories.length > 0">
                          {{ business.categories.map((c: { name: string }) => c.name).join(', ') }}
                        </div>
                        <div class="text-xs text-gray-400 truncate" v-if="business.businessAddress">
                          <i class="pi pi-map-marker text-[10px]"></i> {{ business.businessAddress }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-control-validation">
                <InputTextCustom v-model="businessData.email" label="Email" type="email" required />
              </div>

              <div class="form-control-validation">
                <InputTextCustom v-model="businessData.phone" label="Phone Number" type="tel" required />
              </div>

              <div class="form-control-validation">
                <span class="text-contrast text-[95%] mb-1">Business Sector</span>
                <Select 
                  v-model="businessData.categoryIds" 
                  :options="categories"  
                  :selectionLimit="1" 
                  optionLabel="name" 
                  optionValue="id" 
                  filter 
                  required
                  :maxSelectedLabels="3" 
                  class="w-full mt-1 mb-3 border border-gray-300 outline-none rounded-[5px] 
                  focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300 
                  bg-secondaryLinen" 
                />               
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

              <div v-if="registrationError" class="text-red-500 text-sm mt-2">{{ registrationError }}</div>

              <ButtonCustom
                :label="isLoading ? 'Registering...' : 'Register your business'"
                :disabled="isLoading"
                size="lg"
                primary="true"
                input-class="p-[10px] text-[15px] mt-8"
                type="submit"
              />
            </form>

            <p v-if="!showClaimOption && !showClaimedWarning" class="text-center md:text-[100%]">
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
import useSearch from '~/composables/search/useSearch';
import type { BusinessUser } from "~/types/business";

const { getCategories, getBusinessProfile } = useBusinessMethods();
const { registerBusiness } = useMethods();
const { search } = useSearch();
const toast = useToast();
const router = useRouter();

const categories = ref<{ id: string; name: string }[]>([]);

// Search-related state
const isSearching = ref(false);
const searchCompleted = ref(false);
const businessNameAvailable = ref(false);
const showClaimOption = ref(false);
const showClaimedWarning = ref(false);
const unclaimedBusiness = ref<any>(null);
const claimedBusiness = ref<any>(null);
const searchResults = ref<any[]>([]);
const showDropdown = ref(false);
let searchTimeout: NodeJS.Timeout | null = null;

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

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    closeDropdown();
  });
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

const handleInputFocus = () => {
  if (businessData.value.name.trim().length >= 2 && searchResults.value.length > 0) {
    showDropdown.value = true;
  }
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const handleBusinessNameInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchCompleted.value = false;
  businessNameAvailable.value = false;
  showClaimOption.value = false;
  showClaimedWarning.value = false;
  unclaimedBusiness.value = null;
  claimedBusiness.value = null;

  if (businessData.value.name.trim().length < 2) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }

  showDropdown.value = true;

  searchTimeout = setTimeout(() => {
    searchBusinessName(businessData.value.name.trim());
  }, 500);
};

const searchBusinessName = async (name: string) => {
  if (!name || name.length < 2) return;

  try {
    isSearching.value = true;
    const results = await search(name);

    if (results && results.length > 0) {
      searchResults.value = results;
      showDropdown.value = true;
      businessNameAvailable.value = false;
    } else {
      searchResults.value = [];
      businessNameAvailable.value = true; // ✅ Triggers green checkmark
    }

    searchCompleted.value = true;
  } catch (error: any) {
    console.error('Search error:', error);
    searchResults.value = [];
    businessNameAvailable.value = true;
    searchCompleted.value = true;
  } finally {
    isSearching.value = false;
  }
};

const handleBusinessSelect = async (selectedBusiness: any) => {
  closeDropdown();
  businessData.value.name = selectedBusiness.name;

  const businessId = selectedBusiness.businessId;

  if (!businessId) {
    console.error('Business ID not found in selected business');
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Unable to load business details',
      life: 3000
    });
    return;
  }

  isSearching.value = true;

  try {
    const profileResponse = await getBusinessProfile(businessId);
    
    if (profileResponse?.statusCode === 200 && profileResponse.data) {
      const businessProfile = profileResponse.data;
      const businessStatus = businessProfile.businessStatus;

      console.log(`Business selected: ${businessProfile.name}, Status: ${businessStatus}`);

      if (businessStatus === 'approved' || businessStatus === 'claimed') {
        claimedBusiness.value = businessProfile;
        showClaimedWarning.value = true;
        showClaimOption.value = false;
        businessNameAvailable.value = false;
      } else if (businessStatus === 'unclaimed' || businessStatus === 'pending') {
        unclaimedBusiness.value = businessProfile;
        showClaimOption.value = true;
        showClaimedWarning.value = false;
        businessNameAvailable.value = false;
      } else {
        console.warn(`Unexpected business status: ${businessStatus}`);
        toast.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Unable to determine business status',
          life: 3000
        });
      }
    } else {
      console.error('Failed to fetch business profile:', profileResponse);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to load business details',
        life: 3000
      });
    }
  } catch (profileError) {
    console.error('Error fetching business profile:', profileError);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load business information',
      life: 3000
    });
  } finally {
    isSearching.value = false;
  }
};

const resetSearch = () => {
  showClaimOption.value = false;
  showClaimedWarning.value = false;
  unclaimedBusiness.value = null;
  claimedBusiness.value = null;
  searchCompleted.value = false;
  businessNameAvailable.value = false;
  businessData.value.name = '';
  searchResults.value = [];
  showDropdown.value = false;
};

const handleClaimRedirect = () => {
  if (unclaimedBusiness.value && unclaimedBusiness.value.id) {
    router.push(`/biz/${unclaimedBusiness.value.id}/claim-business`);
  }
};

const validateForm = (): { isValid: boolean; errorMessage?: string } => {
  if (!businessData.value.name || businessData.value.name.trim().length === 0) {
    return { isValid: false, errorMessage: 'Business name is required.' };
  }

  if (businessData.value.name.trim().length < 2) {
    return { isValid: false, errorMessage: 'Business name must be at least 2 characters long.' };
  }

  if (!businessData.value.email || businessData.value.email.trim().length === 0) {
    return { isValid: false, errorMessage: 'Email address is required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(businessData.value.email)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address.' };
  }

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

  if (businessData.value.website) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(businessData.value.website)) {
      return { isValid: false, errorMessage: 'Please enter a valid website URL.' };
    }
  }

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

  if (!confirmPassword.value || confirmPassword.value.length === 0) {
    return { isValid: false, errorMessage: 'Please confirm your password.' };
  }

  if (confirmPassword.value !== password.value) {
    return { isValid: false, errorMessage: 'Passwords do not match.' };
  }

  if (!businessData.value.categoryIds || businessData.value.categoryIds.length === 0) {
    return { isValid: false, errorMessage: 'Please select at least one business category.' };
  }

  return { isValid: true };
};

const handleRegistration = async () => {
  registrationError.value = null;

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

  const payload = {
    ...businessData.value,
    categoryIds: Array.isArray(businessData.value.categoryIds) 
      ? businessData.value.categoryIds 
      : [businessData.value.categoryIds],
    password: password.value
  };

  try {
    isLoading.value = true;

    const res = await registerBusiness(payload);
    
    if (res) {
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Business registered successfully! Redirecting to login...', 
        life: 3000 
      });
      
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
  } catch (err: any) {
  registrationError.value = err.message

  toast.add({
    severity: 'error',
    summary: 'Registration Error',
    detail: err.message,
    life: 4000
  })
}


 finally {
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