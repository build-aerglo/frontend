<template>
  <div
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { $topBusinesses, $reviews, $statistics, $categories } = useNuxtApp();

const topBusinesses = computed(() => $topBusinesses.value);
const categories = computed(() => $categories.value);
const statistics = computed(() => $statistics.value);
const reviews = computed(() => $reviews.value);
</script>
