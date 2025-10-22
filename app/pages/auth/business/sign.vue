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
            <p class="mb-6 text-[130%] text-contrast">Make your app management easy and fun!</p>

            <form id="formAuthentication" class="mb-6" action="index.html" method="GET">
              <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.userName" label="Username" type="text" placeholder="Enter UserName" />
            </div>

            <div class="form-control-validation">
              <InputTextCustom v-model="businessRegistrationForm.businessName" label="Business name" type="text" placeholder="Enter Business Name" />
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.email" label="Email" type="email" placeholder="Enter Email" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.phoneNum" label="Phone number" type="tel" placeholder="Enter phone number" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-password-toggle form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.password" label="Password" type="password" placeholder="Enter password" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-password-toggle form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.confirmPassword" label="confirm Password" type="password" placeholder="confirm password" />
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

            <div class="d-flex justify-content-center">
              <a href="javascript:;" class="btn btn-icon rounded-circle btn-text-facebook me-1_5">
                <i class="icon-base ti tabler-brand-facebook-filled icon-20px"></i>
              </a>

              <a href="javascript:;" class="btn btn-icon rounded-circle btn-text-twitter me-1_5">
                <i class="icon-base ti tabler-brand-twitter-filled icon-20px"></i>
              </a>

              <a href="javascript:;" class="btn btn-icon rounded-circle btn-text-github me-1_5">
                <i class="icon-base ti tabler-brand-github-filled icon-20px"></i>
              </a>

              <a href="javascript:;" class="btn btn-icon rounded-circle btn-text-google-plus">
                <i class="icon-base ti tabler-brand-google-filled icon-20px"></i>
              </a>
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
.authentication-wrapper {
  /* Set a new max-width (e.g., 650px) to comfortably fit two columns */
  --bs-auth-basic-inner-max-width: 650px;

}
.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  background: #ff6523 !important; 
}
</style>