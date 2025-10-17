<template>
    <div class="flex justify-center items-center p-[30px] sm:p-[100px] bg-secondaryLinen h-screen relative">
        <NuxtLink to="/Auth/User/home" class="text-primary absolute top-[20px] sm:right-[100px] right-[20px]">Home</NuxtLink>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-[10px] flex-1">
            <div class="hidden sm:flex col-span-2 bg-primary rounded-l-[10px] justify-center items-center p-[20px]">
                <div class="min-h-[500px]">
                    <img src="" class="object-contain object-center w-[400px] h-max rounded-[10px]" />
                    <div class="mt-[20px]">
                        <h3 class="text-[200%] text-white text-center">Sign into Your EchoHub account</h3>
                        
                    </div>
                </div>
            </div>
            <div class="shadow-lg flex justify-center items-center rounded-r-[10px] sm:p-0 p-[30px]">
                <div class="w-full sm:w-[80%] rounded-[10px]">
                    <div class="mb-[30px]">
                        <h1 class="text-[200%]">Welcome Back!</h1>
                        
                    </div>
                    <form @submit.prevent="submitform(user)" class="flex flex-col gap-[20px]">
                        <FloatLabel>
                            <InputText fluid v-model="e" class="!bg-secondaryLinen" />
                            <label>Email Address: </label>
                        </FloatLabel>

                        <FloatLabel>
                            <Password fluid v-model="p" toggleMask class="!bg-secondaryLinen" />
                            <label class="text-[100%]">Password: </label>
                        </FloatLabel>
                        
                        <div class="text-right">
                            <NuxtLink to="/" class="text-primary">Forgot Password?</NuxtLink>
                        </div>

                        <Button label="Sign In" fluid class="bg-primary" />

                        <div class="mt-[20px] text-center">
                            Don't have an account? <span>
                                <NuxtLink to="/" class="text-primary">Sign Up</NuxtLink>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const e = ref('')
const p = ref('')
</script>

