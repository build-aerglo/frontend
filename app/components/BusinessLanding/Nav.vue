<template>
  <nav class="bg-white shadow-sm sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/links" class="flex items-center space-x-2">
            <img src="~/assets/images/e-user-logo.png" alt="Welcome" class="h-10 w-auto object-contain" />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex md:items-center md:space-x-8">
          <a href="#features" class="text-gray-600 hover:text-emerald-600 transition-colors">Features</a>
          <a href="#pricing" class="text-gray-600 hover:text-emerald-600 transition-colors">Pricing</a>
        </div>

        <!-- Desktop Auth buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <NuxtLink to="/business/auth/sign-in" class="text-gray-600 hover:text-emerald-600">Log In</NuxtLink>
          <NuxtLink to="/business/[id]" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Claim Business
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500">
            <span class="sr-only">Open main menu</span>
            <svg v-if="!isMobileMenuOpen" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a href="#features" @click="isMobileMenuOpen = false" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Features</a>
        <a href="#pricing" @click="isMobileMenuOpen = false" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Pricing</a>

      </div>
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="px-5 mb-2">
           <NuxtLink to="/business/auth/sign-in"class="block text-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Log In</NuxtLink>
        </div>
        <div class="px-5">
          <NuxtLink to="/business/[id]" class="block text-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700">
            Claim Business
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isMobileMenuOpen = ref(false);
</script>
