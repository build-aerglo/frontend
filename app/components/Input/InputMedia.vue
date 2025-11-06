<template>
  <div class="w-full">
    <label v-if="label" class="block mb-1 text-gray-700 font-medium text-sm">
      {{ label }}
    </label>

    <!-- Input wrapper -->
    <div
      class="relative bg-secondaryLinen flex items-center border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-primary transition-colors"
      @click="triggerFileInput"
    >
      <i class="pi pi-image text-gray-500 mr-2 text-lg"></i>

      <span
        class="text-gray-500 text-sm truncate"
        :class="{ 'text-gray-900': hasFile }"
      >
        {{ fileName }}
      </span>

      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        class="hidden"
        @change="handleFileChange"
      />
    </div>

    <!-- Preview for multiple images -->
    <div
      v-if="multiple && previewUrls.length"
      class="mt-2 flex flex-wrap gap-2"
    >
      <div
        v-for="(url, index) in previewUrls"
        :key="index"
        class="relative w-16 h-16"
      >
        <img
          :src="url"
          alt="preview"
          class="w-full h-full object-cover rounded-md border"
        />

        <button
          type="button"
          @click.stop="removeImage(index)"
          class="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1 hover:bg-gray-100 transition"
        >
          <i class="pi pi-times text-xs text-gray-700"></i>
        </button>
      </div>
    </div>

    <!-- Preview for single image -->
    <div v-else-if="!multiple && previewUrls.length" class="mt-2 relative w-20 h-20">
      <img
        :src="previewUrls[0]"
        alt="preview"
        class="w-full h-full object-cover rounded-md border"
      />

      <button
        type="button"
        @click.stop="removeImage(0)"
        class="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1 hover:bg-gray-100 transition"
      >
        <i class="pi pi-times text-xs text-gray-700"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  label: String,
  multiple: Boolean,
  accept: {
    type: String,
    default: "image/*",
  },
  max: {
    type: Number,
    default: 5, // only used if multiple
  },
});

const fileInput = ref(null);
const files = ref([]);
const previewUrls = ref([]);

const hasFile = computed(() => files.value.length > 0);
const fileName = computed(() => {
  if (!hasFile.value) return "Choose image" + (props.multiple ? "s" : "");
  if (props.multiple) return `${files.value.length} file(s) selected`;
  return files.value[0]?.name || "Choose file";
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files || []);

  // Limit total files to props.max
  if (props.multiple) {
    const combined = [...files.value, ...selectedFiles].slice(0, props.max);
    files.value = combined;
  } else {
    files.value = selectedFiles.slice(0, 1);
  }

  previewUrls.value = files.value.map((file) => URL.createObjectURL(file));
};

const removeImage = (index) => {
  files.value.splice(index, 1);
  previewUrls.value.splice(index, 1);
  fileInput.value.value = "";
};
</script>

