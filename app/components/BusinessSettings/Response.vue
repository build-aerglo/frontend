<template>
  <div class="relative">
    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="!canAutoResponse || !allowAutoResponse"
        class="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
      >
        <div class="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <i class="pi pi-lock text-4xl text-slate-500 mb-4"></i>
          <h3 class="text-xl font-semibold text-slate-800 mb-2">
            Auto responses disabled
          </h3>
          <p class="text-slate-600 text-sm">
            You don’t have access to auto responses right now. Please update
            your plan or permissions to continue.
          </p>
        </div>
      </div>
    </transition>

    <!-- Page Content -->
    <div>
      <!-- Header -->

      <!-- Response Cards -->
      <div class="space-y-4">
        <!-- Positive Reviews -->
        <div
          class="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden transition-all hover:shadow-lg"
        >
          <div
            class="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-green-200"
          >
            <div class="flex items-center gap-3">
              <i class="pi pi-thumbs-up text-green-600 text-2xl"></i>
              <h2 class="text-xl font-semibold text-slate-800">
                Positive Reviews
              </h2>
            </div>
          </div>
          <div class="p-6">
            <Editor
              v-model="responses.positiveResponse"
              editorStyle="height: 200px"
            >
              <template v-slot:toolbar>
                <span class="ql-formats"> </span>
              </template>
            </Editor>
            <p class="text-sm text-slate-500 mt-2">
              {{ responses.positiveResponse.length }} characters
            </p>
          </div>
        </div>

        <!-- Neutral Reviews -->
        <div
          class="bg-white rounded-xl shadow-md border border-yellow-100 overflow-hidden transition-all hover:shadow-lg"
        >
          <div
            class="bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4 border-b border-yellow-200"
          >
            <div class="flex items-center gap-3">
              <i class="pi pi-minus-circle text-yellow-600 text-2xl"></i>
              <h2 class="text-xl font-semibold text-slate-800">
                Neutral Reviews
              </h2>
            </div>
          </div>
          <div class="p-6">
            <textarea
              v-model="responses.neutralResponse"
              rows="4"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all resize-none"
              placeholder="Thank you for taking the time to share your thoughts. We appreciate..."
            ></textarea>
            <p class="text-sm text-slate-500 mt-2">
              {{ responses.neutralResponse.length }} characters
            </p>
          </div>
        </div>

        <!-- Negative Reviews -->
        <div
          class="bg-white rounded-xl shadow-md border border-red-100 overflow-hidden transition-all hover:shadow-lg"
        >
          <div
            class="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200"
          >
            <div class="flex items-center gap-3">
              <i class="pi pi-thumbs-down text-red-600 text-2xl"></i>
              <h2 class="text-xl font-semibold text-slate-800">
                Negative Reviews
              </h2>
            </div>
          </div>
          <div class="p-6">
            <textarea
              v-model="responses.negativeResponse"
              rows="4"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none transition-all resize-none"
              placeholder="We sincerely apologize for your experience. Your feedback is important..."
            ></textarea>
            <p class="text-sm text-slate-500 mt-2">
              {{ responses.negativeResponse.length }} characters
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-end gap-4">
        <ButtonCustom
          label="Save Auto Responses"
          :disabled="!canAutoResponse || !allowAutoResponse"
          input-class="w-max"
          primary="true"
          size="lg"
          @click="saveResponsesAsync"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  canAutoResponse: Boolean,
  allowAutoResponse: Boolean,
});

import useBusinessMethods from "~/composables/business/useBusinessMethods";

const { getBusinessAutoResponse, updateBusinessAutoResponse } =
  useBusinessMethods();
const toast = useToast();

interface Responses {
  positiveResponse: string;
  neutralResponse: string;
  negativeResponse: string;
  allowAutoResponse: boolean;
}

const responses = ref<Responses>({
  positiveResponse: "",
  neutralResponse: "",
  negativeResponse: "",
  allowAutoResponse: false,
});

const saveResponsesAsync = async () => {
  if (!props.canAutoResponse || !props.allowAutoResponse) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Auto response not allowed for this business",
      life: 3000,
    });
  }

  try {
    const res = await updateBusinessAutoResponse(responses.value);
    if (res?.statusCode === 200) {
      return toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Auto response updated.",
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

onBeforeMount(async () => {
  if (props.canAutoResponse) {
    try {
      const res = await getBusinessAutoResponse();
      if (res?.statusCode === 200) {
        responses.value = res.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
