<template>
  <div class="flex flex-col gap-4">
    
    <div class="card p-6 relative">
      
      <div class="absolute top-4 right-5 z-10">
        <button 
          v-if="!isEditingDescription"
          @click="toggleEditDescription"
          class="text-gray-500 hover:!text-primary transition-colors p-2 rounded-full"
        >
          <i class="pi pi-pencil text-lg"></i>
        </button>

        <ButtonCustom 
          v-else
          :primary="true"
          @click="saveChangesDescription"
          label="Save changes"
        />
          
      </div>

      <div class="py-4">
        <ProfileField
          rows="3"
          v-model="description"
          placeholder="Enter a detailed description of your business..."
          :is-editing="isEditingDescription"
          inputType="textarea" 
          :class="{ 'mt-6': isEditingDescription }" 
        />
      </div>
    </div>
    
    
    <div class="card p-6 relative bg-white rounded-lg shadow">
      
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold text-contrast">Highlights</h2>
        
        <div class="z-10">
            <button 
                v-if="!isEditingHighlights"
                @click="toggleEditHighlights"
                class="text-gray-500 hover:!text-primary transition-colors p-2 rounded-full"
            >
                <i class="pi pi-pencil text-lg"></i>
            </button>

            <ButtonCustom 
                v-else
                @click="saveChangesHighlights"
                :primary="true"
                label="Save Changes"
            />
           
        </div>
      </div>

      <div class="pt-2">

        <div v-if="isEditingHighlights" class="grid grid-cols-2 gap-x-6 gap-y-2">
          <div 
            v-for="highlight in highlights" 
            :key="highlight.id" 
            @click="highlight.checked = !highlight.checked"
            class="flex items-center cursor-pointer text-gray-800 hover:text-primary transition-colors"
          >
            <div 
              :class="highlight.checked ? '!bg-primary !border-primary' : 'bg-white border-gray-400'"
              class="w-5 h-5 border-2 rounded-full flex items-center justify-center mr-3 transition-colors duration-200"
            >
              <i v-if="highlight.checked" class="pi pi-check text-white text-xs"></i>
            </div>
            <span class="text-sm font-medium">{{ highlight.name }}</span>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <span 
            v-for="highlight in checkedHighlights" 
            :key="highlight.id"
            class=" text-contrast text-sm font-medium px-3 py-1 flex items-center"
          >
            <i class="pi pi-check text-green-500 text-xs mr-2"></i>
            {{ highlight.name }}
          </span>
          
          <p v-if="checkedHighlights.length === 0" class="text-gray-500 text-sm italic">
              No features highlighted yet.
          </p>
        </div>

      </div>
      
    </div>

    <div class="card p-6 relative bg-white rounded-lg shadow">
      
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold text-contrast">Tags</h2>
        
        <div class="z-10">
            <button 
                v-if="!isEditingTags"
                @click="toggleEditTags"
                class="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full"
            >
                <i class="pi pi-pencil text-lg"></i>
            </button>

            <ButtonCustom 
                v-else
                @click="saveChangesTags"
                :primary="true"
                label= "Save Changes"
            />
            
        </div>
    </div>

    <div class="pt-1">

        <div 
          v-if="isEditingTags" 
          class="flex flex-wrap gap-2 pb-2 md:flex-nowrap md:overflow-x-auto hide-scrollbar"
        >
            <span 
                v-for="tag in tags" 
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
interface Highlight {
  id: number;
  name: string;
  checked: boolean;
}
const isEditingDescription = ref(false);
const description = ref("The Cozy Cafe is your perfect spot for premium coffee, delicious pastries, and a warm atmosphere. Whether you're looking for a quiet place to work, catch up with friends, or simply enjoy a great cup of coffee, we've got you covered. Our skilled baristas craft each drink with care, using only the finest locally-sourced beans.");

const toggleEditDescription = () => {
    isEditingDescription.value = true;
};

const saveChangesDescription = () => {
    console.log("Saving new description:", description.value);
    isEditingDescription.value = false;
};

const isEditingHighlights = ref(false);

// Initial list of highlights with checked status
const highlights = ref<Highlight[]>([
  { id: 1, name: 'Wi-Fi', checked: true },
  { id: 2, name: 'Order online', checked: false },
  { id: 3, name: 'Accomodates groups', checked: true },
  { id: 4, name: 'Restrooms', checked: false },
  { id: 5, name: 'Wheelchair Accessible', checked: true },
  { id: 6, name: 'Parking Available', checked: false },
  { id: 7, name: 'Card Payment', checked: false },
  { id: 8, name: 'Baby-Changing Facility', checked: true },
]);

const checkedHighlights = computed(() => {
    return highlights.value.filter(h => h.checked);
});

const toggleEditHighlights = () => {
    isEditingHighlights.value = true;
};

const saveChangesHighlights = () => {
    const selectedNames = checkedHighlights.value.map(h => h.name);
    console.log("Saving selected highlights:", selectedNames);
    isEditingHighlights.value = false;
};

interface Tag {
    id: number;
    name: string;
    checked: boolean;
}

const isEditingTags = ref(false);

const tags = ref<Tag[]>([
    { id: 1, name: 'Fast Service', checked: true },
    { id: 2, name: 'Gourmet Coffee', checked: false },
    { id: 3, name: 'Live Music', checked: false },
    { id: 4, name: 'Budget Friendly', checked: true },
    { id: 5, name: 'Event Space', checked: false },
    { id: 6, name: 'Takeaway Only', checked: false },
]);

const checkedTags = computed(() => {
    return tags.value.filter(t => t.checked);
});

const toggleEditTags = () => {
    isEditingTags.value = true;
};

const saveChangesTags = () => {
    const selectedTags = checkedTags.value.map(t => t.name);
    console.log("Saving selected tags:", selectedTags);
    isEditingTags.value = false;
};
</script>

<style scoped>

</style>