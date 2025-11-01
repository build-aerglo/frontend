<template>
  <div class="layout-wrapper layout-content-navbar" 
       :class="{ 'layout-menu-collapsed': isLayoutCollapsed }">
    <div class="layout-container">
      
      <NavSideBar 
        @toggle="toggleLayout" 
        :isLayoutCollapsed="isLayoutCollapsed" 
      />

      <div class="layout-page">
        <nav class="!sm:hidden bg-white w-full py-1 flex items-center justify-between px-6 shadow-md nav sticky top-0">
          <a href="javascript:void(0);" 
            class="nav-item nav-link px-0 p-2 h-full" 
            @click="toggleLayout"
          >
            <i class="pi pi-bars text-2xl"></i> 
          </a>

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
@media (min-width: 1200px) {
  nav {
    display: none !important;
  }
}
.nav {
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

/* Hide overlay completely on desktop (1200px and above) */
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
