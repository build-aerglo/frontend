<template>
    <div class="authentication-wrapper authentication-cover">
        <!-- Logo -->
        <a href="index.html" class="app-brand auth-cover-brand">
            <NavLogo />
        </a>
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
                <div class="w-px-400 mx-auto mt-12 pt-5">
                    <h4 class="mb-1">Welcome to Vuexy! 👋</h4>
                    <p class="mb-6">Please sign-in to your account and start the adventure</p>

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
                        <ButtonCustom label="Submit" size="lg" primary="true" />
                    </form>

                    <p class="text-center">
                        <span>New on our platform?</span>
                        <a href="auth-register-cover.html">
                            <span>Create an account</span>
                        </a>
                    </p>

                    <div class="divider my-6">
                        <div class="divider-text">or</div>
                    </div>

                    <div class="d-flex justify-content-center">
                        <a href="javascript:;" class="btn btn-icon rounded-circle btn-text-facebook me-1_5">
                            <i class="icon-base pi pi-google icon-20px"></i>
                        </a>

                        <a href="javascript:;" class="btn btn-icon rounded-circle btn-text-twitter me-1_5">
                            <i class="icon-base pi pi-twitter icon-20px"></i>
                        </a>

                        <a href="javascript:;" class="btn btn-icon rounded-circle btn-text-github me-1_5">
                            <i class="icon-base pi pi-github icon-20px"></i>
                        </a>

                        <a href="javascript:;" class="btn btn-icon rounded-circle btn-text-google-plus">
                            <i class="icon-base pi pi-facebook icon-20px"></i>
                        </a>
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