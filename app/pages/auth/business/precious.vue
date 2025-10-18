<template>
    <div class="flex justify-center items-center p-[30px] sm:p-[100px] bg-secondaryLinen h-screen relative">
        <NuxtLink class="bb absolute top-[20px] sm:right-[100px] right-[20px]">Home</NuxtLink>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-[10px] flex-1">
            <div class="hidden sm:flex col-span-2 bg-primary rounded-l-[10px] justify-center items-center p-[20px]">
                <div class="min-h-[500px]">
                    <img src="" class="object-contain object-center w-[400px] h-max rounded-[10px]" />
                    <div class="mt-[20px]">
                        <h3 class="text-[200%] text-white text-center">Sign up or die!!</h3>
                        <div class="text-white text-center">Terms and conditions apply</div>
                    </div>
                </div>
            </div>
            <div class="shadow-lg flex justify-center items-center rounded-r-[10px] sm:p-0 p-[30px]">
                <div class="w-full sm:w-[80%] rounded-[10px]">
                    <div class="mb-[30px]">
                        <h1 class="text-[200%]">Create Account</h1>
                        <div>Welcome Back</div>
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
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                            <FloatLabel>
                                <InputText fluid v-model="e" class="!bg-secondaryLinen" />
                                <label>Username: </label>
                            </FloatLabel>

                            <FloatLabel>
                                <Password fluid v-model="p" toggleMask class="!bg-secondaryLinen" />
                                <label class="text-[100%]">BVN Number: </label>
                            </FloatLabel>
                        </div>
                        <div class="text-right">
                            <NuxtLink to="/" class="bb">Forget Password</NuxtLink>
                        </div>

                        <Button label="Sign In" fluid class="bg-primary" />

                        <div class="mt-[20px] text-center">
                            Already have an acconunt? <span>
                                <NuxtLink to="/" class="bb">Sign In</NuxtLink>
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