<template>
  <div class="card bg-white rounded-lg shadow p-0">
        <div class="px-6 py-5">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Media Files (Gallery)</h2>
          <p class="text-sm text-gray-500 mb-4">Showcase your business with up to {{ maxMediaFiles }} additional images.</p>

          <div class="flex flex-wrap gap-4">
            
            <div 
              v-for="(url, index) in mediaPreviewsWithPlaceholders" 
              :key="index"
              class="relative w-[200px] h-[200px] rounded-lg overflow-hidden cursor-pointer border border-gray-300 image-slot"
              @click="triggerFileInput('media', index)"
            >
              <img
                :src="url"
                :alt="`Media File ${index + 1}`"
                class="w-full h-full object-cover transition-opacity duration-300"
                :class="{ 'opacity-70': url.includes('placeholder') }"
              />

              <div 
                class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 flex items-center justify-center overlay"
              >
                <i class="pi pi-camera text-white text-2xl"></i>
              </div>
            </div>

            <input
                ref="mediaInput"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="(e) => handleFileChange(e, 'media')"
            />
          </div>
        </div>
      </div>

      <ButtonCustom
        label="Save Media Changes"
        size="lg"
        primary="true"
        input-class="p-[10px] text-[15px] mt-8 w-auto"
        @click="saveMediaChanges"
      />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'; 

/* ------------------ PROPS ------------------ */

const props = defineProps({
    /** Array of media URLs (strings) from the parent component. */
    media: {
        type: Array as () => string[],
        default: () => [],
    },
});

/* ------------------ EMITS ------------------ */

const emit = defineEmits<{
    (e: 'update', payload: { key: string; value: any }): void;
}>();


/* ------------------ LOCAL STATE ------------------ */

const maxMediaFiles = 5;
const logoInput = ref<HTMLInputElement | null>(null);
const logoPreviewUrl = ref<string | null>(null); 
const mediaInput = ref<HTMLInputElement | null>(null);

// 🚨 mediaPreviews is initialized as an empty array, it will be populated by the watch effect
const mediaPreviews = ref<string[]>([]); 


/* ------------------ WATCHERS ------------------ */

// 🚨 Watch for initial prop load and updates to set local state
watch(() => props.media, (newVal) => {
    // We use a shallow copy of the array to allow local manipulation
    mediaPreviews.value = [...newVal];
}, { immediate: true });


/* ------------------ COMPUTED PROPERTIES ------------------ */

// Combines actual media URLs with placeholders up to maxMediaFiles
const mediaPreviewsWithPlaceholders = computed(() => {
    const previews = [...mediaPreviews.value];
    const placeholdersNeeded = maxMediaFiles - previews.length;
    
    for (let i = 0; i < placeholdersNeeded; i++) {
        previews.push(`https://via.placeholder.com/200?text=Slot+${previews.length + 1}`);
    }
    
    return previews.slice(0, maxMediaFiles); 
});


/* ------------------ METHODS ------------------ */

// 🚨 Function to emit changes to the parent
const saveMediaChanges = () => {
    // We only want to send actual URLs, not placeholder URLs
    const cleanedMediaUrls = mediaPreviews.value.filter(url => 
        !url.includes('placeholder') && 
        url.trim() !== ''
    );

    // Emit the change to the parent component
    emit("update", { key: "media", value: cleanedMediaUrls });
};


const triggerFileInput = (type: 'logo' | 'media', index?: number) => {
    if (type === 'logo') {
        logoInput.value?.click();
    } else if (type === 'media') {
        // to determine single/multiple file input
        const inputElement = mediaInput.value;
        if (inputElement) {
            if (typeof index === 'number' && index < mediaPreviews.value.length && mediaPreviews.value[index]?.includes('placeholder') === false) {
                // Replacing an existing image
                inputElement.multiple = false;
                inputElement.dataset.replaceIndex = String(index);
            } else {
                // Adding to a placeholder slot
                inputElement.multiple = true;
                delete inputElement.dataset.replaceIndex;
            }
        }
        mediaInput.value?.click();
    }
};

const handleFileChange = (e: Event, type: 'logo' | 'media') => {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    if (type === 'logo') {
        const file = files[0];
        if (file) {
            logoPreviewUrl.value = URL.createObjectURL(file);
        }
    } else if (type === 'media') {
        const inputElement = e.target as HTMLInputElement;
        const replaceIndex = inputElement.dataset.replaceIndex;

        if (replaceIndex !== undefined) {
            // Replacing a specific image
            const file = files[0];
            if (file) {
                mediaPreviews.value[Number(replaceIndex)] = URL.createObjectURL(file);
            }
        } else {
            // Adding new images
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file && mediaPreviews.value.length < maxMediaFiles) {
                    mediaPreviews.value.push(URL.createObjectURL(file));
                }
            }
        }
    }
    
    (e.target as HTMLInputElement).value = '';
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