<template>
  <Toast />
  <div class="flex flex-col min-h-screen">
    <!-- Navigation Bar -->
    <nav class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 fixed top-0 z-50 transition-colors duration-300">
      <div class="mx-auto px-8 flex items-center justify-between h-16">
        
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/">
            <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-10 w-auto" />
          </NuxtLink>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center space-x-6">
          <!-- Review Business Button -->
          <div v-if="data">
            <button 
              @click="handleReviewNavigation"
              class="px-6 py-2 bg-[#008253] text-white rounded-lg shadow hover:bg-[#008260] transition whitespace-nowrap font-medium"
            >
              Review Business
            </button>
          </div>

          <!-- User Profile or Login/Register -->
          <div class="flex items-center h-full">
            <!-- User Profile Dropdown -->
            <div v-if="userStore.isAuthenticated && isEndUser" class="relative group flex items-center">
              <button 
                @click.stop="showUserDropdown = !showUserDropdown"
                class="flex items-center focus:outline-none transition-transform hover:scale-105"
              >
                <UserAvatar 
                  v-if="userProfile"
                  :first-name="userProfile?.username"
                  :size="40"
                />
                <div v-else class="h-10 w-10 rounded-full bg-gray-200 animate-pulse border border-gray-100"></div>
                <i class="pi pi-chevron-down ml-1 text-xs text-gray-400"></i>
              </button>
              
              <div v-if="showUserDropdown" class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-[100] origin-top-right">
                <NuxtLink :to="`/user/${userStore.id}`" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="showUserDropdown = false">
                  <i class="pi pi-user mr-2 text-[#008253]"></i> My Profile
                </NuxtLink>
                <button @click.stop="handleLogout" class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <i class="pi pi-sign-out mr-2"></i> Logout
                </button>
              </div>
            </div>

            <!-- Login/Register Button -->
            <ButtonCustom
              v-else-if="!userStore.isAuthenticated"
              @click="showGeneralAuth = true" 
              secondary="true"
              label="Login/Register"
              class="!py-2"
            />
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="md:hidden flex items-center text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none" @click="isOpen = !isOpen">
          <i class="pi pi-bars text-sm"></i>
        </button>
      </div>
    </nav>

    <!-- Mobile Drawer -->
    <div :class="['fixed top-0 left-0  w-[220px] bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 md:hidden z-50', isOpen ? 'translate-x-0' : '-translate-x-full']">
      <ul class="flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-white font-medium p-6 space-y-4">
        
        <!-- Mobile Header -->
        <li>
          <div class="flex items-center justify-between border-b border-gray-200 mx-[-1.5rem] px-[1.5rem] py-1 dark:border-gray-700">
            <!-- Show User Avatar if authenticated -->
            <div v-if="userStore.isAuthenticated && isEndUser">
              <NuxtLink :to="`/user/${userStore.id}`" @click="isOpen = false">
                <UserAvatar 
                  v-if="userProfile"
                  :first-name="userProfile?.username"
                  :size="38"
                />
              </NuxtLink>
            </div>
            
            <!-- Show Logo if not authenticated -->
            <div v-else>
              <NuxtLink to="/" @click="isOpen = false">
                <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" />
              </NuxtLink>
            </div>
            
            <button @click="isOpen = false" class="text-gray-600 dark:text-gray-200">
              <i class="pi pi-times text-sm"></i>
            </button>
          </div>
        </li>

        <!-- Review Business (Mobile) -->
        <li v-if="data">
          <button @click="handleReviewNavigation" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 hover:after:w-full">
            Review Business
          </button>
        </li>

        <!-- My Profile Link (Mobile) - Only if authenticated -->
        <li>
          <NuxtLink to="/end-user/landing/categories" @click="isOpen = false" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 hover:after:w-full">
            Categories
          </NuxtLink>
        </li>

        <!-- Auth Section (Mobile) -->
        <li class="pt-4 border-t">
          <!-- Logout Button -->
          <button 
            v-if="userStore.isAuthenticated && isEndUser"
            @click="handleLogout" 
            class="text-red-600 hover:text-red-700"
          >
            <i class="pi pi-sign-out mr-2"></i> Logout
          </button>

          <!-- Login/Register Button -->
          <ButtonCustom
            v-else-if="!userStore.isAuthenticated"
            @click="showGeneralAuth = true; isOpen = false" 
            primary=true
            label="Login/Register"
          />
        </li>
      </ul>
    </div>

    <!-- Mobile Menu Backdrop -->
    <div v-if="isOpen" class="fixed inset-0 z-30 md:hidden bg-black/20 backdrop-blur-md transition-all duration-300" @click="isOpen = false"></div>
    
    <!-- Main Content - Add top padding to account for fixed navbar -->
    <div class="flex-1 mt-16 px-[8px] py-[20px]">
      <slot />
    </div>

    <!-- Modals (Teleport) -->
    <Teleport to="body">
      <!-- Review Modal -->
      <div v-if="showReviewModal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeReviewAndClearDraft"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]">
          <button @click="closeReviewAndClearDraft" class="absolute top-5 right-5 text-gray-400">
            <i class="pi pi-times text-xl"></i>
          </button>
          
          <ReviewForm 
            v-if="reviewDraft"
            :initial-data="reviewDraft"
            @close="closeReviewAndClearDraft" 
            @open-auth="handleOpenAuth" 
            @success="closeReviewAndClearDraft"
          />
        </div>
      </div>

      <!-- Auth Modal -->
      <AuthUnifiedModal 
        v-if="showAuthModal" 
        @close="showAuthModal = false" 
        @authenticated="onUserAuthenticated"
        @back-to-review="handleBackToReview"
      />

      <!-- General Auth Modal -->
      <AuthUnifiedModal 
        v-if="showGeneralAuth" 
        :hide-back-to-review="true"
        @close="showGeneralAuth = false" 
        @authenticated="handleGeneralAuthSuccess"
      />

      <!-- Logout Confirmation Modal -->
      <LogoutConfirm />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePageData } from "~/composables/method/usePageData";
import { useUserStore } from '~/store/user';
import ReviewForm from '~/components/Review/ReviewForm.vue';
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";
import useMethods from '~/composables/useMethods';
import useRoleAccess from '~/composables/useRoleAccess';

const userStore = useUserStore();
const pageData = usePageData();
const { triggerLogout } = useMethods();
const { getUserProfile } = useUserProfileMethods();
const { isEndUser } = useRoleAccess();

// UI State
const showReviewModal = ref(false);
const showAuthModal = ref(false);
const showGeneralAuth = ref(false);
const reviewDraft = ref<any>(null);
const isOpen = ref(false);
const showUserDropdown = ref(false);
const userProfile = ref<any>(null);

// Get business data from the composable
const data = computed(() => pageData.value?.data);

// Fetch user profile data
const fetchProfileData = async () => {
  if (!userStore.id || !userStore.isAuthenticated) return;
  
  try {
    const response = await getUserProfile(userStore.id);
    
    if (response && response.data) {
      userProfile.value = response.data;
    } else {
      console.warn("Profile data structure unexpected:", response);
    }
  } catch (error) {
    console.error("Biz Layout Profile Fetch Error:", error);
    userProfile.value = null; 
  }
};

// Handle logout - close dropdown and trigger logout modal
const handleLogout = () => {
  showUserDropdown.value = false;
  isOpen.value = false;
  triggerLogout();
};

const handleReviewNavigation = () => {
  isOpen.value = false; // Close mobile drawer if open
  
  console.log("Button Clicked. Business Data:", data.value);
  
  if (!data.value) {
    console.error("No business data found in usePageData");
    return;
  }

  if (userStore.isAuthenticated) {
    // Redirect directly to the write-review page
    navigateTo({
      path: '/review/write-review',
      query: { 
        bizId: data.value.id, 
        bizName: data.value.name,
        bizLogo: data.value.logo 
      }
    });
  } else {
    // Setup the draft and show the modal
    reviewDraft.value = {
      businessName: data.value.name,
      selectedBusinessId: data.value.id,
      selectedBusinessLogo: data.value.logo,
      rating: 0,
      reviewBody: '',
      images: [], 
      isAddingNewBusiness: false
    };

    console.log("Opening Review Modal for Guest with Draft:", reviewDraft.value);
    showReviewModal.value = true;
  }
};

// Modal Handlers
const handleOpenAuth = (currentFormData: any) => {
  reviewDraft.value = currentFormData;
  localStorage.setItem('review_draft', JSON.stringify(currentFormData));
  showReviewModal.value = false;
  showAuthModal.value = true;
};

const onUserAuthenticated = () => {
  showAuthModal.value = false;
  showReviewModal.value = true; 
};

const handleBackToReview = () => {
  showAuthModal.value = false;
  showReviewModal.value = true;
};

const closeReviewAndClearDraft = () => {
  showReviewModal.value = false;
  reviewDraft.value = null;
  localStorage.removeItem('review_draft');
};

const handleGeneralAuthSuccess = () => {
  showGeneralAuth.value = false;
};

// Watcher: Runs when userStore.isAuthenticated changes
watch(() => userStore.isAuthenticated, (isLoggedIn) => {
  if (isLoggedIn) {
    fetchProfileData();
    const saved = localStorage.getItem('review_draft');
    if (saved) {
      reviewDraft.value = JSON.parse(saved);
      showAuthModal.value = false;
      showReviewModal.value = true;
    }
  } else {
    userProfile.value = null;
  }
});

// Auto-open if returning from login
onMounted(() => {
  if (userStore.isAuthenticated) {
    fetchProfileData();
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    showUserDropdown.value = false;
  });

  const saved = localStorage.getItem('review_draft');
  if (userStore.isAuthenticated && saved) {
    reviewDraft.value = JSON.parse(saved);
    showAuthModal.value = false;
    showReviewModal.value = true;
  }
});
</script>