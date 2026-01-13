<template>
    <!-- <div v-if="!lazyItems.length && !loading" class="text-center py-6">
        No reviews yet
    </div>
    <VirtualScroller v-else :items="lazyItems" :itemSize="lazyItems.length" lazy :loading="loading" showLoader
        @lazy-load="onLazyLoad" style="height: 500px">
        <template #item="{ item }">
            <div class="mb-[20px]">
                <Review :data="item" />
            </div>
        </template>

<template #loader>
            <div class="flex justify-center items-center p-4">
                <img src="/svg/spinner.svg" alt="Loading..." class="w-8 h-8" />
            </div>
        </template>
</VirtualScroller> -->
    <div v-if="reviews.length <= 0" class="flex flex-col items-center gap-2.5 py-[50px]">
    No reviews yet
    <ButtonCustom 
        v-if="!isBusiness"
        label="Be the first to review this business" 
        icon="pencil" 
        input-class="w-max" 
        size="lg"
        primary="true" 
    />
</div>
    <div v-else class="flex flex-col gap-[20px]">
        <!-- <div class="h-[200px] border rounded-[10px]">
            Summary
        </div> -->
        <Card class="sticky top-0 shadow-lg z-[10000]">
            <template #content>
                <div class="w-full">
                    <!-- <div class="flex gap-2.5 justify-end">
                        <NuxtLink v-if="isBusiness" to="/business/reviews-management">
                            <ButtonCustom input-class="w-max" label="Manage Reviews" primary="true" size="lg" />
                        </NuxtLink>
                        <ButtonCustom :to="`/review/write-review?_id=${business.id}`" v-else input-class="w-max"
                            label="Write a review" primary="true" size="lg" />
                    </div>
                    <div class="mt-[10px] flex gap-[20px]">
                        <div class="flex items-center justify-center flex-col">
                            <div class="font-extrabold text-[200%]">{{ business.avgRating }}</div>
                            <div class="w-[90px]">
                                <Star :count="business.avgRating" />
                            </div>
                            <div>{{ business.reviewCount }} Review(s)</div>
                        </div>
                        <div class="flex-1 border"></div>
                    </div> -->
                    <div class="flex sm:flex-row flex-col justify-between items-center gap-[10px]">
                        <div class="flex gap-[10px] flex-1">
                            <select v-model="sortValue">
                                <option v-for="(i, idx) in sort" :key="idx" :value="i.id">{{ i.name }}</option>
                            </select>

                            <select v-model="filterValue">
                                <option v-for="(i, idx) in filter" :key="idx" :value="i.id">{{ i.name }}</option>
                            </select>

                            <!-- <Select v-model="filterValue" :options="filter" optionLabel="name" optionValue="id"
                                placeholder="Filter by rating" />

                            <Select v-model="sortValue" :options="sort" optionLabel="name" optionValue="id"
                                placeholder="Sort" /> -->
                        </div>
                        <div class="flex gap-[5px]">
                            <InputText placeholder="Search Reviews" class="sm:w-[300px] w-full" v-model="searchValue" />
                            <ButtonCustom icon="search" input-class="w-max" />
                        </div>
                    </div>
                </div>
            </template>
        </Card>
        <Review v-for="(i, idx) in reviewsData" :key="idx" :data="i" :isBusiness="isBusiness" />
        <div>
            <Paginator :first="first" :rows="rows" :totalRecords="totalRecords" :rowsPerPageOptions="rowsPerPageOptions"
                @page="onPageChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import useReviewMethods from "~/composables/method/useReviewMethods";
const { getBusinessReviews } = useReviewMethods()

const props = defineProps(['reviews', 'business', 'isBusiness'])
// const ITEMS_PER_PAGE = 10;

// const lazyItems = ref<any[]>([]);
// const page = ref(1);
// const loading = ref(false);
// const hasMore = ref(true);

// onMounted(() => {
//     lazyItems.value = props.reviews?.length
//         ? [...props.reviews]
//         : [];

//     page.value = props.reviews?.length
//         ? Math.ceil(props.reviews.length / ITEMS_PER_PAGE)
//         : 0;

//     hasMore.value = true;
// });


// const onLazyLoad = async () => {
//     if (loading.value || !hasMore.value) return;

//     loading.value = true;

//     try {
//         const res = await getBusinessReviews(
//             props.business.id,
//             page.value + 1,
//             ITEMS_PER_PAGE
//         );

//         if (!res || res.data.length === 0) {
//             hasMore.value = false;
//             return;
//         }

//         lazyItems.value.push(...res.data);
//         page.value++;
//     } finally {
//         loading.value = false;
//     }
// };

onBeforeMount(() => {

})

const sortValue = ref<'new' | 'old'>('new')
const filterValue = ref<number | 'all'>('all')
const searchValue = ref('')

const first = ref(0)        // starting index
const rows = ref(10)        // page size
const rowsPerPageOptions = [10, 15, 50, 100]

const sort = [
    { id: 'new', name: 'Newest First' },
    { id: 'old', name: 'Oldest First' }
]

const filter = [
    { id: 1, name: '1 star' },
    { id: 2, name: '2 stars' },
    { id: 3, name: '3 stars' },
    { id: 4, name: '4 stars' },
    { id: 5, name: '5 stars' },
    { id: 'all', name: 'All ratings' }
]

const processedReviews = computed(() => {
    let data = [...props.reviews ?? []]

    if (searchValue.value.trim()) {
        const q = searchValue.value.toLowerCase()
        data = data.filter(r =>
            r.reviewBody.toLowerCase().includes(q)
        )
    }

    if (filterValue.value !== 'all') {
        data = data.filter(
            r => r.starRating === filterValue.value
        )
    }

    data.sort((a, b) => {
        const da = new Date(a.createdAt).getTime()
        const db = new Date(b.createdAt).getTime()
        return sortValue.value === 'new' ? db - da : da - db
    })

    return data
})


const totalRecords = computed(() => processedReviews.value.length)

const reviewsData = computed(() => {
    return processedReviews.value.slice(
        first.value,
        first.value + rows.value
    )
})


const onPageChange = (e: any) => {
    first.value = e.first
    rows.value = e.rows
}


watch([sortValue, filterValue, searchValue], () => {
    first.value = 0
})
</script>

<style scoped>
select {
    border: 1px solid gray;
    border-radius: 10000px;
    padding: 5px 10px;
    font-size: 90%;
}
</style>