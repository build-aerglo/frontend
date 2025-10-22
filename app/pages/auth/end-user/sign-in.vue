<template>
    <div class="authentication-wrapper authentication-cover">
        <!-- Logo -->
         <NuxtLink to="/auth/end-user/sign-in" class="text-primary absolute top-[20px] sm:right-[100px] left-[20px]"><NavLogo /></NuxtLink>
        <!-- /Logo -->
        <div class="authentication-inner row m-0">
            <!-- /Left Text -->
            <div class="d-none d-xl-flex col-xl-8 p-0">
                <div class="auth-cover-bg d-flex justify-content-center align-items-center">
                    <img src="/images/img/illustrations/auth-login-illustration-light.png" alt="auth-login-cover"
                        class="my-5 auth-illustration"
                        data-app-light-img="illustrations/auth-login-illustration-light.png"
                        data-app-dark-img="illustrations/auth-login-illustration-dark.png" />
                    <img src="/images/img/illustrations/bg-shape-image-light.png" alt="auth-login-cover"
                        class="platform-bg" data-app-light-img="illustrations/bg-shape-image-light.png"
                        data-app-dark-img="illustrations/bg-shape-image-dark.png" />
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
                            <div>
                                <InputTextCustom v-model="password" label="Password:" type="password"
                                    placeholder="Enter Password" />
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