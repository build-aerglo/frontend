<template>
  <Card>
    <template #content>
      <div class="flex gap-[10px]">
        <div
          :style="{ backgroundColor: getColorCode(initials) }"
          :class="`rounded-full h-[44px] w-[44px] font-bold flex justify-center items-center`"
        >
          {{ initials }}
        </div>
        <div
          class="flex flex-col flex-1"
          :class="isProfile ? 'justify-center' : ''"
        >
          <div class="text-[90%] mb-[2px]">
            {{ data.anonymous ? "Anonymous" : data.email }}
          </div>
          <ReviewStatusPill v-if="!isProfile" :status="data.status" />
        </div>
        <div class="w-[100px]">
          <Star :count="data.starRating" :rounded="false" />
          <small>{{ timeAgo(data.uploadedDate) }}</small>
        </div>
      </div>

      <Divider />

      <div class="my-[20px]">
        <div>{{ data.reviewBody }}</div>
      </div>

      <div
        v-if="data.photoUrls && data.photoUrls.length > 0"
        class="grid grid-cols-2 sm:grid-cols-4 gap-[20px] w-full sm:max-w-[40%]"
      >
        <div
          v-for="(img, index) in displayedImages"
          :key="index"
          class="relative cursor-pointer"
        >
          <img
            :src="img"
            class="w-full h-[100px] object-contain rounded-full"
          />
          <div
            v-if="showOverlay && index === 3"
            class="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold rounded-md"
          >
            +{{ remainingImages }}
          </div>
        </div>
      </div>

      <div class="flex justify-between gap-[10px] items-center mt-[50px]">
        <div class="flex gap-[20px] w-full justify-between">
          <div class="flex gap-[20px]">
            <div
              @click="upvote"
              :class="`${isVoting ? 'cursor-not-allowed' : 'cursor-pointer'} text-[90%]`"
            >
              <i
                :class="`pi pi-${isVoting ? 'spin pi-spinner' : 'thumbs-up'} text-[90%]`"
              ></i>
              Useful ({{ helpfulCount ?? 0 }})
            </div>
            <div v-if="!isBusiness" class="text-[90%] cursor-pointer">
              <i class="pi pi-share-alt text-[90%]"></i>
              Share
            </div>
          </div>
          <div class="flex gap-[20px]">
            <div v-if="!isBusiness" class="cursor-pointer">
              <i class="pi pi-flag text-[90%]"></i>
            </div>
            <div
              class="flex items-center gap-[10px] cursor-pointer"
              v-if="data.replyId"
              @click="showHiddenReply = !showHiddenReply"
            >
              <div class="text-[90%]">
                {{ data.replyId ? "(1)" : "(0)" }} Reply
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider v-if="data.replyBody && showReply" />

      <!-- reply -->
      <Transition name="fade-slide">
        <div
          v-if="data.replyBody && showReply && showHiddenReply"
          class="border-l-[5px] border-l-primary flex items-center px-[10px] pb-[5px] pt-[15px] bg-[#f3f0ec] rounded-[5px]"
        >
          <div v-html="data.replyBody"></div>
        </div>
      </Transition>

      <!-- errors and warnings -->
      <div v-if="data.status.toLowerCase() !== 'approved' && showReply">
        <div v-if="data.warnings && data.warnings?.length > 0">
          <Divider />
          <div class="text-[110%] font-bold mb-[20px]">Flagged reasons:</div>
          <div class="flex flex-col gap-2.5">
            <ol>
              <li v-for="(i, idx) in data.warnings" :key="idx">
                {{ i }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import useReviewMethods from "~/composables/review/useReviewMethods";
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";
import type { ReviewDashboard } from "~/types/review";
const props = withDefaults(
  defineProps<{
    data: ReviewDashboard;
    showReply: boolean;
    isProfile?: boolean;
    isBusiness?: boolean;
  }>(),
  {
    isProfile: false,
    isBusiness: false,
  },
);

const { getUserId } = useUserProfileMethods();
const { toggleUpvoteReview } = useReviewMethods();
const toast = useToast();

const showHiddenReply = ref(false);
const initials = getInitials(props.data.email);
const images = ref();

const userId = getUserId();

const helpfulCount = ref(0);
const voted = ref(true);

const displayedImages = computed(() =>
  props.data.photoUrls ? props.data.photoUrls.slice(0, 4) : [],
);

const remainingImages = computed(() =>
  props.data.photoUrls ? props.data.photoUrls.length - 4 : 0,
);

const showOverlay = computed(() =>
  props.data.photoUrls
    ? props.data.photoUrls.length > 4
      ? true
      : false
    : false,
);

onBeforeMount(() => {
  if (props.data.photoUrls && props.data.photoUrls.length > 0) {
    images.value = props.data.photoUrls;
  }

  if (props.data.helpfulCount) helpfulCount.value = props.data.helpfulCount;
});

const isVoting = ref(false);
const upvote = async () => {
  if (isVoting.value) return; // prevent multi clicking (hopefully)
  if (!userId) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Must be signed in to upvote review.",
      life: 3000,
    });
  }
  try {
    isVoting.value = true;
    const res = await toggleUpvoteReview(props.data.replyId!, userId);
    if (res.statusCode === 200) {
      if (res.data.userHasVoted) {
        voted.value = true;
        toast.add({
          severity: "success",
          summary: "SUCCESS",
          detail: "Review upvoted successfully.",
          life: 3000,
        });
      } else {
        voted.value = false;
        toast.add({
          severity: "info",
          summary: "SUCCESS",
          detail: "Review upvoted deleted successfully.",
          life: 3000,
        });
      }

      helpfulCount.value = res.data.helpfulCount ?? helpfulCount.value++;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isVoting.value = false;
  }
};

const shareContent = async () => {
  const shareData = {
    title: document.title,
    text: "Check this out!",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
