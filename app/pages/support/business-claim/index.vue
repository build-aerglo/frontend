<template>
  <BusinessClaim
    v-if="showModal && singleClaim"
    :data="singleClaim"
    @close="showModal = false"
    @updated="reloadData"
  />
  <div v-else>
    <GeneralLoader v-if="isLoadingPage" />
    <div class="min-h-screen bg-gray-50 p-6" v-else>
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <div class="text-2xl font-bold text-gray-900">Claim Management</div>
          <p class="text-gray-600">
            Review and manage business ownership claims
          </p>
        </div>

        <!-- stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-[20px] mb-[20px]">
          <Card v-for="(i, idx) in stats" :key="idx">
            <template #content>
              <div class="text-center">{{ i.title }}</div>
              <div class="text-center text-bold text-[200%] mt-[10px]">
                {{ i.count }}
              </div>
            </template>
          </Card>
        </div>

        <!-- Filters -->
        <div class="rounded-lg mb-[20px]">
          <div class="flex justify-end gap-[20px]">
            <div>
              <Select
                v-model="filters.status"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="All Status"
                class="w-full"
              />
            </div>

            <div>
              <Select
                v-model="filters.dateSort"
                :options="dateSortOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select order"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <div v-if="businessClaims.length > 0">
          <DataTable :value="businessClaims" showGridlines stripedRows>
            <Column class="w-[5%]">
              <template #body>#</template>
            </Column>
            <Column header="Business Name" class="w-[30%]">
              <template #body="slotProps">
                <Skeleton v-if="isLoadingTable" fluid />
                <span v-else>
                  {{ slotProps.data.businessName }}
                </span>
              </template>
            </Column>
            <Column header="Claimant" class="w-[20%]">
              <template #body="slotProps">
                <Skeleton v-if="isLoadingTable" fluid />
                <span v-else>
                  {{ slotProps.data.fullName }} ({{ slotProps.data.role }})
                </span>
              </template>
            </Column>
            <Column header="Date Submitted" class="w-[15%]">
              <template #body="slotProps">
                <Skeleton v-if="isLoadingTable" fluid />
                <span v-else>
                  {{ dateFormat(slotProps.data.createdAt, true) }}
                </span>
              </template>
            </Column>
            <Column header="Status" class="w-[10%]">
              <template #body="slotProps">
                <Skeleton v-if="isLoadingTable" fluid />
                <span v-else>
                  <span
                    :class="getStatusClass(slotProps.data.status)"
                    class="px-3 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ slotProps.data.statusName }}
                  </span>
                </span>
              </template>
            </Column>
            <Column header="..." class="w-[5%]">
              <template #body="slotProps">
                <Skeleton v-if="isLoadingTable" fluid />
                <div class="flex gap-[10px] items-center" v-else>
                  <div
                    @click="selectClaim(slotProps.data)"
                    class="w-10 h-10 flex justify-center items-center cursor-pointer hover:bg-[#ecfdf5] rounded-full"
                  >
                    <i class="pi pi-eye ..action-btn text-[green]"></i>
                  </div>
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
        <GeneralEmpty v-else description="Empty!" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import useSupportMethods from "~/composables/support/useSupportMethods";
import type { BusinessClaimResponse } from "~/types/business";
const { getBusinessClaims } = useSupportMethods();
const { getBusinessClaim } = useBusinessMethods();
const route = useRoute();

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
  await loadClaims(false);
};
//

// stats
const stats = ref([
  { title: "Total Completed", count: 0 },
  { title: "Total Under Review", count: 0 },
  { title: "Total Rejected", count: 0 },
  { title: "Total Cancelled", count: 0 },
]);

// Filters
const filters = ref<{ status: number | null; dateSort: string }>({
  status: 0,
  dateSort: "latest_first",
});

const statusOptions = [
  { label: "All Status", value: null },
  { label: "Pending", value: 0 },
  { label: "Under Review", value: 1 },
  { label: "Cancelled", value: 5 },
  { label: "Rejected", value: 4 },
  { label: "Completed", value: 6 },
  { label: "Approved", value: 7 },
  { label: "Appealed", value: 8 },
];

const dateSortOptions = [
  { label: "Latest First", value: "latest_first" },
  { label: "Oldest First", value: "oldest_first" },
];

const isLoadingTable = ref(false);
const isLoadingPage = ref(true);

const loadClaims = async (reloadPage: boolean) => {
  const _status = filters.value.status ? filters.value.status : undefined;
  const _date_filter = filters.value.dateSort;
  const _page = currentPage.value ?? 1;
  const _pageSize = limit.value ?? 10;

  try {
    reloadPage ? (isLoadingPage.value = true) : (isLoadingTable.value = true);
    const res = await getBusinessClaims(
      _status,
      _date_filter,
      _page,
      _pageSize,
    );
    if (res.ok) {
      console.log(res);
      businessClaims.value = res.data.claims;

      total.value = res.data.total;

      // set statistics
      stats.value[0]!.count = res.data.statistics.totalCompleted;
      stats.value[1]!.count = res.data.statistics.totalUnderReview;
      stats.value[2]!.count = res.data.statistics.totalRejected;
      stats.value[3]!.count = res.data.statistics.totalCancelled;
    }
  } catch (error) {
    console.log(error);
  } finally {
    reloadPage ? (isLoadingPage.value = false) : (isLoadingTable.value = false);
  }
};

definePageMeta({ layout: "support" });

const showModal = ref(false);
const businessClaims = ref<BusinessClaimResponse[]>([]);
const singleClaim = ref<BusinessClaimResponse>();

const selectClaim = (data: BusinessClaimResponse) => {
  if (!data) return;
  singleClaim.value = data;
  showModal.value = true;
};

const getStatusClass = (status: number) => {
  const classes = {
    1: "bg-gray-100 text-gray-800",
    0: "bg-yellow-100 text-yellow-800",
    8: "bg-blue-100 text-blue-800",
    7: "bg-green-100 text-green-800",
    5: "bg-red-100 text-red-800",
    4: "bg-purple-100 text-purple-800",
    6: "bg-indigo-100 text-indigo-800",
  };
  return classes[status as keyof typeof classes];
};

onBeforeMount(async () => {
  if (route.query.id) {
    const res = await getBusinessClaim(route.query.id as string);
    if (res?.statusCode === 200) {
      singleClaim.value = res?.data;
      showModal.value = true;
    }
  }

  await Promise.all([loadClaims(true)]);
});

const reloadData = async () => {
  showModal.value = false;
  await loadClaims(false);
};
</script>
