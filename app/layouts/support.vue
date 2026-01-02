<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div class="px-4 md:px-6 h-16 flex items-center justify-between">
        <!-- Left: Menu Button (Mobile) / Logo (Desktop) -->
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Button -->
      <button
            v-if="!isSidebarOpen"
            @click="toggleSidebar"
            class="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <i class="pi pi-bars text-xl text-slate-700"></i>
          </button>

          <!-- Logo (Desktop) -->
          <div class="hidden md:flex items-center">
            <img
              src="~/assets/images/e-user-logo.png"
              class="object-contain w-24 h-24"
              alt="Logo"
            />
          </div>
        </div>

        <!-- Center: Page Title (Mobile) -->
        <div class="md:hidden">
          <h1 class="text-lg font-semibold text-slate-800">{{ pageTitle }}</h1>
        </div>

        <!-- Right: Notifications & User -->
        <div class="flex items-center gap-3">
          <!-- Notifications -->
          <button
            class="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <i class="pi pi-bell text-xl text-slate-700"></i>
            <span
              v-if="notificationCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </button>

          <!-- User Avatar (Desktop) -->
          <div class="hidden md:flex items-center gap-1 pl-3 border-l border-slate-200">
            <div class="w-9 h-9 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
              <i class="pi pi-user text-white text-sm"></i>
            </div>
            <div class="hidden md:block">
              <p class="text-sm font-medium text-slate-800 mb-0 mt-1">Admin User</p>
              <p class="text-xs text-slate-500 mt-0">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar Overlay (Mobile) -->
    <Transition name="fade">
      <div
        v-if="isSidebarOpen"
        @click="closeSidebar"
        class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 mt-16"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-16 bottom-0 left-0 bg-white border-r border-slate-200 z-40 transition-transform duration-300 ease-in-out',
        'w-72 md:w-64',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >

      <!-- Logo Area (Mobile) -->
      <div class="md:hidden px-6 border-b border-slate-200">
        <div class="flex justify-between items-center">
          <img
            src="~/assets/images/e-user-logo.png"
            class="object-contain w-24 h-24"
            alt="Logo"
          />
          <button
            @click="closeSidebar"
            class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <i class="pi pi-times text-lg text-slate-700"></i>
          </button>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto p-4 space-y-1">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="handleNavClick"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
            isActiveRoute(item.path)
              ? 'bg-blue-50 text-emerald-700 font-medium'
              : 'text-slate-700 hover:bg-slate-100'
          ]"
        >
          <i :class="[item.icon, 'text-lg']"></i>
          <span>{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </nav>

      <!-- Logout Section -->
      <div class="border-t border-slate-200 p-4">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <i class="pi pi-sign-out text-lg"></i>
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main
      :class="[
        'pt-16 transition-all duration-300',
        'md:ml-64'
      ]"
    >
      <div class="p-4 md:p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'

interface MenuItem {
  label: string
  path: string
  icon: string
  badge?: number | string
}

// Sidebar state
const isSidebarOpen = ref(false)
const notificationCount = ref(5)

// Router
const route = useRoute()
const router = useRouter()

// Menu items
const menuItems = ref<MenuItem[]>([
  {
    label: 'Profile',
    path: '/support/user/profile',
    icon: 'pi pi-user'
  },
  {
    label: 'Dashboard',
    path: '/support/user/dashboard',
    icon: 'pi pi-th-large'
  },
  {
    label: 'Claim Requests',
    path: '/support/user/claim-management',
    icon: 'pi pi-inbox',
  },
  {
    label: 'Categories & Tags',
    path: '/support/user/category-management',
    icon: 'pi pi-folder'
  },
  {
    label: 'Businesses',
    path: '/support/user/businesses',
    icon: 'pi pi-building'
  },
  {
    label: 'Reviews',
    path: '/support/user/review-moderation',
    icon: 'pi pi-flag',
  },
  {
    label: 'Settings',
    path: '/support/user/settings',
    icon: 'pi pi-cog'
  }
])

// Computed
const pageTitle = computed(() => {
  const currentItem = menuItems.value.find(item => item.path === route.path)
  return currentItem?.label || 'Support'
})

// Methods
const toggleSidebar = (): void => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = (): void => {
  isSidebarOpen.value = false
}

const isActiveRoute = (path: string): boolean => {
  return route.path === path
}

const handleNavClick = (): void => {
  // Close sidebar on mobile when navigating
  if (window.innerWidth < 768) {
    closeSidebar()
  }
}

const handleLogout = async (): Promise<void> => {
  try {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to logout?')
    if (!confirmed) return
    
    // Close sidebar first (for mobile)
    closeSidebar()
    
    // Clear any stored auth tokens
    if (process.client) {
      localStorage.removeItem('authToken')
      sessionStorage.clear()
    }
    
    // Call logout API 
    // await $fetch('/api/auth/logout', { method: 'POST' })
    
    // Redirect to home page
    await router.push('/') // or '/' for home page
    
    // Show success message
    console.log('Logged out successfully')
  } catch (error) {
    console.error('Logout failed:', error)
    alert('Logout failed. Please try again.')
  }
}
</script>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>