<template>
  <div
    class="min-h-screen bg-green-100 bg-cover bg-center flex items-center justify-center"
  >
     <!-- Logo -->
    <NuxtLink 
      to="/" 
      class="absolute top-4 left-4 animate-fade-in"
    >
      <img 
        src="/assets/images/e-user-logo.png" 
        alt="Logo" 
        class="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain drop-shadow-md"
      />
    </NuxtLink>

    <div class="relative w-full max-w-md px-6 py-8 bg-white/90 backdrop-blur rounded-2xl shadow-lg">

      <!-- Register Card -->
      <h4 class="text-center text-primary text-[150%] font-bold mb-3">
        <div class="text-yellow-600">Create An Account</div>
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
          <div class="relative mt-1">
            <i class="pi pi-user absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
          />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <div class="relative mt-1">
            <i class="pi pi-envelope absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
          />
          </div>
        </div>

        <!-- Phone -->
        <div>
          <label
            for="phone"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <div class="relative mt-1">
            <i class="pi pi-phone absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            pattern="[0-9]{11}"
            class="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
          />
          </div>
        </div>

        <!-- Passwords -->
        <div class="flex gap-3">
          <div class="relative w-1/2">
            <InputTextCustom
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              inputClass="border border-light-300 hover:border-light-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none rounded-md p-2 w-full transition"
            />
            <i
              :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
              class="absolute right-3 top-4 cursor-pointer text-gray-400"
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
              class="absolute right-3 top-4 cursor-pointer text-gray-400"
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
            <NuxtLink to="/" class="text-gray-600 hover:underline">
              privacy policy & terms
            </NuxtLink>
          </label>
        </div>
        <div class="mb-6">
            <button class="btn btn-primary d-grid w-100" type="submit">Sign Up</button>
        </div>
      </form>

      <!-- Already have account -->
      <p class="text-center text-sm mt-5">
        Already have an account?
        <NuxtLink
          to="/auth/support-user/sign-in"
          class="text-green-800 hover:underline"
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
