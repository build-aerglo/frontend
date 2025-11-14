<template>
  <div class="container-xxl relative bg-[url('/images/auth/b-user-bg.png')] bg-cover bg-center">
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="authentication-wrapper authentication-basic container-py">
      <div class="authentication-inner py-6">
        <!-- Register Card -->
        <div class="card">
          <!-- p-4 md:shadow-lg md:rounded-xl md:bg-white md:p-0 -->
          <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center mb-9">
              <NuxtLink to="/">
                <NavLogo />
              </NuxtLink>
            </div>
            <!-- /Logo -->
            <p class="mb-6 text-[105%] sm:text-[110%] text-contrast text-center">Build customer trust through real
              feedback!</p>

            <form @submit.prevent="handleRegistration" class="mb-6">

              <div class="form-control-validation">
                <InputTextCustom v-model="businessData.name" label="Business Name" type="text" required />
              </div>

              <div class="form-control-validation">
                <InputTextCustom v-model="businessData.email" label="Email" type="email" required />
              </div>

              <div class="form-control-validation">
                <InputTextCustom v-model="businessData.phone" label="Phone Number" type="tel" required />
              </div>

              <div class="form-password-toggle form-control-validation">
                <InputTextCustom v-model="password" label="Password" type="password" required />
                <div v-if="!allValid" class="flex flex-col mt-[10px] mb-[10px]">
                  <div class="flex items-center gap-2">
                    <i class="text-[10px]"
                      :class="validLength ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                    Password must be greater than 8 characters
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="text-[10px]"
                      :class="validNumeric ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                    Password must contain a number
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="text-[10px]"
                      :class="validComplexity ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                    Password must contain a special character (@#&_$?)
                  </div>
                </div>
                <div v-if="isValid">Password Validated</div>
              </div>

              <div class="form-password-toggle form-control-validation">
                <InputTextCustom v-model="confirmPassword" label="Confirm Password" type="password" required />
              </div>
              <div v-if="registrationError" class="text-red-500">{{ registrationError }}</div>
              <ButtonCustom :label="isLoading ? 'Registering...' : 'Register your business'" :disabled="isLoading"
                size="lg" primary="true" input-class="p-[10px] text-[15px] mt-8" type="submit" />
            </form>

            <p class="text-center md:text-[100%]">
              <span class="text-contrast">Already have an account?</span>
              <NuxtLink to="sign-in">
                <span class="ms-1 hover:underline text-link">Sign in instead</span>
              </NuxtLink>
            </p>

            <p class="text-[80%] text-center">
              <span class="text-contrast">By submitting this form you accept our</span>
              <NuxtLink to="/">
                <span class="ms-1 hover:underline text-link">privacy policy</span>
              </NuxtLink>
            </p>

          </div>
        </div>
        <!-- Register Card -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useMethods from '~/composables/useMethods';
import type { BusinessUser } from "~/types";

const { registerBusiness } = useMethods();
const router = useRouter();

const businessData = ref<BusinessUser>({
  id: '',
  name: '',
  email: '',
  phone: '',
  userType: 'business_user',
  password: '',
  address: null,
  branchName: null,
  branchAddress: null,
  website: null,
  categoryIds: ["0199d4ef-ca22-7970-a8d2-579518a5030d"]
});
const toast = useToast()
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false);
const registrationError = ref<string | null>(null);


const validLength = ref(true);
const validComplexity = ref(true);
const validNumeric = ref(true);
const isValid = ref(false)
const allValid = computed(() => validLength.value && validNumeric.value && validComplexity.value);

watch(password, (newVal) => {
  validLength.value = newVal.length >= 8;
  validNumeric.value = /[0-9]/.test(newVal);
  validComplexity.value = /[@#&$_?]/.test(newVal);
});

watch([password, confirmPassword], () => {
  if (isValid.value) isValid.value = false;
});


const handleRegistration = async () => {
  if (!allValid.value) return;
  if (confirmPassword.value !== businessData.value.password) {
    return toast.add({
      severity: 'error',
      summary: 'ERROR', detail: 'Password do not match', life: 3000
    });
  }

  businessData.value.password = password.value;

  try {
    isLoading.value = true;
    registrationError.value = null;

    const res = await registerBusiness(businessData.value);
    if (res) {
      alert('Business registered successfully')
      console.log(res);
      navigateTo('./sign-in');
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

<style scoped>
.authentication-wrapper.authentication-basic .authentication-inner::before,
.authentication-wrapper.authentication-basic .authentication-inner::after {
  content: none !important;
  display: none !important;
}
</style>