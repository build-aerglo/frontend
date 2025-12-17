<template>
    <div class="relative min-h-screen bg-green-100 flex items-center justify-center">
  
      <!-- Form Section -->
      <div class="relative w-full max-w-md px-6 py-8">
        <div class="bg-white rounded-2xl shadow-lg p-8">
        <div class="flex justify-center mb-6">
          <img src="~/assets/images/e-user-logo.png" alt="Welcome" class="h-12 w-auto object-contain" />
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col justify-center items-center text-gray-600">
          <img :src="spinner" class="h-10 w-10 object-center" />
          <p class="text-sm mt-2">Signing up...</p>
        </div>

        <form @submit.prevent="handleEndUserRegistration" class="space-y-5">
          <!-- Email -->
          <div>
            <input id="email" v-model="form.email" type="email"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              placeholder="Email"
              required />

          </div>

          <!-- Phone -->
          <div>
            <input id="phone" v-model="form.phone" type="tel" pattern="[0-9]{11}" placeholder="Phone Number"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
              required />
          </div>

            <!-- Password -->
             <div >
               <div>
                 <div class="relative mt-1">
                   <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                     class="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                     placeholder="Password"
                     required 
                     />
                   <button type="button" @click="showPassword = !showPassword"
                     class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary">
                     <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                   </button>
                 </div>
               </div>
             </div>
            <!-- Confirm Password -->
            <div>
              <div class="relative mt-1">
                <input id="confirmPassword" v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'"
                  class="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                  placeholder="Confirm Password"
                  required />
                <button type="button" @click="showConfirm = !showConfirm"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary">
                  <i :class="showConfirm ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
              </div>
            </div>
          <div class="mb-2">
            <button 
              class="btn btn-primary d-grid w-100" 
              type="submit"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Signing In...' : 'Sign In' }}
            </button>
          </div>
        </form>

        <div class="text-center mt-0">
          <p class="text-xs">By submitting this form you accept our <NuxtLink class="!text-blue-500 cursor-pointer hover:underline">privacy policy</NuxtLink></p> 
        </div>
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
import type { EndUser } from "~/types";
import spinner from '~/assets/svg/spinner.svg'

const { registerEndUser } = useMethods();
const confirmPassword = ref('')
const form = ref<EndUser>({ 
  email: "",
  phone: "",
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
      toast.add({ severity: 'success', summary: 'SUCCESS', detail: 'Registered successfully!', life: 3000 });
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
