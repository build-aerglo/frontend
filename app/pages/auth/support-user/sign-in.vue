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
                <div class="mb-6 form-password-toggle form-control-validation">
                  <label class="form-label" for="password">Password</label>
                  <div class="input-group input-group-merge">
                    <input
                      type="password"
                      id="password"
                      class="form-control"
                      name="password"
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                      aria-describedby="password" />
                    <span class="input-group-text cursor-pointer"><i class="pi pi-eye-slash"></i></span>
                  </div>
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

<script setup>

</script>

