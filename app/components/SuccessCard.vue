<template>
  <Transition name="fade">
    <div
      v-if="showSuccess"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      @click.self="closeCard"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slide-up">
        <!-- Close Button -->
        <button
          @click="closeCard"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <i class="pi pi-times text-xl"></i>
        </button>

        <!-- Success Icon -->
        <div class="flex justify-center pt-8 pb-4">
          <div class="relative">
            <div class="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div class="relative bg-green-500 rounded-full p-4">
              <i class="pi pi-check-circle text-white text-5xl"></i>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="px-8 pb-8 text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-3">
            Account Created Successfully!
          </h2>
          <p class="text-gray-600 mb-2 leading-relaxed">
            Welcome aboard! Your account has been created.
          </p>
          <p class="text-sm text-gray-500 mb-6 flex items-center justify-center gap-2">
            <i class="pi pi-envelope text-blue-500"></i>
            <span>Please check your email to verify your account</span>
          </p>

          <!-- Benefits List -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p class="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              What's Next?
            </p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-start gap-2">
                <i class="pi pi-check text-green-500 mt-1 text-xs"></i>
                <span>Verify your email address</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="pi pi-check text-green-500 mt-1 text-xs"></i>
                <span>Complete your profile</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="pi pi-check text-green-500 mt-1 text-xs"></i>
                <span>Start writing reviews and earn points</span>
              </li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3">
            <button
              @click="goToLogin"
              class="w-full bg-[#008253] hover:bg-[#006642] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Go to Sign In</span>
              <i class="pi pi-arrow-right text-sm"></i>
            </button>
            <button
              @click="closeCard"
              class="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: []
}>();

const showSuccess = computed(() => props.show);

const closeCard = () => {
  emit('close');
};

const goToLogin = () => {
  emit('close');
  navigateTo('/auth/end-user/sign-in');
};
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>