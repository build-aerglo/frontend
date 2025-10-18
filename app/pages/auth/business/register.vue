<template>
  <div class="min-h-screen bg-secondaryLinen text-contrast">
    <div class="p-5">
      <NuxtLink to="/" class="text-[150%] text-primary p-6 font-bold"><img src="../../../assets/logo/echohub-high-resolution-logo-transparent-blue.png" alt="EchoHub logo" class="fixed top-0 left-0 m-5 max-w-[120px] h-auto"></NuxtLink>
    </div>
    <div class="flex flex-col sm:flex-row justify-center items-center sm:max-w-[80%] mx-auto gap-[40px] sm:gap-[50px] p-4 mt-3">
      <div class="w-full sm:w-[60%] flex-col">
        <img src="../../../assets/images/13818783_5358802.jpg" alt="" class="">
        <h2 class="text-primary text-[250%] sm:text-[290%]">Engage More Users. Capture Every Insight. Elevate Your Business.</h2>
        <P class="text-[130%] sm:text-[150%]">Easily collect and display verified reviews. Monitor performance, respond instantly, and build trust that keeps customers coming back.</P>
        <Rating v-model="value" :stars="5" readonly />
      </div> 
      <div class="bg-white rounded-lg w-full sm:w-[40%] p-10 shadow-md">
        <h2 class="text-[200%] mb-3 text-center text-contrast">Register Your Business</h2>
        <form @submit.prevent="submitForm">
          <InputTextCustom
          v-model="businessRegistrationForm.userName"
          label="User Name"
          :required="true"
          icon="pi pi-user"
          />

          <InputTextCustom
          v-model="businessRegistrationForm.email"
          label="Business/Non-business email"
          type="email"
          :required="true"
          icon="pi pi-envelope"
          />

          <InputTextCustom
          v-model="businessRegistrationForm.phoneNum"
          label="Business Phone number"
          :required="true"
          icon="pi pi-phone"
          />

          <InputTextCustom
          v-model="businessRegistrationForm.address"
          label="Business Address"
          :required="true"
          icon="pi pi-map-marker"
          />

          <InputTextCustom
          v-model="businessRegistrationForm.password"
          label="Password"
          type="password"
          :required="true"
          icon="pi pi-lock"
          />
          <ButtonCustom
            type="submit" 
            label="Register Business" 
            primary="true"
          />
        </form>
        <div class="flex gap-[10px] mt-3 text-[130%]">
          <p>Already have an account?</p>
          <NuxtLink to="../business/login" class="text-accent hover:underline">Log in</NuxtLink>
        </div>
        
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
const businessRegistrationForm = ref({
  userName: '',
  email: '',
  phoneNum: '',
  address: '',
  password: '',
  userType: ''
})
const value = ref(5);
const submitForm = () => {
  alert('You are Registered!')
  
}

</script>

<style scoped>

</style>