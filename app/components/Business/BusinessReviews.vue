<template>
    <div v-if="reviews.length <= 0" class="flex flex-col items-center gap-2.5 py-[50px]">
        No reviews yet
        <ButtonCustom 
            v-if="!isBusiness"
            label="Be the first to review this business" 
            icon="pencil" 
            input-class="w-max" 
            size="lg"
            primary="true" 
            @click="handleWriteReviewClick" 
        />
    </div>
    <div v-else class="flex flex-col gap-[20px]">
        <Card class="sticky top-0 shadow-lg z-[10]">
            <template #content>
                <div class="w-full">
                    <div class="flex sm:flex-row flex-col justify-between items-center gap-[10px]">
                        <div class="flex gap-[10px] flex-1">
                            <select v-model="sortValue">
                                <option v-for="(i, idx) in sort" :key="idx" :value="i.id">{{ i.name }}</option>
                            </select>

                            <select v-model="filterValue">
                                <option v-for="(i, idx) in filter" :key="idx" :value="i.id">{{ i.name }}</option>
                            </select>

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

    <Teleport to="body">
      <div v-if="showReviewModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeReviewAndClearDraft"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-2xl">
          <button @click="closeReviewAndClearDraft" class="absolute top-5 right-5 text-gray-400">
              <i class="pi pi-times text-xl"></i>
          </button>
          
          <ReviewForm 
            v-if="reviewDraft"
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
    </Teleport>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import ReviewForm from '~/components/Review/ReviewForm.vue'
import useReviewMethods from "~/composables/method/useReviewMethods";
const { getBusinessReviews } = useReviewMethods()

const props = defineProps(['reviews', 'business', 'isBusiness'])
const userStore = useUserStore()

// --- Review Modal State ---
const showReviewModal = ref(false)
const showAuthModal = ref(false)
const reviewDraft = ref<any>(null)

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

// --- Review Flow Handlers ---
const handleWriteReviewClick = () => {
  if (userStore.isAuthenticated) {
    // Redirect directly to the write-review page
    navigateTo({
      path: '/review/write-review',
      query: { 
        bizId: props.business.id, 
        bizName: props.business.name,
        bizLogo: props.business.logo 
      }
    });
  } else {
    // 2. If guest, show the modal flow
    reviewDraft.value = {
      businessName: props.business.name,
      selectedBusinessId: props.business.id,
      selectedBusinessLogo: props.business.logo,
      rating: 0,
      reviewBody: '',
      images: [],
      isAddingNewBusiness: false
    };
    showReviewModal.value = true;
  }
}

const handleOpenAuth = (currentFormData: any) => {
  reviewDraft.value = currentFormData;
  localStorage.setItem('review_draft', JSON.stringify(currentFormData));
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
  localStorage.removeItem('review_draft');
};

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