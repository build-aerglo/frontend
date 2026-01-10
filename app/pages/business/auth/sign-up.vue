<template>
   <NavBar />
  <div class="container-xxl relative bg-[url('/images/auth/b-user-bg.png')] bg-cover bg-center">
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="authentication-wrapper authentication-basic container-py">
      <div class="authentication-inner py-6">

        <div class="card">
          <div class="card-body">

            <div class="app-brand justify-content-center mb-9">
              <NuxtLink to="/">
                <NavLogo />
              </NuxtLink>
            </div>

            <p class="mb-6 text-[105%] sm:text-[110%] text-contrast text-center">
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
    categories.value = res;
  } catch (error) {
    console.error("Failed to load categories:", error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Unable to fetch categories',
      life: 3000
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

const handleRegistration = async () => {
  if (!allValid.value) return;

  if (confirmPassword.value !== password.value) {
    return toast.add({
      severity: 'error',
      summary: 'ERROR',
      detail: 'Passwords do not match',
      life: 3000
    });
  }

  if (businessData.value.categoryIds.length === 0) {
    return toast.add({
      severity: 'error',
      summary: 'ERROR',
      detail: 'Please select at least one category.',
      life: 3000
    });
  }

  businessData.value.password = password.value;

  try {
    isLoading.value = true;
    registrationError.value = null;

    const res = await registerBusiness(businessData.value);
    if (res) {
      toast.add({ severity: 'success', summary: 'SUCCESS', detail: 'Registered successfully!', life: 3000 });
      navigateTo('./sign-in');
    } else {
      toast.add({
        severity: 'error',
        summary: 'ERROR',
        detail: 'Registration failed. Please try again.',
        life: 3000
      });
    }
  } catch (error) {
    console.log(error);
    toast.add({
      severity: 'error',
      summary: 'ERROR',
      detail: 'Registration failed.',
      life: 3000
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
