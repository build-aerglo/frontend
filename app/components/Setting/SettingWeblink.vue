<template>
  <div>
    <form class="px-6 py-5">
      <h1 class="text-[150%] text-contrast mb-4">Web Links</h1>

      <InputTextCustom type="url" label="Website link" />
      
      <div class="mt-7">
        <p>Social media links</p>
        <div class="md:grid grid-cols-2 gap-4 mt-1">
          <InputTextCustom type="url">
            <template #label>
              <i class="pi pi-whatsapp text-green-500"></i> WhatsApp
            </template>
          </InputTextCustom>
  
          <InputTextCustom type="url">
            <template #label>
              <i class="pi pi-instagram text-pink-500"></i> Instagram
            </template>
          </InputTextCustom>
  
          <InputTextCustom type="url">
            <template #label>
              <i class="pi pi-tiktok text-black"></i> TikTok
            </template>
          </InputTextCustom>
  
          <InputTextCustom type="url">
            <template #label>
              <i class="pi pi-twitter text-sky-500"></i> X (Twitter)
            </template>
          </InputTextCustom>
        </div>
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