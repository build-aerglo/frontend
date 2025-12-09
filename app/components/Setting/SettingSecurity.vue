<template>
  <div class="flex flex-col gap-3">
    <div class="card">
      <div class="card-body px-3 py-1">
        <form class="px-6 py-5">
          <h1 class="text-[150%] text-contrast">Security</h1>
          <InputTextCustom type="password" label="Current Password" :disabled="!isEditing" />
          <div class="md:grid grid-cols-2 gap-2">
            <div class="flex flex-col gap-1">
              <InputTextCustom type="password" label="New Password" v-model="newPassword" :disabled="!isEditing" />
              <small v-if="newPassword.length > 0" class="text-red-500 text-sm mt-[-8px] block mb-2">
                Must be at least 8 characters with one uppercase letter.
              </small>
            </div>
            <InputTextCustom type="password" label="Confirm New Password" :disabled="!isEditing" />
          </div>
          <ButtonCustom
            label="Update Password"
            size="lg"
            primary="true"
            input-class="p-[10px] text-[15px] mt-4 w-auto"
            :disabled="!isEditing"
          />
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-body px-9 py-6">
        <h1 class="text-[150%] text-contrast mb-4">Preferences</h1>

        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center md:w-[50%]" v-for="(item, index) in preferenceToggles" :key="index">
            <label class="text-contrast text-[15px]">{{ item.label }}</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="item.model"
                class="sr-only peer"
                :disabled="!isEditing"
              />
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

        <div class="mt-4 flex justify-between items-center w-full sm:w-[51%]">
    
          <label class=" font-medium text-contrast flex items-center">
              Contact mode
          </label>
          
          <div class="flex items-center gap-x-8"> 
              <div 
                  class="flex items-center space-x-2" 
                  v-for="mode in contactModes" 
                  :key="mode"
              >
                  <input
                      type="checkbox"
                      :id="mode"
                      :value="mode"
                      v-model="selectedContactModes"
                      :disabled="!isEditing"
                  />
                  <label :for="mode" class="text-gray-900 flex items-center space-x-1 cursor-pointer">
                      <span>{{ mode }}</span>
                  </label>
              </div>
          </div>
        </div>
        <ButtonCustom
          label="Save Preferences"
          size="lg"
          primary="true"
          input-class="p-[10px] text-[15px] mt-5 w-auto"
          :disabled="!isEditing"
          @click="savePreferences"
        />
      </div>
    </div>

    <div class="card">
      <div class="card-body px-6 py-5">
        <h1 class="text-[150%] text-contrast mb-4">ID verification</h1>
        <div class="md:grid grid-cols-2 gap-2">
          <InputTextCustom label="CAC ID Number" :disabled="!isEditing" />
          <InputTextCustom label="TIN" :disabled="!isEditing" />
        </div>
        <div class="md:grid grid-cols-2 gap-2">
          <InputSelect label="Other ID" :disabled="!isEditing" />
          <div class="flex flex-col gap-1">
            <InputMedia label="ID Image" />
          </div>
        </div>
         <ButtonCustom
          label="Save changes"
          size="lg"
          primary="true"
          input-class="p-[10px] text-[15px] mt-5 w-auto"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <div class="card">
      <div class="card-body px-6 py-5">
        <h1 class="text-[150%] text-contrast mb-4">Deactivate account</h1>
        <div class="mb-6 bg-yellow-50 border-l-4 border-gold p-4 rounded-md">
          <h5 class="text-yellow-700 font-semibold mb-1">
            Are you sure you want to delete your account?
          </h5>
          <p class="text-yellow-700 text-sm">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
        <form @submit.prevent>
          <div class="flex items-center gap-2 mb-5">
            <input
              id="accountActivation"
              type="checkbox"
              v-model="confirmDeactivate"
              class="w-4 h-4 accent-red-600 cursor-pointer"
              :disabled="!isEditing"
            />
            <label for="accountActivation" class="text-sm text-contrast">
              I confirm my account deactivation
            </label>
          </div>
          <ButtonCustom
            label="Deactivate Account"
            size="lg"
            :primary="true"
            :disabled="!confirmDeactivate || !isEditing"
            input-class="p-[10px] text-[15px] mt-2 w-auto !bg-red-600 text-white hover:!bg-red-700 disabled:!bg-red-300"
          />
        </form>
      </div>
    </div>
    <button @click="logout">logout</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isEditing: Boolean
})
import type { BusinessPreference } from "~/types/business";
import useBusinessMethods from '~/composables/business/useBusinessMethods';
import useBusinessUser from '~/composables/business/useBusinessUser';
const { saveBusinessPreferences } = useBusinessMethods(); 
const store = useBusinessUser();
const newPassword = ref("");
const isPrivateReview = ref(false);
const isDndMode = ref(false);
const confirmDeactivate = ref(false);
const selectedContactModes = ref([]);
const contactModes = ["Email", "SMS", "Whatsapp"];
const preferenceToggles = [
  { label: "Private Reviews", model: isPrivateReview },
  { label: "Do Not Disturb", model: isDndMode },
  { label: "Dark Mode", model: isDndMode },
];
const preferences = ref<BusinessPreference>({
  reviewsPrivate: isPrivateReview.value,
  dndModeEnabled: isDndMode.value,
  dndModeDurationHours: null, // you will later expand this when backend adds it
})
  
const logout = () => {
  store.clearUser()
}
const savePreferences = async () => {
  try {
    const businessId = store.userData?.business?.businessId;

    if (!businessId) {
      console.error("Business ID missing!");
      return;
    }

    await saveBusinessPreferences(businessId, preferences.value);

    alert("Preferences updated successfully!");
  } catch (error) {
    alert("Failed to update preferences.");
  }
};

</script>
