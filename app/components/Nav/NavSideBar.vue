<template>
  <aside id="layout-menu" class="layout-menu menu-vertical menu">
    <div class="app-brand demo">
      <NuxtLink v-if="!isLayoutCollapsed" to="/" class="app-brand-link">
        <NavLogo height="h-[40px]" />
      </NuxtLink>

      <a href="javascript:void(0);"
        class="layout-menu-toggle menu-link text-large ms-auto pt-[14px] pr-2"
        @click.stop="$emit('toggle')"
      >
        <i 
          v-if="isLayoutCollapsed" 
          class="pi pi-chevron-right d-none d-xl-block"
        ></i>      
        <i 
          v-else 
          class="pi pi-times d-none d-xl-block"
        ></i>
        <i class="pi pi-times d-block d-xl-none"></i>
      </a>
      
    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-3">
      
      <li 
        v-for="item in menuItems" 
        :key="item.name" 
        class="menu-item"
        :class="{ 'active': $route.path === item.to }"
      >
        <NuxtLink :to="item.to" class="menu-link flex items-center">
          <i class="menu-icon" :class="item.icon"></i>
          <div data-i18n="Menu Item">{{ item.name }}</div>
        </NuxtLink>
      </li>
      
    </ul>
    
    <div class="p-4">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-all duration-200 px-3 py-2"
      >
        <i class="pi pi-sign-out text-lg"></i>
        <span v-if="!isLayoutCollapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  isLayoutCollapsed: {
    type: Boolean,
    required: true,
  },
  menuItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['toggle']);

const handleLogout = () => {
    console.log("Logging out...");
};
</script>

<style scoped>
 .menu-icon {
  @apply flex items-center justify-center text-[18px] leading-none;
}
.menu-item.active > .menu-link {
  
 background: linear-gradient(
    90deg, 
    rgba(0, 26, 214, 0.7) 20%, 
    rgba(0, 130, 83, 0.7) 80%
  );
  
  box-shadow: 0 0.125rem 0.375rem 0 rgba(0, 130, 83, 0.3);
  
  @apply text-white; 
}

</style>