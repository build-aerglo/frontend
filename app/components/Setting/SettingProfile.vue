<template>
  <div>
  
    <form class="px-6 py-5">
      <h1 class="text-[150%] text-contrast">Business Profile</h1>
      <InputTextCustom type="text" label="Business name" />
      <InputTextAreaCustom rows="4" label="Business address" />
      <InputTextAreaCustom rows="4" label="Business description" />
      <InputSelect label="Business Sector" />
      <InputSelect label="Opening days and time" />
      <ButtonCustom label="Save changes" size="lg" primary="true"
        input-class="p-[10px] text-[15px] mt-4 w-auto" />
    </form>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>