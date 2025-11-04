<template>
  <div class="container-xxl relative bg-[url('/images/b-user-bg.png')] bg-cover bg-center">
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
              <InputTextCustom v-model="businessRegistration.name" label="Business Name" type="text" required />
            </div>

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistration.email" label="Email" type="email" required />
            </div>

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistration.phone" label="Phone Number" type="tel" required />
            </div>
            
            <div class="form-password-toggle form-control-validation">
              <InputTextCustom v-model="businessRegistration.password" label="Password" type="password" required />
            </div>

            <div class="form-password-toggle form-control-validation">
              <InputTextCustom v-model="businessRegistration.confirmPassword" label="Confirm Password" type="password" required />
            </div>
            
            <ButtonCustom label="Register your business" size="lg" primary="true" input-class="p-[10px] text-[15px] mt-8" />
            </form>

            <p class="text-center md:text-[100%]">
              <span class="text-contrast">Already have an account?</span>
              <NuxtLink to="log-in">
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
import  useMethods  from '~/composables/useMethods';
import type { BusinessData } from "~/types";

const { registerBusiness } = useMethods();

definePageMeta({
  layout: false 
});
const businessRegistration = ref<BusinessData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    confirmPassword: '',
});

const handleRegistration = async () => {
  try {
    const res = await registerBusiness (businessRegistration.value)
    console.log('Business registered successfully:', res)
  } catch (error) {
    console.error('Error registering business:', error)
  }
}

</script>

<style scoped>
.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  content: none !important;
  display: none !important;
}
</style>