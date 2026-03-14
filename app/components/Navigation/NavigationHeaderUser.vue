<template>
  <div
    class="flex justify-between items-center gap-2.5 w-full sm:py-[15px] py-[10px] px-[20px] shadow-md bg-white fixed z-[100]"
  >
    <div class="flex items-center border">
      <img
        src="/assets/images/e-user-logo.png"
        alt="Logo"
        class="h-10 w-auto"
      />
    </div>
    <div v-if="isMobile" class="flex items-center gap-[20px]">
      <button class="rounded-full !bg-primary text-white">For Business</button>
      <i class="pi pi-bars" @click="showSidebar = true"></i>

      <Drawer
        v-model:visible="showSidebar"
        class="w-[200px] py-[20px] bg-[#F0FDF4]"
        position="right"
      >
        <div class="flex flex-col h-full">
          <div ref="heroSearchRef" class="mb-[30px] w-full border">
            <SearchBarHome :full-width="true" />
          </div>
          <div class="flex flex-col justify-between gap-2.5 flex-1">
            <div
              class="flex flex-col gap-[20px] justify-center items-center py-[20px]"
            >
              <NuxtLink
                @click="handleDrawerLinkClick(i)"
                v-for="(i, idx) in drawerLinks"
                :key="idx"
                class="text-[150%]"
              >
                {{ i.title }}
              </NuxtLink>
            </div>
            <div class="mb-[-20px]">
              <NuxtLink to="/for-business/" @click="showSidebar = false">
                <button
                  class="rounded-full border border-primary text-primary w-full"
                >
                  For Business
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
        <template #footer>
          <button
            class="rounded-full !bg-primary text-white w-full"
            v-if="!userStore.isAuthenticated"
            @click="
              () => {
                showGeneralAuth = true;
                showSidebar = false;
              }
            "
          >
            Get Started
          </button>
          <div v-else class="flex gap-[20px]">
            <div class="flex-1 w-full text-[90%] text-center truncate mb-[4px]">
              #{{ userStore.id }}
            </div>
            <button class="border p-[10px] rounded-sm" @click="triggerLogout()">
              <i class="pi pi-sign-out text-[red]"></i>
            </button>
            <NuxtLink :to="`/user/${userStore.id}`">
              <button class="rounded-sm !bg-primary text-white w-full">
                My Profile
              </button>
            </NuxtLink>
          </div>
        </template>
      </Drawer>
    </div>
    <div class="flex gap-[40px] items-center" v-else>
      <div class="flex gap-[20px] items-center topnav">
        <NuxtLink @click="handleWriteReviewClick()"> Write a review </NuxtLink>
        <div>|</div>
        <NuxtLink>About Clereview</NuxtLink>
        <div>|</div>
        <NuxtLink>Contact Us</NuxtLink>
        <!-- <div v-for="(i, idx) in headerLinks" :key="idx" @click="i.url">
          {{ i.title }}
        </div> -->
      </div>
      <div class="flex gap-[10px]">
        <NuxtLink @click="showGeneralAuth = true">
          <button
            class="rounded-full bg-white border border-primary text-primary hover:!bg-primary hover:!text-white"
          >
            Get Started
          </button>
        </NuxtLink>
        <NuxtLink to="/for-business/">
          <button class="rounded-full !bg-primary text-white">
            For Business
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- ify and precious code -->
  <!-- Modals (Teleport) -->
  <Teleport to="body">
    <div
      v-if="showReviewModal"
      class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        @click="closeReviewAndClearDraft"
      ></div>
      <div
        class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]"
      >
        <button
          @click="closeReviewAndClearDraft"
          class="absolute top-5 right-5 text-gray-400"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
        <ReviewForm
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
    <AuthUnifiedModal
      v-if="showGeneralAuth"
      :hide-back-to-review="true"
      @close="showGeneralAuth = false"
      @authenticated="handleGeneralAuthSuccess"
    />
  </Teleport>
</template>

<script setup lang="ts">
const showSidebar = ref(false);

const heroSearchRef = ref<HTMLElement | null>(null);
useHeroSearchObserver(heroSearchRef);

// is mobile
const isMobile = ref(false);

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onUnmounted(() => {
  window.removeEventListener("resize", checkIsMobile);
});

onMounted(async () => {
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
});
//

const handleDrawerLinkClick = (i: any) => {
  i.url();
  showSidebar.value = false;
};

// ify and precious code
const { triggerLogout } = useMethods();
import { useUserStore } from "~/store/user";
const userStore = useUserStore();

const showReviewModal = ref(false);
const showAuthModal = ref(false);
const showGeneralAuth = ref(false);
const reviewDraft = ref<any>(null);

const handleOpenAuth = (currentFormData: any) => {
  reviewDraft.value = currentFormData;
  localStorage.setItem("review_draft", JSON.stringify(currentFormData));
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
  localStorage.removeItem("review_draft");
};

const handleGeneralAuthSuccess = () => {
  showGeneralAuth.value = false;
};

const router = useRouter();
const handleWriteReviewClick = () => {
  if (userStore.isAuthenticated) {
    router.push("/review/write-review");
  } else {
    showReviewModal.value = true;
  }
};

//

// const headerLinks = [
//   { url: () => handleWriteReviewClick(), title: "Write a review" },
//   { url: () => {}, title: "|" },
//   {
//     url: () => {
//       showGeneralAuth.value = true;
//     },
//     title: "Get Started",
//   },
// ];

const drawerLinks = [
  { url: () => handleWriteReviewClick(), title: "Write a review" },
  { url: () => navigateTo("/about-clereview"), title: "About Clereview" },
  { url: () => navigateTo("/contact-us"), title: "Contact Us" },
];
</script>
<style scoped>
button {
  padding-inline: 25px;
  padding-block: 15px;
}

a {
  cursor: pointer;
}
.topnav a {
  padding-bottom: 2px;
  color: var(--primary);
}

.topnav a:hover {
  color: var(--primary);
  border-bottom: 1px solid var(--primary);
}
</style>
