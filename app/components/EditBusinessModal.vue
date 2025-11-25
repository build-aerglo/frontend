<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 space-y-6">

      <h2 class="text-2xl font-bold text-center text-gray-800">
        Edit Business Profile
      </h2>

      <!-- Upload Image -->
      <div>
        <label class="block text-sm font-medium mb-1">Business Image</label>
        <input type="file" @change="onFileChange" class="border rounded px-3 py-2 w-full" />

        <img v-if="previewImage" :src="previewImage" class="mt-3 h-32 w-full object-cover rounded-lg shadow" />
      </div>

      <!-- Name -->
      <div>
        <label class="block text-sm font-medium mb-1">Business Name</label>
        <input v-model="tempData.name" class="border px-3 py-2 rounded w-full" />
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium mb-1">Category</label>
        <input v-model="tempData.category" class="border px-3 py-2 rounded w-full" />
      </div>

      <!-- Address -->
      <div>
        <label class="block text-sm font-medium mb-1">Address</label>
        <textarea v-model="tempData.address" class="border px-3 py-2 rounded w-full"></textarea>
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-sm font-medium mb-1">Phone Number</label>
        <input v-model="tempData.phone" class="border px-3 py-2 rounded w-full" />
      </div>

      <!-- Website -->
      <div>
        <label class="block text-sm font-medium mb-1">Website</label>
        <input v-model="tempData.website" class="border px-3 py-2 rounded w-full" />
      </div>

      <!-- Hours -->
      <div>
        <label class="block text-sm font-medium mb-1">Opening Hours</label>
        <input v-model="tempData.hours" class="border px-3 py-2 rounded w-full" />
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-4">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button 
          @click="save"
          class="px-4 py-2 bg-[#008253] text-white rounded-lg hover:bg-[#006f47]"
        >
          Save Changes
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  data: Object
});

const emit = defineEmits(["close", "save"]);

const tempData = reactive({ ...props.data });
const previewImage = ref(null);
const selectedFile = ref(null);

const onFileChange = (e) => {
  selectedFile.value = e.target.files[0];
  previewImage.value = URL.createObjectURL(selectedFile.value);
};

const save = () => {
  emit("save", { ...tempData, imageFile: selectedFile.value });
};
</script>
