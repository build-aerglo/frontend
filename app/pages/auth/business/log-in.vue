<template>
      <!-- Content -->

    <div class="container-xxl">
      <div class="authentication-wrapper authentication-basic container-p-y">
        <div class="authentication-inner py-6">
          <!-- Login -->
          <div class="md:card p-4 md:shadow-lg md:rounded-xl md:bg-white md:p-0">
            <div class="md:card-body md:p-8">
              <!-- Logo -->
              <NuxtLink to="/" class="md:text-center">
                 <NavLogo />
               </NuxtLink>
              <!-- /Logo -->
              <h4 class="mb-1 text-[150%] md:text-[180%] !text-primary">Welcome Back! 👋</h4>
              <p class="mb-6 text-[105%] sm:text-[120%] text-contrast">Sign in to manage reviews and track your business growth.</p>

              <form @submit.prevent="HandleLogin" id="formAuthentication" class="mb-4">
                
                <div class="form-control-validation">
                  <InputTextCustom v-model="businessLogin.email" label="Email" type="email" icon="envelope" required />
                </div>

                <div class="form-password-toggle form-control-validation">
                  <InputTextCustom v-model="businessLogin.password" label="Password" type="password" required />
                </div>
                <div class="mb-6 mt-8">
                  <div class="d-flex justify-content-between">
                    <div class="form-check mb-0 ms-2">
                        <input class="form-check-input" type="checkbox" id="remember-me" />
                        <label class="form-check-label" for="remember-me"> Remember Me </label>
                    </div>
                    <a href="auth-forgot-password-cover.html">
                        <p class="mb-0">Forgot Password?</p>
                    </a>
                </div>
                </div>
                <ButtonCustom label="Log in to your account" size="lg" primary="true" input-class="p-3 text-[15px]" />
              </form>

              <p class="text-center md:text[110%] pt-1">
                <span>New on our platform?</span>
                <NuxtLink to="register">
                    <span class="ms-1 hover:underline">Create an account</span>
                </NuxtLink>
              </p>

              <!-- <div class="divider my-6">
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
              </div> -->
            </div>
          </div>
          <!-- /Login -->
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const businessLogin = ref({
    email: '',
    password: '',

});
const HandleLogin = () => {
  alert('Logged in successfully!')
}

</script>

<style scoped>

.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  content: none !important;
  display: none !important;
}
</style>