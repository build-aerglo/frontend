<template>
  <aside id="layout-menu" 
         class="layout-menu menu-vertical menu"
  >
    <div class="app-brand demo">
      <NuxtLink to="/" class="app-brand-link">
        <NavLogo />
      </NuxtLink>

      <a href="javascript:void(0);"
         class="layout-menu-toggle menu-link text-large ms-auto"
         @click.stop="$emit('toggle')"
      >
        <i class="pi pi-envelope menu-toggle-icon d-none d-xl-block"></i>
        <i class="pi pi-times d-block d-xl-none"></i>
      </a>
      
    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-1">
      
      <li class="menu-item">
        <NuxtLink to="/" class="menu-link">
          <i class="menu-icon pi pi-cog"></i>
          <div data-i18n="Settings">Settings</div>
        </NuxtLink>
      </li>
      
    </ul>
  </aside>
</template>

<script setup>

const emit = defineEmits(['toggle']);
</script>
<style scoped>
 

</style>