<template>
<nav
    class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
  >
    <div class="mx-auto px-8 flex items-center justify-between h-16">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2">
        <img
          src="~/assets/images/e-user-logo.png"
          alt="Welcome"
          class="h-10 w-auto object-contain"
        />
      </NuxtLink>

      <!-- Desktop Nav Links -->
       <!-- Right buttons -->
      <div class="flex items-right space-x-8">
        <ul class="hidden md:flex items-center space-x-8 dark:text-gray-200 font-medium">
          <!-- For Business Dropdown -->
        <li class="relative">
          <button
            @click="toggleBusinessDropdown"
            class="flex items-center hover:text-primary focus:outline-none after:content-[''] after:absolute after:left-0 after:-bottom-1 
             after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
             hover:after:w-full"
          >
            For Business
            <i class="pi pi-chevron-down ml-1 text-sm"></i>
          </button>

          <div
            v-if="showBusinessDropdown"
            class="absolute mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-56 z-50"
          >
            <NuxtLink
              to="/business/auth/sign-up"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-briefcase mr-2 text-primary"></i>
              Add a Business
            </NuxtLink>
            <NuxtLink
              to="/business/auth/sign-in"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-sign-in mr-2 text-primary"></i>
              Log in to Your Business Account
            </NuxtLink>
            <NuxtLink to="/biz/[id]/claim-business"
                            class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="pi pi-id-card mr-2 text-primary"></i>
                            Claim a Business
                          </NuxtLink>
          </div>
        </li>
        <li><NuxtLink to="/end-user/landing/categories" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
             after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
             hover:after:w-full"
            >Categories</NuxtLink>
        </li>
        <li>
          <div class="hidden md:flex items-center h-full">
            <div v-if="userStore.isAuthenticated" class="relative group flex items-center">
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

              <div v-if="showUserDropdown" class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-[100] origin-top-right">
                <NuxtLink :to="`/user/${userStore.id}`" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="showUserDropdown = false">
                  <i class="pi pi-user mr-2 text-[#008253]"></i> My Profile
                </NuxtLink>
                <button @click="triggerLogout()" class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <i class="pi pi-sign-out mr-2"></i> Logout
                </button>
              </div>
            </div>

            
          </div>
        </li>
      </ul>

        <!-- Mobile toggle -->
        <button
          class="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none"
          @click="isOpen = !isOpen"
        >
          <i :class="isOpen ? 'pi pi-bars text-sm' : 'pi pi-bars text-sm'"></i>
        </button>
      </div>
    </div>

    <!-- Sidebar for small screens -->
    <div
      :class="[
        'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 md:hidden z-50',
        isOpen ? 'translate-y-0' : '-translate-x-full',
      ]"
    >

      <ul class="flex flex-col bg-white border-b border-gray-200 text-gray-800 dark:text-white font-medium px-8 py-4 space-y-4">
        <li>
          <div class="flex items-center justify-between border-b border-gray-200 mx-[-1.5rem] px-[1.5rem] py-1 dark:border-gray-700 ">
            <div v-if="userStore.isAuthenticated">
              <NuxtLink :to="`/user/${userStore.id}`" @click="isOpen = false">
                <UserAvatar 
                  v-if="userProfile"
                  :first-name="userProfile?.username"
                  :size="38"
                />
              </NuxtLink>
            </div>
            <button @click="isOpen = false" class="text-gray-600 dark:text-gray-200">
              <i class="pi pi-times text-sm"></i>
            </button>
          </div>
        </li>

        <li><NuxtLink to="/end-user/landing/categories" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
             after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
             hover:after:w-full"
            >Categories</NuxtLink></li>

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
              to="/business/auth/sign-up"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-briefcase mr-2 text-primary"></i>
              Add a Business
            </NuxtLink>
            <NuxtLink
              to="/business/auth/sign-in"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-sign-in mr-2 text-primary"></i>
              Log in to Your Business Account
            </NuxtLink>
            <NuxtLink to="/biz/[id]/claim-business"
                            class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i class="pi pi-id-card mr-2 text-primary"></i>
                            Claim a Business
                          </NuxtLink>
          </div>
        </li>
        <li class="pt-4 border-t">
          <button 
            v-if="userStore.isAuthenticated" 
            @click="triggerLogout(); isOpen = false" 
            class="text-red-600"
          >
            <i class="pi pi-sign-out mr-2"></i> Logout
          </button>
        </li>
      </ul>
    </div>
    <!-- Overlay when sidebar is open -->
    <div
    v-if="isOpen"
    class="fixed inset-0 z-30 md:hidden bg-black/5 backdrop-blur-sm transition-all duration-300"
    @click="isOpen = false"
    ></div>
  </nav>
</template> 


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '~/store/user'
import useMethods from '~/composables/useMethods'
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";

const { triggerLogout } = useMethods()
const { getUserProfile } = useUserProfileMethods();
const userStore = useUserStore()

const isOpen = ref(false)
const showBusinessDropdown = ref(false)
const showUserDropdown = ref(false)
const userProfile = ref<any>(null)
const showClaimModal = ref(false)

const fetchProfileData = async () => {
  if (!userStore.id || !userStore.isAuthenticated) return;
  try {
    const response = await getUserProfile(userStore.id);
    if (response?.data) userProfile.value = response.data;
  } catch (error) {
    console.error("NavBar Profile Fetch Error:", error);
  }
};

const toggleBusinessDropdown = (e: MouseEvent) => {
  e.stopPropagation()
  showBusinessDropdown.value = !showBusinessDropdown.value
}

const handleClickOutside = () => {
  showBusinessDropdown.value = false
  showUserDropdown.value = false
}

onMounted(() => {
  if (userStore.isAuthenticated) fetchProfileData();
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for auth changes to fetch/clear profile
watch(() => userStore.isAuthenticated, (val) => {
  if (val) fetchProfileData();
  else userProfile.value = null;
})
</script>
