<template>
    <header class="py-4 border-b">
        <nav class="flex container items-center">
            <a href="" classs="flex gap-1 items-center">
                <div class="text-3xl font-bold text-primary ml-8">EchoHub</div>
            </a>
            <ul class="flex gap-8 ml-auto text-xl capitalize">
                <li>
                    <NuxtLink to="/Home">
                        <div class="text-primary">Home</div>
                    </NuxtLink>
                </li>
                <li>
                     <NuxtLink to="/Home">
                        <div class="text-primary">For Businesses</div>
                    </NuxtLink>
                </li>
            </ul>
        </nav>
    </header>
    <div class="flex justify-center items-center h-screen px-[30px] sm:px-[200px]">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-[10px] w-full">
            <div class="col-span-2 w-full flex justify-center items-center">
                <div class="w-full flex-1">
                    <h1 class="text-[400%] text-primary mb-[20px]">Join The Echohub Community</h1>
                    <div class="text-light text-[23px]">Where genuine reviews guide smarter choices...</div>
                </div>
            </div>
            <div class="grid-cols-1 border border-red-800">
                <div class="rounded-[10px] shadow-md bg-white p-[20px]">
                    <!--slot-->
                    <div class="flex flex-col w-full">
                        <h3 class="text-[130%] text-primary mb-[50px] w-full text-center">Create an account</h3>
                        <form @submit.prevent="submitform(user)" class="flex flex-col gap-[30px]">
                            <FloatLabel> 
                              <InputText id="over_label" fluid v-model="user.name" /> 
                              <label class="text-[100%]" for="over_label">Full Name: </label> 
                            </FloatLabel>

                            <FloatLabel> 
                              <InputText id="over_label" fluid v-model="user.email" /> 
                              <label class="text-[100%]" for="over_label">Email Address: </label> 
                            </FloatLabel>

                            <FloatLabel> 
                              <InputText id="over_label" fluid v-model="user.naame" /> 
                              <label class="text-[100%]" for="over_label_pass">UserName: </label> 
                            </FloatLabel>
                            
                            <FloatLabel> 
                              <InputText id="over_label" fluid v-model="user.password" /> 
                              <label class="text-[100%]" for="over_label_pass">Password: </label> 
                            </FloatLabel>

                            <Button label="Sign Up with EchoHub" class="w-full bg-primary hover:opacity-20;text-secondary"/>
                        </form>
                        <div class="text-light mt-4 text-[13px] text-center">Already have an account?<NuxtLink to="/loginuser" class="text-primary">Log in</NuxtLink></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "default",
});
const user=ref({
    name: '',
    email: '',
    naame: '',
    password: ''
})

const submitform = (u: { name:string, email:string, naame:string, password:string}) => {
    console.log('Data:', u);
    // Add your form submission logic here
}
</script>