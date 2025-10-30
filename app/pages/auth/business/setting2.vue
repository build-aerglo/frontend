<template>
  <div>
    <div class="!bg-primary text-white p-10 md:hidden">
      <div class="flex gap-4 justify-start items-center">
        <NuxtLink to="/"><</NuxtLink>
        <p class="text-[140%]">Settings</p>
      </div>
      <div class="flex gap-4">
        <p class="text-[90%]">profile image</p>
        <p class="text-120%">profile picture</p>
      </div>
    </div>
    <div class="bg-white rounded-[30px] p-6 mt-[-30px] md:hidden">
      <div class="flex flex-col gap-4"> 
              
        <div 
          v-for="section in subLinks"
          :key="section.id"
          class="card w-full shadow-md rounded-lg overflow-hidden"
        >
          <div 
            @click="toggleMobileSection(section.id)"
            class="flex justify-between items-center px-3 cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div class="flex items-center gap-3">
              <i :class="[section.icon, 'text-[100%] text-primary-500 align-middle' ]"></i> 
              <h2 class="text-[100%] font-semibold text-gray-700 align-middle">
                {{ section.label }}
              </h2>
            </div>

            <i
              :class="[
                'pi pi-chevron-down transition-transform duration-200 text-gray-600 text-xl',
                openMobileSection === section.id ? 'rotate-180' : ''
              ]"
            ></i>
          </div>

          <div v-show="openMobileSection === section.id" class="p-4 border-t border-gray-200">
            
            <div v-if="section.id === 'business-profile'">
              <form class="space-y-4">
                <InputTextCustom type="text" label="Business name" />
                <InputTextAreaCustom rows="4" label="Business address" />
                <InputTextAreaCustom rows="4" label="Business description" />
                <InputSelect label="Business Sector" />
                <InputSelect label="Opening days and time" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>

            <div v-else-if="section.id === 'contact-info'">
              <form class="space-y-4">
                <InputTextCustom type="email" label="E-mail" />
                <InputTextCustom type="tel" label="Phone Number" />
                <InputSelect label="Preferred mode of contact" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>

            <div v-else-if="section.id === 'web-links'">
              <form class="space-y-4">
                <InputSelect label="Social media links" />
                <InputTextCustom type="url" label="Website link" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>
            
            <div v-else-if="section.id === 'media-branding'">
              <form class="space-y-4">
                <InputTextCustom type="file" label="Business logo" />
                <InputTextCustom type="file" label="Media files" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>

            <div v-else-if="section.id === 'security'">
              <form class="space-y-4">
                <InputTextCustom type="password" label="Current Password" />
                <InputTextCustom type="password" label="New Password" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>
        
            </div>
          </div>
      </div>
    </div>


    <!-- Layout wrapper -->
    <div class=" layout-wrapper layout-content-navbar">
      <div class="layout-container">
        <!-- Menu -->
        <aside id="layout-menu" class="layout-menu menu-vertical menu !fixed top-0 bottom-0 w-64 z-10">
          <div class="app-brand demo py-4 px-5">
            <NuxtLink>
              <NavLogo height="h-[40px]" />
            </NuxtLink>
          </div>

          <ul class="space-y-2 px-2">
            <!-- SETTINGS DROPDOWN -->
            <li>
              <button
                @click="toggleDropdown('settings')"
                class="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium"
              >
                <span>Settings</span>
                <i
                  :class="[
                    'pi pi-chevron-down transition-transform duration-200',
                    openDropdown === 'settings' ? 'rotate-180' : ''
                  ]"
                ></i>
              </button>

              <!-- Dropdown sublinks -->
              <ul
                v-show="openDropdown === 'settings'"
                class="pl-6 mt-1 space-y-1 transition-all duration-300"
              >
                <li v-for="item in subLinks" :key="item.id">
                  <button
                    @click="scrollToSection(item.id)"
                    class="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-600"
                  >
                    {{ item.label }}
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </aside>

        <!-- Layout container -->
        <div class="layout-page ml-64">
          <nav
            class="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl  align-items-center bg-navbar-theme !sticky top-0"
            id="layout-navbar">
              <div class="w-full h-full px-6 flex items-center justify-start">
    
                <form class="w-full max-w-md mr-6" @submit.prevent>
                  <div class="relative">
                    <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg align-middle"></i>
                    
                    <input 
                      type="text"
                      placeholder="Search settings..."
                      class="w-full py-2 pl-10 pr-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
                    />
                  </div>
                </form>
    
              </div>
   
          </nav>

          <div class="flex flex-col items-start mt-4 gap-4  px-6">
            <div class="card w-full scroll-mt-25" id="business-profile">
              <form class="px-6 py-5">
                <h1 class="text-[150%] text-contrast">Business Profile</h1>
                <InputTextCustom type="text" label="Business name" />
                <InputTextAreaCustom rows="4" label="Business address" />
                <InputTextAreaCustom rows="4" label="Business description" />
                <InputSelect label="Business Sector" />
                <InputSelect label="Opening days and time" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>

            <div class="card w-full scroll-mt-25" id="contact-info">
              <form class="px-6 py-5">
                <h1 class="text-[150%] text-contrast">Contact Information</h1>
                <InputTextCustom type="email" label="E-mail" />
                <InputTextCustom type="tel" label="Phone Number" />
                <InputSelect label="Preferred mode of contact" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>

            <div class="card w-full scroll-mt-25" id="web-links">
              <form class="px-6 py-5">
                <h1 class="text-[150%] text-contrast">Web Links</h1>
                <InputSelect label="Social media links" />
                <InputTextCustom type="url" label="Website link" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>

            <div class="card w-full scroll-mt-25" id="media-branding">
              <form class="px-6 py-5">
                <h1 class="text-[150%] text-contrast">Media & Branding</h1>
                <InputTextCustom type="file" label="Business logo" />
                <InputTextCustom type="file" label="Media files" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>

            <div class="card w-full scroll-mt-25" id="security">
              <form class="px-6 py-5">
                <h1 class="text-[150%] text-contrast">Security</h1>
                <InputTextCustom type="password" label="Current Password" />
                <InputTextCustom type="password" label="New Password" />
                <ButtonCustom label="Save changes" size="lg" primary="true"
                  input-class="p-[10px] text-[15px] mt-4 w-auto" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const openDropdown = ref<string | null>(null);
const subLinks = [
  { id: "business-profile", label: "Business Profile", icon: "pi pi-building" },
  { id: "contact-info", label: "Contact Information", icon: "pi pi-phone" },
  { id: "web-links", label: "Web Links", icon: "pi pi-link" },
  { id: "media-branding", label: "Media & Branding", icon: "pi pi-image" },
  { id: "security", label: "Security", icon: "pi pi-lock" },
];

const toggleDropdown = (menu: string) => {
  openDropdown.value = openDropdown.value === menu ? null : menu;
};

// Smooth scroll function
const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
const openMobileSection = ref<string | null>(null);
const toggleMobileSection = (id: string) => {
  openMobileSection.value = openMobileSection.value === id ? null : id;
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

@media (max-width: 767px) {
    .layout-wrapper.layout-content-navbar {
        display: none !important;
    }
}

</style>
