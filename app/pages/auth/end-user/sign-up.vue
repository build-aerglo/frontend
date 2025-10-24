<template>
      <div class="authentication-wrapper authentication-cover">
      <div class="authentication-inner row m-0">
        <!-- /Left Text -->
        <div class="d-none d-xl-flex col-xl-8 p-0">
           <div class="auth-cover-bg bg-primary d-flex justify-content-right align-items-right">
              <NuxtLink to="/" class="absolute top-[20px] sm:right-[100px] left-[20px]"><NavLogo /></NuxtLink>
              <img src="assets/images/joincomm2.jpg" class="w-[150%] h-screen"/>
            </div>
        </div>

        <!-- Register -->
        <div class="d-flex col-12 col-xl-4 align-items-center authentication-bg p-sm-12 p-6 mt-0">
          <div class="w-px-400 mx-auto mt-2 pt-5">
            <h3 class="text-center text-accent mb-0 mt-0">Join The Community</h3>
            <h5 class="mb-1 mt-0 text-center text-primary">Create An Account</h5>
            <form id="formAuthentication" class="mb-4" action="index.html" method="GET">
              <div class="mb-3 form-control-validation">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  autofocus />
              </div>
              <div class="mb-3 form-control-validation">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" name="email" placeholder="Enter your email" />
              </div>
              <div class="mb-3 form-control-validation">
                  <label for="phone-number" class="form-label">Phone Number</label>
                  <input type="tel" class="form-control" id="phone-number" name="phone-number" pattern="[0-9]{11}" placeholder="Enter your phone number" />
                </div>
                <div class="flex gap-2">
                    <div class="relative w-1/2">
                      <InputTextCustom
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Password"
                      />
                      <i
                        :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                        class="absolute right-3 top-4 cursor-pointer"
                        @click="showPassword = !showPassword"
                      ></i>
                    </div>
                    <div class="relative w-1/2">
                      <InputTextCustom
                        v-model="confirmPassword"
                        :type="showConfirm ? 'text' : 'password'"
                        placeholder="Confirm password"
                      />
                      <i
                        :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"
                        class="absolute right-3 top-4 cursor-pointer"
                        @click="showConfirm = !showConfirm"
                      ></i>
                    </div>
              </div>
              <div class="mb-3 mt-2">
                <div class="form-check mb-8 ms-2 form-control-validation">
                  <input class="form-check-input" type="checkbox" id="terms-conditions" name="terms" />
                  <label class="form-check-label" for="terms-conditions">
                    I agree to
                    <a href="javascript:void(0);">privacy policy & terms</a>
                  </label>
                </div>
              </div>
              
              <button class="btn btn-primary d-grid w-100 mt-0">Sign up</button>
           </form>

            <p class="text-center">
              <span>Already have an account?<NuxtLink to="/auth/end-user/sign-in"><span> Sign in</span></NuxtLink></span>
            </p>

            <div class="divider my-6">
              <div class="divider-text">or</div>
            </div>

            <div class="d-flex justify-content-center">
                <NuxtLink to="/"><i class="pi pi-facebook ml-3" style="font-size:1rem;color:blue"></i></NuxtLink>
                <NuxtLink to="/"><i class="pi pi-twitter ml-3" style="font-size:1rem; color:black"></i></NuxtLink>
                <NuxtLink to="/"><i class="pi pi-github ml-3" style="font-size:1rem; color:black"></i></NuxtLink>
                <NuxtLink to="/"><i class="pi pi-google ml-3" style="font-size:1rem; color:orangered"></i></NuxtLink>
            </div>
          </div>
        </div>
        <!-- /Register -->
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const password = ref<string>("");
const confirmPassword = ref<string>("");
const showPassword = ref<boolean>(false);
const showConfirm = ref<boolean>(false);
</script>



