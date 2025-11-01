<template>
  <div class="flex flex-col gap-3">
    <div class="card">
      <div class="card-body px-3 py-1">
      
      <form class="px-6 py-5">
        <h1 class="text-[150%] text-contrast">Security</h1>
        <InputTextCustom type="password" label="Current Password" />
        <div class="md:grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <InputTextCustom type="password" label="New Password" v-model="newPassword" />
            <small v-if="newPassword.length > 0" class="text-red-500 text-sm mt-[-8px] block mb-2">
              Must be at least 8 characters with one uppercase letter.
            </small>
          </div>
          <InputTextCustom type="password" label="Confirm New Password" />
        </div>
        <ButtonCustom label="Update Password" size="lg" primary="true"
          input-class="p-[10px] text-[15px] mt-4 w-auto" />
      </form>
      </div>
  
    </div>
    <div class="card">
      <div class="card-body px-9 py-6">
        <h1 class="text-[150%] text-contrast mb-4">Preferences</h1>

        <div class="flex flex-col gap-4">
          <!-- Review Privacy Toggle -->
          <div class="flex justify-between items-center">
            <label class="text-contrast text-[15px]">Set reviews to private</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="isPrivateReview" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer
                peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:border-gray-300 after:border after:rounded-full
                after:h-5 after:w-5 after:transition-all
                peer-checked:bg-primary"
              ></div>
            </label>
          </div>

          <!-- DND Mode Toggle -->
          <div class="flex justify-between items-center">
            <label class="text-contrast text-[15px]">Set do not disturb mode</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="isDndMode" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer
                peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:border-gray-300 after:border after:rounded-full
                after:h-5 after:w-5 after:transition-all
                peer-checked:bg-primary"
              ></div>
            </label>
          </div>
        </div>

        <ButtonCustom
          label="Save Preferences"
          size="lg"
          primary="true"
          input-class="p-[10px] text-[15px] mt-5 w-auto"
        />
      </div>
    </div>

    <div class="card">
    <div class="card-body px-6 py-5">
      <h1 class="text-[150%] text-contrast mb-4">Deactivate account</h1>

      <!-- Warning Message -->
      <div class="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
        <h5 class="text-yellow-700 font-semibold mb-1">
          Are you sure you want to delete your account?
        </h5>
        <p class="text-yellow-700 text-sm">
          Once you delete your account, there is no going back. Please be certain.
        </p>
      </div>

      <!-- Deactivation Form -->
      <form @submit.prevent>
        <div class="flex items-center gap-2 mb-5">
          <input
            id="accountActivation"
            type="checkbox"
            v-model="confirmDeactivate"
            class="w-4 h-4 accent-red-600 cursor-pointer"
          />
          <label for="accountActivation" class="text-sm text-contrast">
            I confirm my account deactivation
          </label>
        </div>

        <ButtonCustom
          label="Deactivate Account"
          size="lg"
          :primary="true"
          :disabled="!confirmDeactivate"
          input-class="p-[10px] text-[15px] mt-2 w-auto !bg-red-600 text-white hover:!bg-red-700 disabled:!bg-red-300"
        />
      </form>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
const newPassword = ref("");
const isPrivateReview = ref(false);
const isDndMode = ref(false);
const confirmDeactivate = ref(false);
</script>

<style scoped>

</style>