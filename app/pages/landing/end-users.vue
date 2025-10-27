<template>
  <nav
    class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
  >
    <div class="container mx-auto px-6 flex items-center justify-between h-16">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2">
        <img
          src="/assets/images/e-user-logo.png"
          alt="Welcome"
          class="h-10 w-auto object-contain"
        />
      </NuxtLink>

      <!-- Desktop Nav Links -->
      <ul class="hidden lg:flex items-center space-x-8 text-gray-700 dark:text-gray-200 font-medium">
        <li><a href="#writeReview" class="hover:text-primary">Write a Review</a></li>
        <li><a href="#categories" class="hover:text-primary">Categories</a></li>

        <!-- For Business Dropdown -->
        <li class="relative">
          <button
            @click="toggleBusinessDropdown"
            class="flex items-center hover:text-primary focus:outline-none"
          >
            For Business
            <i class="pi pi-chevron-down ml-1 text-sm"></i>
          </button>

          <div
            v-if="showBusinessDropdown"
            class="absolute mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-56 z-50"
          >
            <NuxtLink
              to="/business/add"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-briefcase mr-2 text-primary"></i>
              Add a Business
            </NuxtLink>
            <NuxtLink
              to="/business/login"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-sign-in mr-2 text-primary"></i>
              Log in to Your Business Account
            </NuxtLink>
          </div>
        </li>
      </ul>

      <!-- Right buttons -->
      <div class="flex items-center space-x-4">
        <!-- Theme Switcher -->
        <button @click="toggleTheme" class="text-gray-600 dark:text-gray-200 hover:text-primary">
          <i :class="themeIcon"></i>
        </button>

        <!-- Login/Register -->
        <NuxtLink
          to="/auth/end-user/sign-in"
          class="hidden sm:inline-flex items-center bg-[#008253] text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Login/Register
        </NuxtLink>

        <!-- Mobile toggle -->
        <button
          class="lg:hidden text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none"
          @click="isOpen = !isOpen"
        >
          <i :class="isOpen ? 'pi pi-times text-xl' : 'pi pi-bars text-xl'"></i>
        </button>
      </div>
    </div>

    <!-- Sidebar for small screens -->
    <div
      :class="[ 
        'fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 lg:hidden z-40', 
        isOpen ? 'translate-x-0' : '-translate-x-full' 
      ]"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" />
        <button @click="isOpen = false" class="text-gray-600 dark:text-gray-200">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <ul class="flex flex-col text-gray-700 dark:text-gray-200 font-medium p-6 space-y-4">
        <li><a href="#writeReview" class="hover:text-primary block">Write a Review</a></li>
        <li><a href="#categories" class="hover:text-primary block">Categories</a></li>

        <!-- For Business Dropdown (Mobile) -->
        <li>
          <button
            @click="toggleBusinessDropdown"
            class="flex items-center justify-between w-full hover:text-primary focus:outline-none"
          >
            <span>For Business</span>
            <i class="pi pi-chevron-down text-sm"></i>
          </button>

          <div v-if="showBusinessDropdown" class="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <NuxtLink
              to="/business/add"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-briefcase mr-2 text-[#008253]"></i>
              Add a Business
            </NuxtLink>
            <NuxtLink
              to="/business/login"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-sign-in mr-2 text-[#008253]"></i>
              Log in to Your Business Account
            </NuxtLink>
          </div>
        </li>

        <li>
          <NuxtLink
            to="/auth/end-user/sign-in"
            class="inline-flex items-center justify-center bg-[#008253] text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition w-full text-center"
          >
            Login/Register
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Overlay when sidebar is open -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 lg:hidden"
      @click="isOpen = false"
    ></div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const isOpen = ref(false)
const isDark = ref(false)
const showBusinessDropdown = ref(false)

// Theme setup
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const themeIcon = computed(() =>
  isDark.value ? 'pi pi-moon text-xl' : 'pi pi-sun text-xl'
)

// For Business dropdown
const toggleBusinessDropdown = (event: MouseEvent) => {
  event.stopPropagation()
  showBusinessDropdown.value = !showBusinessDropdown.value
}

const handleClickOutside = () => {
  showBusinessDropdown.value = false
}
</script>
