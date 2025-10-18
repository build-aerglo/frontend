<template>
    <div class="flex justify-center items-center p-[30px] sm:p-[100px] bg-secondaryLinen h-screen relative">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-[10px] flex-1">
            <div class="hidden sm:flex col-span-2 bg-primary rounded-l-[10px] justify-center items-center p-[20px]">
                <div class="min-h-[450px]">
                    <img src="assets/images/community.png" class="object-contain object-center w-[550px] h-max rounded-[10px]" />
                    <div class="mt-[20px]">
                        <h3 class="text-[250%] text-accent text-center">Join The EchoHub Community</h3>
                        <div class="text-white text-center text-[120%]">Where genuine reviews guide smarter choices...</div>
                    </div>
                </div>
            </div>
            <div class="shadow-lg flex justify-center items-center bg-white rounded-r-[10px] sm:p-0 p-[30px]">
                <div class="w-full sm:w-[80%] rounded-[10px]">
                    <div class="mb-[10px]">
                        <h1 class="text-[200%] text-center text-accent">Create An Account</h1>
                    </div>
                    <form @submit.prevent="submitform(user)" class="flex flex-col gap-[20px]">
                        <FloatLabel>
                            <InputText fluid v-model="e" class="bg-secondaryLinen"/>
                            <label>Full Name: </label>
                        </FloatLabel>

                        <FloatLabel>
                            <InputText fluid v-model="e" class="bg-secondaryLinen"/>
                            <label>Email Address: </label>
                        </FloatLabel>

                        <FloatLabel>
                            <InputText fluid v-model="e" class="bg-secondaryLinen" />
                            <label>Phone Number: </label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText fluid v-model="e" class="bg-secondaryLinen" />
                            <label>User Name: </label>
                        </FloatLabel>

                        
                        <FloatLabel>
                            <Password fluid v-model="p" toggleMask class="" />
                            <label class="text-[100%]">Password: </label>
                        </FloatLabel>

                        <FloatLabel>
                            <Password fluid v-model="p" toggleMask class="" />
                            <label class="text-[100%]">Confirm Password: </label>
                        </FloatLabel>
                    

                        <Button label="Sign Up" fluid class="bg-primary" />

                        <div class="mt-[7px] text-center text-light">
                            Already have an account? <span>
                                <NuxtLink to="/auth/user/sign-in" class="text-primary">Sign In</NuxtLink>
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


