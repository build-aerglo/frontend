<template>
  <div class="card">
    <div class="px-6 py-5">
      <div class="flex justify-between items-center mb-6">
        <span class="text-[130%] text-contrast font-bold">Frequently Asked Questions</span>
        
        <ButtonCustom
          :label="isFaqEditing ? 'Save' : 'Edit'"
          :primary="!isFaqEditing"
          :secondary="isFaqEditing"
          size="md"
          input-class="w-auto text-[14px]"
          @click="toggleFaqEditing"
        />
      </div>
      
      <div v-if="isFaqEditing" class="mb-6 border p-4 rounded-lg bg-gray-50">
        <h2 class="text-lg font-semibold mb-3">Add New FAQ</h2>
        <div class="flex flex-col gap-3">
            <input 
                v-model="newFaq.question" 
                placeholder="Enter Question (e.g., Do you offer online booking?)" 
                class="border p-2 rounded w-full"
            />
            <textarea 
                v-model="newFaq.answer" 
                placeholder="Enter Answer" 
                rows="3" 
                class="border p-2 rounded w-full"
            ></textarea>
            <ButtonCustom 
                label="Save New FAQ"
                primary="true"
                size="md"
                input-class="w-fit"
                @click="addFaq"
            />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div 
          v-for="(faq, index) in localFaqs" 
          :key="index" 
          class="border rounded-lg overflow-hidden transition-all duration-300"
        >
          <div 
            class="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
            @click="toggleFaq(index)"
          >
            <p class="font-medium text-contrast text-[120%]">{{ faq.question }}</p>
            <div class="flex items-center gap-3">
                <i :class="['pi', faq.open ? 'pi-chevron-up' : 'pi-chevron-down', 'text-sm text-gray-600']"></i>
                
                <i v-if="isFaqEditing" 
                   class="pi pi-trash text-red-500 hover:text-red-700 cursor-pointer text-sm"
                   @click.stop="removeFaq(index)"
                ></i>
            </div>
          </div>
          
          <div v-show="faq.open" class="p-4 bg-white border-t text-gray-600 transition-all duration-300">
            {{ faq.answer }}
          </div>
        </div>
        
        <p v-if="localFaqs.length === 0" class="text-gray-500 italic p-4 text-center">
            No frequently asked questions have been added yet.
        </p>
      </div>

      <div v-if="isFaqEditing" class="mt-6 flex justify-end gap-3">
        <ButtonCustom 
            label="Save All FAQ Changes"
            primary="true"
            size="lg"
            input-class="w-auto"
            @click="saveFaqChanges"
        />
        <ButtonCustom 
            label="Cancel"
            secondary="true"
            size="lg"
            input-class="w-auto"
            @click="cancelFaqChanges"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'; 
// ... (Your other imports like ButtonCustom are assumed)

interface FaqItem {
    question: string;
    answer: string;
    open?: boolean; // Make 'open' optional as we'll remove it when emitting
}

/* ------------------ PROPS ------------------ */
const props = defineProps({
    // 1. Accept the faqs array from the parent
    faqs: {
        type: Array as () => FaqItem[],
        default: () => [],
    },
});

/* ------------------ EMITS ------------------ */
const emit = defineEmits<{
    (e: 'update', payload: { key: string; value: any }): void;
}>();


const isFaqEditing = ref(false);

// 2. Use local state, initialized from the prop
const localFaqs = ref<FaqItem[]>([]);
const originalFaqs = ref<FaqItem[]>([]); // To store state for cancel

// 3. Watch for initial prop load and updates
const initializeFaqs = (newFaqs: FaqItem[]) => {
    // We add the 'open' state for local UI functionality
    const faqsWithOpenState = newFaqs.map(faq => ({ ...faq, open: faq.open ?? false }));
    localFaqs.value = JSON.parse(JSON.stringify(faqsWithOpenState));
    originalFaqs.value = JSON.parse(JSON.stringify(faqsWithOpenState));
};

watch(() => props.faqs, (newVal) => {
    initializeFaqs(newVal);
}, { immediate: true }); // Initialize on mount


const newFaq = reactive({
    question: '',
    answer: ''
});

// ... (toggleFaq, addFaq, removeFaq logic is fine, just use localFaqs instead of faqs) ...

const toggleFaq = (index: number) => {
    const item = localFaqs.value[index]; // 🚨 Use localFaqs
    if (item) {
        item.open = !item.open;
    }
};

const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
        localFaqs.value.push({ // 🚨 Use localFaqs
            question: newFaq.question.trim(),
            answer: newFaq.answer.trim(),
            open: false,
        });
        newFaq.question = '';
        newFaq.answer = '';
    }
};

const removeFaq = (index: number) => {
    if (isFaqEditing.value) {
        localFaqs.value.splice(index, 1); // 🚨 Use localFaqs
    }
};

// 4. Update saveFaqChanges to emit data to parent
const saveFaqChanges = () => {
    // Clean the data: remove the 'open' property, as it's only for UI
    const cleanedFaqs = localFaqs.value.map(({ question, answer }) => ({ question, answer }));
    
    // Emit the change to the parent component
    emit("update", { key: "faqs", value: cleanedFaqs }); 
    
    // Update original state and close edit mode
    originalFaqs.value = JSON.parse(JSON.stringify(localFaqs.value));
    isFaqEditing.value = false;
};

const cancelFaqChanges = () => {
    localFaqs.value = JSON.parse(JSON.stringify(originalFaqs.value)); // 🚨 Use localFaqs
    isFaqEditing.value = false;
};

const toggleFaqEditing = () => {
    // If we're entering edit mode, ensure localFaqs is reset from the latest prop data
    if (!isFaqEditing.value) {
        initializeFaqs(props.faqs);
    }
    // If we are exiting edit mode via this button, save changes (if no dedicated save button is used)
    if (isFaqEditing.value) {
        saveFaqChanges();
    } else {
        isFaqEditing.value = true;
    }
};

</script>

<style scoped>

</style>