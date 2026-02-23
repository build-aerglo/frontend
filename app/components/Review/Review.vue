<template>
  <div class="bg-white rounded-[10px] p-[20px] border-1 border-gray-200">
    <div class="flex gap-[10px]">
      <div
        :style="{ backgroundColor: getColorCode(initials) }"
        :class="`rounded-full h-[44px] w-[44px] font-bold flex justify-center items-center`"
      >
        {{ initials }}
      </div>
      <div class="flex flex-col flex-1">
        <div class="text-[120%]">
          {{ data.reviewAsAnon ? "Anonymous" : (data.name ?? data.email) }}
        </div>
        <small>{{ data.email }}</small>
      </div>
      <div class="w-[100px]">
        <Star :count="data.starRating" :rounded="false" />
        <small>{{ timeAgo(data.createdAt) }}</small>
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
        <img :src="img" class="w-full h-[100px] object-cover rounded-md" />
        <div
          v-if="showOverlay && index === 3"
          class="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold rounded-md"
        >
          +{{ remainingImages }}
        </div>
      </div>
    </div>
    <Divider />
    <div class="flex justify-between gap-[10px] items-center .text-[80%]">
      <div class="flex gap-[20px]">
        <div @click="upvote" class="cursor-pointer">
          <i class="pi pi-thumbs-up .text-[90%]"></i>
          Useful ({{ reviewUpvotes }})
        </div>
        <div v-if="!isBusiness">
          <i class="pi pi-share-alt .text-[90%]"></i>
          Share
        </div>
        <div v-if="!isBusiness">
          <i class="pi pi-flag .text-[90%]"></i>
        </div>
      </div>
    </div>

    <!-- reply -->
    <div
      class="border-l-[5px] border-l-primary p-[20px] bg-[#f3f0ec] rounded-[5px] mt-[20px]"
      v-if="data.reply"
    >
      <div class="flex justify-between gap-2.5 items-center">
        <div>
          <i class="pi pi-reply text-[90%] mr-[10px]"></i> Reply from
          <span class="font-bold">{{ data.reply.name }}</span>
        </div>
        <div>
          {{ timeAgo(data.reply.createdAt) }}
        </div>
      </div>
      <div class="mt-[20px]" v-html="data.reply.body"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useReviewMethods from "~/composables/method/useReviewMethods";

const props = defineProps(["data", "upvotes", "isBusiness"]);

const { upvoteReview } = useReviewMethods();

const initials = getInitials(props.data.name ?? props.data.email);
const reviewUpvotes = ref(0);

const images = ref();
const displayedImages = computed(() => props.data.photoUrls.slice(0, 4));

const remainingImages = computed(() => props.data.photoUrls.length - 4);

const showOverlay = computed(() => props.data.photoUrls.length > 4);

onBeforeMount(() => {
  reviewUpvotes.value = props.upvotes ? props.upvotes : 0;
  if (props.data.photoUrls && props.data.photoUrls.length > 0) {
    images.value = props.data.photoUrls;
  }
});

const upvote = async () => {
  if (props.isBusiness) return;
  reviewUpvotes.value++;
  await upvoteReview(props.data.id);
};
</script>
<style scoped>
.img img {
  width: 100px !important;
}
</style>
<!-- businessId [...]
locationId string($uuid)
nullable: true
reviewerId string($uuid)
nullable: true
email string
nullable: true
starRating integer($int32)
reviewBody string
replyBody
uopdare
nullable: true
photoUrls [
nullable: true
string]
reviewAsAnon boolean -->
