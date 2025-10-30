<template>
  <div class="layout-wrapper layout-content-navbar" 
       :class="{ 'layout-menu-collapsed': isLayoutCollapsed }">
    <div class="layout-container">
      
      <NavSideBar @toggle="toggleLayout" />

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
            
            <div class="flex-grow">
              </div>


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
    
    <div v-if="!isLayoutCollapsed" class="layout-overlay layout-menu-toggle" @click="toggleLayout"></div>
    
  </div>
</template>

<script setup>

const isLayoutCollapsed = ref(false);

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

@media (max-width: 1200px) {
  body.menu-open .layout-menu {
    visibility: visible !important;
    transform: translateX(0) !important;
    z-index: 1050 !important;
  }
}

</style>