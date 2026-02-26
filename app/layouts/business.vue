<template>
  <Toast />
  <Drawer
    v-model:visible="showNotifications"
    header="Notifications"
    class="!w-full md:!w-80 lg:!w-[30rem]"
    position="right"
  >
    <div v-if="announcements.length > 0">
      <div class="flex flex-col gap-[20px]">
        <AnnouncementNotification
          v-for="(i, idx) in announcements"
          :key="idx"
          :data="i"
        />
      </div>
    </div>
    <div v-else class="flex justify-center items-center">
      <div class="min-h-[300px] flex flex-col justify-center items-center">
        <i class="pi pi-bell text-[500%] mb-[20px]"></i>
        <div class="font-bold text-[120%]">No new notification!</div>
        <div>Check back later.</div>
      </div>
    </div>
  </Drawer>
  <div
    class="layout-wrapper layout-content-navbar"
    :class="{ 'layout-menu-collapsed': isLayoutCollapsed }"
  >
    <div class="layout-container">
      <NavSideBar
        @toggle="toggleLayout"
        :isLayoutCollapsed="isLayoutCollapsed"
        :menuItems="menuItems"
      />

      <div class="layout-page">
        <nav
          class="nav-bar bg-white w-full py-1 flex items-center px-6 shadow-bottom nav sticky top-0"
        >
          <a
            href="javascript:void(0);"
            class="nav-item nav-link px-0 p-2 h-full mobile-menu-toggle"
            @click="toggleLayout"
          >
            <i class="pi pi-bars text-2xl"></i>
          </a>

          <div class="flex items-center justify-between w-full px-0">
            <div class="flex items-center gap-4 ml-auto">
              <OverlayBadge
                :value="announcements.length > 0 ? announcements.length : null"
                severity="danger"
              >
                <i
                  class="pi pi-bell text-xl text-contrast cursor-pointer"
                  :class="{ 'bell-pulse': announcements.length > 0 }"
                  @click="showNotifications = !showNotifications"
                />
              </OverlayBadge>
              <div
                class="relative w-10 h-10 rounded-full overflow-hidden group cursor-pointer"
              >
                <img
                  :src="business?.logo ?? '/images/avatar_profile.png'"
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
        <!-- <footer class="footer bg-white border-t border-gray-200 p-8 mt-12">
          <div class="container-xxl mx-auto">

            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

              <div class="col-span-full lg:col-span-2">
                <p class="text-[150%] font-semibold text-gold mb-3">CleReview</p>
                <p class="text-[100%] text-contrast w-full md:max-w-md">
                  Empower your business with real-time customer insights. Turn feedback into fuel for growth and
                  excellence.
                </p>
              </div>

              <div>
                <h3 class="text-[140%] font-semibold text-contrast mb-4">Quick Links</h3>
                <ul class="space-y-2 text-sm">
                  <li>
                    <NuxtLink to="/" class="!text-link hover:underline">Home</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/about" class="!text-link hover:underline">About Us</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/contact" class="!text-link hover:underline">Contact</NuxtLink>
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="text-[140%] font-semibold text-contrast mb-4">Support</h3>
                <ul class="space-y-2 text-sm">
                  <li>
                    <NuxtLink to="/faqs" class="!text-link hover:underline">FAQs</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/help-center" class="!text-link hover:underline">Help Center</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/terms" class="!text-link hover:underline">Terms of Service</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/privacy" class="!text-link hover:underline">Privacy Policy</NuxtLink>
                  </li>
                </ul>
              </div>

            </div>

            <hr class="my-8 border-gray-200" />

            <div class="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
              <p class="mb-4 sm:mb-0 text-contrast">
                &copy; {{ new Date().getFullYear() }} <span class="text-gold">CleReview</span>. All rights reserved.
              </p>
            </div>
          </div>
        </footer> -->
      </div>
    </div>
    <div
      class="menu-overlay fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-[1040]"
      :class="{
        'opacity-100 visible': !isLayoutCollapsed,
        'opacity-0 invisible': isLayoutCollapsed,
      }"
      @click="toggleLayout"
    ></div>
    <LogoutConfirm />
  </div>
</template>

<script setup>
import LogoutConfirm from "~/components/LogoutConfirm.vue";
import useAnnouncementMethods from "~/composables/announcements/useAnnouncementMethods";
import useBusinessMethods from "~/composables/business/useBusinessMethods";
const menuItems = [
  { name: "Dashboard", to: "/business/dashboard", icon: "pi pi-home" },
  {
    name: "Reviews management",
    to: "/business/reviews-management",
    icon: "pi pi-comments",
  },
  { name: "Reports", to: "/business/reports", icon: "pi pi-chart-bar" },
  { name: "Messages", to: "/business/messages", icon: "pi pi-envelope" },
  { name: "Access Management", to: "/business/access", icon: "pi pi-lock" },
  { name: "Profile", to: "/business/profile/", icon: "pi pi-user" },
  {
    name: "Business Branches",
    to: "/business/branches/",
    icon: "pi pi-warehouse",
  },
  { name: "Settings", to: "/business/setting/", icon: "pi pi-cog" },
  {
    name: "Help and support",
    to: "/business/help",
    icon: "pi pi-question-circle",
  },
];

const showNotifications = ref(false);
const { getAnnouncements } = useAnnouncementMethods();
const announcements = getAnnouncements().data;

const isLayoutCollapsed = ref(true);
const toggleLayout = () => {
  isLayoutCollapsed.value = !isLayoutCollapsed.value;
};

const { getBusinessUser } = useBusinessMethods();
const business = getBusinessUser();

watch(
  isLayoutCollapsed,
  (isCollapsed) => {
    if (import.meta.client) {
      if (!isCollapsed) {
        document.body.classList.add("menu-open");
      } else {
        document.body.classList.remove("menu-open");
      }
    }
  },
  { immediate: true },
);
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
    transition:
      transform 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
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
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
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

/* // bell */

bell-pulse {
  animation: bellPulse 1.5s infinite ease-in-out;
}

@keyframes bellPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
</style>
