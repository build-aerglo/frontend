<template>
  <div class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <div class="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[95vh] flex flex-col">
      <div class="flex border-b shrink-0">
        <button 
          @click="activeTab = 'signin'" 
          :class="['flex-1 py-4 font-semibold transition', activeTab === 'signin' ? 'text-[#008253] border-b-2 border-[#008253]' : 'text-gray-400']"
        >Sign In</button>
        <button 
          @click="activeTab = 'signup'" 
          :class="['flex-1 py-4 font-semibold transition', activeTab === 'signup' ? 'text-[#008253] border-b-2 border-[#008253]' : 'text-gray-400']"
        >Sign Up</button>
      </div>

      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20">
        <i class="pi pi-times text-lg"></i>
      </button>

      <div class="p-8 overflow-y-auto">
        <AuthSignInForm 
          v-if="activeTab === 'signin'" 
          @success="onAuthSuccess" 
          @switch-to-signup="activeTab = 'signup'"
          :is-modal="true" 
        />
        <AuthSignUpForm 
          v-if="activeTab === 'signup'" 
          @success="onAuthSuccess" 
          @switch-to-signin="activeTab = 'signin'"
          
          :is-modal="true" 
        />
      </div>

      <div v-if="!hideBackToReview" class="border-t border-gray-100 p-4 bg-gray-50/50 text-center">
        <button 
          @click="$emit('back-to-review')" 
          class="text-sm text-gray-500 hover:text-[#008253] transition flex items-center justify-center mx-auto gap-2"
        >
          <i class="pi pi-arrow-left text-xs"></i>
          Back to review
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define the new prop
defineProps({
  hideBackToReview: {
    type: Boolean,
    default: false
  }
})

const activeTab = ref('signin')
const emit = defineEmits(['close', 'authenticated','back-to-review' ])

const onAuthSuccess = () => {
  emit('authenticated')
  emit('close');
  // We don't emit close here immediately if the parent wants to handle redirection
}
</script>