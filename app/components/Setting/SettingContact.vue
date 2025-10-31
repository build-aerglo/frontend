<template>
  <div>
    <form class="px-6 py-5">
      <h1 class="text-[150%] text-contrast">Contact Information</h1>
      
      <div class="md:grid grid-cols-2 gap-2">
        <InputTextCustom type="email" label="Business E-mail" />
        <InputTextCustom type="tel" label="Phone Number" />
      </div>
      
      <div class="mt-4">
        <label class="block font-medium text-gray-700 mb-2">
          Preferred modes of contact (Select all that apply)
        </label>
  
        <div class="flex flex-wrap gap-x-8 gap-y-4 items-center p-3">
          
          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              :id="'modeEmail'" 
              name="contactMode" 
              :value="'Email'"
              class="form-check-input" 
              v-model="selectedContactModes"
            />
            <label :for="'modeEmail'" class="text-gray-900 flex items-center space-x-1 cursor-pointer">
              <i class="pi pi-envelope text-lg text-blue-500"></i>
              <span>Email</span>
            </label>
          </div>
  
          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              :id="'modeSms'" 
              name="contactMode" 
              :value="'SMS'" 
              class="form-check-input"
              v-model="selectedContactModes"
            />
            <label :for="'modeSms'" class="text-gray-900 flex items-center space-x-1 cursor-pointer">
              <i class="pi pi-mobile text-lg text-purple-500"></i>
              <span>SMS</span>
            </label>
          </div>
  
          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              :id="'modeWhatsapp'" 
              name="contactMode" 
              :value="'Whatsapp'" 
              class="form-check-input"
              v-model="selectedContactModes"
            />
            <label :for="'modeWhatsapp'" class="text-gray-900 flex items-center space-x-1 cursor-pointer">
              <i class="pi pi-whatsapp text-lg text-green-500"></i>
              <span>Whatsapp</span>
            </label>
          </div>
          
        </div>
      </div>
      
      <ButtonCustom label="Save changes" size="lg" primary="true"
        input-class="p-[10px] text-[15px] mt-4 w-auto" 
      />
    </form>
  </div>
</template>

<script setup>
const selectedContactModes = ref([]);
</script>