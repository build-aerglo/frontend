<template>
  <Toast />
  <div class="flex flex-col min-h-screen">
    <div class="fixed top-0 w-full shadow-lg z-[100]">
      <NavigationHeaderBusiness />
    </div>
    <div class="flex-1 mt-[76px]">
      <slot />
    </div>
    <div>
      <NavigationFooter
        tagline="Build trust, grow your brand, and turn customer feedback into your biggest competitive advantage. Manage reviews, respond to customers, and track performance — all in one place."
        :link-overrides="[
          {
            matchTitle: 'For Users',        // ← lookup key, must match the default exactly
            title: 'For Businesses',        // ← what actually shows as the column heading
            items: [
              { name: 'Getting Started', url: '/business/register' },
              { name: 'Sign In',         url: '/business/login' },
              { name: 'Create Account',  url: '/business/register' },
              { name: 'Dashboard',       url: '/business/dashboard' },
            ],
          },
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
