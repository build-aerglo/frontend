<template>
    <div class="authentication-wrapper authentication-cover">
        <!-- Logo -->
         <NuxtLink to="/" class="absolute top-[20px] sm:right-[100px] left-[20px]"><NavLogo /></NuxtLink>
        <!-- /Logo -->
        <div class="authentication-inner row m-0">
            <!-- /Left Text -->
            <div class="d-none d-xl-flex col-xl-8 p-0">
                <div class="auth-cover-bg d-flex justify-content-center align-items-center">
                    
                </div>
            </div>
            <!-- /Left Text -->

            <!-- Login -->
            <div class="d-flex col-12 col-xl-4 align-items-center authentication-bg p-sm-12 p-6">
                <div class="w-px-400 mx-auto mt-3 pt-5">
                    <h4 class="mb-4 text-accent text-center">Welcome</h4>
                    <form id="formAuthentication" class="mb-6">
                        <div class="mb-6 form-control-validation">
                            <label for="email" class="form-label">Email or Username</label>
                            <input type="text" class="form-control" id="email" name="email-username"
                                placeholder="Enter your email or username" autofocus />
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
                        <a href="auth-forgot-password-cover.html">
                            <p class="mb-0">Forgot Password?</p>
                        </a>
                    </div>
                </div>
                <button class="btn btn-primary d-grid w-100">Sign in</button>
            </form>
            <p class="text-center">
                <span>New to Echohub? </span><NuxtLink to="/auth/end-user/sign-up">Create an account</NuxtLink>
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
            <!-- /Login -->
    </div>
    </div>
</template>


<script setup>
const password = ref('')
</script>