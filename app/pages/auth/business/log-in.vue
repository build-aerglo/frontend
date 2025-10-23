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
              <h4 class="mb-1 tet-[180%] !text-primary">Welcome Back! 👋</h4>
              <p class="mb-6 text-[120%] text-contrast">Sign in to manage reviews and track your business growth.</p>

              <form @submit.prevent="HandleLogin" id="formAuthentication" class="mb-4">
                
                <div class="form-control-validation">
                  <InputTextCustom v-model="businessLogin.email" label="Email" type="email" placeholder="Enter Email" />
                </div>

                <div class="form-password-toggle form-control-validation">
                  <InputTextCustom v-model="businessLogin.password" label="Password:" type="password" placeholder="Enter password" />
                </div>
                <div class="mb-6 mt-8">
                  <p class="text-center text[110%]">
                    <span>Forgot Password?</span>
                    <NuxtLink to="/">
                      <span class="ms-1 hover:underline">Reset Password</span>
                    </NuxtLink>
                  </p>
                  
                </div>
                <ButtonCustom label="Log in to your account" size="lg" primary="true" input-class="p-3 text-[15px]" />
              </form>

              <p class="text-center text[110%]">
                <span>New on our platform?</span>
                <NuxtLink to="/register">
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
  background: #ff6523 !important; 
}
</style>