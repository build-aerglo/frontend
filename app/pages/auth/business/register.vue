<template>
  <div class="authentication-wrapper authentication-cover bg-secondaryLinen">
    <!-- Logo -->
    <NuxtLink to="/" class="app-brand auth-cover-brand">
      <NavLogo />
    </NuxtLink>
    <!-- /Logo -->
    <div class="authentication-inner row m-0">
      <!-- /Left Text -->
      <div class="d-none d-xl-flex col-xl-8 p-0">
        <div class="auth-cover-bg d-flex justify-content-center align-items-center">
          <img
            src="../../../../public/images/img/illustrations/auth-register-illustration-light.png"
            alt="auth-register-cover"
            class="my-5 auth-illustration"
            data-app-light-img="illustrations/auth-register-illustration-light.png"
            data-app-dark-img="illustrations/auth-register-illustration-dark.png" />
          <img
            src="../../assets/img/illustrations/bg-shape-image-light.png"
            alt="auth-register-cover"
            class="platform-bg"
            data-app-light-img="illustrations/bg-shape-image-light.png"
            data-app-dark-img="illustrations/bg-shape-image-dark.png" />
        </div>
      </div>
      <!-- /Left Text -->

      <!-- Register -->
      <div class="d-flex col-12 col-xl-4 align-items-center authentication-bg p-sm-12 p-6">
        <div class="w-px-400 mx-auto mt-12 pt-5">
          <h4 class="mb-1 text-[180%]">Register Your Business 🚀</h4>
          <p class="mb-6 text-[120%]">Make your app management easy and fun!</p>

          <form id="formAuthentication" class="mb-6" action="index.html" method="GET">
            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.userName" label="Username" type="text" placeholder="Enter UserName" />
            </div>

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.businessName" label="Business name" type="text" placeholder="Enter Business Name" />
            </div>
            
            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.email" label="Email" type="email" placeholder="Enter Email" />
            </div>

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.phoneNum" label="Phone number" type="tel" placeholder="Enter phone number" />
            </div>

            <div class="form-password-toggle form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.password" label="Password:" type="password" placeholder="Enter password" />
            </div>
            <div class="mb-6 mt-8">
              <div class="form-check mb-8 ms-2 form-control-validation">
                <input class="form-check-input" type="checkbox" id="terms-conditions" name="terms" />
                <label class="form-check-label" for="terms-conditions">
                  I agree to
                  <a href="javascript:void(0);">privacy policy & terms</a>
                </label>
              </div>
            </div>
            <ButtonCustom label="Register your business" size="lg" primary="true" />
          </form>

          <p class="text-center">
            <span>Already have an account?</span>
            <a href="auth-login-cover.html">
              <span class="ms-1">Sign in instead</span>
            </a>
          </p>

        </div>
      </div>
      <!-- /Register -->
    </div>
  </div>
</template>

<script setup lang="ts">
const businessRegistrationForm = ref({
    userName: '',
    businessName: '',
    email: '',
    phoneNum: '',
    password: '',
    confirmPassword: ''
});


</script>

<style scoped>

</style>