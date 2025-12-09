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

      <!-- Add New FAQ -->
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

      <!-- FAQ List -->
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

              <i
                v-if="isFaqEditing"
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

      <!-- Bottom Buttons -->
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
import { ref, reactive, watch } from "vue";

interface FaqItem {
  question: string;
  answer: string;
  open?: boolean; // UI-only field
}

/* ------------------ PROPS ------------------ */
const props = defineProps({
  faqs: {
    type: Array as () => FaqItem[],
    default: () => [],
  },
});

/* ------------------ EMITS ------------------ */
const emit = defineEmits<{
  (e: "update", payload: { key: string; value: any }): void;
}>();

/* ------------------ STATE ------------------ */
const isFaqEditing = ref(false);

const localFaqs = ref<FaqItem[]>([]);
const originalFaqs = ref<FaqItem[]>([]);

const newFaq = reactive({
  question: "",
  answer: "",
});

/* ------------------ INITIALIZER ------------------ */
const initializeFaqs = (faqs: FaqItem[]) => {
  const formatted = faqs.map((f) => ({
    ...f,
    open: f.open ?? false,
  }));
  localFaqs.value = JSON.parse(JSON.stringify(formatted));
  originalFaqs.value = JSON.parse(JSON.stringify(formatted));
};

watch(
  () => props.faqs,
  (val) => initializeFaqs(val),
  { immediate: true }
);

/* ------------------ METHODS ------------------ */
const toggleFaq = (index: number) => {
  const faq = localFaqs.value[index];
  if (faq) {
    faq.open = !faq.open;
  }
};

const addFaq = () => {
  if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

  localFaqs.value.push({
    question: newFaq.question.trim(),
    answer: newFaq.answer.trim(),
    open: false,
  });

  newFaq.question = "";
  newFaq.answer = "";
};

const removeFaq = (index: number) => {
  if (isFaqEditing.value) {
    localFaqs.value.splice(index, 1);
  }
};

const saveFaqChanges = () => {
  const cleaned = localFaqs.value.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  emit("update", { key: "faqs", value: cleaned });

  originalFaqs.value = JSON.parse(JSON.stringify(localFaqs.value));
  isFaqEditing.value = false;
};

const cancelFaqChanges = () => {
  localFaqs.value = JSON.parse(JSON.stringify(originalFaqs.value));
  isFaqEditing.value = false;
};

const toggleFaqEditing = () => {
  if (!isFaqEditing.value) {
    initializeFaqs(props.faqs);
  }
  isFaqEditing.value = !isFaqEditing.value;
};
</script>

<style scoped></style>
