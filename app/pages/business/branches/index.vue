<template>
  <Toast />
  <Dialog
    v-model:visible="openBranchEditor"
    :draggable="false"
    modal
    :header="`${openType === 'new' ? 'Register' : 'Update'} Business Branch`"
    :style="{ width: '45rem' }"
    position="top"
  >
    <form @submit.prevent="saveBranch(openType)" class="flex flex-col gap-2.5">
      <div>
        <label for="branchName">Branch Name</label>
        <InputText
          fluid
          class="flex-auto"
          required
          autocomplete="off"
          v-model="branch.branchName"
        />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
        <div>
          <label for="branchStreet">Branch Street</label>
          <InputText
            fluid
            class="flex-auto"
            required
            autocomplete="off"
            v-model="branch.branchStreet"
          />
        </div>

        <div>
          <label>Branch State</label>
          <select 
            v-model="branch.branchState" 
            required
            class="w-full border rounded-md px-3 py-2 text-sm outline-none h-[42px] border-gray-300 focus:border-[#008253]"
          >
            <option value="">Select State *</option>
            <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div>
          <label>Branch City / Town</label>
          <select 
            v-model="branch.branchCityTown" 
            :disabled="!branch.branchState"
            required
            class="w-full border rounded-md px-3 py-2 text-sm outline-none h-[42px] border-gray-300 focus:border-[#008253] disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select City *</option>
            <option v-for="c in availableCities" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-[20px]">
        <ButtonCustom
          label="Cancel"
          size="lg"
          @clicked="resetAddBranch"
          input-class="w-max"
          type="button"
        />
        <ButtonCustom
          primary="true"
          size="lg"
          :label="isSubmitting ? 'Saving...' : 'Saving Branch'"
          :icon="isSubmitting ? 'spinner pi-spin' : null"
          input-class="w-max"
          type="submit"
        />
      </div>
    </form>
  </Dialog>

  <Dialog
    v-model:visible="openDeleteBranch"
    :draggable="false"
    modal
    header="Confirm Delete"
    :style="{ width: '45rem' }"
    position="top"
  >
    <div v-if="deleteBranchId">
      Are you sure you want to delete this branch?
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-2.5">
        <ButtonCustom
          label="Cancel"
          size="lg"
          @clicked="openDeleteBranch = false"
          input-class="w-max"
        />
        <ButtonCustom
          primary="true"
          size="lg"
          :label="isDeleting ? 'Deleting' : 'Delete Branch'"
          :icon="isDeleting ? 'spinner pi-spin' : 'trash'"
          input-class="w-max"
          @clicked="deleteBranchAsync(deleteBranchId)"
        />
      </div>
    </template>
  </Dialog>

  <Card class="w-full min-h-[500px]">
    <template #content>
      <div class="flex justify-between items-center gap-2.5">
        <div class="text-[120%]">
          Manage Business Branches ({{ businessBranches?.length ?? 0 }} / ∞)
        </div>
        <ButtonCustom
          primary="true"
          size="lg"
          label="Add Branch"
          icon="plus"
          input-class="w-max"
          @clicked="showEditor('new', null)"
        />
      </div>
      <div class="flex justify-end">
        <div class="w-full sm:w-[40%] mt-2.5">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-search"></i>
            </InputGroupAddon>
            <InputText v-model="search" placeholder="Sort Branches" fluid />
          </InputGroup>
        </div>
      </div>
      <div class="mt-[40px]">
        <GeneralLoader v-if="isLoading" height="500px" />
        <div v-else>
          <div v-if="filteredBranches.length" class="flex flex-col gap-5">
            <div
              v-for="(branch, idx) in paginatedBranches"
              :key="idx"
              class="branch-card"
            >
              <div class="flex items-center gap-2.5 justify-end">
                <div class="flex-1 font-bold text-[110%]">
                  {{ branch.branchName }}
                </div>
                <div class="flex gap-2.5">
                  <i
                    class="pi pi-pen-to-square text-primary cursor-pointer"
                    @click="showEditor('edit', branch)"
                  ></i>
                  <i
                    class="pi pi-trash text-[red] cursor-pointer"
                    @click="setDeleteBranch(branch.id!)"
                  ></i>
                </div>
              </div>
              <div class="flex gap-1 items-center mt-1">
                <i class="pi pi-map-marker mt-[1px]"></i>
                <div class="text-[90%]">
                  {{ branch.branchStreet }} {{ branch.branchCityTown }},
                  {{ branch.branchState }}
                </div>
              </div>

              <Divider />
            </div>

            <Paginator
              :rows="rows"
              :first="first"
              :totalRecords="filteredBranches.length"
              :rowsPerPageOptions="[5, 10, 20]"
              @page="onPageChange"
              class="mt-6"
            />
          </div>

          <div v-else class="min-h-[500px] flex justify-center items-center">
            <p>No business branch registered yet.</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
definePageMeta({ layout: "business" });
import { onBeforeMount, ref, computed, watch } from "vue";
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import useNigerianLocations from "~/composables/useNigerianLocations";

const {
  createBranch,
  updateBranch,
  deleteBranch,
  getBusinessBranches,
  getBusinessUser,
} = useBusinessMethods();

// Location logic
const { getStates, getCitiesByState } = useNigerianLocations();
const states = getStates();

const isLoading = ref(true);
const businessId = getBusinessUser();
const toast = useToast();
const openDeleteBranch = ref(false);
const deleteBranchId = ref();

interface BusinessBranch {
  businessId: string;
  id?: string;
  branchName?: string;
  branchStreet?: string;
  branchCityTown?: string;
  branchState?: string;
}

const businessBranches = ref<BusinessBranch[]>([]);
const search = ref("");
const isDeleting = ref(false);

const rows = ref(5);
const first = ref(0);

const openBranchEditor = ref(false);
const openType = ref("new");
const isSubmitting = ref(false);

const filteredBranches = computed(() => {
  return businessBranches.value.filter((branch: BusinessBranch) =>
    branch.branchName?.toLowerCase().includes(search.value.toLowerCase()),
  );
});

const paginatedBranches = computed(() => {
  return filteredBranches.value.slice(first.value, first.value + rows.value);
});

const branch = ref({
  businessId: businessId.id,
  id: "null",
  branchName: "",
  branchStreet: "",
  branchCityTown: "",
  branchState: "",
});

// Cities filtered by the state selected in the form
const availableCities = computed(() => {
  return branch.value.branchState ? getCitiesByState(branch.value.branchState) : [];
});

// Reset city when state changes
watch(() => branch.value.branchState, (newState, oldState) => {
  if (oldState && newState !== oldState) {
    branch.value.branchCityTown = "";
  }
});

const resetBranch = () => {
  branch.value = {
    businessId: businessId.id,
    id: "null",
    branchName: "",
    branchStreet: "",
    branchCityTown: "",
    branchState: "",
  };
};

const onPageChange = (event: any) => {
  first.value = event.first;
  rows.value = event.rows;
};

watch(search, () => {
  first.value = 0;
});

const resetAddBranch = () => {
  openBranchEditor.value = false;
  resetBranch();
};

const validate = (data: any, field: string) => {
  if (!data)
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: `${field} is required!`,
      life: 3000,
    });
};

const loadBranches = async () => {
  if (!businessId.id) return;
  try {
    const res = await getBusinessBranches(businessId.id);
    if (res && res.statusCode === 200) {
      businessBranches.value = res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const saveBranch = async (type: string) => {
  validate(branch.value.branchName, "Branch name");
  validate(branch.value.branchStreet, "Branch street");
  validate(branch.value.branchCityTown, "Branch city / town");
  validate(branch.value.branchState, "Branch state");

  if (type !== "new") {
    if (!branch.value.id) return;
  }

  try {
    isSubmitting.value = true;
    const action = type === "new" ? createBranch : updateBranch;

    const res = await action(branch.value);
    if (res?.statusCode === 200) {
      openBranchEditor.value = false;
      await loadBranches();
      return toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: `Business branch ${
          type === "new" ? "registered" : "updated"
        } successfully.`,
        life: 3000,
      });
    }

    throw new Error("error");
  } catch (error) {
    console.log(error);
  } finally {
    isSubmitting.value = false;
  }
};

const setDeleteBranch = (id: string) => {
  if (!id) return;
  deleteBranchId.value = id;
  openDeleteBranch.value = true;
};

const deleteBranchAsync = async (id: string) => {
  if (!id) return;

  try {
    isDeleting.value = true;
    const res = await deleteBranch(id);
    if (res?.statusCode === 200) {
      await loadBranches();
      openDeleteBranch.value = false;
      return toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Branch Deleted Successfully.",
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isDeleting.value = false;
  }
};

const showEditor = (type: string, data: BusinessBranch | null) => {
  if (type === "new") {
    resetBranch();
    openType.value = "new";
  } else {
    openType.value = "edit";
    branch.value.branchName = data?.branchName!;
    branch.value.branchStreet = data?.branchStreet!;
    branch.value.branchState = data?.branchState!; // Set state first
    branch.value.branchCityTown = data?.branchCityTown!; // Then set city
    branch.value.id = data?.id!;
  }

  openBranchEditor.value = true;
};

onBeforeMount(async () => {
  await loadBranches();
});
</script>