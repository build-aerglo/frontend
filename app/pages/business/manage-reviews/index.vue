<template>
  <Dialog
    v-model:visible="showDateSelector"
    :draggable="false"
    modal
    header="Select Range:"
    :style="{ width: '35rem' }"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
      <div>
        <label>Start Date:</label>
        <DatePicker
          v-model="customStartDate"
          showIcon
          fluid
          iconDisplay="input"
          :manualInput="false"
        />
      </div>
      <div>
        <label>End Date:</label>
        <DatePicker
          v-model="customStopDate"
          showIcon
          fluid
          iconDisplay="input"
          :manualInput="false"
          :minDate="customStartDate"
          :disabled="!customStartDate"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2.5">
        <ButtonCustom
          label="Cancel"
          size="lg"
          input-class="!w-max"
          :no-zoom="true"
          @click="showDateSelector = false"
        />
        <ButtonCustom
          label="Apply Range"
          input-class="!w-max"
          primary="true"
          size="lg"
          :no-zoom="true"
          @click="handleCustomDate(customStartDate, customStopDate)"
        />
      </div>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="viewReview"
    :draggable="false"
    modal
    header="Review:"
    :style="{ width: '35rem' }"
  >
    <ReviewForDashboard :show-reply="true" :data="selectedReview!" />
  </Dialog>

  <Dialog
    v-model:visible="editReview"
    :draggable="false"
    modal
    header="Respond to review:"
    :style="{ width: '35rem' }"
  >
    <ReviewForDashboard :show-reply="false" :data="selectedReview!" />
    <Editor
      v-model="editReplyText"
      editorStyle="height: 150px"
      class="mt-[20px]"
    >
      <template v-slot:toolbar>
        <span>Review Response:</span>
      </template>
    </Editor>
    <template #footer>
      <div class="flex w-full justify-between" v-if="selectedReview">
        <div class="">
          <ButtonCustom
            v-if="isEdit"
            :no-zoom="true"
            input-class="!bg-[red]"
            icon="trash"
            label="Delete Response"
            size="lg"
            @click="deleteResponseAsync(selectedReview)"
            :is-loading="isDeletingResponse"
          />
        </div>
        <div class="flex gap-2.5">
          <ButtonCustom
            :no-zoom="true"
            label="Cancel"
            size="lg"
            input-class="!w-max"
            @click="resetResponse"
          />
          <ButtonCustom
            :no-zoom="true"
            input-class="!w-max"
            :label="!isEdit ? 'Upload Response' : 'Update Response'"
            size="lg"
            primary="true"
            @click="
              !isEdit
                ? postResponseAsync(selectedReview)
                : updateResponseAsync(selectedReview)
            "
            :is-loading="isUpdatingResponse"
          />
        </div>
      </div>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="openDispute"
    :draggable="false"
    modal
    header="Report review:"
    :style="{ width: '45rem' }"
  >
    <ReviewForDashboard :show-reply="false" :data="selectedReview!" />
    <div class="mt-[20px] flex flex-col gap-2.5">
      <div>
        <label>Offense Category:</label>
        <Select
          v-model="selectedCategory"
          :options="disputeCategory"
          placeholder="Select Reason"
          optionLabel="name"
          optionValue="code"
          fluid
        />
        <div class="mt-2.5 text-[90%]" v-if="disputeSelectedCategory">
          {{ disputeSelectedCategory?.description }}
        </div>
      </div>
      <div>
        <label>Reason for flagging:</label>
        <Textarea v-model="selectedReason" :rows="4" fluid />
      </div>
      <div>
        <ImageUploader
          v-model="uploadedImages"
          path="disputes"
          :label="`Supporting Images ${!disputeSelectedCategory?.requiresEvidence ? '(optional)' : ''}`"
          :max="5"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2.5 w-full" v-if="selectedReview">
        <ButtonCustom
          :no-zoom="true"
          label="Cancel"
          size="lg"
          input-class="!w-max"
          @click="resetResponse"
        />
        <ButtonCustom
          :no-zoom="true"
          input-class="!w-max"
          label="Open Dispute"
          size="lg"
          icon="flag"
          primary="true"
          @click="openDisputeAsync(selectedReview)"
          :is-loading="isSendingDispute"
        />
      </div>
    </template>
  </Dialog>

  <div class="relative">
    <transition name="fade">
      <div
        v-if="isLoadingPage"
        class="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
      >
        <GeneralLoader />
      </div>
    </transition>

    <div class="flex flex-col gap-[20px]">
      <div class="flex justify-end gap-2.5">
        <Select
          v-model="selectedBranch"
          :options="businessBranches"
          placeholder="Select Branch"
          optionLabel="branchName"
          optionValue="id"
          v-if="businessBranches.length > 0"
        />
        <Select
          v-model="selectedTimeSpan"
          :options="timeSpan"
          optionLabel="name"
          placeholder="Select Range"
        />
      </div>

      <div class="grid gap-[20px] grid-cols-2 sm:grid-cols-4">
        <!-- statistics -->
        <div
          v-for="(i, idx) in statList"
          :key="idx"
          class="shadow-md rounded flex-1 p-6 flex flex-col justify-between bg-white border-b-4"
          :style="{ borderColor: i.color }"
        >
          <div class="flex justify-between items-center mb-4">
            <span class="text-[120%] font-semibold">{{ i.name }}</span>
            <i
              :class="`pi-${i.icon}`"
              class="pi !text-[120%]"
              :style="{ color: i.color }"
            ></i>
          </div>
          <div class="text-4xl font-bold text-center my-[10px]">
            {{ i.count }}
          </div>
          <p class="text-[80%] text-gray-400 hidden">{{ i.description }}</p>
        </div>
      </div>

      <Card>
        <template #content>
          <div class="text-[150%] mb-2.5 font-bold">Manage Reviews</div>
          <div class="flex justify-between items-center gap-2.5 mb-[20px]">
            <div class="flex sm:flex-row flex-col gap-2.5 w-full">
              <Select
                v-model="selectedRating"
                :options="ratings"
                optionLabel="name"
                placeholder="Select Rating Filter"
              />
              <Select
                v-model="selectedStatus"
                :options="statuses"
                optionLabel="name"
                placeholder="Select Status Filter"
              />
              <ButtonCustom
                icon="filter"
                size="lg"
                :label="isMobile ? 'Apply Filters' : null"
                :no-zoom="true"
                :input-class="isMobile ? '!w-full' : '!w-max !px-[5px]'"
                primary="true"
                :is-loading="isLoadingTable"
                @click="loadReviewsFromFilter"
              />
            </div>
          </div>
          <div v-if="reviews.length > 0">
            <DataTable :value="reviews" showGridlines stripedRows>
              <Column class="w-[5%]">
                <template #body>#</template>
              </Column>
              <Column header="Branch" v-if="!selectedBranch" class="w-[15%]">
                <template #body="slotProps">
                  <Skeleton v-if="isLoadingTable" fluid />
                  <span v-else>
                    {{ slotProps.data.locationName }}
                  </span>
                </template>
              </Column>
              <Column header="Review" :class="selectedBranch ? '' : 'w-[30%]'">
                <template #body="slotProps">
                  <Skeleton v-if="isLoadingTable" fluid />
                  <span v-else>
                    {{ slotProps.data.reviewBody }}
                  </span>
                </template>
              </Column>
              <Column header="Status" class="w-[15%]">
                <template #body="slotProps">
                  <Skeleton v-if="isLoadingTable" fluid />
                  <ReviewStatusPill :status="slotProps.data.status" v-else />
                </template>
              </Column>
              <Column header="Date Uploaded" class="w-[15%]">
                <template #body="slotProps">
                  <Skeleton v-if="isLoadingTable" fluid />
                  <span v-else>
                    {{ dateFormat(slotProps.data.uploadedDate) }}
                  </span>
                </template>
              </Column>
              <Column header="Rating" class="w-[10%]">
                <template #body="slotProps">
                  <Skeleton v-if="isLoadingTable" fluid />
                  <span v-else>
                    <Star :count="slotProps.data.starRating" :rounded="false" />
                  </span>
                </template>
              </Column>
              <Column header="..." class="w-[10%]">
                <template #body="slotProps">
                  <Skeleton v-if="isLoadingTable" fluid />
                  <div class="flex gap-2.5 items-center" v-else>
                    <i
                      class="pi pi-eye action-btn"
                      @click="selectReview('view', slotProps.data)"
                    ></i>
                    <i
                      class="pi pi-send action-btn"
                      @click="selectReview('edit', slotProps.data)"
                    ></i>
                    <i
                      class="pi pi-flag action-btn"
                      @click="showDispute(slotProps.data)"
                    ></i>
                  </div>
                </template>
              </Column>
            </DataTable>
            <Paginator
              class="mt-[20px]"
              :rows="limit"
              :totalRecords="total"
              :rowsPerPageOptions="[2, 10, 20, 30]"
              @page="onPageChange"
              :first="first"
            />
          </div>
          <div
            v-else
            class="min-h-[370px] flex flex-col justify-center items-center"
          >
            <i class="!text-[600%] pi pi-inbox"></i>
            <div v-if="emptyStateType === 'initial-empty'">No reviews yet.</div>

            <div v-if="emptyStateType === 'filtered-empty'">
              Your filter selection returned no results.
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageUploader from "~/components/Input/ImageUploader.vue";
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import useReviewMethods from "~/composables/review/useReviewMethods";
import type { BusinessSubscription, DisputeCategory } from "~/types/business";
import type { ReviewDashboard } from "~/types/review";

definePageMeta({ layout: "business" });

const {
  getBusinessBranches,
  getBusinessUser,
  getBusinessSubscriptionFromStore,
} = useBusinessMethods();
const {
  getDisputeCategories,
  postResponse,
  updateResponse,
  deleteResponse,
  getReviewManagement,
  sendDispute,
} = useReviewMethods();

interface Branch {
  id: string | null;
  businessId?: string;
  branchName: string;
  branchStreet?: string | null;
  branchCityTown?: string | null;
  branchState?: string | null;
}

interface SelectResponse {
  name: string;
  code: string;
}

// pagination setup - do not touch
const limit = ref(2);
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
//

const businessSubscription = ref<BusinessSubscription | null>(null);
const business = getBusinessUser();
const toast = useToast();

const editReplyText = ref("");

const isLoadingTable = ref(false);
const selectedBranch = ref();
const selectedStatus = ref<SelectResponse>();
const selectedRating = ref<SelectResponse>();

const stats = ref({
  totalReviews: {
    name: "Total Reviews",
    count: 0,
    color: "gold",
    icon: "star-fill",
    description: "Number of reviews between selected timeframe.",
  },
  awaitingReplies: {
    name: "Awaiting Replies",
    count: 0,
    color: "blue",
    icon: "comment",
    description: "New reviews requiring attention.",
  },
  totalLiked: {
    name: "Total Liked",
    count: 0,
    color: "green",
    icon: "thumbs-up",
    description: "Total replies appreciated by users.",
  },
  totalFlagged: {
    name: "Total Flagged",
    count: 0,
    color: "red",
    icon: "flag",
    description: "Reviews under moderation for policy violation.",
  },
});
const statList = computed(() => Object.values(stats.value));

const selectedTimeSpan = ref({ name: "All Time", code: "all_time" });
const timeSpan = ref([
  { name: "Last 7 days", code: "7_days" },
  { name: "Last 14 days", code: "14_days" },
  { name: "Last Month", code: "30_days" },
  { name: "All Time", code: "all_time" },
  { name: "Custom", code: "custom" },
]);

const ratings = [
  { name: "Rating: 1 Star", code: 1 },
  { name: "Rating: 2 Stars", code: 2 },
  { name: "Rating: 3 Stars", code: 3 },
  { name: "Rating: 4 Stars", code: 4 },
  { name: "Rating: 5 Stars", code: 5 },
  { name: "All Ratings", code: null },
];

const statuses = [
  { name: "Status: Approved", code: "approved" },
  // { name: "Pending", code: "pending" },
  { name: "Status: Flagged", code: "flagged" },
  // { name: "Rejected", code: "rejected" },
  { name: "All Status", code: null },
];

const showDateSelector = ref(false);
const customStartDate = ref();
const customStopDate = ref();

const businessBranches = ref<Branch[]>([]);
const disputeCategory = ref<DisputeCategory[]>([]);

const selectedReview = ref<ReviewDashboard>();
const reviews = ref<ReviewDashboard[]>([]);
const viewReview = ref(false);
const editReview = ref(false);
const isEdit = ref(false);

const handleCustomDate = async (start: Date | null, stop: Date | null) => {
  if (start === null || stop === null) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Select start and end dates.",
      life: 3000,
    });
  }

  showDateSelector.value = false;
  await loadReviews(true);
};

const selectReview = (type: string, data: ReviewDashboard) => {
  selectedReview.value = data;
  editReplyText.value = selectedReview.value.replyBody ?? "";
  if (type === "view") {
    return (viewReview.value = true);
  }

  if (data.replyBody && data.replyBody.length > 0) {
    isEdit.value = true;
  } else {
    isEdit.value = false;
  }

  editReview.value = true;
};

const loadReviewsFromFilter = async () => {
  if (reviews.value.length <= 0) {
    return;
  }

  await loadReviews(false);
};

const isDeletingResponse = ref(false);
const deleteResponseAsync = async (data: ReviewDashboard) => {
  try {
    isDeletingResponse.value = true;
    const res = await deleteResponse({
      reviewId: data.id,
      responderId: business.userId,
    });

    if (res?.statusCode === 200) {
      toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Response deleted successfully.",
        life: 3000,
      });
      return resetResponse();
    }
  } catch (error) {
    console.log(error);
  } finally {
    isDeletingResponse.value = false;
  }
};

const isUpdatingResponse = ref(false);
const postResponseAsync = async (data: ReviewDashboard) => {
  //update reviewbody
  data.replyBody = editReplyText.value;

  if (!data.replyBody || data.replyBody.length <= 0) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Review response required.",
      life: 3000,
    });
  }
  try {
    isUpdatingResponse.value = true;
    const res = await postResponse({
      reviewId: data.id,
      responderId: business.userId,
      replyBody: data.replyBody,
      businessId: business.id,
    });

    if (res?.statusCode === 200) {
      toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Response uploaded successfully.",
        life: 3000,
      });
      return resetResponse();
    }
  } catch (error) {
    console.log(error);
  } finally {
    isUpdatingResponse.value = false;
  }
};

const updateResponseAsync = async (data: ReviewDashboard) => {
  //update reviewbody
  data.replyBody = editReplyText.value;

  if (!data.replyBody || data.replyBody.length <= 0) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Review response required.",
      life: 3000,
    });
  }

  try {
    isUpdatingResponse.value = true;
    const res = await updateResponse({
      reviewId: data.id,
      responderId: business.userId,
      replyBody: data.replyBody,
    });

    if (res?.statusCode === 200) {
      toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Response updated successfully.",
        life: 3000,
      });
      return resetResponse();
    }
  } catch (error) {
    console.log(error);
  } finally {
    isUpdatingResponse.value = false;
  }
};

const resetResponse = async () => {
  editReview.value = false;
  openDispute.value = false;
  selectedReview.value = undefined;
  isEdit.value = false;
};

const getBusinessBranchesAsync = async () => {
  if (businessBranches.value?.length > 0) {
    return;
  }

  try {
    const res = await getBusinessBranches("id");
    if (res.statusCode === 200) {
      businessBranches.value = res.data;
      if (businessBranches.value.length > 0) {
        businessBranches.value.push({
          id: null,
          businessId: "id",
          branchName: "All Branches",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getDisputeCategoriesAsync = async () => {
  if (disputeCategory.value?.length > 0) {
    return;
  }

  try {
    const res = await getDisputeCategories();
    if (res?.statusCode === 200) {
      disputeCategory.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
};

const hasLoaded = ref(false);
const hasEverHadData = ref(false);

const isLoadingPage = ref(false);
const loadReviews = async (reloadPage: boolean) => {
  const _branch = selectedBranch.value ? selectedBranch.value : null;
  const _startDate = customStartDate.value
    ? new Date(customStartDate.value)
    : null;
  const _endDate = customStopDate.value ? new Date(customStopDate.value) : null;
  const _page = currentPage.value ?? 1;
  const _pageSize = limit.value ?? 10;
  const _status = selectedStatus.value ? selectedStatus.value.code : null;
  const _rating = selectedRating.value ? selectedRating.value.code : null;
  // const payload = {
  //   branch: _branch,
  //   start: _startDate,
  //   end: _endDate,
  //   page: _page,
  //   size: _pageSize,
  //   status: _status,
  //   rating: _rating,
  // };

  // console.log(payload);

  hasLoaded.value = false;

  try {
    reloadPage ? (isLoadingPage.value = true) : (isLoadingTable.value = true);
    const res = await getReviewManagement(
      business.id,
      {
        branch: _branch,
        startDate: _startDate,
        endDate: _endDate,
        status: _status,
        rating: _rating,
      },
      _page,
      _pageSize,
      true,
    );
    if (res.ok) {
      reviews.value = res.data.reviews;

      if (res.data.reviews.length > 0) {
        hasEverHadData.value = true;
      }

      total.value = res.data.statistics.totalReviewCount;

      // set statistics
      stats.value.totalReviews.count = res.data.statistics.totalReviewCount;
      stats.value.totalFlagged.count = res.data.statistics.flaggedCount;
    }
  } catch (error) {
    console.log(error);
  } finally {
    hasLoaded.value = true;
    reloadPage ? (isLoadingPage.value = false) : (isLoadingTable.value = false);
  }
};

const emptyStateType = computed(() => {
  if (!hasLoaded.value) return "loading";
  if (reviews.value.length > 0) return "data";
  if (!hasEverHadData.value) return "initial-empty";
  return "filtered-empty";
});

const openDispute = ref(false);
const showDispute = (data: ReviewDashboard) => {
  selectedReview.value = data;
  openDispute.value = true;
};

const isSendingDispute = ref(false);

const selectedCategory = ref();
const selectedReason = ref();
const uploadedImages = ref([]);
const openDisputeAsync = async (data: ReviewDashboard) => {
  const payload = {
    reviewId: data.id,
    businessId: business.id,
    categoryCode: selectedCategory.value,
    filedByUserId: business.userId,
    explanation: selectedReason.value,
    evidenceUrls: uploadedImages.value,
    businessPlan: businessSubscription.value?.id,
  };

  try {
    isSendingDispute.value = true;
    const res = await sendDispute(payload);
    if (res?.statusCode === 200) {
      return toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Dispute submitted successfully.",
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isSendingDispute.value = false;
  }
};

const isMobile = ref(false);

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768; // adjust breakpoint
};

onUnmounted(() => {
  window.removeEventListener("resize", checkIsMobile);
});

onBeforeMount(async () => {
  await Promise.all([
    getBusinessBranchesAsync(),
    getDisputeCategoriesAsync(),
    loadReviews(true),
  ]);
});

onMounted(async () => {
  businessSubscription.value = await getBusinessSubscriptionFromStore();
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
});

// utils
type DateRange = {
  startDate: string | null;
  endDate: string | null;
};

function getDate(code: string): DateRange {
  const today = new Date();
  const endDate = today.toISOString();

  const getPastDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  switch (code) {
    case "7_days":
      return {
        startDate: getPastDate(7),
        endDate,
      };

    case "14_days":
      return {
        startDate: getPastDate(14),
        endDate,
      };

    case "30_days":
      return {
        startDate: getPastDate(30),
        endDate,
      };

    case "all_time":
      return {
        startDate: null,
        endDate: null,
      };

    default:
      return {
        startDate: null,
        endDate: null,
      };
  }
}

function findByCode(
  data: DisputeCategory[],
  code: string,
): DisputeCategory | undefined {
  return data.find((item) => item.code === code);
}

const disputeSelectedCategory = ref<DisputeCategory>();
watch(selectedCategory, async (newValue) => {
  if (!newValue) return;
  disputeSelectedCategory.value = findByCode(disputeCategory.value, newValue);
});

watch(selectedTimeSpan, async (newValue) => {
  if (newValue.code === "custom") {
    businessSubscription.value = await getBusinessSubscriptionFromStore();
    if (!businessSubscription.value) return;

    if (businessSubscription.value.tier <= 0) {
      return toast.add({
        severity: "info",
        summary: "INFO",
        detail: "Business account plan does not support this action.",
        life: 5000,
      });
    }
    showDateSelector.value = true;
    return;
  }

  const dateData = getDate(newValue.code);
  customStartDate.value = dateData.startDate;
  customStopDate.value = dateData.endDate;

  await loadReviews(true);
});

watch(selectedBranch, async (newValue) => {
  await loadReviews(true);
});

watch(editReview, (newValue) => {
  if (newValue === false) {
    resetResponse();
  }
});
</script>

<style scoped>
.action-btn {
  cursor: pointer;
  padding: 5px;
  border-radius: 100%;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
}
label {
  font-weight: 400;
  color: gray;
  font-size: 90%;
  margin-bottom: 5px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
