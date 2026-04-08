<template>
<nav
    class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
  >
    <div class="mx-auto px-8 flex items-center justify-between h-16">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2">
        <img
          src="~/assets/images/e-user-logo.png"
          alt="Welcome"
          class="h-10 w-auto object-contain"
        />
      </NuxtLink>

      <!-- Desktop Nav Links -->
       <!-- Right buttons -->
      <div class="flex items-right space-x-8">
        <ul class="hidden md:flex items-center space-x-8 dark:text-gray-200 font-medium">
          <!-- For Business Dropdown -->
          <li class="relative">
            <button
              @click="toggleBusinessDropdown"
              class="flex items-center hover:text-primary focus:outline-none after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
              hover:after:w-full"
            >
              For Business
              <i class="pi pi-chevron-down ml-1 text-sm"></i>
            </button>

            <div
              v-if="showBusinessDropdown"
              class="absolute mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-56 z-50"
            >
              <NuxtLink
                to="/business/auth/sign-up"
                class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i class="pi pi-briefcase mr-2 text-primary"></i>
                Add a Business
              </NuxtLink>
              <NuxtLink
                to="/business/auth/sign-in"
                class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i class="pi pi-sign-in mr-2 text-primary"></i>
                Log in to Your Business Account
              </NuxtLink>
              <NuxtLink to="/biz/[id]/claim-business"
                  class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="pi pi-id-card mr-2 text-primary"></i>
                  Claim a Business
                </NuxtLink>
            </div>
          </li>
          <div class="hidden md:block">
            <button @click="handleWriteReviewClick" class="px-6 py-2 bg-[#008253] text-white rounded-lg shadow hover:bg-[#008260] transition whitespace-nowrap font-medium">
              Write a review
            </button>
          </div>
       </ul>
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
              <NuxtLink v-if="userStore.id" :to="`/user/${userStore.id}`" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="showUserDropdown = false">
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

        <!-- Mobile toggle -->
        <button
          class="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none"
          @click="isOpen = !isOpen"
        >
          <i :class="isOpen ? 'pi pi-bars text-sm' : 'pi pi-bars text-sm'"></i>
        </button>
      </div>
    </div>

    <!-- Sidebar for small screens -->
    <div
      :class="[
        'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 md:hidden z-50',
        isOpen ? 'translate-y-0' : '-translate-x-full',
      ]"
    >
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
    <!-- Overlay when sidebar is open -->
    <div
    v-if="isOpen"
    class="fixed inset-0 z-30 md:hidden bg-black/5 backdrop-blur-sm transition-all duration-300"
    @click="isOpen = false"
    ></div>

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
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/store/user'
import ReviewForm from '~/components/Review/ReviewForm.vue'
import useUserProfileMethods from '~/composables/user/useUserProfileMethods'
import useMethods from '~/composables/useMethods'

const { triggerLogout } = useMethods()
const { getUserProfile } = useUserProfileMethods()
const userStore = useUserStore()
const router = useRouter()

const isOpen = ref(false)
const showBusinessDropdown = ref(false)
const showUserDropdown = ref(false)
const showReviewModal = ref(false)
const showAuthModal = ref(false)
const showGeneralAuth = ref(false)
const showClaimModal = ref(false)
const reviewDraft = ref<any>(null)
const userProfile = ref<any>(null)

const fetchProfileData = async () => {
  if (!userStore.isAuthenticated || !userStore.id) return
  const res = await getUserProfile(userStore.id)
  userProfile.value = res?.data ?? null
}

const handleWriteReviewClick = () => {
  isOpen.value = false
  if (userStore.isAuthenticated) {
    router.push('/review/write-review')
  } else {
    showReviewModal.value = true
  }
}

const handleOpenAuth = (data: any) => {
  reviewDraft.value = data
  localStorage.setItem('review_draft', JSON.stringify(data))
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

const toggleBusinessDropdown = (e: MouseEvent) => {
  e.stopPropagation()
  showBusinessDropdown.value = !showBusinessDropdown.value
}

watch(() => userStore.isAuthenticated, (val) => {
  if (val) fetchProfileData()
  else userProfile.value = null
})

onMounted(() => {
  if (userStore.isAuthenticated) fetchProfileData()

  document.addEventListener('click', () => {
    showBusinessDropdown.value = false
    showUserDropdown.value = false
  })

  const saved = localStorage.getItem('review_draft')
  if (saved && userStore.isAuthenticated) {
    reviewDraft.value = JSON.parse(saved)
    showReviewModal.value = true
  }
})

const navigateToClaimPage = (name: string) => {
  showClaimModal.value = false
  router.push(`/biz/${encodeURIComponent(name)}/claim-business`)
}
const handleGeneralAuthSuccess = () => {
  showGeneralAuth.value = false
}
</script>






