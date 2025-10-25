<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Left Image Section -->
    <div class="hidden xl:flex w-2/3 relative">
      <img
        src="/assets/images/e-user-bg.png"
        alt="Join the community"
        class="object-cover w-full h-full"
      />
    </div>

    <!-- Right Form Section -->
    <div
      class="flex flex-col justify-center items-center w-full xl:w-1/3 p-8 bg-white"
    >
      <div class="w-full max-w-md">
        <div class="flex justify-center mb-3 mt-0">
            <img
            src="/assets/images/e-user-logo.png"
            alt="Welcome"
            class="h-12 w-auto object-contain"
          />
        </div>
        <div class="text-green-700 text-center font-bold text-[90%]">Clear reviews, Confident decisions</div>
        <form @submit.prevent="handleSignup" class="space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div class="relative mt-1">
            <i class="pi pi-user absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required
            />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="relative mt-1">
            <i class="pi pi-envelope absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required
            />
            </div>
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div class="relative mt-1">
            <i class="pi pi-phone absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              pattern="[0-9]{11}"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required
            />
            </div>
          </div>

          <div class="flex space-x-4">
            <!-- Password -->
            <div class="w-1/2">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >
              Password
              </label>
              <div class="relative mt-1">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary"
                >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>
            <!-- Confirm Password -->
            <div class="w-1/2">
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div class="relative mt-1">
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  class="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  @click="showConfirm = !showConfirm"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary"
                >
                  <i :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>
          </div>
            
          <!-- Terms -->
          <div class="flex items-center gap-2 text-sm">
          <input
            id="terms"
            type="checkbox"
            v-model="form.agree"
            class="w-4 h-4 text-primary border-gray-300 rounded"
          />
          <label for="terms">
            I agree to
            <NuxtLink to="/" class="text-gray-600 hover:underline">
              privacy policy & terms
            </NuxtLink>
          </label>
        </div>

          <div class="my-4">
              <button class="btn btn-primary d-grid w-100" type="submit">Sign Up</button>
          </div>
        </form>
        <p class="text-center text-sm text-gray-800">
          <span>Already have an account? </span>
          <NuxtLink to="/auth/end-user/sign-in" class="text-gray-600 hover:underline font-medium">
            Sign in
          </NuxtLink>
        </p>

        <!-- Divider -->
        <div class="flex items-center my-3">
          <hr class="flex-grow border-gray-300" />
          <span class="px-3 text-gray-400 text-sm">or</span>
          <hr class="flex-grow border-gray-300" />
        </div>

        <!-- Socials -->
        <div class="flex justify-center space-x-4 text-xl">
          <NuxtLink to="/"><i class="pi pi-facebook text-gray-800 cursor-pointer"></i></NuxtLink>
          <NuxtLink to="/"><i class="pi pi-twitter text-gray-800 cursor-pointer"></i></NuxtLink>
          <NuxtLink to="/"><i class="pi pi-github text-gray-800 cursor-pointer"></i></NuxtLink>
          <NuxtLink to="/"><i class="pi pi-google text-gray-800 cursor-pointer"></i></NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface SignupForm {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

const form = ref<SignupForm>({
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agree: false,
});

const showPassword = ref(false);
const showConfirm = ref(false);

const handleSignup = () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  // Placeholder for backend auth API integration
  console.log("User data ready for backend:", form.value);
};
</script>


