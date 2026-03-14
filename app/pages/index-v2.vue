<template>
  <NavigationHeaderUser />
  <div class="flex flex-col">
    <div
      class="min-h-[90dvh] border border-primary flex flex-col justify-center items-center bg-cover bg-center py-[30px]"
      style="
        background-image:
          linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
          url(&quot;/images/background/e-user-ldg.png&quot;);
      "
    >
      <div
        class="flex-1 w-full flex justify-center items-center flex-col gap-2.5"
      >
        <div class="font-bold text-white text-2xl sm:text-4xl drop-shadow-lg">
          Let real experiences guide you.
        </div>
        <div class="text-white text-sm sm:text-[110%]">
          Find verified businesses, read <span class="hidden sm:inline-block">authentic</span> reviews, and connect with the
          services you need.
        </div>
        <div ref="heroSearchRef" class="mt-[20px] sm:w-[50%] w-full">
          <SearchBarHome />
        </div>
      </div>

      
    </div>
    <!-- statistics -->
    <LandingStatistics :statistics="statistics" />
    <!-- categories -->
    <div class="..border ..rounded-[10px] !bg-[#FDF3FF] p-[30px]">
      <div class="flex justify-between items-center mb-[20px]">
        <div class="text-2xl font-bold">Looking for something specific?</div>
        <div class="flex gap-2">
          <i
            @click="prev"
            class="pi pi-chevron-left rounded-full p-[10px] hover:bg-primary cursor-pointer bg-light"
          ></i>
          <i
            @click="next"
            class="pi pi-chevron-right rounded-full p-[10px] hover:bg-primary cursor-pointer bg-light"
          ></i>
        </div>
      </div>

      <Carousel
        v-model:page="page"
        :value="categories"
        :numVisible="10"
        :numScroll="5"
        :showNavigators="false"
        :showIndicators="false"
      >
        <template #item="slotProps">
          <UserLandingSingleCategory :data="slotProps.data" />
        </template>
      </Carousel>
    </div>

    <!-- featured business -->
    <div class="section sm:my-[50px] my-[30px]">
      <div class="flex justify-between items-center mb-[20px]">
        <div class="header font-bold flex-1 text-3xl">Featured Businesses</div>
        <div>
          <button
            class="rounded-full !bg-primary px-[15px] py-[5px] text-white"
          >
            See More
            <i class="pi pi-angle-right"></i>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-[20px]">
        <BusinessSingle
          v-for="(i, idx) in featuredBusiness"
          :key="idx"
          :data="i"
        />
      </div>
    </div>

    <!-- cta - business -->
    <div
      class="..section-mg bg-gradient-to-r from-fuchsia-50 to-fuchsia-200 p-[50px] my-[30px] rounded-[10px]"
    >
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-[20px]">
        <div class="flex flex-col justify-center">
          <div class="text-2xl font-bold">More than just reviews</div>
          <div class="mt-[20px]">
            <p>
              Turn your customer feedback into actionable insights by managing,
              analyzing, comparing, and exporting it effortlessly with
              CleReview’s powerful and fully customizable business dashboard.
            </p>
            <p>
              Stand on the grand stage and be discovered by millions of users.
            </p>
            <p>With onboarding in mere minutes, what are you waiting for?.</p>
          </div>
          <div class="mt-[20px]">
            <NuxtLink>
              <button
                class="rounded-full !bg-light text-white px-[25px] py-[15px]"
              >
                Get Started
              </button>
            </NuxtLink>
          </div>
        </div>
        <div>
          <div class="flex gap-4 w-full mx-auto">
            <div
              v-for="(img, index) in images"
              :key="img"
              @click="setActive(index)"
              class="cursor-pointer overflow-hidden rounded-xl transition-all duration-500"
              :class="
                index === activeIndex
                  ? 'flex-[3] h-[320px]'
                  : 'flex-[1] h-[320px] opacity-80 hover:opacity-100'
              "
            >
              <img
                :src="img"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- recent reviews -->
    <Card class="section-mg p-[20px]">
      <template #content>
        <div class="mb-[20px] flex justify-between">
          <div class="text-3xl font-bold">Recent Reviews</div>
          <div class="flex gap-2">
            <button
              class="pi pi-chevron-left rounded-full p-[10px] hover:bg-primary cursor-pointer bg-light"
              :disabled="isPrevDisabled"
              @click="review_prev"
            >
              <i></i>
            </button>
            <button
              class="pi pi-chevron-right rounded-full p-[10px] hover:bg-primary cursor-pointer bg-light"
              :disabled="isNextDisabled"
              @click="review_next"
            >
              <i></i>
            </button>
          </div>
        </div>
        <div class="mx-[-10px]">
          <Carousel
            v-model:page="review_page"
            :value="groupedCategories"
            :numVisible="1"
            :numScroll="1"
            :showNavigators="false"
            :showIndicators="false"
          >
            <template #item="slotProps">
              <div class="grid-container">
                <div
                  v-for="item in slotProps.data"
                  :key="item.id"
                  class="grid-item"
                >
                  <ReviewForLandingPage :data="item" />
                </div>
              </div>
            </template>
          </Carousel>
        </div>
      </template>
    </Card>

    <!-- cta - user -->
    <div
      class="..section-mg ..rounded-[10px] p-[25px] flex items-center justify-end bg-gradient-to-r from-[#deae29] to-[#fbd85b] mt-[30px]"
    >
      <div class="flex-1">
        <div class="font-bold text-[130%] text-white">
          Share Your Experience
        </div>
        <div class="text-white">
          Had an experience? Share your review with businesses and help
          thousands of others discover who they can trust.
        </div>
      </div>
      <div>
        <button class="rounded-full !bg-black text-white px-[25px] py-[15px]">
          Write a review
        </button>
      </div>
    </div>
  </div>
  <NavigationFooterUser />
</template>

<script setup lang="ts">
import type { ReviewSummary } from "~/types/review";

const heroSearchRef = ref<HTMLElement | null>(null);
useHeroSearchObserver(heroSearchRef);

const statistics = [
  { title: "Registered Businesses", count: "200+" },
  { title: "Reviewing Users", count: "100k+" },
  { title: "Uploaded Reviews", count: "10M+" },
];

// categories
const page = ref(0);

const next = () => {
  page.value++;
};

const prev = () => {
  if (page.value > 0) page.value--;
};

const categories = [
  {
    id: "147e754e-5e57-4291-b878-9f246aeed0e4",
    name: "Education and Training",
    description: null,
    parentCategoryId: null,
  },
  {
    id: "7d2eec4b-3009-43ac-9eef-5644144556a8",
    name: "Fashion and Beauty",
    description: null,
    parentCategoryId: null,
  },
  {
    id: "4237bde4-7a06-463b-baaf-7e571bcf9dc5",
    name: "Food and Resturants",
    description: null,
    parentCategoryId: null,
  },
  {
    id: "8edd049c-6505-4086-9bf1-4f8b058a4fcf",
    name: "Health and Wellness",
    description: null,
    parentCategoryId: null,
  },
  {
    id: "c65281fa-eabd-4c73-917b-92fdd6025660",
    name: "Hotels,BnB and vacation",
    description: null,
    parentCategoryId: null,
  },
  {
    id: "22949d84-3c57-449f-93dc-2af00cd63b24",
    name: "Others",
    description: null,
    parentCategoryId: null,
  },
  {
    id: "14ce3615-ac66-4302-856b-133c3827b35d",
    name: "Shopping",
    description: null,
    parentCategoryId: null,
  },
];
//

// featured business
const featuredBusiness = getTopBusinesses(8);
//

// cto - business
const images = ref([
  "/images/img/pages/app-academy-tutor-5.png",
  "/images/img/pages/app-academy-tutor-3.png",
  "/images/img/pages/app-academy-tutor-4.png",
]);

const activeIndex = ref(0);

const setActive = (index: number) => {
  activeIndex.value = index;
};
//

// recent reviews
const review_page = ref(0);
const numPages = computed(() => {
  return Math.ceil(mockReviews.length / 2); // 2 = numVisible
});

const isPrevDisabled = computed(() => review_page.value <= 0);
const isNextDisabled = computed(() => review_page.value >= numPages.value - 1);

const review_next = () => {
  if (review_page.value < numPages.value - 1) review_page.value++;
};

const review_prev = () => {
  if (review_page.value > 0) review_page.value--;
};

const mockReviews: ReviewSummary[] = [
  {
    email: "john.doe@email.com",
    starRating: 5,
    uploadedDate: "2026-03-01",
    reviewBody:
      "<p>Excellent&nbsp;service,&nbsp;the&nbsp;staff&nbsp;were&nbsp;very&nbsp;professional&nbsp;and&nbsp;helpful.</p>",
    businessName: "Prime Tech Solutions",
    businessId: "biz_001",
    anonymous: false,
  },
  {
    email: "sarah.johnson@email.com",
    starRating: 4,
    uploadedDate: "2026-03-02",
    reviewBody:
      "<p>Great&nbsp;experience&nbsp;overall,&nbsp;but&nbsp;delivery&nbsp;could&nbsp;have&nbsp;been&nbsp;a&nbsp;bit&nbsp;faster.</p>",
    businessName: "GreenLeaf Market",
    businessId: "biz_002",
    anonymous: false,
  },
  {
    email: "david.smith@email.com",
    starRating: 3,
    uploadedDate: "2026-03-02",
    reviewBody:
      "<p>The&nbsp;product&nbsp;quality&nbsp;was&nbsp;good,&nbsp;however&nbsp;customer&nbsp;support&nbsp;was&nbsp;slow&nbsp;to&nbsp;respond.</p>",
    businessName: "Urban Style Hub",
    businessId: "biz_003",
    anonymous: false,
  },
  {
    email: "emily.brown@email.com",
    starRating: 5,
    uploadedDate: "2026-03-03",
    reviewBody:
      "<p>Amazing&nbsp;experience,&nbsp;I&nbsp;will&nbsp;definitely&nbsp;recommend&nbsp;this&nbsp;business&nbsp;to&nbsp;others.</p>",
    businessName: "Fresh Bite Restaurant",
    businessId: "biz_004",
    anonymous: false,
  },
  {
    email: "michael.wilson@email.com",
    starRating: 2,
    uploadedDate: "2026-03-03",
    reviewBody:
      "<p>Unfortunately&nbsp;the&nbsp;service&nbsp;did&nbsp;not&nbsp;meet&nbsp;my&nbsp;expectations&nbsp;this&nbsp;time.</p>",
    businessName: "CityFix Auto Care",
    businessId: "biz_005",
    anonymous: true,
  },
  {
    email: "linda.martin@email.com",
    starRating: 4,
    uploadedDate: "2026-03-04",
    reviewBody:
      "<p>Friendly&nbsp;staff&nbsp;and&nbsp;clean&nbsp;environment,&nbsp;I&nbsp;would&nbsp;visit&nbsp;again.</p>",
    businessName: "Glow Beauty Lounge",
    businessId: "biz_006",
    anonymous: false,
  },
  {
    email: "james.anderson@email.com",
    starRating: 5,
    uploadedDate: "2026-03-04",
    reviewBody:
      "<p>Fantastic&nbsp;customer&nbsp;service&nbsp;and&nbsp;very&nbsp;reliable&nbsp;products.</p>",
    businessName: "SmartHome Gadgets",
    businessId: "biz_007",
    anonymous: true,
  },
  {
    email: "olivia.thomas@email.com",
    starRating: 3,
    uploadedDate: "2026-03-05",
    reviewBody:
      "<p>The&nbsp;experience&nbsp;was&nbsp;average,&nbsp;there&nbsp;is&nbsp;room&nbsp;for&nbsp;improvement.</p>",
    businessName: "Healthy Living Pharmacy",
    businessId: "biz_008",
    anonymous: true,
  },
  {
    email: "daniel.jackson@email.com",
    starRating: 4,
    uploadedDate: "2026-03-05",
    reviewBody:
      "<p>Good&nbsp;value&nbsp;for&nbsp;money,&nbsp;and&nbsp;the&nbsp;team&nbsp;was&nbsp;very&nbsp;responsive.</p>",
    businessName: "QuickPrint Services",
    businessId: "biz_009",
    anonymous: false,
  },
  {
    email: "sophia.white@email.com",
    starRating: 1,
    uploadedDate: "2026-03-06",
    reviewBody:
      "<p>Sorry,&nbsp;we&nbsp;aim&nbsp;to&nbsp;improve&nbsp;this&nbsp;experience&nbsp;in&nbsp;the&nbsp;future.</p>",
    businessName: "Urban Fit Gym",
    businessId: "biz_010",
    anonymous: false,
  },
];

const groupedCategories = computed(() => {
  const groups = [];
  for (let i = 0; i < mockReviews.length; i += 4) {
    groups.push(mockReviews.slice(i, i + 4));
  }
  return groups;
});
//
</script>

<style scoped>
.header {
  border-left: 7px solid theme("colors.primary");
  padding-left: 10px;
  /* font-size: 130%; */
  font-weight: bolder;
  margin-bottom: 10px;
  padding-block: 5px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
button:disabled {
  cursor: not-allowed;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 items per row on desktop */
  gap: 1rem;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr; /* 1 item per row on mobile */
  }
}
</style>
