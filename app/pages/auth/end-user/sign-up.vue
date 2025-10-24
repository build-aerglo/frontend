<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Left Image Section -->
    <div class="hidden xl:flex w-2/3 relative">
      <NuxtLink to="/" class="absolute top-6 left-6 z-10">
        <NavLogo />
      </NuxtLink>
      <img
        src="/assets/images/joincomm2.jpg"
        alt="Join the community"
        class="object-contain w-full h-full"
      />
    </div>

    <!-- Right Form Section -->
    <div
      class="flex flex-col justify-center items-center w-full xl:w-1/3 p-8 bg-white"
    >
      <div class="w-full max-w-md">
        <h3 class="text-center mb-1 text-accent text-2xl font-bold">
          Join The Community
        </h3>
        <h5 class="text-center mt-0 text-primary mb-3 font-medium">
          Create An Account
        </h5>

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
              placeholder="Enter your username"
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
              placeholder="Enter your email"
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
              placeholder="Enter your phone number"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <!-- Password & Confirm Password -->
          <div class="flex gap-3">
            <!-- Password -->
            <div class="relative w-1/2">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                required
              />
              <i
                :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                class="absolute right-3 top-3 cursor-pointer text-gray-500"
                @click="showPassword = !showPassword"
              ></i>
            </div>

            <!-- Confirm Password -->
            <div class="relative w-1/2">
              <input
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Confirm Password"
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                required
              />
              <i
                :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"
                class="absolute right-3 top-3 cursor-pointer text-gray-500"
                @click="showConfirm = !showConfirm"
              ></i>
            </div>
          </div>

          <!-- Terms -->
          <div class="flex items-center space-x-2 mt-3">
            <input
              id="terms"
              v-model="form.agree"
              type="checkbox"
              class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              required
            />
            <label for="terms" class="text-sm text-gray-700">
              I agree to the <a href="#" class="text-primary">privacy policy</a> & terms
            </label>
          </div>

          <div class="mb-6">
              <button class="btn btn-primary d-grid w-100" type="submit">Sign In</button>
          </div>
        </form>

        <p class="text-center mt-4 text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/auth/end-user/sign-in" class="text-primary font-medium">Sign In</NuxtLink>
        </p>

        <!-- Divider -->
        <div class="flex items-center my-6">
          <hr class="flex-grow border-gray-300" />
          <span class="px-3 text-gray-400 text-sm">or</span>
          <hr class="flex-grow border-gray-300" />
        </div>

        <!-- Socials -->
        <div class="flex justify-center space-x-4 text-xl">
          <NuxtLink to="/"><i class="pi pi-facebook text-blue-600 cursor-pointer"></i></NuxtLink>
          <NuxtLink to="/"><i class="pi pi-twitter text-sky-500 cursor-pointer"></i></NuxtLink>
          <NuxtLink to="/"><i class="pi pi-github text-gray-800 cursor-pointer"></i></NuxtLink>
          <NuxtLink to="/"><i class="pi pi-google text-orange-500 cursor-pointer"></i></NuxtLink>
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


