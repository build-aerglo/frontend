<template>
  <nav class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
    <div class="mx-auto px-8 flex items-center justify-between h-16">
      
      <NuxtLink to="/" class="flex items-center flex-shrink-0">
        <img
          src="~/assets/images/e-user-logo.png"
          alt="Logo"
          class="h-10 w-auto object-contain"
        />
      </NuxtLink>

      <div class="flex items-center space-x-8">
        <ul class="hidden md:flex items-center space-x-8 dark:text-gray-200 font-medium">
          
          <li>
            <NuxtLink 
              to="/end-user/landing/categories" 
              class="relative hover:text-[#008253] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 hover:after:w-full"
            >
              Categories
            </NuxtLink>
          </li>

          <li v-if="userStore.isAuthenticated" class="relative">
            <button 
              @click.stop="showUserDropdown = !showUserDropdown"
              class="flex items-center focus:outline-none transition-transform hover:scale-105"
            >
              <UserAvatar 
                v-if="userProfile"
                :first-name="userProfile?.username"
                :size="40"
              />
              <div v-else class="h-10 w-10 rounded-full bg-gray-200 animate-pulse border border-gray-100"></div>
              <i class="pi pi-chevron-down ml-1 text-xs text-gray-400"></i>
            </button>

            <div v-if="showUserDropdown" class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-[100]">
              <NuxtLink :to="`/user/${userStore.id}`" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="showUserDropdown = false">
                <i class="pi pi-user mr-2 text-[#008253]"></i> My Profile
              </NuxtLink>
              <button @click="triggerLogout()" class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <i class="pi pi-sign-out mr-2"></i> Logout
              </button>
            </div>
          </li>
        </ul>

        <button
          class="md:hidden text-gray-700 dark:text-gray-300 hover:text-[#008253] focus:outline-none"
          @click="isOpen = true"
        >
          <i class="pi pi-bars text-xl"></i>
        </button>
      </div>
    </div>

    <Drawer 
      v-model:visible="isOpen" 
      position="left"
      :show-close-icon="false"
      :header="undefined"
      class="!w-[280px] dark:bg-gray-900"
      :pt="{
        header: 'hidden',
        content: 'p-0'
      }"
    >
      <div class="flex flex-col h-full bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div v-if="userStore.isAuthenticated" class="flex items-center gap-3">
            <UserAvatar 
              v-if="userProfile"
              :first-name="userProfile?.username"
              :size="40"
            />
            <span class="font-bold text-gray-800 dark:text-white truncate max-w-[120px]">
              {{ userProfile?.username }}
            </span>
          </div>
          <img v-else src="~/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" />
          
          <button @click="isOpen = false" class="p-2 text-gray-500">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="flex-1 py-4">
          <ul class="px-3 space-y-1">
            <li>
              <NuxtLink to="/" @click="isOpen = false" class="mobile-link">
                <i class="pi pi-home"></i> Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/end-user/landing/categories" @click="isOpen = false" class="mobile-link">
                <i class="pi pi-th-large"></i> Categories
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="p-5 border-t border-gray-100 dark:border-gray-800">
          <button 
            v-if="userStore.isAuthenticated"
            @click="triggerLogout(); isOpen = false"
            class="w-full flex items-center justify-center gap-2 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition"
          >
            <i class="pi pi-sign-out"></i> Logout
          </button>
          <NuxtLink 
            v-else 
            to="/auth/login" 
            @click="isOpen = false"
            class="w-full block text-center py-3 bg-[#008253] text-white font-medium rounded-xl"
          >
            Login / Register
          </NuxtLink>
        </div>
      </div>
    </Drawer>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import useMethods from '~/composables/useMethods'
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";

const { triggerLogout } = useMethods()
const { getUserProfile } = useUserProfileMethods();
const userStore = useUserStore()

const isOpen = ref(false)
const showUserDropdown = ref(false)
const userProfile = ref<any>(null)

const fetchProfileData = async () => {
  if (!userStore.id || !userStore.isAuthenticated) return;
  try {
    const response = await getUserProfile(userStore.id);
    if (response?.data) userProfile.value = response.data;
  } catch (error) {
    console.error("NavBar Profile Fetch Error:", error);
  }
};

onMounted(() => {
  if (userStore.isAuthenticated) fetchProfileData();
  document.addEventListener('click', () => { showUserDropdown.value = false });
})

watch(() => userStore.isAuthenticated, (val) => {
  if (val) fetchProfileData();
  else userProfile.value = null;
})
</script>

<style scoped>
.mobile-link {
  @apply flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors;
}
.mobile-link i {
  @apply text-[#008253] text-lg;
}
</style>