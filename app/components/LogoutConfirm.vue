<template>
  <Teleport to="body">
    <div v-if="showLogoutModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="!isLoggingOut && (showLogoutModal = false)"></div>
      
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <i :class="isLoggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-exclamation-triangle'" class="text-red-600 text-xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Sign Out</h3>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to log out?</p>
        </div>

        <div v-if="logoutError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-shake">
          <i class="pi pi-times-circle text-red-500 mt-0.5"></i>
          <span class="text-xs text-red-700 font-medium">{{ logoutError }}</span>
        </div>

        <div class="mt-8 flex gap-3">
          <button 
            @click="showLogoutModal = false" 
            :disabled="isLoggingOut"
            class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            @click="logoutUser" 
            :disabled="isLoggingOut"
            class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:bg-red-400 flex items-center justify-center"
          >
            <i v-if="isLoggingOut" class="pi pi-spin pi-spinner mr-2"></i>
            <span>{{ isLoggingOut ? 'logging out...' : 'Confirm' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import useMethods from '~/composables/useMethods';
const { showLogoutModal, logoutUser, isLoggingOut, logoutError } = useMethods();
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>