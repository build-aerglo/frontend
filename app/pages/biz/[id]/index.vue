<template>
    <Toast />
    <GeneralLoader v-if="isLoading" />
    <Business v-else :business="business" :to-edit="toEdit" :page="page" @edit="loadBusinessData"
        :isBusiness="isBusiness" :categories="categories" :reviews="reviews" status="verified" />
</template>

<script setup lang="ts">
definePageMeta({
    layout: "biz"
})
import { onBeforeMount } from "vue"
import useBusinessMethods from '~/composables/business/useBusinessMethods';
import { usePageData } from "~/composables/method/usePageData";
import useReviewMethods from "~/composables/method/useReviewMethods";
import type { BusinessProfileResponse } from '~/types/business';

const pageData = usePageData()

const route = useRoute()
const { getBusinessProfile, getBusinessUser, saveBusinessProfile, getCategories } = useBusinessMethods()
const { getBusinessReviews } = useReviewMethods()
const businessUser = getBusinessUser();

const page = ref(route.query._section ?? 'review');
const isLoading = ref(true);
const toEdit = ref(false);
const isBusiness = ref(false);
const categories = ref([])
const reviews = ref<any[]>([])

const business = ref<BusinessProfileResponse>()

const loadBusinessData = async () => {
    const id = route.params.id;
    if (!id) {
        throw createError({
            statusCode: 404,
            statusMessage: "Business Not Found",
            fatal: true
        })
    }

    try {
        isLoading.value = true;

        const [res, categoryRes, reviewRes] = await Promise.all([
            getBusinessProfile(id),
            getCategories(),
            getBusinessReviews(String(id))
        ]);

        if (categoryRes) {
            categories.value = categoryRes;
        }

        if (reviewRes?.statusCode === 200) {
            reviews.value = reviewRes.data;
        }

        if (res?.statusCode === 200) {
            if (businessUser.id && businessUser.id === id) {
                // is business
                isBusiness.value = true;
                toEdit.value = true;
                page.value = 'profile'
                pageData.value.isBusiness = true;
            }

            pageData.value.data = res.data;
            business.value = res.data;
            return;
        }

        throw createError({
            statusCode: 404,
            statusMessage: "Business Not Found",
            fatal: true
        })
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: "Business Not Found",
            fatal: true
        })
    } finally {
        isLoading.value = false;
    }
}

const pageTitle = computed(() => `${business.value?.name ?? 'Business Profile'} - ${business.value?.categories[0]?.name ?? ''} | Clereview`);
useHead({
    title: pageTitle, meta: [
        { name: 'description', content: computed(() => business.value?.businessDescription ?? '') }
    ],
});

onBeforeMount(async () => {
    await loadBusinessData();
})

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