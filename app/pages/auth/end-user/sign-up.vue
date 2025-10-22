<template>
    <div class="authentication-wrapper authentication-cover">
      <!-- Logo -->
        <NuxtLink to="/auth/user/sign-up" class="text-primary absolute top-[20px] sm:right-[100px] left-[20px]"><NavLogo /></NuxtLink>
      <!-- /Logo -->
      <div class="authentication-inner row m-0">
        <!-- /Left Text -->
        <div class="d-none d-xl-flex col-xl-8 p-0">
          
        </div>
        <!-- /Left Text -->

        <!-- Register -->
        <div class="d-flex col-12 col-xl-4 align-items-center authentication-bg p-sm-12 p-6">
          <div class="w-px-400 mx-auto mt-3 pt-5">
            <h4 class="mb-4 text-center text-accent">Create Your Account</h4>
            <form id="formAuthentication" class="mb-6" action="index.html" method="GET">

              
              <div class="mb-2 form-control-validation">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  autofocus />
              </div>
              <div class="mb-2 form-control-validation">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" name="email" placeholder="Enter your email" />
              </div>
              <div class="mb-2 form-password-toggle form-control-validation">
                <label class="form-label" for="password">Password</label>
                <div class="input-group input-group-merge">
                  <input
                    type="password"
                    id="password"
                    class="form-control"
                    name="password"
                    placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                    aria-describedby="password" />
                  <span class="input-group-text cursor-pointer"><i class="icon-base ti tabler-eye-off"></i></span>
                </div>
                
              </div>
              <div class="mb-2 mt-8">
                <div class="form-check mb-8 ms-2 form-control-validation">
                  <input class="form-check-input" type="checkbox" id="terms-conditions" name="terms" />
                  <label class="form-check-label" for="terms-conditions">
                    I agree to
                    <a href="javascript:void(0);">privacy policy & terms</a>
                  </label>
                </div>
              </div>
              <button class="btn btn-primary d-grid w-100">Sign up</button>
            </form>

            <p class="text-center">
              <span>Already have an account? </span>
                <span><NuxtLink to="/auth/end-user/sign-in">Sign in</NuxtLink></span> 
            </p>

            <div class="divider my-6">
              <div class="divider-text">or</div>
            </div>

            <div class="d-flex justify-content-center">
              <NuxtLink to="/"><i class="pi pi-facebook ml-3" style="font-size:1rem;color:blue"></i></NuxtLink>
              <NuxtLink to="/"><i class="pi pi-twitter ml-3" style="font-size:1rem; color:black"></i></NuxtLink>
              <NuxtLink to="/"><i class="pi pi-github ml-3" style="font-size:1rem; color:black"></i></NuxtLink>
              <NuxtLink to="/"><i class="pi pi-google ml-3" style="font-size:1rem; color:orange"></i></NuxtLink>
            </div>
          </div>
        </div>
        <!-- /Register -->
      </div>
    </div>
</template>
<script setup>

</script>