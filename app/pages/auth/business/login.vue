<template>
  <div class="min-h-screen bg-secondaryLinen text-contrast">
    <div class="p-6">
      <NuxtLink to="/" class="text-[150%] text-primary font-bold">LOGO</NuxtLink>
    </div>
    <div class="flex flex-col sm:flex-row justify-center items-center sm:max-w-[80%] mx-auto gap-[40px] sm:gap-[50px] p-6 mt-5">
      <div class="w-full sm:w-[60%]">
        <h2 class="text-primary text-[250%] sm:text-[290%] mb-3">Engage More Users. Capture Every Insight. Elevate Your Business.</h2>
        <P class="text-[130%] sm:text-[150%] text-contrast">Build trust and attract customers with authentic reviews that matter</P>
      </div> 
      <div class="bg-white rounded-md w-full sm:w-[40%] p-10 shadow-md">
        <h2 class="text-[200%] mb-3 text-center text-contrast">Login to your account</h2>
        <form @submit.prevent="submitForm">
          <InputTextCustom
          v-model="businessLoginForm.email"
          label="Business/Non-business email"
          type="email"
          placeholder="Enter an accessible Email"
          :required="true"
          />


          <InputTextCustom
          v-model="businessLoginForm.password"
          label="Password"
          type="password"
          placeholder="Create a unique password"
          :required="true"
          />
          <ButtonCustom
            type="submit" 
            label="Log in to your account" 
            primary="true"
          />
        </form>
        <div class="flex gap-[10px] mt-3 text-[130%]">
          <p>Don't  have an account?</p>
          <NuxtLink to="../business/register" class="text-accent hover:underline">Register your business</NuxtLink>
        </div>
        
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
const businessLoginForm = ref({
  email: '',
  password: '',
  userType: ''
})

const submitForm = () => {
  alert('You are Registered!')
  
}

</script>

<style scoped>

</style>