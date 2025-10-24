<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-py">
      <div class="authentication-inner py-6">
        <!-- Register Card -->
        <div class="md:card p-4 md:shadow-lg md:rounded-xl md:bg-white md:p-0">
          <div class="md:card-body md:p-8">
            <!-- Logo -->
             <!-- <div class="app-brand justify-content-center mb-0"> -->
               <NuxtLink to="/" class="md:text-center">
                 <NavLogo />
               </NuxtLink>
             <!-- </div> -->
            <!-- /Logo -->
            <h4 class="mb-1 text-[150%] md:text-[180%] !text-primary">Register Your Business 🚀</h4>
            <p class="mb-6 text-[105%] sm:text-[130%] text-contrast">Build customer trust through real feedback!</p>

            <form @submit.prevent="handleRegistration" id="formAuthentication" class="mb-6">
              <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.userName" label="Username" type="text" icon="user" required />
            </div>

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.businessName" label="Business Name" type="text" icon="tag" required />
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.email" label="Email" type="email" icon="envelope" required />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.phoneNum" label="Phone Number" type="tel" icon="phone" required />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-password-toggle form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.password" label="Password" type="password" required />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-password-toggle form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.confirmPassword" label="Confirm Password" type="password" required />
                </div>
              </div>
            </div>
            <div class="mb-6 mt-4">
              <div class="form-check mb-8 ms-2 form-control-validation">
                <input class="form-check-input" type="checkbox" id="terms-conditions" name="terms" v-model="agreedToTerms" />
                <label class="form-check-label md:text-[110%] text-contrast" for="terms-conditions">
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

            <p class="text-center md:text-[110%]">
              <span class="text-contrast">Already have an account?</span>
              <NuxtLink to="log-in">
                <span class="ms-1 hover:underline">Sign in instead</span>
              </NuxtLink>
            </p>

            <div class="divider my-6">
              <div class="divider-text">or</div>
            </div>

            <div class="flex justify-center space-x-4">
              <!-- Google -->
              <NuxtLink
                to="https://www.google.com"
                target="_blank"
                class=" text-[#DB4437] flex items-center justify-center w-[48px] h-[48px]
                      transition-all duration-300 hover:bg-[#DB4437]/10 hover:rounded-full"
              >
                <i class="pi pi-google icon-20px"></i>
              </NuxtLink>

              <!-- Facebook -->
              <NuxtLink
                to="https://www.facebook.com"
                target="_blank"
                class=" text-[#1877F2] text-[200%] flex items-center justify-center w-[48px] h-[48px]
                      transition-all duration-300 hover:bg-[#1877F2]/10 hover:rounded-full"
              >
                <i class="pi pi-facebook icon-20px"></i>
              </NuxtLink>

              <!-- Instagram -->
              <NuxtLink
                to="https://www.instagram.com"
                target="_blank"
                class=" text-[#E4405F] flex items-center justify-center w-[48px] h-[48px]
                      transition-all duration-300 hover:bg-[#E4405F]/10 hover:rounded-full"
              >
                <i class="pi pi-instagram icon-20px"></i>
              </NuxtLink>

              <!-- Twitter -->
              <NuxtLink
                to="https://www.twitter.com"
                target="_blank"
                class="no-underline text-[#1DA1F2] flex items-center justify-center w-[48px] h-[48px]
                      transition-all duration-300 hover:bg-[#1DA1F2]/10 hover:rounded-full"
              >
                <i class="pi pi-twitter icon-20px"></i>
              </NuxtLink>
            </div>

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
@media (min-width: 768px) {
  .authentication-wrapper {
    --bs-auth-basic-inner-max-width: 650px;
  }
}
.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  content: none !important;
  display: none !important;
}
</style>