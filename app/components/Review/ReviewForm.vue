<template>
  <div class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-center text-[#008253] mb-6">
      Share Your Experience
    </h2>
    <div ref="businessDropdownRef" class="relative">
      <label class="block text-sm font-medium text-gray-900 mb-1">Business Name *</label>
      <div class="relative">
        <input type="text" v-model="form.businessName" @input="handleBusinessInput" @focus="showSearchDropdown = true"
          placeholder="Search for a business..."
          class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#008253] outline-none" />
        <i v-if="isSearching"
          class="pi pi-spin pi-spinner absolute right-10 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <img v-if="form.selectedBusinessId || form.isAddingNewBusiness"
          :src="form.selectedBusinessLogo || '/images/default-business-logo.png'"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain rounded" />
      </div>

      <ul v-if="showSearchDropdown && filteredBusinesses.length"
        class="bg-white shadow-xl mt-1 rounded-lg border max-h-60 overflow-y-auto absolute z-50 w-full">
        <li v-for="(b, i) in filteredBusinesses" :key="i" @click="selectBusiness(b)"
          class="px-4 py-3 cursor-pointer hover:bg-green-50 border-b flex items-center gap-3">
          <img v-if="b.logo" :src="b.logo" class="w-6 h-6 rounded-full object-cover" />
          <span class="font-medium text-gray-800">{{ b.name }}</span>
        </li>
      </ul>

      <div
        v-if="form.businessName.trim() && !isSearching && filteredBusinesses.length === 0 && !form.selectedBusinessId && !form.isAddingNewBusiness"
        class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p class="text-sm text-amber-800 mb-2">Can't find "{{ form.businessName }}"?</p>
        <button @click="form.isAddingNewBusiness = true" class="text-sm bg-[#008253] text-white px-4 py-2 rounded-lg"> +
          Add as New Business </button>
      </div>

      <p v-if="form.isAddingNewBusiness" class="text-xs text-green-600 mt-1 font-medium">
        ✓ New business "{{ form.businessName }}" will be created
      </p>
      <p v-else-if="form.selectedBusinessId" class="text-xs text-green-600 mt-1 font-medium">
        ✓ Existing business selected
      </p>
    </div>

    <div v-if="form.isAddingNewBusiness" class="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium text-green-800">New Business Location</p>
        <button @click="form.isAddingNewBusiness = false" class="text-xs text-red-600 underline">Cancel</button>
      </div>
      <select v-model="form.newBusinessState" class="w-full border rounded-lg px-3 py-2 text-sm outline-none">
        <option value="">Select State *</option>
        <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="form.newBusinessCity" :disabled="!form.newBusinessState"
        class="w-full border rounded-lg px-3 py-2 text-sm outline-none disabled:bg-gray-100">
        <option value="">Select City *</option>
        <option v-for="c in newBusinessCities" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div v-if="form.selectedBusinessId && !form.isAddingNewBusiness" class="space-y-3">
      <label class="block text-sm font-medium text-gray-900">Branch/Location *</label>
      <select v-model="form.selectedBranchOption" :disabled="form.manualEntryEnabled || isLoadingBranches"
        class="w-full border rounded-lg px-3 py-2 text-sm outline-none disabled:bg-gray-100">
        <option value="">{{ isLoadingBranches ? 'Loading branches...' : 'Select a branch...' }}</option>
        <option v-if="!hasOnlineBranch" value="online">Online (Website/Digital Services)</option>
        <option v-for="option in branchOptions" :key="option.id" :value="option.id">{{ option.display }}</option>
      </select>

      <div class="flex items-center space-x-2">
        <input type="checkbox" id="formManual" v-model="form.manualEntryEnabled"
          :disabled="form.selectedBranchOption === 'online'" class="w-4 h-4 accent-[#008253]" />
        <label for="formManual" class="text-sm text-gray-700">Branch not found? Enter manually</label>
      </div>

      <div v-if="form.manualEntryEnabled && form.selectedBranchOption !== 'online'"
        class="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm font-medium text-blue-800">Enter Branch Location</p>
        <select v-model="form.manualState" class="w-full border rounded-lg px-3 py-2 text-sm outline-none">
          <option value="">Select State *</option>
          <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="form.manualCity" :disabled="!form.manualState"
          class="w-full border rounded-lg px-3 py-2 text-sm outline-none disabled:bg-gray-100">
          <option value="">Select City *</option>
          <option v-for="c in manualCities" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <p v-if="form.selectedBranchOption === 'online'" class="text-xs text-green-600 mt-1 font-medium">
        ✓ Online branch will be added to this business
      </p>
      <p v-else-if="form.selectedBranchOption && !form.manualEntryEnabled"
        class="text-xs text-green-600 mt-1 font-medium">
        ✓ Existing branch selected
      </p>
      <p v-else-if="form.manualEntryEnabled && form.manualState && form.manualCity"
        class="text-xs text-green-600 mt-1 font-medium">
        ✓ New branch will be added: {{ form.manualCity }}, {{ form.manualState }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900 mb-1">Rating *</label>
      <div class="flex items-center">
        <Stars v-for="n in 5" :key="n" :value="(hoverRating || form.rating) - (n - 1)"
          :color-level="Math.ceil(hoverRating || form.rating)" class="cursor-pointer"
          @mousemove="hoverRating = n - 1 + getFraction($event)" @mouseleave="hoverRating = 0"
          @click="form.rating = n - 1 + getFraction($event)" />
        <span class="ml-2 text-sm text-gray-700">
          {{ form.rating > 0 ? getRatingLabel(form.rating) : '' }}
          <span v-if="form.rating > 0" class="text-sm text-gray-500">({{ form.rating.toFixed(1) }})</span>
        </span>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900 mb-1">Your Review *</label>
      <textarea v-model="form.reviewBody" rows="4" maxlength="500"
        class="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-[#008253] outline-none"
        placeholder="Tell us about your experience..."></textarea>
      <p class="text-xs text-gray-400 text-right">{{ form.reviewBody.length }}/500</p>
    </div>

    <ImageUploader v-model="form.images" path="reviews" label="Add Images" :max="3" />

    <div class="pt-6 border-t">
      <div v-if="!userStore.isAuthenticated">
        <div v-if="!showEmailInput" class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <button @click="showEmailInput = true" class="py-3 bg-[#008253] text-white rounded-xl">Review as
              guest</button>
            <span class="text-center text-[11px] md:text-[12px] text-gray-500">No account needed</span>
          </div>
          <div class="flex flex-col gap-1">
            <button @click="emitOpenAuth"
              class="py-3 border border-[#008253] text-[#008253] rounded-xl font-medium hover:bg-green-100">Sign in and
              review</button>
            <span class="text-center text-[11px] md:text-[12px] text-gray-500">Earn points and track your reviews</span>
          </div>
        </div>
        <div v-else>
          <label class="block text-sm font-medium text-gray-900 mb-1">Email address *</label>
          <input type="email" v-model="form.email" placeholder="Email is required for guest reviews"
            class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-green-500 mb-3" />
          <div class="flex gap-2">
            <button @click="showEmailInput = false" class="flex-1 text-gray-500 underline text-sm">Back</button>
            <button @click="handleReviewSubmit" :disabled="isSubmitting"
              class="flex-[2] py-3 bg-[#008253] text-white rounded-xl">
              {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </div>
      </div>
      <button v-else @click="handleReviewSubmit" :disabled="isSubmitting"
        class="w-full py-4 bg-[#008253] text-white rounded-xl">
        {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Stars from '~/components/Stars.vue'
import ImageUploader from '~/components/Input/ImageUploader.vue'
import { useUserStore } from '~/store/user'
import useSearch from '~/composables/search/useSearch'
import useBusinessMethods from '~/composables/business/useBusinessMethods'
import useNigerianLocations from '~/composables/useNigerianLocations'
import useReviewMethods from '~/composables/review/useReviewMethods'

const props = defineProps<{
  initialData?: any
}>()

const emit = defineEmits(['close', 'success', 'open-auth'])
const userStore = useUserStore()
const { search } = useSearch()
const { getBusinessBranches, getBusinessProfile } = useBusinessMethods()
const { getStates, getCitiesByState } = useNigerianLocations()
const { submitUserReview } = useReviewMethods()

const form = reactive(props.initialData || {
  businessName: "",
  selectedBusinessId: "",
  selectedBusinessLogo: "",
  isAddingNewBusiness: false,
  newBusinessState: "",
  newBusinessCity: "",
  selectedBranchOption: "",
  manualEntryEnabled: false,
  manualState: "",
  manualCity: "",
  rating: 0,
  reviewBody: "",
  images: [],
  email: ""
})

const toast = useToast()
const isSearching = ref(false)
const showSearchDropdown = ref(false)
const showEmailInput = ref(false)
const isSubmitting = ref(false)
const hoverRating = ref(0)
const branches = ref<any[]>([])
const isLoadingBranches = ref(false)
const states = getStates()
const filteredBusinesses = ref<any[]>([])
let debounceTimer: any = null

const businessDropdownRef = ref<HTMLElement | null>(null)

const newBusinessCities = computed(() => form.newBusinessState ? getCitiesByState(form.newBusinessState) : [])
const manualCities = computed(() => form.manualState ? getCitiesByState(form.manualState) : [])

// ✅ FIX 3: Check if online branch exists
const hasOnlineBranch = computed(() => {
  return branches.value.some(b =>
    b.name?.toLowerCase() === 'online' ||
    (b.branchCityTown?.toLowerCase() === 'online' && b.branchState?.toLowerCase() === 'online')
  )
})

// ✅ FIX 2: Proper display for branches
const branchOptions = computed(() => {
  return branches.value.map(branch => {
    // Handle pseudo-branch (business-address)
    if (branch.id === 'business-address') {
      const cityState = [branch.branchCityTown, branch.branchState].filter(Boolean).join(', ')
      return {
        id: branch.id,
        display: cityState || 'Main Location'
      }
    }

    // Handle online branch
    if (branch.branchCityTown?.toLowerCase() === 'online' && branch.branchState?.toLowerCase() === 'online') {
      return {
        id: branch.id,
        display: 'Online (Website/Digital Services)'
      }
    }

    // Handle regular branches
    const cityState = [branch.branchCityTown, branch.branchState].filter(Boolean).join(', ')
    return {
      id: branch.id,
      display: cityState || branch.name || 'Unknown Location'
    }
  })
})

const handleBusinessInput = () => {
  showSearchDropdown.value = true
  form.selectedBusinessId = ""
  form.isAddingNewBusiness = false
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!form.businessName.trim()) return
  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    const res = await search(form.businessName)
    filteredBusinesses.value = Array.isArray(res) ? res : (res.companies || [])
    isSearching.value = false
  }, 400)
}

const selectBusiness = async (b: any) => {
  form.businessName = b.name
  form.selectedBusinessId = b.id || b.businessId || ""
  form.selectedBusinessLogo = b.logo || ""
  showSearchDropdown.value = false
  if (form.selectedBusinessId) fetchBranches(form.selectedBusinessId)
}

// ✅ FIX 2: Extract city/state from business address
const fetchBranches = async (id: string) => {
  isLoadingBranches.value = true
  try {
    const [branchResult, profile] = await Promise.all([
      getBusinessBranches(id),
      getBusinessProfile(id)
    ])

    const all = []
    const profileData = profile?.data

    if (profileData) {
      let city = ""
      let state = ""

      // Logic: If businessAddress exists, parse it. 
      // Otherwise, use city/state columns directly.
      if (profileData.businessAddress) {
        const addressParts = profileData.businessAddress.split(',').map((s: string) => s.trim())

        if (addressParts.length >= 2) {
          state = addressParts[addressParts.length - 1]
          city = addressParts[addressParts.length - 2]
        }
      } else {
        // Fallback to specific columns
        city = profileData.businessCityTown || 'Main Location'
        state = profileData.businessState || ''
      }

      all.push({
        id: 'business-address',
        branchCityTown: city,
        branchState: state
      })
    }

    branches.value = [...all, ...(Array.isArray(branchResult) ? branchResult : (branchResult?.data || []))]
  } finally {
    isLoadingBranches.value = false
  }
}

const getRatingLabel = (r: number) => {
  const labels: Record<number, string> = { 1: "Not Great.", 2: "Needs Improvement.", 3: "Just Okay.", 4: "Really Good!", 5: "Fantastic!" }
  return labels[Math.floor(r)] || ""
}

const getFraction = (e: MouseEvent) => {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  return x / rect.width < 0.5 ? 0.5 : 1
}

const emitOpenAuth = () => {
  localStorage.setItem('review_draft', JSON.stringify({ ...form }))
  emit('open-auth', { ...form })
}

const MIN_CHAR_GUEST = 50
const MIN_CHAR_USER = 25
const blacklistedWords = ['scam', 'fraud', 'fake', 'spam', 'racist', 'hate', 'violence', 'drugs', 'terrorist', 'bomb', 'kill']

const validateReviewContent = (text: string) => {
  const onlyEmojiRegex = /^[\s\p{Emoji}\p{Symbol}\p{Punctuation}]+$/u
  const textWithoutEmoji = text.replace(/\p{Emoji}/gu, '').trim()

  if (onlyEmojiRegex.test(text) || textWithoutEmoji.length === 0) {
    return "Your review cannot consist only of emojis."
  }

  const elongatedRegex = /(.)\1{4,}/gi
  if (elongatedRegex.test(text)) {
    return "Please avoid using elongated words (e.g., 'niceeeee')."
  }

  const foundBlacklisted = blacklistedWords.filter(word =>
    text.toLowerCase().includes(word.toLowerCase())
  )
  if (foundBlacklisted.length > 0) {
    return "Your review contains inappropriate language."
  }

  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([^\s]+\.(com|net|org|ng|gov|edu))/gi
  if (urlRegex.test(text)) {
    return "Links or URLs are not allowed in reviews."
  }

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const phoneRegex = /(\+234|0)[789][01]\d{8}/g
  const addressRegex = /\b(No\.|Street|St\.|Avenue|Ave\.|Close|Cl\.|Road|Rd\.)\b/gi

  if (emailRegex.test(text)) return "Please remove email addresses from the review."
  if (phoneRegex.test(text)) return "Please remove phone numbers from the review."
  if (addressRegex.test(text)) return "Please remove specific home/office addresses for privacy."

  return null
}

const handleReviewSubmit = async () => {
  if (!form.businessName.trim()) {
    return toast.add({ severity: 'warn', summary: 'Missing Info', detail: 'Enter business name', life: 3000 })
  }
  if (form.rating === 0) {
    return toast.add({ severity: 'warn', summary: 'Rating Required', detail: 'Please provide a star rating', life: 3000 })
  }

  const minRequired = userStore.isAuthenticated ? MIN_CHAR_USER : MIN_CHAR_GUEST
  if (form.reviewBody.length < minRequired) {
    return toast.add({
      severity: 'error',
      summary: 'Review too short',
      detail: `As a ${userStore.isAuthenticated ? 'user' : 'guest'}, your review must be at least ${minRequired} characters.`,
      life: 5000
    })
  }

  const contentError = validateReviewContent(form.reviewBody)
  if (contentError) {
    return toast.add({ severity: 'error', summary: 'Invalid Content', detail: contentError, life: 5000 })
  }

  const isOnline = form.selectedBranchOption === 'online'
  const isManual = form.manualEntryEnabled

  if (form.isAddingNewBusiness && (!form.newBusinessState || !form.newBusinessCity)) {
    return toast.add({ severity: 'warn', summary: 'Location Required', detail: 'Select new business location', life: 3000 })
  }
  if (form.selectedBusinessId && !form.selectedBranchOption && !isManual) {
    return toast.add({ severity: 'warn', summary: 'Branch Required', detail: 'Select a branch', life: 3000 })
  }
  if (isManual && !isOnline && (!form.manualState || !form.manualCity)) {
    return toast.add({ severity: 'warn', summary: 'Location Required', detail: 'Enter branch location details', life: 3000 })
  }
  if (!userStore.isAuthenticated && !form.email) {
    return toast.add({ severity: 'warn', summary: 'Email Required', detail: 'Email required for guest review', life: 3000 })
  }

  isSubmitting.value = true
  try {
    const reviewData = {
      businessName: form.businessName,
      businessId: form.selectedBusinessId || null,
      starRating: form.rating,
      reviewBody: form.reviewBody,
      photoUrls: form.images.length ? form.images : null,
      reviewAsAnon: !userStore.isAuthenticated,
      isNewBusiness: form.isAddingNewBusiness,
      isNewBranch: isManual || isOnline,

      // ✅ FIX 1: Use businessId as locationId for business-address
      locationId: (isManual || isOnline)
        ? null
        : form.selectedBranchOption === 'business-address'
          ? form.selectedBusinessId
          : (form.selectedBranchOption || null),  // ✅ Convert empty string to null

      branchCityTown: form.isAddingNewBusiness
        ? form.newBusinessCity
        : isOnline
          ? 'online'
          : isManual
            ? form.manualCity
            : null,

      branchState: form.isAddingNewBusiness
        ? form.newBusinessState
        : isOnline
          ? 'online'
          : isManual
            ? form.manualState
            : null,

      reviewerId: userStore.isAuthenticated ? userStore?.id : null,
      email: userStore.isAuthenticated ? userStore.userData?.email : form.email
    }

    await submitUserReview(reviewData)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Review submitted successfully!', life: 3000 })
    emit('success')
  } catch (e: any) {
    toast.add({ severity: 'error', summary: 'Submission Failed', detail: e.response?.data?.error || "An error occurred", life: 4000 })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (form.selectedBusinessId) {
    fetchBranches(form.selectedBusinessId)
  }
})
watch(() => props.initialData, (newData) => {
  if (newData) {
    // This merges the new props into the existing reactive form
    Object.assign(form, newData);
    
    // Trigger branch fetching if a business ID was passed in
    if (newData.selectedBusinessId) {
      fetchBranches(newData.selectedBusinessId);
    }
  }
}, { immediate: true, deep: true });
</script>