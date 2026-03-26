<template>
  <div class="flex justify-between items-center gap-2.5 w-full px-5 py-2.5 shadow-md bg-white">
    <NuxtLink to="/for-business/index-v2" class="flex flex-col items-center">
      <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-10 w-auto" />
      <div class="text-[80%] text-center text-slate-500">For Business</div>
    </NuxtLink>

    <div class="flex gap-2.5 items-center">
      <!-- Authenticated state (always visible) -->
      <div v-if="businessUserStore.isAuthenticated" class="relative">
        <button
          @click.stop="showDropdown = !showDropdown"
          class="flex items-center gap-2 focus:outline-none hover:scale-105 transition-transform"
        >
          <img
            v-if="profileData?.logo"
            :src="profileData.logo"
            class="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full !bg-primary/20 flex items-center justify-center !text-primary font-bold text-sm"
          >
            {{ profileData?.name?.[0] ?? 'B' }}
          </div>
          <i class="pi pi-chevron-down text-xs text-slate-400"></i>
        </button>

        <!-- Dropdown -->
        <div
          v-if="showDropdown"
          class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-[100]"
        >
          <NuxtLink
            to="/business/dashboard"
            class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            @click="showDropdown = false"
          >
            <i class="pi pi-building mr-2 !text-primary"></i> Profile
          </NuxtLink>
          <button
            @click="triggerLogout(); showDropdown = false"
            class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <i class="pi pi-sign-out mr-2"></i> Logout
          </button>
        </div>
      </div>

      <!-- Unauthenticated: Desktop buttons (sm and above) -->
      <template v-else>
        <div class="hidden sm:flex gap-2.5 items-center">
          <NuxtLink to="/business/auth/sign-in">
            <ButtonCustom primary="true" label="Sign In" size="lg" inputClass="!w-auto" />
          </NuxtLink>
          <ButtonCustom
            secondary="true"
            label="Claim a Business"
            size="lg"
            inputClass="!w-auto"
            @click="showClaimModal = true"
          />
        </div>

        <!-- Unauthenticated: Mobile hamburger (below sm) -->
        <button
          class="sm:hidden flex items-center text-slate-700 focus:outline-none"
          @click="isDrawerOpen = true"
        >
          <i class="pi pi-bars text-xl"></i>
        </button>
      </template>
    </div>
  </div>

  <!-- Mobile Drawer -->
  <Drawer
    v-model:visible="isDrawerOpen"
    position="left"
    class="!w-[280px]"
    :pt="{ header: 'hidden', content: 'p-0' }"
  >
    <div class="flex flex-col h-full bg-white">
      <!-- Drawer header -->
      <div class="flex items-center justify-between p-5 border-b border-slate-100">
        <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" />
        <button
          @click="isDrawerOpen = false"
          class="p-2 rounded-full bg-slate-50 text-slate-500"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <!-- Drawer body -->
      <div class="flex flex-col gap-4 p-5 flex-1">
        <p class="text-sm text-slate-500">
          Manage your business reputation with Clereview.
        </p>

        <NuxtLink to="/business/auth/sign-in" @click="isDrawerOpen = false">
          <ButtonCustom primary="true" label="Sign In" size="lg" />
        </NuxtLink>

        <ButtonCustom
          secondary="true"
          label="Claim a Business"
          size="lg"
          @click="isDrawerOpen = false; showClaimModal = true"
        />
      </div>

      <!-- Drawer footer -->
      <div class="p-5 border-t border-slate-100 text-xs text-slate-400 text-center">
        © CleReview · For Business
      </div>
    </div>
  </Drawer>

  <Teleport to="body">
    <SearchBusinessClaim
      v-if="showClaimModal"
      @close="showClaimModal = false"
      @search="handleClaimSearch"
    />
  </Teleport>

  <LogoutConfirm />
</template>

<script setup lang="ts">
import { useBusinessUserStore } from '~/store/business/businessUser'
import useBusinessMethods from '~/composables/business/useBusinessMethods'
import useBusinessProfile from '~/composables/business/useBusinessProfile'
import useMethods from '~/composables/useMethods'

const router = useRouter()
const businessUserStore = useBusinessUserStore()
const { getBusinessProfile } = useBusinessMethods()
const { triggerLogout } = useMethods()

const profileStore = useBusinessProfile()
const profileData = computed(() => profileStore.profileData)

const showDropdown = ref(false)
const showClaimModal = ref(false)
const isDrawerOpen = ref(false)

onMounted(async () => {
  if (businessUserStore.isAuthenticated && businessUserStore.businessId) {
    await getBusinessProfile(businessUserStore.businessId)
  }

  document.addEventListener('click', () => {
    showDropdown.value = false
  })
})

const handleClaimSearch = (businessId: string) => {
  showClaimModal.value = false
  router.push(`/biz/${businessId}/claim-business`)
}
</script>