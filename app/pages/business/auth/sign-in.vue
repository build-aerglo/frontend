<template>
    <div class="container-xxl relative bg-[url('/images/auth/b-user-bg.png')] bg-cover bg-center">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="authentication-wrapper authentication-basic container-p-y">
        <div class="authentication-inner py-6">
          <!-- Login -->
          <div class="card">
            <div class="card-body">
              <!-- Logo -->
              <div class="app-brand justify-content-center mb-9">
                <NuxtLink to="/" class="md:text-center">
                    <NavLogo />
                </NuxtLink>
              </div>
              <p class="mb-6 text-[105%] sm:text-[110%] text-center text-contrast">Sign in to manage reviews and track your business growth.</p>

              <form @submit.prevent="HandleLogin" id="formAuthentication" class="mb-4">
                
                <div class="form-control-validation">
                  <InputTextCustom v-model="loginData.email" label="Email" type="email" required />
                </div>

                <div class="form-password-toggle form-control-validation">
                  <InputTextCustom v-model="loginData.password" label="Password" type="password" required />
                </div>
                <div class="mb-6 mt-8">
                  <div class="d-flex justify-content-between">
                    <div class="form-check mb-0 ms-2">
                        <input class="form-check-input" type="checkbox" id="remember-me" />
                        <label class="form-check-label" for="remember-me"> Remember Me </label>
                    </div>
                    <NuxtLink to="/">
                        <p class="mb-0 text-link">Forgot Password?</p>
                    </NuxtLink>
                </div>
                </div>
                <ButtonCustom label="Sign in" size="lg" primary="true" input-class="p-3 text-[15px]" type="submit" />
              </form>

              <p class="text-center md:text[100%] pt-1">
                <span>New on our platform?</span>
                <NuxtLink to="sign-up">
                    <span class="ms-1 hover:underline text-link">Create an account</span>
                </NuxtLink>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import  useMethods  from '~/composables/useMethods';
import type { LoginData } from "~/types";
const { loginUser } = useMethods();

const loginData = ref<LoginData>({
  email: '',
  password: '',

});
const HandleLogin = async () => {
  console.log(useRuntimeConfig().public.apiUrl)
  const res = await loginUser(loginData.value);
  if (!res.error) {
    console.log("Login successful:", res);
    // navigateTo('./profile')
  } else {
    alert(res.error);
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