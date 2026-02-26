<template>
  <Toast />
  <GeneralLoader v-if="isLoading" />
  <div v-else class="max-w-[1440px] mx-auto px-5 pt-1">
    <button 
      @click="goBack" 
      class="flex items-center text-gray-500 hover:text-[#008253] transition-colors duration-200 group mb-4"
    >
      <div
        class="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-gray-800 mr-1 transition-all"
      >
        <i class="pi pi-arrow-left text-sm"></i>
      </div>
      <span class="font-medium text-sm">Back</span>
    </button>
    <Business
      :business="business"
      :to-edit="toEdit"
      :page="page"
      @edit="loadBusinessData"
      :isBusiness="isBusiness"
      :categories="categories"
      :reviews="reviews"
      status="verified"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "biz",
});
import { onBeforeMount } from "vue";
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import { usePageData } from "~/composables/method/usePageData";
import useReviewMethods from "~/composables/method/useReviewMethods";
import type { BusinessProfileResponse } from "~/types/business";

const pageData = usePageData();
const router = useRouter();
const route = useRoute();
const {
  getBusinessProfile,
  getBusinessUser,
  saveBusinessProfile,
  getCategories,
} = useBusinessMethods();
const { getBusinessReviews } = useReviewMethods();
const businessUser = getBusinessUser();

const page = ref(route.query._section ?? "review");
const isLoading = ref(true);
const toEdit = ref(false);
const isBusiness = ref(false);
const categories = ref([]);
const reviews = ref<any[]>([]);

const business = ref<BusinessProfileResponse>();

const loadBusinessData = async () => {
  const id = route.params.id as string;
  if (!id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Business Not Found",
      fatal: true,
    });
  }

  try {
    isLoading.value = true;

    const [res, categoryRes, reviewRes] = await Promise.all([
      getBusinessProfile(id, true),
      getCategories(),
      getBusinessReviews(id),
    ]);

    if (categoryRes) {
      categories.value = categoryRes;
    }

    if (reviewRes?.statusCode === 200) {
      // console.log(reviewRes);
      reviews.value = reviewRes.data.reviews;
    }

    if (res?.statusCode === 200) {
      if (businessUser.id && businessUser.id === id) {
        // is business
        isBusiness.value = true;
        toEdit.value = true;
        page.value = "profile";
        pageData.value.isBusiness = true;
      }

      pageData.value.data = res.data;
      business.value = res.data;
      return;
    }

    throw createError({
      statusCode: 404,
      statusMessage: "Business Not Found",
      fatal: true,
    });
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Business Not Found",
      fatal: true,
    });
  } finally {
    isLoading.value = false;
  }
};

const pageTitle = computed(
  () =>
    `${business.value?.name ?? "Business Profile"} - ${
      business.value?.categories[0]?.name ?? "Business"
    } | Clereview`,
);
useHead({
  title: pageTitle,
  meta: [
    {
      name: "description",
      content: computed(() => business.value?.businessDescription ?? ""),
    },
  ],
});

onBeforeMount(async () => {
  await loadBusinessData();
});
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/end-user/landing/categories");
  }
};
// // #push data
// provide('businessData', business.value)
// const count = ref(0)
// provide('key', count)

// // #push data
// definePageMeta({
//     businessId: computed(() => business.value?.id),
//     isBusiness: computed(() => isBusiness.value)
// })
</script>
