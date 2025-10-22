<template>
      <!-- Content -->

    <div class="container-xxl">
      <div class="authentication-wrapper authentication-basic container-p-y">
        <div class="authentication-inner py-6">
          <!-- Login -->
          <div class="card">
            <div class="card-body">
              <!-- Logo -->
              <NuxtLink to="/" class="text-center">
                 <NavLogo />
               </NuxtLink>
              <!-- /Logo -->
              <h4 class="mb-1 tet-[180%] !text-primary">Welcome to Vuexy! 👋</h4>
              <p class="mb-6 text-[120%] text-contrast">Please sign-in to your account and start the adventure</p>

              <form id="formAuthentication" class="mb-4" action="index.html" method="GET">
                
                <div class="form-control-validation">
                  <InputTextCustom v-model="businessRegistrationForm.email" label="Email" type="email" placeholder="Enter Email" />
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
                <ButtonCustom label="Log in to your account" size="lg" primary="true" input-class="p-3 text-[15px]" />
              </form>

              <p class="text-center text[110%]">
                <span>New on our platform?</span>
                <a href="auth-register-basic.html">
                  <span class="ms-1 hover:underline">Create an account</span>
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
          <!-- /Login -->
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

.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  background: #ff6523 !important; 
}
</style>