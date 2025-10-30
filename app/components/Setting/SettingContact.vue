<template>
  <div>
    <form class="px-6 py-5">
      <h1 class="text-[150%] text-contrast">Contact Information</h1>
      <InputTextCustom type="email" label="E-mail" />
      <InputTextCustom type="tel" label="Phone Number" />
      <InputSelect label="Preferred mode of contact" />
      <ButtonCustom label="Save changes" size="lg" primary="true"
        input-class="p-[10px] text-[15px] mt-4 w-auto" />
    </form>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>