<template>
  <GeneralLoader height="300px" v-if="isLoadingPage" />
  <div v-else>
    <div v-if="emptyStateType !== 'data'">
      <GeneralEmpty
        description="Business does not have reviews yet."
        v-if="emptyStateType === 'initial-empty'"
      />
      <Card v-if="emptyStateType === 'filtered-empty'">
        <template #content>
          <div
            class="flex flex-col gap-2.5 items-center justify-center min-h-[200px]"
          >
            <i :class="`pi pi-folder-open !text-[500%]`"></i>
            <div>Your filter selection returned no results.</div>
            <ButtonCustom
              label="Clear Filters"
              @click="clearFilters"
              icon="times"
              input-class="!w-max"
              primary="true"
              :no-zoom="true"
            />
          </div>
        </template>
      </Card>
    </div>

    <div
      v-else
      class="flex flex-col-reverse md:flex-row gap-[30px] items-start"
    >
      <div class="flex flex-col gap-[20px] w-full md:w-[60%]">
        <Card class="...sticky ...top-0 shadow-lg z-[10]">
          <template #content>
            <div class="w-full">
              <div
                class="flex sm:flex-row flex-col justify-between items-center gap-[10px]"
              >
                <div class="flex gap-[10px] flex-1">
                  <!-- branches -->
                  <select v-model="selectedBranch" v-if="branches.length > 0">
                    <option
                      v-for="(i, idx) in branches"
                      :key="idx"
                      :value="i.id"
                    >
                      {{
                        i.id
                          ? `${i.branchCityTown}, ${i.branchState}`
                          : i.branchName
                      }}
                    </option>
                  </select>

                  <!-- rating -->
                  <select v-model="selectedRating">
                    <option
                      v-for="(i, idx) in ratings"
                      :key="idx"
                      :value="i.id"
                    >
                      {{ i.name }}
                    </option>
                  </select>
                </div>

                <div class="flex gap-[5px]">
                  <ButtonCustom
                    label="Apply Filter"
                    :no-zoom="true"
                    input-class="!w-max !text-[80%]"
                    primary="true"
                    :is-loading="isLoadingReviews"
                    @click="loadReviewsFromFilter"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>

        <div v-if="isLoadingReviews" class="flex flex-col gap-[20px]">
          <Card v-for="i in 2" :key="i">
            <template #content>
              <div
                class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900"
              >
                <div class="flex mb-4">
                  <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                  <div>
                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                  </div>
                </div>
                <Skeleton width="100%" height="50px"></Skeleton>
              </div>
            </template>
          </Card>
        </div>

        <div v-else class="flex flex-col gap-[20px]">
          <ReviewForDashboard
            :is-profile="true"
            :show-reply="true"
            v-for="(i, idx) in review"
            :key="idx"
            :data="i"
            :is-business="isBusiness"
          />
        </div>

        <div>
          <Paginator
            :rows="limit"
            :totalRecords="total"
            :rowsPerPageOptions="[2, 10, 20, 30]"
            @page="onPageChange"
            :first="first"
          />
        </div>
      </div>

      <div class="flex flex-col gap-[20px] w-full md:w-[40%]">
        <Card class="shadow-md border border-slate-100">
          <template #header>
            <div class="px-6 pt-6 font-bold text-lg text-slate-800">
              Review Summary
            </div>
          </template>
          <template #content>
            <div class="flex flex-col gap-6">
              <div
                class="flex flex-row gap-4 sm:gap-6 items-start justify-between"
              >
                <div class="flex flex-col items-center sm:items-start shrink-0">
                  <h3
                    class="text-4xl sm:text-6xl font-black text-slate-800 leading-none mb-2"
                  >
                    {{ displayAvgRating }}
                  </h3>
                  <div class="mb-1 scale-75 sm:scale-100 origin-left">
                    <Star :count="business?.avgRating || 0" :rounded="true" />
                  </div>
                  <p
                    class="text-[10px] sm:text-xs text-slate-500 font-medium whitespace-nowrap"
                  >
                    Based on {{ getTotalRatings(ratingCount) }}
                    {{ review.length <= 0 ? "Review" : "Reviews" }}
                  </p>
                </div>

                <div class="flex-1 space-y-2">
                  <StarForProfileRating
                    v-for="star in stars"
                    :key="star"
                    :star="star"
                    :rating-count="ratingCount"
                  />
                </div>
              </div>

              <div
                class="bg-primary/5 border-l-4 border-primary p-3 sm:p-4 rounded-r-lg"
              >
                <p
                  class="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-widest mb-1"
                >
                  What people are saying
                </p>
                <p
                  class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line"
                >
                  {{
                    business?.reviewSummary
                      ? formatReviewSummary(business?.reviewSummary)
                      : "No review summary for this business."
                  }}
                </p>
              </div>
            </div>
          </template>
        </Card>

        <Card
          v-if="business?.businessAddress"
          class="shadow-sm border border-slate-100"
        >
          <template #content>
            <div class="flex gap-3 items-start">
              <i class="pi pi-map-marker text-primary mt-1"></i>
              <div>
                <p class="text-sm font-bold text-slate-700">Location</p>
                <p class="text-xs text-slate-500">
                  {{ business.businessAddress }}
                </p>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Teleport to="body">
      <!-- Review Modal -->
      <div
        v-if="showReviewModal"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      >
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeReviewAndClearDraft"
        ></div>
        <div
          class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]"
        >
          <button
            @click="closeReviewAndClearDraft"
            class="absolute top-5 right-5 text-gray-400"
          >
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
  </div>
</template>

<script setup lang="ts">
import { onActivated, onBeforeMount } from "vue";
import ReviewForm from "~/components/Review/ReviewForm.vue";

import useReviewMethods from "~/composables/review/useReviewMethods";
import type { ReviewDashboard } from "~/types/review";
import type { RatingCounts } from "~/types/business";
import useBusinessMethods from "~/composables/business/useBusinessMethods";

const { getBusinessBranches } = useBusinessMethods();
const { getReviewManagement } = useReviewMethods();
const props = defineProps(["reviews", "business", "isBusiness"]);

interface BusinessBranch {
  businessId: string;
  id?: string | null;
  branchName?: string;
  branchStreet?: string;
  branchCityTown?: string;
  branchState?: string;
}

// UI State
const showReviewModal = ref(false);
const showAuthModal = ref(false);
const reviewDraft = ref<any>(null);

// pagination
const stars = [5, 4, 3, 2, 1] as const;

function getTotalRatings(ratings: RatingCounts): number {
  return Object.values(ratings).reduce((sum, count) => sum + count, 0);
}

const selectedBranch = ref<string | null>(null);
const selectedRating = ref<number | null>(null);

const limit = ref(10);
const total = ref(0);
const currentPage = ref(1);
const first = ref(0);

const onPageChange = async (event: any) => {
  if (event.rows !== limit.value) {
    limit.value = event.rows;
    first.value = 0;
    currentPage.value = 1;
  } else if (event.page !== currentPage.value - 1) {
    first.value = event.first;
    currentPage.value = event.page + 1;
  }
  await loadReviews(false);
};

// caching
const expiryDate = useState<Date | null>("reviews-expiry", () => null);

// data
const review = ref<ReviewDashboard[]>([]);
const ratingCount = ref<RatingCounts>({
  five: 0,
  four: 0,
  three: 0,
  two: 0,
  one: 0,
});

// loading states
const isLoadingPage = ref(false);
const isLoadingReviews = ref(false);
const isFirstLoad = ref(true);

const hasLoaded = ref(false);
const hasEverHadData = ref(false);

// core loader
const loadReviews = async (reloadPage: boolean) => {
  const now = new Date();

  // prevent unnecessary refetch
  if (reloadPage && !isFirstLoad.value) {
    if (expiryDate.value && expiryDate.value > now) {
      return;
    }
  }

  const _branch = selectedBranch.value ?? null;
  const _rating = selectedRating.value ?? null;

  try {
    if (isFirstLoad.value) {
      isLoadingPage.value = true;
    } else {
      isLoadingReviews.value = true;
    }

    const [res, branchesRes] = await Promise.all([
      getReviewManagement(
        props.business?.id,
        {
          branch: _branch,
          startDate: null,
          endDate: null,
          status: null,
          rating: _rating,
        },
        currentPage.value,
        limit.value,
      ),
      getBusinessBranches(props.business?.id),
    ]);

    // const res = await getReviewManagement(
    //   props.business?.id,
    //   {
    //     branch: _branch,
    //     startDate: null,
    //     endDate: null,
    //     status: null,
    //     rating: _rating,
    //   },
    //   currentPage.value,
    //   limit.value,
    // );

    if (branchesRes && branchesRes.statusCode === 200) {
      if (branchesRes.data.length > 0) {
        branches.value = branchesRes.data;
        branches.value.push({
          businessId: props.business?.id,
          id: null,
          branchName: "All Branches",
        });
      }
    }

    if (res.ok) {
      expiryDate.value = new Date(Date.now() + 5 * 60 * 1000);

      review.value = res.data.reviews;

      if (res.data.reviews.length > 0) {
        hasEverHadData.value = true;
      }

      ratingCount.value = res.data.count;
      total.value = getTotalRatings(ratingCount.value);

      isFirstLoad.value = false;
    }
  } catch (error) {
    console.log(error);
  } finally {
    hasLoaded.value = true;
    isLoadingPage.value = false;
    isLoadingReviews.value = false;
  }
};

// lifecycle
onBeforeMount(async () => {
  if (isFirstLoad.value) {
    await loadReviews(true);
  }
});

onActivated(async () => {
  const now = new Date();

  // only refetch if cache expired
  if (!expiryDate.value || expiryDate.value < now) {
    await loadReviews(true);
  }
});

// filters
const loadReviewsFromFilter = async () => {
  if (review.value.length <= 0) return;
  await loadReviews(false);
};

const clearFilters = async () => {
  selectedRating.value = null;
  selectedBranch.value = null;
  await loadReviews(false);
};

// empty state logic
const emptyStateType = computed(() => {
  if (!hasLoaded.value) return "loading";
  if (review.value.length > 0) return "data";
  if (!hasEverHadData.value) return "initial-empty";
  return "filtered-empty";
});

// dropdowns
const branches = ref<BusinessBranch[]>([]);

const ratings = [
  { name: "Rating: 1 Star", id: 1 },
  { name: "Rating: 2 Stars", id: 2 },
  { name: "Rating: 3 Stars", id: 3 },
  { name: "Rating: 4 Stars", id: 4 },
  { name: "Rating: 5 Stars", id: 5 },
  { name: "All Ratings", id: null },
];

// review modal handlers (unchanged)
const handleOpenAuth = (currentFormData: any) => {
  reviewDraft.value = currentFormData;
  localStorage.setItem("review_draft", JSON.stringify(currentFormData));
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
  localStorage.removeItem("review_draft");
};

// rating display
const displayAvgRating = computed(() => {
  const rating = props.business?.avgRating ?? 0;

  const integerPart = Math.floor(rating);
  const decimal = rating - integerPart;

  let displayValue;

  if (decimal <= 0.35) displayValue = integerPart;
  else if (decimal <= 0.65) displayValue = integerPart + 0.5;
  else displayValue = integerPart + 1;

  return displayValue.toFixed(1);
});

const formatReviewSummary = (text: string | null | undefined) => {
  if (!text) return "";

  return text
    .split(". ")
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .join(".\n\n"); // double line break for spacing
};
</script>

<style scoped>
select {
  border: 1px solid gray;
  border-radius: 10000px;
  padding: 5px 10px;
  font-size: 90%;
}
</style>
