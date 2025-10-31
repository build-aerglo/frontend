<template>
  <div class="relative min-h-screen bg-green-100 flex items-center justify-center">

    <!-- Login Card -->
    <div class="relative w-full max-w-md px-6 py-8">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <NuxtLink to="/" class="cursor-pointer">
        <div class="flex justify-center mb-4">
          <img
            src="/assets/images/e-user-logo.png"
            alt="Welcome"
            class="h-12 w-auto object-contain"
          />
        </div>
        </NuxtLink>
         <div class="text-[#008253] text-center font-bold text-[100%] my-4">Clear reviews, Confident decisions.</div>
         <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
              />
          </div>

          <!-- Password -->
          <div class="relative">
            <InputTextCustom
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password:"
              inputClass="border border-light-300 hover:border-light-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none rounded-md p-2 w-full transition"
            />
            <i
              :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"
              class="absolute right-3 top-9 cursor-pointer text-gray-400"
              @click="togglePassword"
            ></i>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                id="remember-me"
                type="checkbox"
                v-model="rememberMe"
                class="w-4 h-4 text-gray-800 border-gray-300 rounded"
              />
              <span>Remember Me</span>
            </label>
            <NuxtLink to="/forgot-password" class="text-blue-500 hover:underline">
              Forgot Password?
            </NuxtLink>
          </div>

          <div class="mb-6">
            <NuxtLink to="/landing/end-user/home"><button class="btn btn-primary d-grid w-100" type="submit">Sign In</button></NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref } from "vue";

// Form state
const email = ref<string>("");
const password = ref<string>("");
const showPassword = ref<boolean>(false);
const rememberMe = ref<boolean>(false);

// Actions
const togglePassword = () => (showPassword.value = !showPassword.value);

// Future-ready backend submission
const onSubmit = async () => {
  try {
    // TODO: connect to your backend API for authentication
    console.log("Login attempt:", {
      email: email.value,
      password: password.value,
      remember: rememberMe.value,
    });
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>

