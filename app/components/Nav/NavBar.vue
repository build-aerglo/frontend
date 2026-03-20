<template>
  <nav class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
    <div class="mx-auto px-8 flex items-center justify-between h-16">
      
      <!-- Logo -->
      <div class="flex items-center w-40 flex-shrink-0">
        <NuxtLink to="/">
          <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-10 w-auto" />
        </NuxtLink>
      </div>

      <!-- Search Bar (Desktop) -->
      <div class="flex-1 flex justify-center px-4">
        <Transition name="fade">
          <div v-if="showNavbarSearch" class="w-full max-w-sm">
            <div class="relative w-full">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
              <input
                v-model="navbarSearchQuery"
                type="text"
                placeholder="search business"
                class="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008253] focus:border-transparent transition"
                @input="onNavbarInput"
                @keydown.enter="handleNavbarSearch"
              />
            </div>
          </div>
        </Transition>
      </div>

      <!-- Desktop Menu -->
      <div class="flex items-center space-x-6 flex-shrink-0">
        
        <!-- Write a Review Button -->
        <div class="hidden md:block">
          <ButtonCustom
            @click="handleWriteReviewClick" 
            primary="true"
            label="Write a review"
            size="lg"
          />
        </div>

        <!-- User Profile Dropdown (if authenticated) -->
        <div v-if="userStore.isAuthenticated" class="hidden md:flex items-center relative">
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
          
          <div v-if="showUserDropdown" class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-[100]">
            <NuxtLink :to="`/user/${userStore.id}`" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="showUserDropdown = false">
              <i class="pi pi-user mr-2 text-[#008253]"></i> My Profile
            </NuxtLink>
            <button @click="triggerLogout(); showUserDropdown = false" class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:hover:bg-red-900/20 transition-colors">
              <i class="pi pi-sign-out mr-2"></i> Logout
            </button>
          </div>
        </div>

        <!-- Login/Register Button (if not authenticated) -->
        <button
          v-if="!userStore.isAuthenticated"
          @click="showGeneralAuth = true" 
          class="hidden md:block px-4 py-2 border-1 border-[#008253] text-[#008253] rounded-lg hover:scale-105  transition-all whitespace-nowrap font-medium"
        >
          Login/Register
        </button>

        <!-- For Business Link -->
        <NuxtLink
          v-if="!userStore.isAuthenticated" 
          to="/business/landing" 
          class="hidden md:block relative font-medium text-gray-800 dark:text-gray-200 hover:text-[#008253] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 hover:after:w-full"
        >
          For Business
        </NuxtLink>

        <!-- Mobile Menu Toggle -->
        <button class="md:hidden flex items-center text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none" @click="isOpen = !isOpen">
          <i class="pi pi-bars text-sm"></i>
        </button>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <Drawer 
      v-model:visible="isOpen" 
      header=" "
      class="!w-[280px] dark:bg-gray-900"
      :pt="{
        header: 'hidden', /* We'll build our own header for better branding */
        content: 'p-0'
      }"
    >
      <div class="flex flex-col h-full bg-white dark:bg-gray-900">
        
        <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div v-if="userStore.isAuthenticated" class="flex items-center gap-3">
            <NuxtLink :to="`/user/${userStore.id}`" @click="isOpen = false">
              <UserAvatar 
                v-if="userProfile"
                :first-name="userProfile?.username"
                :size="42"
              />
            </NuxtLink>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                {{ userProfile?.username || 'User' }}
              </span>
              <span class="text-[11px] text-[#008253]">View Profile</span>
            </div>
          </div>
          
          <div v-else>
            <NuxtLink to="/" @click="isOpen = false">
              <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" />
            </NuxtLink>
          </div>
          
          <button @click="isOpen = false" class="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500">
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto py-4">
          <ul class="space-y-1 px-3">
            <li>
              <NuxtLink to="/" @click="isOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <i class="pi pi-home text-[#008253]"></i>
                <span>Home</span>
              </NuxtLink>
            </li>
            <li>
              <button @click="handleWriteReviewClick(); isOpen = false" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <i class="pi pi-pencil text-[#008253]"></i>
                <span>Write a Review</span>
              </button>
            </li>
            <li>
              <NuxtLink to="/end-user/landing/categories" @click="isOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <i class="pi pi-th-large text-[#008253]"></i>
                <span>Categories</span>
              </NuxtLink>
            </li>
            <li v-if="!userStore.isAuthenticated">
              <NuxtLink to="/business/landing" @click="isOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <i class="pi pi-briefcase text-[#008253]"></i>
                <span>For Business</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="p-5 border-t border-gray-100 dark:border-gray-800">
          <div v-if="userStore.isAuthenticated">
            <button 
              @click="triggerLogout(); isOpen = false" 
              class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              <i class="pi pi-sign-out"></i>
              Logout
            </button>
          </div>

          <div v-else class="space-y-3">
            <ButtonCustom
              @click="showGeneralAuth = true; isOpen = false" 
              primary="true"
              label="Login/Register"
              inputClass="!py-3"
            />
          </div>
        </div>
      </div>
    </Drawer>

    <!-- Modals (Teleport) -->
    <Teleport to="body">
      <div v-if="showReviewModal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeReviewAndClearDraft"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]">
          <button @click="closeReviewAndClearDraft" class="absolute top-5 right-5 text-gray-400"><i class="pi pi-times text-xl"></i></button>
          <ReviewForm :initial-data="reviewDraft" @close="closeReviewAndClearDraft" @open-auth="handleOpenAuth" @success="closeReviewAndClearDraft" />
        </div>
      </div>
      <AuthUnifiedModal v-if="showAuthModal" @close="showAuthModal = false" @authenticated="onUserAuthenticated" @back-to-review="handleBackToReview" />
      <AuthUnifiedModal v-if="showGeneralAuth" :hide-back-to-review="true" @close="showGeneralAuth = false" @authenticated="handleGeneralAuthSuccess" />
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import ReviewForm from '~/components/Review/ReviewForm.vue'
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";
import useMethods from '~/composables/useMethods';
import { useNavbarSearch } from '~/composables/useNavbarSearch';
import useSearch from '~/composables/search/useSearch'

const { search } = useSearch()
const navbarSearchQuery = ref('')
const navbarSuggestions = ref<{ id: string; name: string; logoUrl: string; rating: number; url: string }[]>([])
const showNavbarSuggestions = ref(false)
const navbarActiveIndex = ref(-1)
let navbarDebounceTimer: number | null = null

const onNavbarInput = () => {
  if (navbarDebounceTimer) clearTimeout(navbarDebounceTimer)
  navbarActiveIndex.value = -1

  navbarDebounceTimer = window.setTimeout(async () => {
    const trimmed = navbarSearchQuery.value.trim()
    if (!trimmed) {
      navbarSuggestions.value = []
      showNavbarSuggestions.value = false
      return
    }

    try {
      const res = await search(trimmed)
      const results = Array.isArray(res) ? res : (res.companies || [])
      navbarSuggestions.value = results.slice(0, 6).map((b: any) => ({
        id: b.businessId,
        name: b.name,
        url: b.website || '',
        logoUrl: b.logo || '/images/default-business-logo.png',
        rating: b.avgRating || 0
      }))
      showNavbarSuggestions.value = true
    } catch (e) {
      showNavbarSuggestions.value = false
    }
  }, 400)
}

const { showNavbarSearch } = useNavbarSearch()

const handleNavbarSearch = () => {
  const q = navbarSearchQuery.value.trim()
  if (!q) return

  showNavbarSuggestions.value = false

  const exactMatch = navbarSuggestions.value.find(
    c => c.name.toLowerCase() === q.toLowerCase()
  )

  if (exactMatch) {
    router.push(`/biz/${exactMatch.id}`)
  } else {
    router.push({ path: '/end-user/landing/explore', query: { q } })
  }

  navbarSearchQuery.value = ''
}

const { triggerLogout } = useMethods()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const { getUserProfile } = useUserProfileMethods();

// --- UI State ---
const isOpen = ref(false)
const showReviewModal = ref(false)       
const showAuthModal = ref(false)  
const showGeneralAuth = ref(false)       
const reviewDraft = ref<any>(null)
const userProfile = ref<any>(null);
const showUserDropdown = ref(false);

// --- Logic ---
const fetchProfileData = async () => {
  if (!userStore.id || !userStore.isAuthenticated) return;
  
  try {
    const response = await getUserProfile(userStore.id);
    
    if (response && response.data) {
      userProfile.value = response.data;
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

const handleGeneralAuthSuccess = () => {
  showGeneralAuth.value = false
}

// Watchers and Lifecycle
watch(() => userStore.isAuthenticated, (isLoggedIn) => {
  if (isLoggedIn) {
    fetchProfileData();
    const saved = localStorage.getItem('review_draft')
    if (saved) {
      reviewDraft.value = JSON.parse(saved)
      showAuthModal.value = false 
      showReviewModal.value = true
    }
  } else {
    userProfile.value = null;
  }
})

onMounted(() => {
  if (userStore.isAuthenticated) {
    fetchProfileData();
  }
  
  document.addEventListener('click', () => {
    showUserDropdown.value = false;
  })

  const saved = localStorage.getItem('review_draft')
  if (userStore.isAuthenticated && saved) {
    reviewDraft.value = JSON.parse(saved)
    showAuthModal.value = false
    showReviewModal.value = true
  }
  
  if (route.query.auth === 'login') {
    showGeneralAuth.value = true
    router.replace({ query: { ...route.query, auth: undefined } })
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>