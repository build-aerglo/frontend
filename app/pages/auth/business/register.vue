<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-py">
      <div class="authentication-inner py-6">
        <!-- Register Card -->
        <div class="card">
          <div class="card-body">
            <!-- Logo -->
             <!-- <div class="app-brand justify-content-center mb-0"> -->
               <NuxtLink to="/" class="text-center">
                 <NavLogo />
               </NuxtLink>
             <!-- </div> -->
            <!-- /Logo -->
            <h4 class="mb-1 text-[180%] !text-primary">Register Your Business 🚀</h4>
            <p class="mb-6 text-[130%] text-contrast">Build customer trust through real feedback!</p>

            <form id="formAuthentication" class="mb-6" action="index.html" method="GET">
              <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.userName" label="Username" type="text" icon="user" />
            </div>

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.businessName" label="Business Name" type="text" icon="tag" />
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.email" label="Email" type="email" icon="envelope" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.phoneNum" label="Phone Number" type="tel" icon="phone" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-password-toggle form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.password" label="Password" type="password" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-password-toggle form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.confirmPassword" label="Confirm Password" type="Password" />
                </div>
              </div>
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
            <ButtonCustom label="Register your business" size="lg" primary="true" input-class="p-[10px] text-[15px]" />
            </form>

            <p class="text-center text-[110%]">
              <span>Already have an account?</span>
              <a href="auth-login-basic.html">
                <span class="ms-1 hover:underline">Sign in instead</span>
              </a>
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
                <i class="pi pi-google text-[1.3rem]"></i>
              </NuxtLink>

              <!-- Facebook -->
              <NuxtLink
                to="https://www.facebook.com"
                target="_blank"
                class=" text-[#1877F2] text-[200%] flex items-center justify-center w-[48px] h-[48px]
                      transition-all duration-300 hover:bg-[#1877F2]/10 hover:rounded-full"
              >
                <i class="pi pi-facebook text-[1.3rem]"></i>
              </NuxtLink>

              <!-- Instagram -->
              <NuxtLink
                to="https://www.instagram.com"
                target="_blank"
                class=" text-[#E4405F] flex items-center justify-center w-[48px] h-[48px]
                      transition-all duration-300 hover:bg-[#E4405F]/10 hover:rounded-full"
              >
                <i class="pi pi-instagram text-[1.3rem]"></i>
              </NuxtLink>

              <!-- Twitter -->
              <NuxtLink
                to="https://www.twitter.com"
                target="_blank"
                class="no-underline text-[#1DA1F2] flex items-center justify-center w-[48px] h-[48px]
                      transition-all duration-300 hover:bg-[#1DA1F2]/10 hover:rounded-full"
              >
                <i class="pi pi-twitter text-[1.3rem]"></i>
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
    userName: '',
    businessName: '',
    email: '',
    phoneNum: '',
    password: '',
    confirmPassword: ''
});

</script>

<style scoped>
@media (min-width: 768px) {
  .authentication-wrapper {
    /* Apply the custom wide width variable only when the screen is 768px or larger */
    --bs-auth-basic-inner-max-width: 650px;
  }
}
.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  background: #ff6523 !important; 
}
</style>