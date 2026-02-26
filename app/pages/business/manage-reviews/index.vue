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
        />
      </div>
      <div>
        <label>End Date:</label>
        <DatePicker
          v-model="customStopDate"
          showIcon
          fluid
          iconDisplay="input"
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
        />
        <ButtonCustom
          label="Apply Range"
          input-class="!w-max"
          primary="true"
          size="lg"
          :no-zoom="true"
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
    <Editor v-model="editReplyText" editorStyle="height: 150px">
      <template v-slot:toolbar>
        <span class="ql-formats"> </span>
      </template>
    </Editor>
    <template #footer>
      <div class="flex justify-end" v-if="selectedReview">
        <div>
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
            @click="resetResponse"
          />
          <ButtonCustom
            :no-zoom="true"
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
          optionLabel="name"
          optionValue="id"
          @update:model-value="async () => loadReviews(true)"
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
          <div v-if="reviews.length > 0">
            <div class="flex justify-between items-center gap-2.5 mb-[20px]">
              <div class="flex gap-2.5">
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
                  :no-zoom="true"
                  input-class="!w-max !px-[5px]"
                  primary="true"
                  :is-loading="isLoadingTable"
                  @click="async () => loadReviews(false)"
                />
              </div>
              <div class="flex justify-between items-center gap-2.5">
                <ButtonCustom
                  label="Export Selection"
                  icon="download"
                  size="lg"
                  :no-zoom="true"
                  input-class="!w-max"
                  primary="true"
                />
                <!-- <ButtonCustom
                  icon="filter-slash"
                  size="lg"
                  :no-zoom="true"
                  input-class="!w-max !px-[5px] !border-primary"
                  @click="clearFilters()"
                /> -->
              </div>
            </div>

            <DataTable
              :value="reviews"
              :loading="isLoadingTable"
              showGridlines
              stripedRows
            >
              <Column class="w-[5%]">
                <template #body>#</template>
              </Column>
              <Column header="Branch" v-if="selectedBranch" class="w-[15%]">
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
                  <ReviewStatusPill :data="slotProps.data.status" v-else />
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
              <Column header="..." class="w-[20%]">
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
                    <i class="pi pi-flag action-btn"></i>
                  </div>
                </template>
              </Column>
            </DataTable>
            <Paginator
              class="mt-[20px]"
              :rows="limit"
              :totalRecords="total"
              :rowsPerPageOptions="[10, 20, 30]"
              @page="onPageChange"
              :first="first"
            />
          </div>
          <div
            v-else
            class="min-h-[370px] flex flex-col justify-center items-center"
          >
            <i class="!text-[600%] pi pi-inbox"></i>
            <div>Empty.</div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
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
} = useReviewMethods();

interface Branch {
  id: string | null;
  businessId?: string;
  name: string;
  branchStreet?: string | null;
  branchCityTown?: string | null;
  branchState?: string | null;
}

interface SelectResponse {
  name: string;
  code: string;
}

// pagination setup - do not touch
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
//

const businessSubscription = ref<BusinessSubscription | null>(null);
const business = getBusinessUser();
const toast = useToast();

const editReplyText = ref();

const isLoadingTable = ref(false);
const selectedBranch = ref<Branch>();
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

  if (!data.replyBody || data.replyBody.length >= 0) {
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

  if (!data.replyBody || data.replyBody.length >= 0) {
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
          name: "All Branches",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getDisputeCategoriesAsync = async () => {
  if (businessBranches.value?.length > 0) {
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

const isLoadingPage = ref(false);
const loadReviews = async (reloadPage: boolean) => {
  const _branch = selectedBranch.value ? selectedBranch.value.id : null;
  const _startDate = customStartDate.value
    ? new Date(customStartDate.value)
    : null;
  const _endDate = customStopDate.value ? new Date(customStopDate.value) : null;
  const _page = currentPage.value ?? 1;
  const _pageSize = limit.value ?? 10;
  const _status = selectedStatus.value ? selectedStatus.value.code : null;
  const _rating = selectedRating.value ? selectedRating.value.code : null;

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
    );
    if (res.ok) {
      reviews.value = res.data.reviews;

      // set statistics
      stats.value.totalReviews.count = res.data.statistics.totalReviewCount;
      stats.value.totalFlagged.count = res.data.statistics.flaggedCount;
    }
  } catch (error) {
    console.log(error);
  } finally {
    reloadPage ? (isLoadingPage.value = true) : (isLoadingTable.value = true);
  }
};

onBeforeMount(async () => {
  await Promise.all([
    getBusinessBranchesAsync(),
    getDisputeCategoriesAsync(),
    loadReviews(true),
  ]);
});

onMounted(async () => {
  businessSubscription.value = await getBusinessSubscriptionFromStore();
  // if (!businessSubscription.value) {
  // }
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

watch(selectedTimeSpan, async (newValue) => {
  if (!newValue) return;
  if (newValue.code === "custom") {
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
}
label {
  font-weight: 400;
  color: gray;
  font-size: 90%;
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
