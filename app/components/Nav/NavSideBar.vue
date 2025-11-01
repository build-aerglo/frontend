<template>
  <aside id="layout-menu" class="layout-menu menu-vertical menu"
  >
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

      <li class="menu-item">
        <NuxtLink to="/" class="menu-link flex items-center">
          <i class="menu-icon pi pi-home"></i>
          <div data-i18n="Settings">Dashboard</div>
        </NuxtLink>
      </li>

      <li class="menu-item">
        <NuxtLink to="/" class="menu-link">
          <i class="menu-icon pi pi-comments"></i>
          <div data-i18n="Settings">Reviews management</div>
        </NuxtLink>
      </li>

      <li class="menu-item">
        <NuxtLink to="/" class="menu-link">
          <i class="menu-icon pi pi-chart-bar"></i>
          <div data-i18n="Settings">Reports</div>
        </NuxtLink>
      </li>

      <li class="menu-item">
        <NuxtLink to="/" class="menu-link">
          <i class="menu-icon pi pi-envelope"></i>
          <div data-i18n="Settings">Messages</div>
        </NuxtLink>
      </li>

      <li class="menu-item">
        <NuxtLink to="/" class="menu-link">
          <i class="menu-icon pi pi-lock"></i>
          <div data-i18n="Settings">Access Mnagement</div>
        </NuxtLink>
      </li>
      
      <li class="menu-item">
        <NuxtLink to="/auth/business/profile" class="menu-link">
          <i class="menu-icon pi pi-user"></i>
          <div data-i18n="Settings">Profile</div>
        </NuxtLink>
      </li>
      <li class="menu-item">
        <NuxtLink to="/auth/business/settings" class="menu-link">
          <i class="menu-icon pi pi-cog"></i>
          <div data-i18n="Settings">Settings</div>
        </NuxtLink>
      </li>

      <li class="menu-item">
        <NuxtLink to="/" class="menu-link">
          <i class="menu-icon pi pi-question-circle"></i>
          <div data-i18n="Settings"> Help and support</div>
        </NuxtLink>
      </li>
      
    </ul>
  </aside>
</template>

<script setup>
const props = defineProps({
  isLayoutCollapsed: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['toggle']);
</script>
<style scoped>
 

</style>