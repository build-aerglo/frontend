<template>
  <nav
    class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
    <div class="mx-auto px-8 flex items-center justify-between h-16">
      <!-- Logo -->
      <NuxtLink to="/links" class="flex items-center space-x-2">
        <img src="~/assets/images/e-user-logo.png" alt="Welcome" class="h-10 w-auto object-contain" />
      </NuxtLink>

      <!-- Desktop Nav Links -->
      <!-- Right buttons -->
      <div class="flex items-right space-x-8">
        <ul class="hidden md:flex items-center space-x-8 dark:text-gray-200 font-medium">
          <!-- For Business Dropdown -->
          
        </ul>

        <!-- Mobile toggle -->
        <button class="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none"
          @click="isOpen = !isOpen">
          <i :class="isOpen ? 'pi pi-bars text-sm' : 'pi pi-bars text-sm'"></i>
        </button>
      </div>
    </div>

    <!-- Sidebar for small screens -->
    <div :class="[
      'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 md:hidden z-50',
      isOpen ? 'translate-y-0' : '-translate-x-full',
    ]">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <NuxtLink to="/links"><img src="/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" /></NuxtLink>
        <button @click="isOpen = false" class="text-gray-600 dark:text-gray-200">
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>

      <ul
        class="flex flex-col bg-white border-b border-gray-200 text-gray-800 dark:text-white font-medium p-8 space-y-4">
      </ul>
    </div>
    <!-- Overlay when sidebar is open -->
    <div v-if="isOpen" class="fixed inset-0 z-30 md:hidden bg-black/5 backdrop-blur-sm transition-all duration-300"
      @click="isOpen = false"></div>
  </nav>
  <!-- Overlay when sidebar is open -->
  <div v-if="isOpen" class="fixed inset-0 z-30 md:hidden bg-black/5 backdrop-blur-sm transition-all duration-300"
    @click="isOpen = false"></div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '~/store/user'

const isOpen = ref(false)
const showBusinessDropdown = ref(false)
const userStore = useUserStore()

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = () => {
  showBusinessDropdown.value = false
}
</script>





