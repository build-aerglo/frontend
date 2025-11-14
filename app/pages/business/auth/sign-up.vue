<template>
  <div class="container-xxl relative bg-[url('/images/auth/b-user-bg.png')] bg-cover bg-center">
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="authentication-wrapper authentication-basic container-py">
      <div class="authentication-inner py-6">
        <!-- Register Card -->
        <div class="card"> 
           <!-- p-4 md:shadow-lg md:rounded-xl md:bg-white md:p-0 -->
          <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center mb-9">
              <NuxtLink to="/">
                  <NavLogo />
              </NuxtLink>
            </div>
            <!-- /Logo -->
            <p class="mb-6 text-[105%] sm:text-[110%] text-contrast text-center">Build customer trust through real feedback!</p>

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
            
            <div class="form-password-toggle form-control-validation">
              <InputTextCustom v-model="businessData.password" label="Password" type="password" required />
            </div>

            <div class="form-password-toggle form-control-validation">
              <InputTextCustom v-model="confirmPassword" label="Confirm Password" type="password" required />
            </div>
            <div v-if="registrationError" class="text-red-500">{{ registrationError }}</div>
            <ButtonCustom :label="isLoading ? 'Registering...' : 'Register your business'" :disabled="isLoading" size="lg" primary="true" input-class="p-[10px] text-[15px] mt-8" type="submit" />
            </form>

            <p class="text-center md:text-[100%]">
              <span class="text-contrast">Already have an account?</span>
              <NuxtLink to="sign-in">
                <span class="ms-1 hover:underline text-link">Sign in instead</span>
              </NuxtLink>
            </p>

            <p class="text-[80%] text-center">
              <span class="text-contrast">By submitting this form you accept our</span>
              <NuxtLink to="/">
                <span class="ms-1 hover:underline text-link">privacy policy</span>
              </NuxtLink>
            </p>

          </div>
        </div>
        <!-- Register Card -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMethods from '~/composables/useMethods';
import type { BusinessUser } from "~/types";

const { registerBusiness } = useMethods();
const router = useRouter();

const businessData = ref<BusinessUser>({
    id: '',
    name: '',
    email: '',
    phone: '',
    userType: 'business_user',
    password: '',
    address: null,
    branchName: null,
    branchAddress: null,
    website: null,
    categoryIds: [
      null
    ]
});
const confirmPassword = ref('')
const isLoading = ref(false);
const registrationError = ref<string | null>(null);

const handleRegistration = async () => {
  isLoading.value = true;
  registrationError.value = null;

  const res = await registerBusiness(businessData.value);
  if (res) {
    alert('Business registered successfully')
    console.log(res);
    router.push('/sign-in'); 
  } else {
    registrationError.value = 'Registration failed. Check the form data and try again.';
  }
  
  isLoading.value = false;
}
</script>

<style scoped>
.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  content: none !important;
  display: none !important;
}
</style>