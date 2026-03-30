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
              { name: 'Getting Started', url: '/business/auth/sign-up' },
              { name: 'Sign In',         url: '/business/auth/sign-in' },
              { name: 'Create Account',  url: '/business/auth/sign-up' },
              { name: 'Dashboard',       url: '/business/dashboard' },
            ],
          },
          {
            matchTitle: 'Quick Links',
            title: 'Quick Links',
            items: [
              { name: 'Home', url: '/for-business/index-v2' },
              { name: 'About CleReview', url: '/about' },
              { name: 'Help Center', url: '/business/help' }, // <-- Business specific
              { name: 'Contact Us', url: '/about#contact' },
            ]
          },
          {
            matchTitle: 'Support',
            title: 'Support',
            items: [
              { name: 'Terms of Service', url: '/terms-and-conditions' },
              { name: 'Privacy Policy',   url: '/privacy-policy' },
              { name: 'FAQs',             url: '/business/help#faqs' },
            ]
          }
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
