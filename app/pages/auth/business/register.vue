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

            <form @submit.prevent="handleRegistration" id="formAuthentication" class="mb-6">

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.businessName" label="Business Name" type="text" icon="tag" required />
            </div>

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.email" label="Email" type="email" icon="envelope" required />
            </div>

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.phoneNum" label="Phone Number" type="tel" icon="phone" required />
            </div>
            
            <div class="form-password-toggle form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.password" label="Password" type="password" required />
            </div>

            <div class="form-password-toggle form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.confirmPassword" label="Confirm Password" type="password" required />
            </div>
            <div class="mb-6 mt-4">
              <div class="form-check mb-8 ms-2 form-control-validation">
                <input class="form-check-input" type="checkbox" id="terms-conditions" name="terms" v-model="agreedToTerms" />
                <label class="form-check-label md:text-[100%] text-contrast" for="terms-conditions">
                  I agree to
                  <NuxtLink to="/">privacy policy & terms</NuxtLink>
                </label>
              </div>
            </div>
            <ButtonCustom label="Register your business" size="lg" primary="true" input-class="p-[10px] text-[15px]" :disabled="!agreedToTerms"
                :class="[
                !agreedToTerms
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : 'opacity-100 cursor-pointer'
              ]" />
            </form>

            <p class="text-center md:text-[100%]">
              <span class="text-contrast">Already have an account?</span>
              <NuxtLink to="log-in">
                <span class="ms-1 hover:underline">Sign in instead</span>
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
const businessRegistrationForm = ref({
    id: '',
    userName: '',
    businessName: '',
    email: '',
    phoneNum: '',
    password: '',
    confirmPassword: '',
    userType: ''
});
const agreedToTerms = ref(false);
const handleRegistration = () => {
  alert('Registration Successful!')
}

</script>

<style scoped>
/* @media (min-width: 768px) {
  .authentication-wrapper {
    --bs-auth-basic-inner-max-width: 650px;
  }
} */
.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  content: none !important;
  display: none !important;
}
</style>