<template>
  <div class="layout-wrapper layout-content-navbar" 
       :class="{ 'layout-menu-collapsed': isLayoutCollapsed }">
    <div class="layout-container">
      
      <NavSideBar 
        @toggle="toggleLayout" 
        :isLayoutCollapsed="isLayoutCollapsed" 
      />

      <div class="layout-page">
        
        <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme !sticky top-3 nav-blur-effect" id="layout-navbar">
          
          <div class="navbar-content w-full flex items-center px-4 h-full">
            
            <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-block d-xl-none z-50">
              <a href="javascript:void(0);" 
                class="nav-item nav-link px-0 p-2 h-full" 
                @click="toggleLayout"
              >
                <i class="pi pi-bars text-2xl"></i> 
              </a>
            </div>
            
            <div class="flex-grow"></div>

            <div class="flex items-center space-x-4">
              
              <div class="nav-item cursor-pointer">
                <i class="pi pi-bell text-xl text-gray-70 transition-colors"></i>
              </div>

              <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                  <div class="w-10 h-10 rounded-full !bg-primary flex items-center justify-center text-white border-2 border-white shadow-md">
                    <i class="pi pi-user text-xl"></i> 
                  </div>
                </a>
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
      class="menu-overlay fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-[1040] sm:hidden"
      :class="{ 'opacity-100 visible': !isLayoutCollapsed, 'opacity-0 invisible': isLayoutCollapsed }"
      @click="toggleLayout"
    ></div>

  </div>
</template>

<script setup>
const isLayoutCollapsed = ref(true);

const toggleLayout = () => {
  console.log("Toggling sidebar. New state:", !isLayoutCollapsed.value);
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
</script>

<style scoped>
.layout-navbar {
  z-index: 1020 !important; 
}

/* Sidebar transitions */
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

@media (max-width: 640px) {
  .menu-overlay {
    opacity: 0;
    visibility: hidden;
  }

  .menu-overlay.opacity-100.visible {
    opacity: 1 !important;
    visibility: visible !important;
  }

  .menu-overlay.opacity-0.invisible {
    opacity: 0 !important;
    visibility: hidden !important;
  }
}

/* Preventing overlay from appearing on larger screens */
@media (min-width: 641px) {
  .menu-overlay {
    display: none !important;
  }
}

</style>
