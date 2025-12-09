<template>
  <div class="card bg-white rounded-lg shadow p-0">
    <div class="px-6 py-5">
      <h2 class="text-lg font-semibold text-gray-800 mb-3">Media Files (Gallery)</h2>
      <p class="text-sm text-gray-500 mb-4">
        Showcase your business with up to {{ maxMediaFiles }} additional images.
      </p>

      <div class="flex flex-wrap gap-4">
        <!-- MEDIA SLOT -->
        <div
          v-for="(url, index) in mediaPreviewsWithPlaceholders"
          :key="index"
          class="relative w-[200px] h-[200px] rounded-lg overflow-hidden cursor-pointer border border-gray-300 image-slot"
          @click="isEditing ? triggerFileInput('media', index) : null"
        >
          <img
            :src="url"
            :alt="`Media File ${index + 1}`"
            class="w-full h-full object-cover transition-opacity duration-300"
            :class="{ 'opacity-70': url.includes('placeholder') }"
          />

          <!-- Hover Overlay -->
          <div
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 flex items-center justify-center overlay"
            v-if="isEditing"
          >
            <i class="pi pi-camera text-white text-2xl"></i>
          </div>
        </div>

        <!-- HIDDEN FILE INPUT -->
        <input
          ref="mediaInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="(e) => handleFileChange(e)"
        />
      </div>
    </div>
  </div>

  <!-- SAVE BUTTON (only visible in edit mode) -->
  <ButtonCustom
    v-if="isEditing"
    label="Save Media Changes"
    size="lg"
    primary="true"
    input-class="p-[10px] text-[15px] mt-8 w-auto"
    @click="saveMediaChanges"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

/* ------------------ PROPS ------------------ */
const props = defineProps({
  media: {
    type: Array as () => string[],
    default: () => [],
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

/* ------------------ EMITS ------------------ */
const emit = defineEmits<{
  (e: "update-section", payload: { key: string; value: any }): void;
}>();

/* ------------------ STATE ------------------ */
const maxMediaFiles = 5;
const mediaInput = ref<HTMLInputElement | null>(null);
const mediaPreviews = ref<string[]>([]);

/* ------------------ WATCHERS ------------------ */
watch(
  () => props.media,
  (newVal) => {
    mediaPreviews.value = [...newVal];
  },
  { immediate: true }
);

/* ------------------ COMPUTED ------------------ */
const mediaPreviewsWithPlaceholders = computed(() => {
  const previews = [...mediaPreviews.value];
  const needed = maxMediaFiles - previews.length;

  for (let i = 0; i < needed; i++) {
    previews.push(`https://via.placeholder.com/200?text=Slot+${previews.length + 1}`);
  }

  return previews.slice(0, maxMediaFiles);
});

/* ------------------ METHODS ------------------ */
const triggerFileInput = (type: "media", index?: number) => {
  if (!props.isEditing) return;

  const input = mediaInput.value;
  if (!input) return;

  // If replacing an existing real image → single file mode
  if (
    typeof index === "number" &&
    !mediaPreviews.value[index]?.includes("placeholder")
  ) {
    input.multiple = false;
    (input as any).replaceIndex = index;
  } else {
    // Adding multiple images
    input.multiple = true;
    delete (input as any).replaceIndex;
  }

  input.click();
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files?.length) return;

  const replaceIndex = (input as any).replaceIndex;

  // Replace existing slot
  if (replaceIndex !== undefined) {
    const file = files[0];
    if (file) {
      mediaPreviews.value[replaceIndex] = URL.createObjectURL(file);
    }
  } else {
    // Add new images
    for (let i = 0; i < files.length; i++) {
      if (mediaPreviews.value.length >= maxMediaFiles) break;
      const file = files[i];
      if (file) {
        mediaPreviews.value.push(URL.createObjectURL(file));
      }
    }
  }

  input.value = "";
};

const saveMediaChanges = () => {
  const actualMedia = mediaPreviews.value.filter(
    (url) => !url.includes("placeholder")
  );

  emit("update-section", { key: "media", value: actualMedia });
};
</script>

<style scoped>
.overlay {
  opacity: 0;
}
.image-slot:hover .overlay {
  opacity: 1;
}
img[alt*="placeholder"] {
  filter: brightness(1.2);
}
</style>
