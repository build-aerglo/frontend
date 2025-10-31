<template>
  <div>
  
    <form class="px-6 py-5">
      <h1 class="text-[150%] text-contrast">Business Profile</h1>
      
      <div class="grid grid-cols-2 gap-2">
        <InputTextCustom type="text" label="Business name" />
        <InputSelect label="Business Sector" />
      </div>
      
      <!-- <h2 class="text-lg font-semibold mt-4 mb-2 text-gray-700">Business Address</h2> -->
      
      <div class="grid grid-cols-2 gap-2">
        <InputTextCustom type="text" label="Street Address" />
        <InputTextCustom type="text" label="City/Town" />
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <InputSelect label="Local Government Area" />
        <InputSelect label="State" />
      </div>
      
      <InputTextAreaCustom 
        label="Business description" 
        maxlength="150" 
        class="mt-4"
      />
      
      <!-- <h2 class="text-lg font-semibold mt-4 mb-2 text-gray-700">Opening Hours</h2> -->
      
      <div class="grid grid-cols-2 gap-2">
        <InputSelect label="Opening Days" />
        <InputSelect label="Opening Time" />
      </div>
      
      <ButtonCustom 
        label="Save changes" 
        size="lg" 
        primary="true"
        input-class="p-[10px] text-[15px] mt-4 w-auto" 
      />
    </form>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>