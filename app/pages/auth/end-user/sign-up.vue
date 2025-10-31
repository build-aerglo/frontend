<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Left Image Section -->
    <div class="hidden md:flex w-2/3 relative">
      <img
        src="/assets/images/e-user-bg (3).png"
        alt="Join the community"
        class="object-cover w-full h-full"
      />
    </div>

    <!-- Right Form Section -->
    <div
      class="flex flex-col justify-center items-center px-8 w-full md:w-1/3"
    >
      <div class="w-full max-w-md">
        <div class="flex justify-center mb-3 mt-2">
            <img
            src="/assets/images/e-user-logo.png"
            alt="Welcome"
            class="h-12 w-auto object-contain"
          />
        </div>
        <div class="text-[#008253] text-center font-bold text-[100%] my-4">Clear reviews, Confident decisions.</div>
        <form @submit.prevent="handleSignup" class="space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required
            />
            
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
           
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required
            />
            
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            
            
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              pattern="[0-9]{11}"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required
            />
            
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
                <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
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
                  <i :class="showConfirm ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
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
            class="w-4 h-4 text-[#008253] border-gray-300 rounded"
          />
          <label for="terms">
            I agree to
            <NuxtLink to="/" class="text-blue-500 hover:underline">
              privacy policy & terms
            </NuxtLink>
          </label>
        </div>

          <div class="my-4">
            <NuxtLink to="/landing/end-user/home"><button class="btn btn-primary d-grid w-100" type="submit">Sign Up</button></NuxtLink>
          </div>
        </form>
        <p class="text-center text-sm text-gray-800 mb-0">
          <span>Already have an account? </span>
          <NuxtLink to="/auth/end-user/sign-in" class="text-blue-500 hover:underline font-medium">
            Sign in
          </NuxtLink>
        </p>

        <!-- Divider -->
        <div class="flex items-center mt-0">
          <hr class="flex-grow border-gray-300" />
          <span class="px-3 text-gray-400 text-sm">or</span>
          <hr class="flex-grow border-gray-300" />
        </div>

        <!-- Socials -->
        <div class="flex justify-center space-x-4 text-xl">
          <NuxtLink to="/landing/end-user/home"><i class="pi pi-facebook text-gray-800 cursor-pointer"></i></NuxtLink>
          <NuxtLink to="/landing/end-user/home"><i class="pi pi-twitter text-gray-800 cursor-pointer"></i></NuxtLink>
          <NuxtLink to="/landing/end-user/home"><i class="pi pi-github text-gray-800 cursor-pointer"></i></NuxtLink>
          <NuxtLink to="/landing/end-user/home"><i class="pi pi-google text-gray-800 cursor-pointer"></i></NuxtLink>
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


