<template>
  <nav
    class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
  >
    <div class="mx-auto px-8 flex items-center justify-between h-16">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center">
        <img
          src="~/assets/images/e-user-logo.png"
          alt="Welcome"
          class="h-10 w-auto object-contain"
        />
      </NuxtLink>

      <!-- Desktop right side -->
      <div class="hidden md:flex items-center gap-4">
        <NuxtLink to="/review/write-review">
          <button class="px-6 py-2 bg-[#008253] text-white rounded-lg shadow hover:bg-[#008260] transition font-medium">
            Write a review
          </button>
        </NuxtLink>
        <button
          @click="triggerLogout"
          class="flex items-center gap-2 text-red-600 hover:text-red-700 transition font-medium"
        >
          <i class="pi pi-sign-out"></i>
          Logout
        </button>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden flex items-center text-gray-700 dark:text-gray-300 focus:outline-none"
        @click="isOpen = true"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <Drawer
      v-model:visible="isOpen"
      position="left"
      :show-close-icon="false"
      :header="undefined"
      class="!w-[280px] dark:bg-gray-900"
      :pt="{
        header: '!hidden !p-0 !m-0 !h-0 !min-h-0 !overflow-hidden',
        content: 'p-0'
      }"
    >
      <div class="flex flex-col h-full bg-white dark:bg-gray-900">
        <!-- Drawer header -->
        <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <NuxtLink to="/" @click="isOpen = false">
            <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" />
          </NuxtLink>
          <button
            @click="isOpen = false"
            class="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>

        <!-- Drawer nav links -->
        <div class="flex-1 overflow-y-auto py-4">
          <ul class="space-y-1 px-3">
            <li>
              <NuxtLink
                to="/review/write-review"
                @click="isOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <i class="pi pi-pencil text-[#008253]"></i>
                <span>Write a Review</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Drawer footer: logout -->
        <div class="p-5 border-t border-gray-100 dark:border-gray-800">
          <button
            @click="triggerLogout(); isOpen = false"
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 text-red-600 font-medium hover:bg-red-50 transition-colors"
          >
            <i class="pi pi-sign-out"></i>
            Logout
          </button>
        </div>
      </div>
    </Drawer>

    <LogoutConfirm />
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import useMethods from '~/composables/useMethods'

const { triggerLogout } = useMethods()
const userStore = useUserStore()
const isOpen = ref(false)
</script>