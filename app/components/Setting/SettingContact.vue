<template>
  <div class="card">
    <div class="card-body px-3 py-1">

      <form class="px-6 py-5">
        <h1 class="text-[150%] text-contrast">Contact Information</h1>
        
        <div class="md:grid grid-cols-2 gap-2">
          <InputTextCustom type="email" label="Business E-mail" />
          <InputTextCustom type="tel" label="Phone Number" />
        </div>
        
        
        
        <ButtonCustom label="Save changes" size="lg" primary="true"
          input-class="p-[10px] text-[15px] mt-4 w-auto" 
        />
      </form>
    </div>
  </div>
</template>

<script setup>

</script>