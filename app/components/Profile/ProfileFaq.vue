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
          v-for="(faq, index) in faqs" 
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
        
        <p v-if="faqs.length === 0" class="text-gray-500 italic p-4 text-center">
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

interface FaqItem {
    question: string;
    answer: string;
    open: boolean;
}

const isFaqEditing = ref(false);
const toggleFaqEditing = () => {
    isFaqEditing.value = !isFaqEditing.value;
};

const faqs = ref<FaqItem[]>([
    { question: "What are your operating hours this week?", answer: "Our standard hours are Monday to Friday, 9:00 AM to 5:00 PM. We are closed on public holidays.", open: false },
    { question: "How do I book an appointment or service?", answer: "You can book directly through our website (link available in the profile) or call us during business hours.", open: false },
    { question: "Where is your primary location?", answer: "We are located at 123 Main Street. See the map on the Overview tab for exact coordinates.", open: false },
]);
const originalFaqs = ref<FaqItem[]>(JSON.parse(JSON.stringify(faqs.value)));


const newFaq = reactive({
    question: '',
    answer: ''
});

const toggleFaq = (index: number) => {
    const item = faqs.value[index];
    if (item) {
        item.open = !item.open;
    }
};

const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
        faqs.value.push({
            question: newFaq.question.trim(),
            answer: newFaq.answer.trim(),
            open: false,
        });
        // Clear the form
        newFaq.question = '';
        newFaq.answer = '';
    }
};

const removeFaq = (index: number) => {
    if (isFaqEditing.value) {
        faqs.value.splice(index, 1);
    }
};


const saveFaqChanges = () => {
    console.log("Saving changes:", faqs.value);
    originalFaqs.value = JSON.parse(JSON.stringify(faqs.value));
    isFaqEditing.value = false;
};

const cancelFaqChanges = () => {
    faqs.value = JSON.parse(JSON.stringify(originalFaqs.value));
    isFaqEditing.value = false;
};

</script>

<style scoped>

</style>