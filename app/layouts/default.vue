<template>
  <div class="layout-wrapper layout-content-navbar" 
       :class="{ 'layout-menu-collapsed': isLayoutCollapsed }">
    <div class="layout-container">
      
      <NavSideBar 
        @toggle="toggleLayout" 
        :isLayoutCollapsed="isLayoutCollapsed" 
      />

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
              v-if="route.path === '/auth/business/settings'" 
              class="hidden md:flex items-center space-x-4"
            >
              <ClientOnly>
                <SettingTab />
              </ClientOnly>
            </div>
            
            <div v-if="route.path === '/auth/business/settings'" class="flex-grow hidden md:block"></div> 

            <div class="flex items-center gap-4 ml-auto">
              <i class="pi pi-bell text-xl text-gray-600 cursor-pointer"></i>

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

<style scoped>
@media (min-width: 1201px) {
  .mobile-menu-toggle {
    display: none !important;
  }
}
@media (min-width: 1200px) {
  .nav {
    padding: 12px 20px 12px 20px !important; 
  }
}
.nav {
  z-index: 1020 !important; 
}

@media (max-width: 1200px) {
  .layout-menu {
    position: fixed !important;
    top: 0; 
    left: 0;
    height: 100vh;
    width: 260px;
    background-color: white;
    transform: translateX(-100%);
    opacity: 0;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    z-index: 1050;
    pointer-events: none;
  }

  body.menu-open .layout-menu {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
  }
}

@media (max-width: 1199px) {
  .menu-overlay {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .menu-overlay.opacity-100.visible {
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto;
  }

  .menu-overlay.opacity-0.invisible {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none;
  }
}
@media (min-width: 1200px) {
  .menu-overlay {
    display: none !important;
  }
}
@media (min-width: 1200px) {
  .layout-menu {
    position: sticky !important;
    top: 0; 
    left: 0;
    height: 100vh;
  }
}
</style>