<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Left Image Section -->
    <div class="hidden md:flex w-2/3 relative">
      <img
        src="/assets/images/e-user-bg (3).png"
        alt="Welcome background"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Right Form Section -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/3 px-4 bg-gray-50">
      <div class="w-full max-w-sm space-y-5">
        <div class="flex justify-center mb-4">
          <img
            src="/assets/images/e-user-logo.png"
            alt="Welcome"
            class="h-12 w-auto object-contain"
          />
        </div>
        <div class="text-[#008253] text-center font-bold text-[100%] mt-2 mb-5">Clear reviews, Confident decisions.</div>
        <form id="formAuthentication" @submit.prevent="handleSubmit" class="space-y-5">
          <div>
              <!-- Input -->
              <input
                id="email"
                v-model="email"
                name="email"
                type="text"
                placeholder="Email"
                required
                class="block w-full rounded-md border border-gray-300 p-2 pr-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary outline-none transition"
              />
          </div>
          <div class="relative">
            <InputTextCustom
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              inputClass="border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none rounded-md p-2 w-full text-sm transition"
            />
            <i
              :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"
              class="absolute right-3 top-4 cursor-pointer text-gray-500"
              @click="togglePassword"
            ></i>
          </div>

          <div class="flex justify-between items-center text-xs text-gray-600">
            <label class="flex items-center space-x-1">
              <input type="checkbox" id="remember-me" v-model="rememberMe" class="accent-blue-500" />
              <span>Remember Me</span>
            </label>
            <NuxtLink to="/" class="text-blue-500 hover:text-gray-600 font-medium">
              Forgot Password?
            </NuxtLink>
          </div>
          <div class="mb-6">
              <NuxtLink to="/landing/end-user/home"><button class="btn btn-primary d-grid w-100" type="submit">Sign In</button></NuxtLink>
          </div>
        </form>

        <p class="text-center text-sm text-gray-800">
          <span>Don't have an account? </span>
          <NuxtLink to="/auth/end-user/sign-up" class="text-blue-500 hover:underline font-medium">
            Sign up
          </NuxtLink>
        </p>

        <div class="flex items-center">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="px-2 text-gray-400 text-xs">or sign in with</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <div class="flex justify-center space-x-4">
          <NuxtLink to="/landing/end-user/home" aria-label="Login with Facebook">
            <i class="pi pi-facebook text-black text-xl"></i>
          </NuxtLink>
          <NuxtLink to="/landing/end-user/home" aria-label="Login with Twitter">
            <i class="pi pi-twitter text-black text-xl"></i>
          </NuxtLink>
          <NuxtLink to="/landing/end-user/home" aria-label="Login with GitHub">
            <i class="pi pi-github text-gray-800 text-xl"></i>
          </NuxtLink>
          <NuxtLink to="/landing/end-user/home" aria-label="Login with Google">
            <i class="pi pi-google text-black text-xl"></i>
          </NuxtLink>
        </div>
        <p class="text-center mt-4 text-sm text-gray-800">
          <NuxtLink to="/review/not-signed-in" class="text-blue-500 font-medium">
            Review as a Guest
          </NuxtLink>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref<string>("");
const password = ref<string>("");
const rememberMe = ref<boolean>(false);
const showPassword = ref<boolean>(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleSubmit() {
  try {
    console.log("Attempting login:", email.value, password.value, rememberMe.value);
    // Future: call backend API for authentication
    router.push("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
  }
}
</script>
