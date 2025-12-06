<template>
  <div>
    <div>
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold text-slate-800 mb-3">Auto-Response Configuration</h1>
        <p class="text-slate-600">Configure automated responses for different types of reviews</p>
      </div>

      <!-- Response Cards -->
      <div class="space-y-4">
        <!-- Positive Reviews -->
        <div class="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden transition-all hover:shadow-lg">
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-green-200">
            <div class="flex items-center gap-3">
              <i class="pi pi-thumbs-up text-green-600 text-2xl"></i>
              <h2 class="text-xl font-semibold text-slate-800">Positive Reviews</h2>
          </div>
          </div>
          <div class="p-6">
            <textarea
              v-model="responses.positive"
              rows="4"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all resize-none"
              placeholder="Thank you so much for your positive feedback! We're thrilled to hear..."
            ></textarea>
            <p class="text-sm text-slate-500 mt-2">{{ responses.positive.length }} characters</p>
          </div>
        </div>

        <!-- Neutral Reviews -->
        <div class="bg-white rounded-xl shadow-md border border-yellow-100 overflow-hidden transition-all hover:shadow-lg">
          <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4 border-b border-yellow-200">
            <div class="flex items-center gap-3">
              <i class="pi pi-minus-circle text-yellow-600 text-2xl"></i>
              <h2 class="text-xl font-semibold text-slate-800">Neutral Reviews</h2>
            </div>
          </div>
          <div class="p-6">
            <textarea
              v-model="responses.neutral"
              rows="4"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all resize-none"
              placeholder="Thank you for taking the time to share your thoughts. We appreciate..."
            ></textarea>
            <p class="text-sm text-slate-500 mt-2">{{ responses.neutral.length }} characters</p>
          </div>
        </div>

        <!-- Negative Reviews -->
        <div class="bg-white rounded-xl shadow-md border border-red-100 overflow-hidden transition-all hover:shadow-lg">
          <div class="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
            <div class="flex items-center gap-3">
              <i class="pi pi-thumbs-down text-red-600 text-2xl"></i>
              <h2 class="text-xl font-semibold text-slate-800">Negative Reviews</h2>
            </div>
          </div>
          <div class="p-6">
            <textarea
              v-model="responses.negative"
              rows="4"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none transition-all resize-none"
              placeholder="We sincerely apologize for your experience. Your feedback is important..."
            ></textarea>
            <p class="text-sm text-slate-500 mt-2">{{ responses.negative.length }} characters</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-end gap-4">
        <button
          @click="resetResponses"
          class="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
        >
          <i class="pi pi-refresh mr-2"></i>
          Reset
        </button>
        <button
          @click="saveResponses"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
        >
          Save Changes
        </button>
      </div>

      <!-- Success Message -->
      <transition name="fade">
        <div
          v-if="saved"
          class="mt-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg flex items-center gap-3"
        >
          <i class="pi pi-check-circle text-green-600 text-xl"></i>
          <span class="font-medium">Auto-responses saved successfully!</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Responses {
  positive: string
  neutral: string
  negative: string
}

const responses = ref<Responses>({
  positive: '',
  neutral: '',
  negative: ''
})

const saved = ref(false)

const saveResponses = () => {
  // Add API call here to save the responses
  console.log('Saving responses:', responses.value)
  saved.value = true
  
  setTimeout(() => {
    saved.value = false
  }, 3000)
}

const resetResponses = () => {
  responses.value = {
    positive: '',
    neutral: '',
    negative: ''
  }
}
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