<template>
    <div>
    <div class="container-xxl bg-[url(assets/images/support1.jpg)]">
      <div class="authentication-wrapper authentication-basic container-p-y">
        <!-- Logo -->
        <NuxtLink to="/" class="absolute top-[20px] sm:right-[100px] left-[20px]"><NavLogo /></NuxtLink>
        <!-- /Logo -->
         
        <div class="authentication-inner py-6">
          <!-- Register Card -->
          <div class="card">
            <div class="card-body">
              <h4 class="mb-1 text-center text-primary text-[140%]">Create Your Account</h4>
              
              <form id="formAuthentication" class="mb-6" action="index.html" method="GET">
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
                <div class="mb-2 form-control-validation">
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
                
                <div class="mt-2 mb-3 form-control-validation">
                  <div class="form-check mb-0 ms-2">
                    <input class="form-check-input" type="checkbox" id="terms-conditions" name="terms" />
                    <label class="form-check-label" for="terms-conditions">
                      I agree to
                      <NuxtLink to="/" class="text-accent"> privacy policy & terms</NuxtLink>
                    </label>
                  </div>
                </div>
                <button class="btn btn-primary d-grid w-100">Sign up</button>
              </form>

              <p class="text-center">
                <span>Already have an account? </span>
                <span class="text-accent"><NuxtLink to="/auth/support-user/sign-in">Sign in</NuxtLink></span>
              </p>

            </div>
          </div>
          <!-- Register Card -->
        </div>
      </div>
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


