<template>
  <div>
  
  <form class="px-6 py-5">
    <h1 class="text-[150%] text-contrast">Security</h1>
    <InputTextCustom type="password" label="Current Password" />
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-1">
        <InputTextCustom type="password" label="New Password" v-model="newPassword" />
        <small v-if="newPassword.length > 0" class="text-red-500 text-sm mt-[-8px] block mb-2">
          Must be at least 8 characters with one uppercase letter.
        </small>
      </div>
      <InputTextCustom type="password" label="Confirm New Password" />
    </div>
    <ButtonCustom label="Save changes" size="lg" primary="true"
      input-class="p-[10px] text-[15px] mt-4 w-auto" />
  </form>
  </div>
</template>

<script setup lang="ts">
const newPassword = ref('')
</script>

<style scoped>

</style>