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

  <div v-else class="flex flex-col-reverse md:flex-row gap-[30px] items-start">
    
    <div class="flex flex-col gap-[20px] w-full md:w-[60%]">
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
                <InputText
                  placeholder="Search Reviews"
                  class="sm:w-[200px] w-full"
                  v-model="searchValue"
                />
                <ButtonCustom icon="search" input-class="w-max" />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Review
        v-for="(i, idx) in reviewsData"
        :key="idx"
        :data="i"
        :isBusiness="isBusiness"
      />

      <div>
        <Paginator
          :first="first"
          :rows="rows"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="rowsPerPageOptions"
          @page="onPageChange"
        />
      </div>
    </div>

    <div class="flex flex-col gap-[20px] w-full md:w-[40%]">
      <Card class="shadow-md border border-slate-100">
        <template #header>
          <div class="px-6 pt-6 font-bold text-lg text-slate-800">Review Summary</div>
        </template>
        <template #content>
          <div class="flex flex-col gap-6">
            
            <div class="flex flex-row gap-4 sm:gap-6 items-start justify-between">
              
              <div class="flex flex-col items-center sm:items-start shrink-0">
                <h3 class="text-4xl sm:text-6xl font-black text-slate-800 leading-none mb-2">
                  {{ displayAvgRating }}
                </h3>
                <div class="mb-1 scale-75 sm:scale-100 origin-left">
                  <Star :count="business?.avgRating || 0" :rounded="true" />
                </div>
                <p class="text-[10px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">
                  Based on {{ reviews.length }}
                  {{ reviews.length === 1 ? "Review" : "Reviews" }}
                </p>
              </div>

              <div class="flex-1 space-y-2">
                <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-2 sm:gap-3">
                  <span class="text-[10px] sm:text-xs font-bold text-slate-600 w-2">{{ star }}</span>
                  
                  <div class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="8 8 48 48" class="w-full h-full">
                      <defs>
                        <filter :id="`starDrop-${star}`" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="0" dy="2.2" stdDeviation="2.2" flood-color="#000" flood-opacity="0.32" />
                        </filter>
                      </defs>
                      <circle cx="32" cy="32" r="22" :fill="getStarColor(star)" />
                      <path
                        d="M32 19 L36.3 27.5 L45.5 28.4 L38.1 34.4 L40 43.5 L32 38.9 L24 43.5 L25.9 34.4 L18.5 28.4 L27.7 27.5 Z"
                        fill="#ffffff"
                        :filter="`url(#starDrop-${star})`"
                      />
                    </svg>
                  </div>

                  <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :style="{ 
                          width: `${distribution[star]}%`,
                          backgroundColor: getStarColor(star)
                      }"
                    ></div>
                  </div>
                  <span class="text-[9px] sm:text-[10px] font-semibold text-slate-400 w-6 sm:w-7 text-right">
                      {{ Math.round(distribution[star] ?? 0) }}%
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-primary/5 border-l-4 border-primary p-3 sm:p-4 rounded-r-lg">
              <p class="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                What people are saying
              </p>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {{ ratingDescription }}
              </p>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="business?.businessAddress" class="shadow-sm border border-slate-100">
        <template #content>
          <div class="flex gap-3 items-start">
            <i class="pi pi-map-marker text-primary mt-1"></i>
            <div>
              <p class="text-sm font-bold text-slate-700">Location</p>
              <p class="text-xs text-slate-500">{{ business.businessAddress }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>

   <Teleport to="body">
    <!-- Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeReviewAndClearDraft"></div>
      <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]">
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

    <!-- Auth Modal -->
    <AuthUnifiedModal 
      v-if="showAuthModal" 
      @close="showAuthModal = false" 
      @authenticated="onUserAuthenticated"
      @back-to-review="handleBackToReview"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";
import ReviewForm from "~/components/Review/ReviewForm.vue";
 
import useReviewMethods from "~/composables/method/useReviewMethods";
const { getBusinessReviews } = useReviewMethods();

const props = defineProps(["reviews", "business", "isBusiness"]);
const userStore = useUserStore();

// UI State
const showReviewModal = ref(false);
const showAuthModal = ref(false);
const reviewDraft = ref<any>(null);

// Pagination & Filter State
const sortValue = ref<"new" | "old">("new");
const filterValue = ref<number | "all">("all");
const searchValue = ref("");
const first = ref(0);
const rows = ref(10);
const rowsPerPageOptions = [10, 15, 50, 100];

const sort = [
  { id: "new", name: "Newest First" },
  { id: "old", name: "Oldest First" },
];

const filter = [
  { id: 1, name: "1 star" },
  { id: 2, name: "2 stars" },
  { id: 3, name: "3 stars" },
  { id: 4, name: "4 stars" },
  { id: 5, name: "5 stars" },
  { id: "all", name: "All ratings" },
];

// Helper for distribution star colors
const getStarColor = (star: number) => {
  switch (star) {
    case 1: return "#FF4101";
    case 2: return "#FF6F01";
    case 3: return "#FE9900";
    case 4: return "#C39A28";
    case 5: return "#deae29";
    default: return "#CECECE";
  }
};

const processedReviews = computed(() => {
  let data = [...(props.reviews ?? [])];
  if (searchValue.value.trim()) {
    const q = searchValue.value.toLowerCase();
    data = data.filter((r) => r.reviewBody.toLowerCase().includes(q));
  }
  if (filterValue.value !== "all") {
    data = data.filter((r) => r.starRating === filterValue.value);
  }
  data.sort((a, b) => {
    const da = new Date(a.createdAt).getTime();
    const db = new Date(b.createdAt).getTime();
    return sortValue.value === "new" ? db - da : da - db;
  });
  return data;
});

const totalRecords = computed(() => processedReviews.value.length);
const reviewsData = computed(() => processedReviews.value.slice(first.value, first.value + rows.value));

const onPageChange = (e: any) => {
  first.value = e.first;
  rows.value = e.rows;
};

// Logic for Rating Distribution
const distribution = computed(() => {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const total = props.reviews.length;
  if (total === 0) return counts;
  props.reviews.forEach((rev: any) => {
    const rating = Math.round(rev.starRating);
    if (counts[rating] !== undefined) counts[rating]++;
  });
  return {
    5: ((counts[5] ?? 0) / total) * 100,
    4: ((counts[4] ?? 0) / total) * 100,
    3: ((counts[3] ?? 0) / total) * 100,
    2: ((counts[2] ?? 0) / total) * 100,
    1: ((counts[1] ?? 0) / total) * 100,
  };
});

// Logic for Text Summary
const ratingDescription = computed(() => {
  if (props.reviews.length === 0) return "No reviews yet. Be the first to share your experience!";
  const allText = props.reviews.map((r: any) => r.reviewBody.toLowerCase()).join(" ");
  
  const themes = {
    positive: ["great", "best", "excellent", "amazing", "good", "perfect", "honestly", "love", "satisfied"],
    service: ["service", "staff", "customer", "people", "worker", "professional", "manner"],
    issues: ["problem", "wrong", "figure", "issue", "bad", "slow", "poor", "disappoint", "difficulty"],
  };

  const foundThemes = {
    positive: themes.positive.some(word => allText.includes(word)),
    service: themes.service.some(word => allText.includes(word)),
    issues: themes.issues.some(word => allText.includes(word)),
  };

  let summary = "Reviewers generally ";
  if (foundThemes.positive && !foundThemes.issues) {
    summary += "highly praise this business, highlighting exceptional service and a top-tier experience. ";
  } else if (foundThemes.positive && foundThemes.issues) {
    summary += "have shared mixed experiences; while many enjoy the quality, some have noted minor areas for improvement. ";
  } else if (foundThemes.issues) {
    summary += "have raised concerns regarding their interactions, pointing out areas that need attention. ";
  } else {
    summary += "have shared varied feedback reflecting their recent visits. ";
  }

  if (summary.length < 60 && props.reviews[0]?.reviewBody) {
    summary = `Summary: ${props.reviews[0].reviewBody.substring(0, 150)}...`;
  }
  return summary;
});

// Handlers for Writing Review (Preserved)
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
const displayAvgRating = computed(() => {
  const rating = props.business?.avgRating ?? 0;
  const decimal = rating % 1;
  
  let displayValue;
  if (decimal <= 0.4) {
    displayValue = Math.floor(rating);
  } else if (decimal >= 0.6) {
    displayValue = Math.ceil(rating);
  } else {
    displayValue = rating;
  }
  
  // Format to 1 decimal place
  return displayValue.toFixed(1);
});
watch([sortValue, filterValue, searchValue], () => { first.value = 0; });
</script>

<style scoped>
select {
  border: 1px solid gray;
  border-radius: 10000px;
  padding: 5px 10px;
  font-size: 90%;
}
</style>