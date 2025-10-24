<template>
  <div class="min-h-screen bg-indigo-200 flex items-center justify-center">
    <!-- Logo -->
    <NuxtLink to="/" class="text-primary text-[130%] absolute top-[20px] sm:right-[100px] left-[20px]"><NavLogo /></NuxtLink>
    <!-- /Logo -->
    <div class="relative w-full max-w-md px-6 py-8">

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h4 class="text-center text-primary text-xl font-bold mb-6">
          Welcome Back!
        </h4>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email address"
              class="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
            />
          </div>

          <!-- Password -->
          <div class="relative">
            <InputTextCustom
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password:"
              placeholder="Password"
              inputClass="border border-light-300 hover:border-light-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none rounded-md p-2 w-full transition"
            />
            <i
              :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
              class="absolute right-3 top-9 cursor-pointer text-gray-600"
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
                class="w-4 h-4 text-primary border-gray-300 rounded"
              />
              <span>Remember Me</span>
            </label>
            <NuxtLink to="/forgot-password" class="text-accent hover:underline">
              Forgot Password?
            </NuxtLink>
          </div>

          <div class="mb-6">
                <button class="btn btn-primary d-grid w-100" type="submit">Sign In</button>
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
