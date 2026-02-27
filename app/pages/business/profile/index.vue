<template>
  <Toast />
  <GeneralLoader height="500px" v-if="isLoading" />
  <Business
    v-else
    :business="business"
    :to-edit="toEdit"
    :page="page"
    @edit="loadBusinessData"
    :isBusiness="isBusiness"
    :categories="categories"
    :reviews="reviews"
    status="verified"
    :canEdit="true"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: "business" });
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import useReviewMethods from "~/composables/method/useReviewMethods";
import useBusinessUser from "~/composables/business/useBusinessUser"; // ✅ Import store composable
import type { BusinessProfileResponse } from "~/types/business";

const { getBusinessProfile, getCategories } = useBusinessMethods();
const { getBusinessReviews } = useReviewMethods();
const businessStore = useBusinessUser(); // ✅ Get store instance

const page = ref("profile");
const isLoading = ref(true);
const toEdit = ref(false);
const isBusiness = ref(false);
const categories = ref([]);
const reviews = ref<any[]>([]); // ✅ Initialize as empty array

const business = ref<BusinessProfileResponse>();

const loadBusinessData = async () => {
  // ✅ Get ID from reactive store
  const id = businessStore.id;

  console.log('🔍 Business User ID:', id);
  console.log('🔍 Is Authenticated:', businessStore.isAuthenticated);

  if (!id) {
    console.error('❌ No business ID found in store');
    throw createError({
      statusCode: 404,
      statusMessage: "Business Not Found - No ID",
      fatal: true,
    });
  }

  try {
    isLoading.value = true;

    console.log('📡 Fetching business data for ID:', id);

    const [res, categoryRes, reviewRes] = await Promise.all([
      getBusinessProfile(id),
      getCategories(),
      getBusinessReviews(String(id)),
    ]);

    console.log('📦 Profile Response:', res);
    console.log('📦 Categories Response:', categoryRes);
    console.log('📦 Reviews Response:', reviewRes);

    if (categoryRes) {
      categories.value = categoryRes;
    }

    // ✅ Properly handle reviews response - always ensure it's an array
    if (reviewRes?.statusCode === 200) {
      // API might return {data: []} or {data: {reviews: []}} or just []
      const reviewData = reviewRes.data;
      
      if (Array.isArray(reviewData)) {
        reviews.value = reviewData;
      } else if (reviewData && Array.isArray(reviewData.reviews)) {
        reviews.value = reviewData.reviews;
      } else if (reviewData && typeof reviewData === 'object') {
        // If it's an object, extract any array property
        const arrayProp = Object.values(reviewData).find(val => Array.isArray(val));
        reviews.value = arrayProp || [];
      } else {
        reviews.value = [];
      }
      
      console.log('✅ Reviews loaded:', reviews.value.length, 'Raw data:', reviewData);
    } else {
      reviews.value = []; // ✅ Fallback to empty array
      console.log('⚠️ No reviews or invalid response');
    }

    if (res?.statusCode === 200) {
      if (businessStore.id && businessStore.id === id) {
        isBusiness.value = true;
        toEdit.value = true;
        page.value = "profile";
      }

      business.value = res.data;
      console.log('✅ Business data loaded successfully:', business.value);
      return;
    }

    console.error('❌ Profile response not 200:', res);
    throw createError({
      statusCode: 404,
      statusMessage: "Business Not Found - Invalid Response",
      fatal: true,
    });
  } catch (error) {
    console.error('❌ Error loading business data:', error);
    throw createError({
      statusCode: 404,
      statusMessage: "Business Not Found - Error",
      fatal: true,
    });
  } finally {
    isLoading.value = false;
  }
};

const pageTitle = computed(
  () =>
    `${business.value?.name ?? "Business Profile"} - ${
      business.value?.categories[0]?.name ?? ""
    } | Clereview`
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
</script>
