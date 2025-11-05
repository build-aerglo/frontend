<template>
  <div class="flex flex-col gap-3">
    <div class="card">
      <div class="card-body px-3 py-1">
  
        <form class="px-6 py-5">
          <h1 class="text-[150%] text-contrast">Business Profile</h1>
          
          <div class="md:grid grid-cols-2 gap-2">
            <InputTextCustom type="text" label="Business Name" />
            <InputSelect label="Business Sector" />
          </div>
          
          <!-- <h2 class="text-lg font-semibold mt-4 mb-2 text-gray-700">Business Address</h2> -->
          
          <div class="md:grid grid-cols-2 gap-2">
            <InputTextCustom type="text" label="Street Address" />
            <InputTextCustom type="text" label="City/Town" />
          </div>
          
          <div class="md:grid grid-cols-2 gap-2">
            <InputSelect label="Local Government Area" />
            <InputSelect label="State" />
          </div>
          
          <InputTextAreaCustom 
            label="Business Description" 
            maxlength="150" 
            class="mt-4"
          />
          
          <!-- <h2 class="text-lg font-semibold mt-4 mb-2 text-gray-700">Opening Hours</h2> -->
          
          <div class="md:grid grid-cols-2 gap-2">
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
    </div>
  
    <div class="card">
      <div class="card-body px-3 py-1">
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
  </div>
</div>
</template>

<script setup lang="ts">
const selectedContactModes = ref([]);
</script>

<style scoped>

</style>