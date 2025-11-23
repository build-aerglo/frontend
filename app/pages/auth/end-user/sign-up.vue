<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Left Image Section -->
    <div class="hidden md:flex w-2/3 relative">
      <img src="~/assets/images/e-user-bg.png" alt="Join the community" class="object-cover w-full h-full" />
      <div class="absolute bottom-3 left-3">
        <p class="text-blue-800 text-sm drop-shadow">
          Earn points by writing reviews, making referrals and unlocking achievements across the platform... 
        </p>
      </div>
    </div>

    <!-- Right Form Section -->
    <div class="flex flex-col justify-center bg-gray-50 items-center px-8 w-full md:w-1/3">
      <div class="w-full max-w-md">
        <div class="flex justify-center mt-0">
          <img src="~/assets/images/e-user-logo.png" alt="Welcome" class="h-12 w-auto object-contain" />
        </div>
        <div class="text-[#008253] text-center font-bold text-[100%] my-1">Clear reviews, Confident decisions.</div>
        <form @submit.prevent="handleEndUserRegistration" class="space-y-4">
          <!-- Username -->
          <div>
            <input id="username" v-model="form.username" type="text" placeholder="Username"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required />
          </div>
          <!-- Email -->
          <div>
            <input id="email" v-model="form.email" type="email" placeholder="Email"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required />
          </div>
          <!-- Phone -->
          <div>
            <input id="phone" v-model="form.phone" type="tel" pattern="[0-9]{11}" placeholder="Phone number"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required />
          </div>
          <div>
            <input id="address" v-model="form.address" type="address" placeholder="Address"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required />
          </div>
          <div class="flex space-x-4">
            <!-- Password -->
            <div class="w-1/2">
              <div class="relative mt-1">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
                  class="w-full border border-gray-300 rounded-lg p-2 pr-10 
                        focus:outline-none hover:border-gray-400 
                        focus:border-primary focus:ring-2 focus:ring-primary"
                  required
                />
                <!-- Toggle icon -->
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 
                        text-gray-500 hover:text-primary"
                >
                  <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
              </div>
              <!-- Password validation messages -->
              <div v-if="!allValid" class="flex flex-col mt-2 space-y-1 text-sm">
                <div class="flex items-center gap-2">
                  <i class="text-xs" :class="validLength ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                  Password must be greater than 8 characters
                </div>
                <div class="flex items-center gap-2">
                  <i class="text-xs" :class="validNumeric ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                  Password must contain a number and a special character (@#&_$?)
                </div>
              </div>
              <div v-if="isValid" class="text-green-600 mt-1 text-sm">Password Validated</div>
            </div>
            <!-- Confirm Password -->
            <div class="w-1/2">
              <div class="relative mt-1">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  placeholder="Confirm Password"
                  class="w-full border border-gray-300 rounded-lg p-2 pr-10 
                        focus:outline-none hover:border-gray-400 
                        focus:border-primary focus:ring-2 focus:ring-primary"
                  required
                />
                <!-- Toggle icon -->
                <button
                  type="button"
                  @click="showConfirm = !showConfirm"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 
                        text-gray-500 hover:text-primary"
                >
                  <i :class="showConfirm ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Terms -->
          <div class="flex items-center gap-2 text-xs">
            <input id="terms" type="checkbox" v-model="agree"
              class="w-4 h-4 text-[#008253] border-gray-300 rounded" />
            <label for="terms">
              By submitting this form you accept our
              <NuxtLink to="/" class="text-blue-500 hover:underline">
                privacy policy.
              </NuxtLink>
            </label>
          </div>

          <div class="my-2">
            <button class="btn btn-primary d-grid w-100" type="submit">Sign Up</button>
          </div>
        </form>
        <p class="text-center text-sm text-gray-800 mb-1">
          <span>Already have an account? </span>
          <NuxtLink to="/auth/end-user/sign-in" class="text-blue-500 hover:underline font-medium">
            Sign in
          </NuxtLink>
        </p>

        <!-- Divider -->
        <div class="flex items-center mb-3">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="px-2 text-gray-400 text-xs">or sign in with</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <div class="flex justify-center space-x-5">
          <NuxtLink to="/" aria-label="Login with Facebook">
            <i class="pi pi-facebook text-blue-600 text-2xl"></i>
          </NuxtLink>
          <NuxtLink to="/" aria-label="Login with Twitter">
            <i class="pi pi-twitter text-slate-600 text-2xl"></i>
          </NuxtLink>
          <NuxtLink to="/" aria-label="Login with GitHub">
            <i class="pi pi-github text-gray-800 text-2xl"></i>
          </NuxtLink>
          <NuxtLink to="/" aria-label="Login with Google">
            <i class="pi pi-google text-amber-600 text-2xl"></i>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMethods from '~/composables/useMethods'; 
import type { EndUser } from "~/types";
const { registerEndUser } = useMethods();
const confirmPassword = ref('')
const agree = ref(false)
const form = ref<EndUser>({
  username: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  socialMedia: ""
});
const toast = useToast()
const isLoading = ref(false);
const registrationError = ref<string | null>(null);
const showPassword = ref(false);
const showConfirm = ref(false);

const validLength = ref(true);
const validComplexity = ref(true);
const validNumeric = ref(true);
const isValid = ref(false)
const allValid = computed(() => validLength.value && validNumeric.value && validComplexity.value);

watch(() => form.value.password, (newVal) => {
  validLength.value = newVal.length >= 8;
  validNumeric.value = /[0-9]/.test(newVal);
  validComplexity.value = /[@#&$_?]/.test(newVal);
});

watch([() => form.value.password, confirmPassword], () => {
  if (isValid.value) isValid.value = false;
});


const handleEndUserRegistration = async () => {
  if (!allValid.value) return;
  if (confirmPassword.value !== form.value.password) {
    return toast.add({
      severity: 'error',
      summary: 'ERROR', detail: 'Password do not match', life: 3000
    });
  }


  try {
    isLoading.value = true;
    registrationError.value = null;

    const res = await registerEndUser(form.value);
    if (res) {
      alert('Business registered successfully')
      console.log(res);
      navigateTo('sign-in');
    } else {
      toast.add({
        severity: 'error',
        summary: 'ERROR', detail: 'Registration failed. Check the form data and try again.', life: 3000
      });
    }

    isLoading.value = false;
  } catch (error) {
    console.log(error)
    toast.add({
      severity: 'error',
      summary: 'ERROR', detail: 'Registration failed. Check the form data and try again.', life: 3000
    });
  }
}
</script>
