<template>
    <div>
      <div class="container-xxl  bg-indigo-200">
      <div class="authentication-wrapper authentication-basic container-p-y">
        <!-- Logo -->
              <NuxtLink to="/" class="text-primary text-[130%] absolute top-[20px] sm:right-[100px] left-[20px]"><NavLogo /></NuxtLink>
              <!-- /Logo -->
        <div class="authentication-inner py-6">
          <!-- Login -->
          <div class="card">
            <div class="card-body">
              <h4 class="mb-1 text-center text-primary">Welcome Back!</h4>
              <form id="formAuthentication" class="mb-4" action="index.html" method="GET">
                <div class="mb-6 form-control-validation">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="text"
                    class="form-control"
                    id="email"
                    name="work-email"
                    placeholder="Enter your email address"
                    autofocus />
                </div>
                <div class="relative w-full">
                  <InputTextCustom
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password:"
                    placeholder="Password"
                  />
                  <i
                    :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                    class="absolute right-3 top-9 cursor-pointer"
                    @click="showPassword = !showPassword"
                  ></i>
                </div>
                <div class="my-8">
                  <div class="d-flex justify-content-between">
                    <div class="form-check mb-0 ms-2">
                      <input class="form-check-input" type="checkbox" id="remember-me" />
                      <label class="form-check-label" for="remember-me"> Remember Me </label>
                    </div>
                    <a href="auth-forgot-password-basic.html">
                      <p class="mb-0 text-accent">Forgot Password?</p>
                    </a>
                  </div>
                </div>
                <div class="mb-6">
                  <button class="btn btn-primary d-grid w-100" type="submit">Sign In</button>
                </div>
              </form>

            </div>
          </div>
          <!-- /Login -->
        </div>
      </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const password = ref<string>("");
const showPassword = ref<boolean>(false);
</script>


