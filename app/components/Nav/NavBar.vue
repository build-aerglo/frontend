<template>
  <nav
    class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
    <div class="mx-auto px-8 flex items-center justify-between h-16">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <img src="~/assets/images/e-user-logo.png" alt="Welcome" class="h-10 w-auto object-contain" />
      </NuxtLink>

      <div class="flex items-right space-x-8">
        <ul class="hidden md:flex items-center space-x-8 dark:text-gray-200 font-medium">
          <li class="relative">
            <button @click="toggleBusinessDropdown" class="flex items-center hover:text-primary focus:outline-none after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
              hover:after:w-full">
              For Business
              <i class="pi pi-chevron-down ml-1 text-sm"></i>
            </button>

            <div v-if="showBusinessDropdown"
              class="absolute mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-56 z-50">
              <NuxtLink to="/business/auth/sign-up"
                class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <i class="pi pi-briefcase mr-2 text-primary"></i>
                Add a Business
              </NuxtLink>
              <NuxtLink to="/business/auth/sign-in"
                class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
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
          <li>
            <button @click="handleWriteReviewClick" class="px-6 py-2 bg-[#008253] text-white rounded-lg shadow hover:bg-[#008260] transition">
              Write a review
            </button>
          </li>
        </ul>

        <button class="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none"
          @click="isOpen = !isOpen">
          <i :class="isOpen ? 'pi pi-bars text-sm' : 'pi pi-bars text-sm'"></i>
        </button>
      </div>
    </div>

    <div :class="[
      'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 md:hidden z-50',
      isOpen ? 'translate-y-0' : '-translate-x-full',
    ]">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <NuxtLink to="/links"><img src="/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" /></NuxtLink>
        <button @click="isOpen = false" class="text-gray-600 dark:text-gray-200">
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>

      <ul
        class="flex flex-col bg-white border-b border-gray-200 text-gray-800 dark:text-white font-medium p-8 space-y-4">
        <li>
          <button @click="handleWriteReviewClick" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
              hover:after:w-full">Write a Review</button>
        </li>
        <li>
          <NuxtLink to="/end-user/landing/categories" class="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:w-0 after:h-[2px] after:bg-[#008253] after:transition-all after:duration-300 
              hover:after:w-full">Categories</NuxtLink>
        </li>

        <li>
          <button @click="toggleBusinessDropdown"
            class="flex items-center justify-between w-full hover:text-primary focus:outline-none">
            <span>For Business</span>
            <i class="pi pi-chevron-down text-sm"></i>
          </button>

          <div v-if="showBusinessDropdown" class="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <NuxtLink to="/business/auth/sign-up"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="pi pi-briefcase mr-2 text-primary"></i>
              Add a Business
            </NuxtLink>
            <NuxtLink to="/business/auth/sign-in"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
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

        <li>
          <NuxtLink to="/end-user/auth/sign-in"
            class="inline-flex items-center justify-center bg-[#008253] text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition w-full text-center">
            Login/Register
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-30 md:hidden bg-black/5 backdrop-blur-sm transition-all duration-300"
      @click="isOpen = false"></div>

    <Teleport to="body">
      <div v-if="showReviewModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px] animate-in fade-in zoom-in duration-200">
          <button @click="closeModal" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600"><i class="pi pi-times text-xl"></i></button>
          
          <h2 class="text-3xl font-bold text-center text-[#008253] mb-6">Share Your Experience</h2>
          
          <div class="space-y-4">
             <div class="relative">
              <label class="block text-sm font-medium text-gray-900 mb-1">Business Name *</label>
              <div class="relative">
                <input type="text" v-model="businessName" placeholder="search for a business.." @input="handleBusinessInput" @focus="showSearchDropdown = true" class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] outline-none" />
                <i v-if="isSearching" class="pi pi-spin pi-spinner absolute right-10 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <img v-if="selectedBusinessId" :src="selectedBusinessLogo || '/images/default-business-logo.png'" class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain rounded" />
              </div>
              <ul v-if="showSearchDropdown && filteredBusinesses.length" class="bg-white shadow-xl mt-1 rounded-lg border max-h-60 overflow-y-auto absolute z-50 w-full">
                <li v-for="(b, i) in filteredBusinesses" :key="i" @click="selectBusiness(b)" class="px-4 py-3 cursor-pointer hover:bg-green-50 border-b flex items-center gap-3">
                  <img v-if="b.logo" :src="b.logo" class="w-6 h-6 rounded-full object-cover" />
                  <span class="font-medium text-gray-800">{{ b.name }}</span>
                </li>
              </ul>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Rating *</label>
              <div class="flex items-center">
                <Stars v-for="n in 5" :key="n" :value="(hoverRating || rating) - (n - 1)" :color-level="Math.ceil(hoverRating || rating)" class="cursor-pointer"
                  @mousemove="hoverRating = n - 1 + getFraction($event)" @mouseleave="hoverRating = 0" @click="setRating(n - 1 + getFraction($event))" />
                <span class="ml-2 text-sm text-gray-700">{{ rating > 0 ? getRatingLabel(rating) : '' }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Your Review *</label>
              <textarea v-model="reviewBody" rows="4" class="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-[#008253] outline-none" placeholder="How was it?"></textarea>

            </div>

            <ImageUploader v-model="images" path="reviews" label="Add Images" :max="3" />

            <div v-if="!showEmailInput" class="grid grid-cols-2 gap-4 mt-6">
              <div class="flex flex-col gap-1">
                <button @click="showEmailInput = true" class="py-3 bg-[#008253] text-white  rounded-xl">Review as guest</button>
                <span class="text-center text-sm">No account needed</span>
              </div>
              <div class="flex flex-col gap-1">
                <button @click="handleUserReviewRedirect" class="py-3 border-1 border-[#008253] text-[#008253]  rounded-xl hover:bg-green-50">Review as user</button>
                <span class="text-center text-sm">Earn points and track your reviews</span>
              </div>
            </div>
            <div v-else class="pt-4 space-y-3 border-t">
              <label class="block text-sm font-medium text-gray-900 mb-1">Email address *</label>
              <input type="email" v-model="email" placeholder="submit your email to review as a guest" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008253] outline-none" />
              <div class="flex gap-2">
                <button @click="showEmailInput = false" class="flex-1 text-gray-500 underline">Back</button>
                <button @click="submitReview" class="flex-[2] py-3 bg-[#008253] text-white rounded-xl">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">

import { useUserStore } from '~/store/user'

import useSearch from '~/composables/search/useSearch'
import Stars from '~/components/Stars.vue'
import ImageUploader from '~/components/Input/ImageUploader.vue'

// Sidebar/Nav Toggle States
const isOpen = ref(false)
const showBusinessDropdown = ref(false)
const userStore = useUserStore()
const router = useRouter()
const { search } = useSearch()

// Modal States
const showReviewModal = ref(false)
const showEmailInput = ref(false)
const businessName = ref("")
const selectedBusinessId = ref("")
const selectedBusinessLogo = ref("")
const isSearching = ref(false)
const showSearchDropdown = ref(false)
const rating = ref(0)
const hoverRating = ref(0)
const reviewBody = ref("")
const images = ref<string[]>([])
const email = ref("")
const filteredBusinesses = ref<any[]>([])

let debounceTimer: any = null

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleBusinessDropdown = (event: MouseEvent) => {
  event.stopPropagation()
  showBusinessDropdown.value = !showBusinessDropdown.value
}

const handleClickOutside = () => {
  showBusinessDropdown.value = false
  showSearchDropdown.value = false
}

const handleWriteReviewClick = () => {
  isOpen.value = false // Close sidebar if open
  if (userStore.isAuthenticated) {
    router.push('review/write-review')
  } else {
    showReviewModal.value = true
  }
}

// Logic helpers
const handleBusinessInput = () => {
  showSearchDropdown.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!businessName.value.trim()) return
  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    const res = await search(businessName.value)
    filteredBusinesses.value = Array.isArray(res) ? res : (res.companies || [])
    isSearching.value = false
  }, 400)
}

const selectBusiness = (b: any) => {
  businessName.value = b.name
  selectedBusinessId.value = b.id || b.businessId
  selectedBusinessLogo.value = b.logo || ""
  showSearchDropdown.value = false
}

const getRatingLabel = (r: number) => {
  const labels: any = { 1: "Not Great.", 2: "Needs Improvement.", 3: "Just Okay.", 4: "Really Good!", 5: "Fantastic!" }
  return labels[Math.floor(r)] || ""
}

const setRating = (val: number) => { rating.value = val }
const getFraction = (event: MouseEvent) => (event.clientX - (event.target as HTMLElement).getBoundingClientRect().left) / (event.target as HTMLElement).getBoundingClientRect().width < 0.5 ? 0.5 : 1
const closeModal = () => { showReviewModal.value = false; showEmailInput.value = false }
const handleUserReviewRedirect = () => {
  // 1. Save the current draft to localStorage
  const draft = {
    businessName: businessName.value,
    selectedBusinessId: selectedBusinessId.value,
    selectedBusinessLogo: selectedBusinessLogo.value,
    rating: rating.value,
    reviewBody: reviewBody.value,
    images: images.value // Note: These are usually URLs or Base64 strings
  }
  
  localStorage.setItem('review_draft', JSON.stringify(draft))

  // 2. Redirect to sign-in with a callback path
  // This tells your login page where to send the user after success
  router.push({
    path: '/end-user/auth/sign-in',
    query: { redirect: '/review/write-review' }
  })
  
  closeModal()
}
const submitReview = () => { alert("Success!"); closeModal() }
</script>