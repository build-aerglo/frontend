<template>
  <div class="flex flex-col gap-4">
    
    <!-- DESCRIPTION -->
    <div class="card p-6 relative">
      
      <div class="absolute top-4 right-5 z-10">
        <button 
          v-if="!isEditingDescription"
          @click="isEditingDescription = true"
          class="text-gray-500 hover:!text-primary transition-colors p-2 rounded-full"
        >
          <i class="pi pi-pencil text-lg"></i>
        </button>

        <ButtonCustom 
          v-else
          :primary="true"
          @click="saveDescription"
          label="Save changes"
        />
      </div>

      <div class="py-4">
        <ProfileField
          rows="3"
          v-model="localDescription"
          placeholder="Enter a detailed description of your business..."
          :is-editing="isEditingDescription"
          inputType="textarea"
          :class="{ 'mt-6': isEditingDescription }"
        />
      </div>
    </div>

    <!-- HIGHLIGHTS -->
    <div class="card p-6 relative bg-white rounded-lg shadow">
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold text-contrast">Highlights</h2>

        <div class="z-10">
          <button 
            v-if="!isEditingHighlights"
            @click="isEditingHighlights = true"
            class="text-gray-500 hover:!text-primary transition-colors p-2 rounded-full"
          >
            <i class="pi pi-pencil text-lg"></i>
          </button>

          <ButtonCustom 
            v-else
            @click="saveHighlights"
            :primary="true"
            label="Save Changes"
          />
        </div>
      </div>

      <div class="pt-2">
        <!-- EDIT MODE -->
        <div v-if="isEditingHighlights" class="grid grid-cols-2 gap-x-6 gap-y-2">
          <div 
            v-for="h in localHighlights"
            :key="h.id"
            @click="h.checked = !h.checked"
            class="flex items-center cursor-pointer text-gray-800 hover:text-primary transition-colors"
          >
            <div 
              :class="h.checked ? '!bg-primary !border-primary' : 'bg-white border-gray-400'"
              class="w-5 h-5 border-2 rounded-full flex items-center justify-center mr-3 transition-colors duration-200"
            >
              <i v-if="h.checked" class="pi pi-check text-white text-xs"></i>
            </div>
            <span class="text-sm font-medium">{{ h.name }}</span>
          </div>
        </div>

        <!-- VIEW MODE -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <span 
            v-for="h in checkedHighlights"
            :key="h.id"
            class="text-contrast text-sm font-medium px-3 py-1 flex items-center"
          >
            <i class="pi pi-check text-green-500 text-xs mr-2"></i>
            {{ h.name }}
          </span>

          <p v-if="checkedHighlights.length === 0" class="text-gray-500 text-sm italic">
            No features highlighted yet.
          </p>
        </div>
      </div>
    </div>

    <!-- TAGS -->
    <div class="card p-6 relative bg-white rounded-lg shadow">

      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold text-contrast">Tags</h2>

        <div class="z-10">
          <button 
            v-if="!isEditingTags"
            @click="isEditingTags = true"
            class="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full"
          >
            <i class="pi pi-pencil text-lg"></i>
          </button>

          <ButtonCustom 
            v-else
            @click="saveTags"
            :primary="true"
            label="Save Changes"
          />
        </div>
      </div>

      <div class="pt-1">

        <!-- EDIT MODE -->
        <div v-if="isEditingTags" class="flex flex-wrap gap-2 pb-2">
          <span 
            v-for="tag in localTags"
            :key="tag.id"
            @click="tag.checked = !tag.checked"
            class="text-sm font-medium px-4 py-2 rounded-full cursor-pointer flex-shrink-0 transition-colors duration-200"
            :class="tag.checked 
              ? '!bg-primary text-white border !border-primary' 
              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'"
          >
            {{ tag.name }}
          </span>
        </div>

        <!-- VIEW MODE -->
        <div v-else class="flex flex-wrap gap-1">
          <span 
            v-for="tag in checkedTags"
            :key="tag.id"
            class="bg-green-50 text-green-600 text-sm font-medium px-3 rounded-full"
          >
            {{ tag.name }}
          </span>

          <p v-if="checkedTags.length === 0" class="text-gray-500 text-sm italic">
            No tags set yet.
          </p>
        </div>

      </div>
    </div>

    <ProfileReview :limit="3" :showHeader="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'; // Import watch for reactivity feedback

/* ------------------ PROPS FROM PARENT ------------------ */
const props = defineProps({
  description: String,
  highlights: {
    type: Array as () => { id: string | number; name: string; checked: boolean }[],
    default: () => [],
  },
  tags: {
    type: Array as () => { id: string | number; name: string; checked: boolean }[],
    default: () => [],
  },
});

/* Emits to notify parent */
const emit = defineEmits<{
  (e: 'update', payload: { key: string; value: any }): void;
}>();

/* Local copies for edit mode */
const localDescription = ref(props.description ?? "");
const localHighlights = ref(JSON.parse(JSON.stringify(props.highlights)));
const localTags = ref(JSON.parse(JSON.stringify(props.tags)));

const isEditingDescription = ref(false);
const isEditingHighlights = ref(false);
const isEditingTags = ref(false);

// Watch for prop changes from the parent to update local state (e.g., after initial load or saving)
watch(() => props.description, (newVal) => {
    localDescription.value = newVal ?? "";
});

watch(() => props.highlights, (newVal) => {
    // Only deep copy if the content changes substantially, for simplicity, we copy everything
    localHighlights.value = JSON.parse(JSON.stringify(newVal));
});

watch(() => props.tags, (newVal) => {
    localTags.value = JSON.parse(JSON.stringify(newVal));
});


/* Computed for view mode */
const checkedHighlights = computed(() => {
  return localHighlights.value.filter(
    (h: { id: string | number; name: string; checked: boolean }) => h.checked
  );
});

const checkedTags = computed(() => {
  return localTags.value.filter(
    (t: { id: string | number; name: string; checked: boolean }) => t.checked
  );
});

/* 🚨 SAVING FUNCTIONS: Emit a generic 'update' event to the parent */

const saveDescription = () => {
  // Key name must match the property in business.value (businessDescription)
  emit("update", { key: "businessDescription", value: localDescription.value });
  isEditingDescription.value = false;
};

const saveHighlights = () => {
  // Extract only the names of the checked highlights for the API payload
  const checkedNames = checkedHighlights.value.map((h: { id: string | number; name: string; checked: boolean }) => h.name);
  emit("update", { key: "highlights", value: checkedNames });
  isEditingHighlights.value = false;
};

const saveTags = () => {
  // Extract only the names of the checked tags for the API payload
  const checkedNames = checkedTags.value.map((t: { id: string | number; name: string; checked: boolean }) => t.name);
  emit("update", { key: "tags", value: checkedNames });
  isEditingTags.value = false;
};
</script>
