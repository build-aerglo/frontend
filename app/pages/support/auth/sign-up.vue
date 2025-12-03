<template>
  <div class="relative min-h-screen bg-green-100 flex items-center justify-center">
    <!-- Form Section -->
    <div class="relative w-full max-w-md px-2 py-8">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <div class="flex justify-center mb-1 mt-1">
          <img src="~/assets/images/e-user-logo.png" alt="Welcome" class="h-12 w-auto object-contain" />
        </div>
        <div class="text-[#008253] text-center font-bold text-[100%] my-1">Clear reviews, Confident decisions.</div>
        <form @submit.prevent="handleSupportUserRegistration" class="space-y-2">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input id="username" v-model="form.username" type="text"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required />
            </div>
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input id="email" v-model="form.email" type="email"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required />
            </div>
          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input id="phone" v-model="form.phone" type="tel" pattern="[0-9]{11}"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required />
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input id="address" v-model="form.address" type="address"
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
                  Password must contain a number
                </div>
                <div class="flex items-center gap-2">
                  <i class="text-xs" :class="validComplexity ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                  Password must contain a special character (@#&_$?)
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
              I agree to
              <NuxtLink to="/" class="text-blue-500 hover:underline">
                privacy policy & terms
              </NuxtLink>
            </label>
          </div>
          <div class="my-2">
            <button class="btn btn-primary d-grid w-100" type="submit">Sign Up</button>
          </div>
        </form>
        <p class="text-center text-sm text-gray-800 mb-0">
          <span>Already have an account? </span>
          <NuxtLink to="/support/auth/sign-in" class="text-blue-500 hover:underline font-medium">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMethods from '~/composables/useMethods'; 
import type { SupportUser } from "~/types/support";
const { registerSupportUser } = useMethods();
const confirmPassword = ref('')
const agree = ref(false)
const form = ref<SupportUser>({
  username: "",
  email: "",
  phone: "",
  address: "",
  password: "",
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


const handleSupportUserRegistration = async () => {
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

    const res = await registerSupportUser(form.value);
    if (res) {
      alert('Registered successfully')
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
