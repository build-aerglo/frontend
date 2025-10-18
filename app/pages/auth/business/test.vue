<template>
    <div class="flex flex-col bg-secondaryLinen min-h-screen overflow-hidden relative">
        
        <header class="w-full flex justify-end items-center px-[20px] sm:px-[65px] py-[20px]">
            <NuxtLink to="/">
                <img 
                    src="../../../assets/logo/echohub-high-resolution-logo-transparent-blue.png" 
                    alt="EchoHub logo" 
                    class="h-[30px] sm:h-[40px] w-auto"
                >
            </NuxtLink>
        </header>

        <div class="flex flex-1 justify-center items-start px-[30px] sm:px-[70px] pt-4 pb-0"> 
            
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-[10px] flex-1 max-w-[1400px]">
                
                <div class="hidden sm:flex col-span-3 bg-primary rounded-l-[10px] justify-center items-center p-[20px] h-full">
                    <div class="min-h-[500px] flex flex-col justify-center items-center">
                        <img src="../../../assets/images/8767124_4004536.jpg" class="object-contain object-center w-[400px] h-max rounded-[10px]" />
                        <div class="mt-[20px]">
                            <h3 class="text-[200%] text-white text-center">All Your Reviews. One Powerful Hub</h3>
                            <div class="text-white text-center text-[120%]">Track, manage, and learn from customer feedback</div>
                        </div>
                    </div>
                </div>
                
                <div class="shadow-lg flex justify-center items-center rounded-r-[10px] sm:p-0 p-[30px] col-span-2 bg-white h-full">
                    
                    <div class="w-full h-full flex flex-col justify-center items-center py-6"> 
                        
                        <div class="w-full sm:w-[80%] rounded-[10px]">
                            <div class="mb-[30px]">
                                <h1 class="text-[200%] text-center">Register Your Business</h1>
                            </div>
                            
                            <form @submit.prevent="submitform" class="flex flex-col gap-[20px]">
                                
                                <InputTextCustom
                                    v-model="businessRegistrationForm.userName"
                                    label="User Name"
                                    :required="true"
                                    icon="pi pi-user"
                                    inputBgClass="!bg-secondaryLinen"
                                    inputFocusClass="!focus:border-accent"
                                />
                                <InputTextCustom
                                    v-model="businessRegistrationForm.address"
                                    label="Business Address"
                                    :required="true"
                                    icon="pi pi-map-marker"
                                    inputBgClass="!bg-secondaryLinen"
                                    inputFocusClass="!focus:border-accent"
                                />
                                
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                                    <InputTextCustom
                                        v-model="businessRegistrationForm.email"
                                        label="Email"
                                        type="email"
                                        :required="true"
                                        icon="pi pi-envelope"
                                        inputBgClass="!bg-secondaryLinen"
                                        inputFocusClass="!focus:border-accent"
                                    />
                                    <InputTextCustom
                                        v-model="businessRegistrationForm.phoneNum"
                                        label="Phone number"
                                        :required="true"
                                        icon="pi pi-phone"
                                        inputBgClass="!bg-secondaryLinen"
                                        inputFocusClass="!focus:border-accent"
                                    />
                                </div>
                                
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                                    <InputTextCustom
                                        v-model="businessRegistrationForm.password"
                                        label="Password"
                                        type="password-toggle"
                                        :required="true"
                                        icon="pi pi-lock"
                                        inputBgClass="!bg-secondaryLinen"
                                        inputFocusClass="!focus:border-accent"
                                    />
                                    <InputTextCustom
                                        v-model="businessRegistrationForm.confirmPassword"
                                        label="Confirm Password"
                                        type="password-toggle"
                                        :required="true"
                                        icon="pi pi-lock"
                                        inputBgClass="!bg-secondaryLinen"
                                        inputFocusClass="!focus:border-accent"
                                    />
                                </div>

                                <div class="text-right">
                                    <NuxtLink to="/" class="bb">Forget Password</NuxtLink>
                                </div>

                                <ButtonCustom
                                    type="submit" 
                                    label="Register Business" 
                                    primary="true"
                                />

                                <div class="mt-[20px] text-center">
                                    Already have an account? <span>
                                        <NuxtLink to="/" class="bb">Sign In</NuxtLink>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

---

### Script Setup

```html
<script setup>
import { ref } from 'vue';

const businessRegistrationForm = ref({
    userName: '',
    email: '',
    phoneNum: '',
    address: '',
    password: '',
    confirmPassword: ''
});

const submitform = (user) => {
    console.log('Form Submitted with data:', businessRegistrationForm.value);
}
</script>