<template>
  <div class="card">

    <div class="card-body px-3 py-1">
      <form class="px-6 py-5">
        <h1 class="text-[150%] text-contrast mb-4">Web Links</h1>
  
        <!-- Website Link -->
        <InputTextCustom type="url" label="Website link" />
  
        <!-- Social Media Links -->
        <div class="mt-7">
          <p>Social media links</p>
  
          <div class="mt-2 space-y-3">
            <div
              v-for="(link, index) in socialLinks"
              :key="index"
              class="md:grid grid-cols-2 gap-4 items-center"
            >
              <!-- Select Platform -->
              <InputSelect
                v-model="link.platform"
                label="Platform"
                inputClass="bg-secondaryLinen"
              >
                <option disabled value="">Select platform</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">X (Twitter)</option>
              </InputSelect>
  
              <!-- Input Link -->
              <InputTextCustom
                v-model="link.url"
                type="url"
                label="Link"
                placeholder="Enter link"
              />
            </div>
          </div>
  
          <!-- Add New Social Link -->
          <button
            type="button"
            @click="addSocialLink"
            class="text-link text-sm mt-3 hover:underline"
          >
            + Add another platform
          </button>
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
</template>

<script setup lang="ts">
import { ref } from "vue";

const socialLinks = ref([
  { platform: "", url: "" },
]);

function addSocialLink() {
  socialLinks.value.push({ platform: "", url: "" });
}
</script>

<style scoped>
</style>
