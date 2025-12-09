<template>
  <div class="flex flex-col gap-4">

    <!-- DESCRIPTION -->
    <div class="card p-6 relative">

      <div class="absolute top-4 right-5 z-10">
        <button v-if="!isEditingDescription" @click="isEditingDescription = true"
          class="text-gray-500 hover:!text-primary transition-colors p-2 rounded-full">
          <i class="pi pi-pencil text-lg"></i>
        </button>

        <ButtonCustom v-else :primary="true" @click="saveDescription" label="Save changes" />
      </div>

      <div class="py-4">
        <ProfileField rows="3" v-model="localDescription" placeholder="Enter a detailed description of your business..."
          :is-editing="isEditingDescription" inputType="textarea" :class="{ 'mt-6': isEditingDescription }" />
      </div>
    </div>

    <!-- HIGHLIGHTS -->
    <div class="card p-6 relative bg-white rounded-lg shadow">
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold text-contrast">Highlights</h2>

        <div class="z-10">
          <button v-if="!isEditingHighlights" @click="isEditingHighlights = true"
            class="text-gray-500 hover:!text-primary transition-colors p-2 rounded-full">
            <i class="pi pi-pencil text-lg"></i>
          </button>

          <ButtonCustom v-else @click="saveHighlights" :primary="true" label="Save Changes" />
        </div>
      </div>

      <div class="pt-2">
        <!-- EDIT MODE -->
        <div v-if="isEditingHighlights">
          <AutoComplete v-model="localHighlights" :typeahead="false" class="mt-2.5" multiple fluid />
          <small>Press "Enter" to select a highlight</small>
        </div>

        <!-- VIEW MODE -->
        <div v-else>
          <Chip v-for="(i, idx) in localHighlights" :key="idx" :label="i" />

          <p v-if="checkedHighlights" class="text-gray-500 text-sm italic">
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
          <button v-if="!isEditingTags" @click="isEditingTags = true"
            class="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full">
            <i class="pi pi-pencil text-lg"></i>
          </button>

          <ButtonCustom v-else @click="saveTags" :primary="true" label="Save Changes" />
        </div>
      </div>

      <div class="pt-1">


        <div v-if="isEditingTags">
          <AutoComplete v-model="localTags" forceSelection :suggestions="tagsContants" class="mt-2.5" multiple fluid />
          <small>Press "Enter" to select a tag</small>
        </div>

        <!-- VIEW MODE -->
        <div v-else>
          <Chip v-for="(i, idx) in localTags" :key="idx" :label="i" />

          <p v-if="checkedTags" class="text-gray-500 text-sm italic">
            No tags set yet.
          </p>
        </div>

      </div>
    </div>

    <ProfileReview :limit="3" :showHeader="true" />
  </div>
</template>

<script setup lang="ts">
import { tagsContants } from '../../utils';
const items = ref([]);
const search = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      localTags.value = [...tagsContants];
    } else {
      localTags.value = tagsContants.filter((country) => {
        return country.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
}


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

const localHighlights = ref(
  JSON.parse(JSON.stringify(props.business.highlights ?? []))
);

const localTags = ref(
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
  // localHighlights.value.filter((h: SelectableItem) => h.checked)
  localHighlights.value.length <= 0
);

const checkedTags = computed(() =>
  localTags.value.length <= 0
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
    value: localHighlights.value
  });
  isEditingHighlights.value = false;
};

const saveTags = () => {
  emit("update-section", {
    key: "tags",
    value: localTags.value
  });
  isEditingTags.value = false;
};
</script>
