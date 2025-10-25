<template>
  <div
    class="min-h-screen bg-[url('assets/images/e-user-bg.png')] bg-cover bg-center flex items-center justify-center"
  >
  <!-- Logo -->
    <NuxtLink to="/" class="text-primary text-[130%] absolute top-[20px] sm:right-[100px] left-[20px]"><NavLogo /></NuxtLink>
    <!-- /Logo -->
    <div class="relative w-full max-w-md px-6 py-8 bg-white/90 backdrop-blur rounded-2xl shadow-lg">

      <!-- Register Card -->
      <h4 class="text-center text-primary text-[150%] font-bold mb-3">
        <div class="text-primary">Create Your Account</div>
      </h4>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <!-- Username -->
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="Enter your username"
            class="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
          />
        </div>

        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            class="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
          />
        </div>

        <!-- Phone -->
        <div>
          <label
            for="phone"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            pattern="[0-9]{11}"
            placeholder="Enter your phone number"
            class="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
          />
        </div>

        <!-- Passwords -->
        <div class="flex gap-3">
          <div class="relative w-1/2">
            <InputTextCustom
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              inputClass="border border-light-300 hover:border-light-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none rounded-md p-2 w-full transition"
            />
            <i
              :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
              class="absolute right-3 top-4 cursor-pointer text-gray-600"
              @click="togglePassword"
            ></i>
          </div>

          <div class="relative w-1/2">
            <InputTextCustom
              v-model="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Confirm password"
              inputClass="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
            />
            <i
              :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"
              class="absolute right-3 top-4 cursor-pointer text-gray-600"
              @click="toggleConfirm"
            ></i>
          </div>
        </div>

        <!-- Terms -->
        <div class="flex items-center gap-2 text-sm">
          <input
            id="terms"
            type="checkbox"
            v-model="termsAccepted"
            class="w-4 h-4 text-primary border-gray-300 rounded"
          />
          <label for="terms">
            I agree to
            <NuxtLink to="/" class="text-accent hover:underline">
              privacy policy & terms
            </NuxtLink>
          </label>
        </div>
        <div class="mb-6">
            <button class="btn btn-primary d-grid w-100" type="submit">Sign In</button>
        </div>
      </form>

      <!-- Already have account -->
      <p class="text-center text-sm mt-5">
        Already have an account?
        <NuxtLink
          to="/auth/support-user/sign-in"
          class="text-primary hover:underline"
        >
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const username = ref<string>("");
const email = ref<string>("");
const phone = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");

const showPassword = ref<boolean>(false);
const showConfirm = ref<boolean>(false);
const termsAccepted = ref<boolean>(false);

const togglePassword = () => (showPassword.value = !showPassword.value);
const toggleConfirm = () => (showConfirm.value = !showConfirm.value);

const onSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  if (!termsAccepted.value) {
    alert("You must accept the privacy policy & terms.");
    return;
  }

  try {
    // TODO: connect to backend API for user registration
    console.log("Registration attempt:", {
      username: username.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    });
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
</script>
