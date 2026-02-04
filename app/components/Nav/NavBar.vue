<template>
  <nav class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
    <div class="mx-auto px-8 flex items-center justify-between h-16">
      
      <div class="flex items-center">
        <NuxtLink to="/">
          <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-10 w-auto" />
        </NuxtLink>
      </div>

      <div class="flex items-center space-x-6">
        
        <div class="hidden md:block relative">
          <button @click.stop="toggleBusinessDropdown" class="flex items-center dark:text-gray-200 font-medium hover:text-primary focus:outline-none after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 hover:after:w-full">
            For Business
            <i class="pi pi-chevron-down ml-1 text-sm"></i>
          </button>

          <div v-if="showBusinessDropdown" class="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-56 z-50">
            <NuxtLink to="/business/auth/sign-up" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="pi pi-briefcase mr-2 text-primary"></i> Add a Business
            </NuxtLink>
            <NuxtLink to="/business/auth/sign-in" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="pi pi-sign-in mr-2 text-primary"></i> Log in to Business
            </NuxtLink>
            <button @click="showClaimModal = true" class="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="pi pi-id-card mr-2 text-primary"></i> 
              <span>Claim a Business</span>
            </button>
          </div>
        </div>

        <div class="hidden md:block">
          <button @click="handleWriteReviewClick" class="px-6 py-2 bg-[#008253] text-white rounded-lg shadow hover:bg-[#008260] transition whitespace-nowrap font-medium">
            Write a review
          </button>
        </div>

        <div class="hidden md:flex items-center h-full">
          <div v-if="userStore.isAuthenticated" class="relative group flex items-center">
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
              <button @click="triggerLogout()" class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <i class="pi pi-sign-out mr-2"></i> Logout
              </button>
            </div>
          </div>

          <ButtonCustom
            v-else 
            @click="showGeneralAuth = true" 
            secondary="true"
            label="login/register"
            class="!py-2"
          />
        </div>

        <button class="md:hidden flex items-center text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none" @click="isOpen = !isOpen">
          <i class="pi pi-bars text-sm"></i>
        </button>
      </div>
    </div>

    <div :class="['fixed top-0 left-0 h-full w-[220px] bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 md:hidden z-50', isOpen ? 'translate-x-0' : '-translate-x-full']">
      

      <ul class="flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-white font-medium p-6  space-y-4">
        <li>
          <div class="flex items-center justify-between border-b border-gray-200 mx-[-1.5rem] px-[1.5rem] py-1 dark:border-gray-700 ">
            <div v-if="userStore.isAuthenticated">
              <NuxtLink :to="`/user/${userStore.id}`" @click="isOpen = false">
                <UserAvatar 
                  v-if="userProfile"
                  :first-name="userProfile?.username"
                  :size="38"
                />
              </NuxtLink>
            </div>
            
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
        <li>
          <button @click="handleWriteReviewClick" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 hover:after:w-full">Write a Review</button>
        </li>
        <li>
          <NuxtLink to="/end-user/landing/categories" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 hover:after:w-full">Categories</NuxtLink>
        </li>
        <li>
          <button @click.stop="toggleBusinessDropdown" class="flex items-center justify-between w-full hover:text-primary focus:outline-none">
            <span>For Business</span>
            <i class="pi pi-chevron-down text-sm"></i>
          </button>
          <div v-if="showBusinessDropdown" class="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <NuxtLink to="/business/auth/sign-up" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-100 dark:hover:bg-gray-700">
              <i class="pi pi-briefcase mr-2 text-primary"></i> Add a Business
            </NuxtLink>
            <NuxtLink to="/business/auth/sign-in" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-100 dark:hover:bg-gray-700">
              <i class="pi pi-sign-in mr-2 text-primary"></i> Log in to Business
            </NuxtLink>
            <button @click="showClaimModal = true; isOpen = false" class="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-100 dark:hover:bg-gray-700">
              <i class="pi pi-id-card mr-2 text-primary"></i> 
              <span class="text-left">Claim a Business</span>
            </button>
          </div>
        </li>

        <li class="pt-4 border-t">
          <button 
            v-if="userStore.isAuthenticated" 
            @click="triggerLogout(); isOpen = false" 
            class="text-red-600"
          >
            <i class="pi pi-sign-out mr-2"></i> Logout
          </button>
          <ButtonCustom 
            v-else 
            @click="showGeneralAuth = true; isOpen = false" 
            primary= true
            label="Login/Register"
          />
        </li>
      </ul>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-30 md:hidden bg-black/20 backdrop-blur-md transition-all duration-300" @click="isOpen = false"></div>

    <Teleport to="body">
      <div v-if="showReviewModal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeReviewAndClearDraft"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]">
          <button @click="closeReviewAndClearDraft" class="absolute top-5 right-5 text-gray-400"><i class="pi pi-times text-xl"></i></button>
          <ReviewForm :initial-data="reviewDraft" @close="closeReviewAndClearDraft" @open-auth="handleOpenAuth" @success="closeReviewAndClearDraft" />
        </div>
      </div>
      <AuthUnifiedModal v-if="showAuthModal" @close="showAuthModal = false" @authenticated="onUserAuthenticated" @back-to-review="handleBackToReview" />
      <SearchBusinessClaim v-if="showClaimModal" @close="showClaimModal = false" @search="navigateToClaimPage" />
      <AuthUnifiedModal v-if="showGeneralAuth" :hide-back-to-review="true" @close="showGeneralAuth = false" @authenticated="handleGeneralAuthSuccess" />
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import ReviewForm from '~/components/Review/ReviewForm.vue'
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";
import useMethods from '~/composables/useMethods';
const { triggerLogout } = useMethods()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const { getUserProfile } = useUserProfileMethods();
// --- UI State ---
const isOpen = ref(false)               
const showBusinessDropdown = ref(false)  
const showReviewModal = ref(false)       
const showAuthModal = ref(false)  
const showGeneralAuth = ref(false)       
const reviewDraft = ref<any>(null)       
const showClaimModal = ref(false);
const userProfile = ref<any>(null);
const showUserDropdown = ref(false);
// --- Logic ---
const fetchProfileData = async () => {
  if (!userStore.id || !userStore.isAuthenticated) return;
  
  try {
    const response = await getUserProfile(userStore.id);
    
    // Defensive check: make sure response and response.data exist
    if (response && response.data) {
      userProfile.value = response.data;
    } else {
      console.warn("Profile data structure unexpected:", response);
    }
  } catch (error) {
    console.error("NavBar Profile Fetch Error:", error);
    userProfile.value = null; 
  }
};


const handleWriteReviewClick = () => {
  isOpen.value = false
  if (userStore.isAuthenticated) {
    router.push('/review/write-review')
  } else {
    showReviewModal.value = true
  }
}

const handleOpenAuth = (currentFormData: any) => {
  reviewDraft.value = currentFormData 
  localStorage.setItem('review_draft', JSON.stringify(currentFormData))
  showReviewModal.value = false
  showAuthModal.value = true
}

const onUserAuthenticated = () => {
  // This is the manual trigger after a successful login
  showAuthModal.value = false
  showReviewModal.value = true 
}

const handleBackToReview = () => {
  showAuthModal.value = false
  showReviewModal.value = true
}

const closeReviewAndClearDraft = () => {
  showReviewModal.value = false
  reviewDraft.value = null
  localStorage.removeItem('review_draft')
}

const toggleBusinessDropdown = (event: MouseEvent) => {
  event.stopPropagation()
  showBusinessDropdown.value = !showBusinessDropdown.value
}

// Watcher: Runs when userStore.isAuthenticated changes while the user is on the page
watch(() => userStore.isAuthenticated, (isLoggedIn) => {
  if (isLoggedIn) {
    fetchProfileData(); // This handles profile fetch on login
    const saved = localStorage.getItem('review_draft')
    if (saved) {
      reviewDraft.value = JSON.parse(saved)
      showAuthModal.value = false 
      showReviewModal.value = true
    }
  } else {
    userProfile.value = null; // Clears profile on logout
  }
})

onMounted(() => {
  if (userStore.isAuthenticated) {
    fetchProfileData();
  }
  document.addEventListener('click', () => {
    showBusinessDropdown.value = false
    showUserDropdown.value = false;
  })

  // Re-populate if user returns logged in (e.g. after a page redirect login)
  const saved = localStorage.getItem('review_draft')
  if (userStore.isAuthenticated && saved) {
    reviewDraft.value = JSON.parse(saved)
    // ADD THESE TWO LINES
    showAuthModal.value = false // Ensure the login modal is closed on mount
    showReviewModal.value = true
  }
  if (route.query.auth === 'login') {
    showGeneralAuth.value = true
    
    // Optional: Clean up the URL so it doesn't reopen on refresh
    router.replace({ query: { ...route.query, auth: undefined } })
  }
})
const navigateToClaimPage = (businessName: string) => {
  showClaimModal.value = false;
  
  // Navigate to the claim page using the search query as the ID
  // This results in /biz/BusinessName/claim-business
  router.push(`/biz/${encodeURIComponent(businessName)}/claim-business`);
};
const handleGeneralAuthSuccess = () => {
  showGeneralAuth.value = false
}
</script>