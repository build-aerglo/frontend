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
/* ---------- TYPES ---------- */
type SelectableItem = {
  id: string | number;
  name: string;
  checked: boolean;
};

/* ---------- PROPS ---------- */
const props = defineProps({
  business: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    required: true
  }
});

/* ---------- EMITS ---------- */
const emit = defineEmits<{
  (e: "update-section", payload: { key: string; value: any }): void;
}>();

/* ---------- LOCAL STATE (Editable copies) ---------- */
const localDescription = ref<string>(props.business.businessDescription ?? "");

const localHighlights = ref<SelectableItem[]>(
  JSON.parse(JSON.stringify(props.business.highlights ?? []))
);

const localTags = ref<SelectableItem[]>(
  JSON.parse(JSON.stringify(props.business.tags ?? []))
);

/* ---------- UI Editing Toggles ---------- */
const isEditingDescription = ref(false);
const isEditingHighlights = ref(false);
const isEditingTags = ref(false);

/* ---------- Watch for Parent Updates ---------- */
watch(
  () => props.business.businessDescription,
  (value) => {
    localDescription.value = value ?? "";
  }
);

watch(
  () => props.business.highlights,
  (value) => {
    localHighlights.value = JSON.parse(JSON.stringify(value ?? []));
  }
);

watch(
  () => props.business.tags,
  (value) => {
    localTags.value = JSON.parse(JSON.stringify(value ?? []));
  }
);

/* ---------- Computed Lists ---------- */
const checkedHighlights = computed(() =>
  localHighlights.value.filter((h: SelectableItem) => h.checked)
);

const checkedTags = computed(() =>
  localTags.value.filter((t: SelectableItem) => t.checked)
);

/* ---------- SAVE HANDLERS ---------- */
const saveDescription = () => {
  emit("update-section", {
    key: "businessDescription",
    value: localDescription.value
  });
  isEditingDescription.value = false;
};

const saveHighlights = () => {
  emit("update-section", {
    key: "highlights",
    value: checkedHighlights.value.map((h: SelectableItem) => h.name)
  });
  isEditingHighlights.value = false;
};

const saveTags = () => {
  emit("update-section", {
    key: "tags",
    value: checkedTags.value.map((t: SelectableItem) => t.name)
  });
  isEditingTags.value = false;
};
</script>

