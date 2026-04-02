<template>
  <!-- <div
    class="bg-[#F0FDF4] p-[30px] flex flex-col justify-center items-center h-screen !font-[helvetica]"
  >
    <div
      class="rounded-[20px] p-[30px] m-[20px] bg-white flex-1 w-[50%] flex flex-col"
    >
      <div class="flex justify-start items-center">
        <a href="https://www.clereview.com">
          <img
            src="https://www.clereview.com/images/logo/b-user-logo.png"
            class="w-[170px] h-auto"
          />
        </a>
      </div>
      <hr />
      <div class="flex-1 flex flex-col gap-[10px]">
        <div
          class="text-[25px] font-bold mb-[20px] text-center uppercase mt-[10px]"
        >
          {title}
        </div>
        <div class="font-bold">Hello Team,</div>
        <div>
          <div>Business Name: {businessName}</div>
          <div>Claimed By: {claimerName}</div>
          <div>Role at business: {role}</div>
        </div>

        <div class="text-center my-[20px]">
          <a
            href="{url}"
            style="
              background-color: #008253;
              color: #ffffff;
              padding: 14px 24px;
              text-decoration: none;
              border-radius: 50px;
              display: inline-block;
              font-size: 14px;
            "
          >
            Validate Claim
          </a>
        </div>

        <div>
          If the button doesn't work, copy and paste this link into your
          browser:
        </div>
        <a href="{url}" class="text-[#008253]"> {url} </a>
      </div>
    </div>
    <div class="text-center text-[14px]">
      © 2026 CleReview. All rights reserved.
    </div>
  </div> -->
  <div
    class="grid sm:grid-cols-8 grid-cols-4 gap-[20px] border border-gray-200 shadow-md p-4 rounded-xl mt-5"
  >
    <div
      class="flex justify-center items-center"
      v-for="i in isMobile() ? 4 : 8"
      :key="i"
    >
      <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
    </div>
  </div>

  <Divider />

  <div class="grid sm:grid-cols-5 grid-cols-1 gap-[20px]">
    <div
      v-for="i in isMobile() ? 3 : 10"
      :key="i"
      class="gap-[10px] p-[15px] flex flex-col items-center justify-center relative bg-gray-50 dark:bg-gray-800 rounded-xl transform transition-transform duration-150 ease-out hover:-translate-y-1.5"
    >
      <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
      <Skeleton
        height="2rem"
        width="7rem"
        class="mb-2"
        borderRadius="16px"
      ></Skeleton>
      <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
      <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
    </div>
  </div>

  <Divider />

  <div class="grid sm:grid-cols-4 grid-cols-1 gap-[20px]">
    <div
      v-for="i in isMobile() ? 1 : 4"
      :key="i"
      class="p-[15px] relative bg-gray-50 dark:bg-gray-800 rounded-xl transform transition-transform duration-150 ease-out hover:-translate-y-1.5"
    >
      <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
      <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
      <Skeleton width="20rem" height="4rem" borderRadius="16px"></Skeleton>

      <div class="flex items-center gap-[5px] mt-[20px]">
        <Skeleton shape="circle" size="4rem"></Skeleton>
        <div>
          <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
          <Skeleton width="5rem" borderRadius="16px"></Skeleton>
        </div>
      </div>
    </div>
  </div>

  <Divider />

  <div class="grid sm:grid-cols-4 grid-cols-1 gap-[20px]">
    <div
      v-for="i in isMobile() ? 2 : 8"
      :key="i"
      class="group flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
    >
      <Skeleton size="4rem"></Skeleton>
      <Skeleton width="10rem" borderRadius="16px"></Skeleton>
      <Skeleton width="5rem" borderRadius="16px"></Skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isMobile } from "~/utils";

definePageMeta({
  layout: false,
});

// const { $topBusinesses, $reviews, $statistics, $categories } = useNuxtApp();

// const topBusinesses = computed(() => $topBusinesses.value);
// const categories = computed(() => $categories.value);
// const statistics = computed(() => $statistics.value);
// const reviews = computed(() => $reviews.value);
</script>
