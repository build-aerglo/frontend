<template>
  <div class="layout-wrapper layout-content-navbar" 
       :class="{ 'layout-menu-collapsed': isLayoutCollapsed }">
    <div class="layout-container">
      
      <NavSideBar 
        @toggle="toggleLayout" 
        :isLayoutCollapsed="isLayoutCollapsed" 
        :menuItems="menuItems" />

      <div class="layout-page">
        <nav class="nav-bar bg-white w-full py-1 flex items-center px-6 shadow-md nav sticky top-0">
          
          <a href="javascript:void(0);" 
            class="nav-item nav-link px-0 p-2 h-full mobile-menu-toggle" 
            @click="toggleLayout"
          >
            <i class="pi pi-bars text-2xl"></i> 
          </a>
          
          <div class="flex items-center justify-between w-full px-0">
  
            <div 
              v-if="route.path === '/business/settings'" 
              class="hidden md:flex items-center space-x-4"
            >
              <ClientOnly>
                <SettingTab />
              </ClientOnly>
            </div>
            
            <div class="flex items-center gap-4 ml-auto">
              <i class="pi pi-bell text-xl text-contrast cursor-pointer"></i>
              <div
                  class="relative w-10 h-10 rounded-full overflow-hidden group cursor-pointer"
                  @click="triggerFileInput" 
              >
                  <img
                      :src="previewUrl || defaultAvatar"
                      alt="Profile"
                      class="w-full h-full object-cover rounded-full border border-gray-300"
                  />
              </div>
            </div>
          </div>
        </nav>

        <div class="content-wrapper">
          <div class="container-xxl flex-grow-1 container-p-y">
            <slot /> 
          </div>
        </div>
        
      </div>
    </div>
    <div 
      class="menu-overlay fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-[1040]"
      :class="{ 'opacity-100 visible': !isLayoutCollapsed, 'opacity-0 invisible': isLayoutCollapsed }"
      @click="toggleLayout"
    ></div>
    </div>
</template>

<script setup>
const route = useRoute()
const menuItems = [
  { name: 'Dashboard', to: '/', icon: 'pi pi-home' },
  { name: 'Reviews management', to: '/reviews', icon: 'pi pi-comments' },
  { name: 'Reports', to: '/reports', icon: 'pi pi-chart-bar' },
  { name: 'Messages', to: '/messages', icon: 'pi pi-envelope' },
  { name: 'Access Management', to: '/access', icon: 'pi pi-lock' },
  { name: 'Profile', to: '/business/profile', icon: 'pi pi-user' },
  { name: 'Settings', to: '/business/settings', icon: 'pi pi-cog' },
  { name: 'Help and support', to: '/help', icon: 'pi pi-question-circle' },
];
const isLayoutCollapsed = ref(true);
const toggleLayout = () => {
  isLayoutCollapsed.value = !isLayoutCollapsed.value;
};
watch(isLayoutCollapsed, (isCollapsed) => {
  if (import.meta.client) { 
    if (!isCollapsed) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }
}, { immediate: true }); 
const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=100'
const previewUrl = ref(null)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  }
}
</script>

