<template>
  <Toast />
  <div class="flex flex-col gap-2.5 min-h-screen">
    <div
      class="flex justify-between gap-[20px] items-center p-[20px] shadow-md fixed w-full bg-white z-[100]"
    >
      <NuxtLink to="/">
        <img
          src="~/assets/images/e-user-logo.png"
          class="w-[96px] h-[40px] object-contain object-center"
        />
      </NuxtLink> 
      <div class="flex gap-2.5 items-center" v-if="data">
        <ButtonCustom
          size="lg"
          label="Review Business"
          inputClass="w-max"
          :primary="true"
          @click="handleReviewNavigation"
        />
      </div>
    </div>
    
    <div class="flex-1 border mt-[80px] sm:px-[50px] px-[10px] py-[20px]">
      <slot />
    </div>

    <Teleport to="body">
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

      <AuthUnifiedModal 
        v-if="showAuthModal" 
        @close="showAuthModal = false" 
        @authenticated="onUserAuthenticated"
        @back-to-review="handleBackToReview"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePageData } from "~/composables/method/usePageData";
import { useUserStore } from '~/store/user';
import ReviewForm from '~/components/Review/ReviewForm.vue';

const userStore = useUserStore();
const pageData = usePageData();

// UI State
const showReviewModal = ref(false);
const showAuthModal = ref(false);
const reviewDraft = ref<any>(null);

// Get business data from the composable
const data = computed(() => pageData.value?.data);

const handleReviewNavigation = () => {
  
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
    // 2. If guest, setup the draft and show the modal
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

// --- Modal Handlers ---
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

// Auto-open if returning from login
onMounted(() => {
  const saved = localStorage.getItem('review_draft');
  if (userStore.isAuthenticated && saved) {
    reviewDraft.value = JSON.parse(saved);
    showReviewModal.value = true;
  }
});
</script>