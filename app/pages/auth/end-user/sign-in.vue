<template>
  <div class="flex h-screen bg-white overflow-hidden">
    <!-- Left Image Section -->
    <div class="hidden xl:flex w-2/3 relative">
      <NuxtLink to="/" class="absolute top-6 left-6 z-10">
        <NavLogo />
      </NuxtLink>
      <img
        src="/assets/images/welcom2.jpg"
        alt="Welcome background"
        class="w-full h-full object-contain"
      />
    </div>

    <!-- Right Form Section -->
    <div class="flex flex-col justify-center items-center w-full xl:w-1/3 px-8 bg-gray-50">
      <div class="w-full max-w-sm space-y-5">
        <h2 class="text-3xl font-bold text-center text-accent">
          Welcome
        </h2>

        <form id="formAuthentication" @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email or Username</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="text"
              placeholder="Enter your email or username"
              required
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary outline-none transition"
            />
          </div>

          <div class="relative">
            <InputTextCustom
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              placeholder="Enter Password"
              inputClass="border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none rounded-md p-2 w-full text-sm transition"
            />
            <i
              :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
              class="absolute right-3 top-9 cursor-pointer text-gray-500"
              @click="togglePassword"
            ></i>
          </div>

          <div class="flex justify-between items-center text-xs text-gray-600">
            <label class="flex items-center space-x-1">
              <input type="checkbox" id="remember-me" v-model="rememberMe" class="accent-primary" />
              <span>Remember Me</span>
            </label>
            <NuxtLink to="/" class="hover:text-primary font-medium">
              Forgot Password?
            </NuxtLink>
          </div>

          <button type="submit" class="w-full py-2 bg-primary hover:bg-primary text-white rounded-md text-sm font-medium transition">
            Sign In
          </button>
        </form>

        <p class="text-center text-sm text-gray-700">
          <span>New to Echohub? </span>
          <NuxtLink to="/auth/end-user/sign-up" class="text-primary hover:underline font-medium">
            Create an account
          </NuxtLink>
        </p>

        <div class="flex items-center">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="px-2 text-gray-400 text-xs">or</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <div class="flex justify-center space-x-4">
          <NuxtLink to="/" aria-label="Login with Facebook">
            <i class="pi pi-facebook text-blue-600 text-lg"></i>
          </NuxtLink>
          <NuxtLink to="/" aria-label="Login with Twitter">
            <i class="pi pi-twitter text-sky-500 text-lg"></i>
          </NuxtLink>
          <NuxtLink to="/" aria-label="Login with GitHub">
            <i class="pi pi-github text-gray-800 text-lg"></i>
          </NuxtLink>
          <NuxtLink to="/" aria-label="Login with Google">
            <i class="pi pi-google text-red-500 text-lg"></i>
          </NuxtLink>
        </div>
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
