<template>
  <Toast />
  <Dialog
    v-model:visible="openBranchEditor"
    :draggable="false"
    modal
    :header="`${openType === 'new' ? 'Register' : 'Update'} Business Branch`"
    :style="{ width: '45rem' }"
  >
    <form @submit.prevent="saveBranch(openType)" class="flex flex-col gap-2.5">
      <div>
        <label for="email">Branch Name</label>
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
          <label for="email">Branch Street</label>
          <InputText
            fluid
            class="flex-auto"
            required
            autocomplete="off"
            v-model="branch.branchStreet"
          />
        </div>
        <div>
          <label for="email">Branch City / Town</label>
          <InputText
            fluid
            class="flex-auto"
            required
            autocomplete="off"
            v-model="branch.branchCityTown"
          />
        </div>
        <div>
          <label for="email">Branch State</label>
          <InputText
            fluid
            class="flex-auto"
            required
            autocomplete="off"
            v-model="branch.branchState"
          />
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-[20px]">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="resetAddBranch"
        ></Button>
        <Button type="submit" label="Save Branch"></Button>
      </div>
    </form>
  </Dialog>

  <Card class="w-full">
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
      <div class="flex justify-end" v-if="filteredBranches.length">
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
                    @click="deleteBranchAsync(branch.id!)"
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
import { onBeforeMount } from "vue";
import useBusinessMethods from "~/composables/business/useBusinessMethods";
const {
  createBranch,
  updateBranch,
  deleteBranch,
  getBusinessBranches,
  getBusinessUser,
} = useBusinessMethods();
const isLoading = ref(true);
const businessId = getBusinessUser();
const toast = useToast();

interface BusinessBranch {
  businessId: string;
  id?: string;
  branchName?: string;
  branchStreet?: string;
  branchCityTown?: string;
  branchState?: string;
  name?: string;
}
const businessBranches = ref<BusinessBranch[]>([]);
const search = ref("");

const rows = ref(5); // items per page
const first = ref(0); // index of first item

const openBranchEditor = ref(false);
const openType = ref("new");
const isSubmitting = ref(false);

// const businessBranches: BusinessBranch[] = [
//   {
//     businessId: "B001",
//     id: "test",
//     name: "Central Market",
//     branchStreet: "123 Main St",
//     branchCityTown: "Springfield",
//     branchState: "CA",
//   },
//   {
//     businessId: "B002",
//     id: "test-1",
//     name: "Northside Grocery",
//     branchStreet: "45 North Ave",
//     branchCityTown: "Springfield",
//     branchState: "CA",
//   },
//   {
//     businessId: "B003",
//     id: "test-2",
//     name: "Downtown Cafe",
//     branchStreet: "78 Elm St",
//     branchCityTown: "Riverside",
//     branchState: "NV",
//   },
//   {
//     businessId: "B004",
//     id: "test-3",
//     name: "Lakeside Bistro",
//     branchStreet: "9 Lake Rd",
//     branchCityTown: "Madison",
//     branchState: "WI",
//   },
//   {
//     businessId: "B005",
//     id: "test-4",
//     name: "Sunrise Bakery",
//     branchStreet: "56 Sunrise Blvd",
//     branchCityTown: "Orlando",
//     branchState: "FL",
//   },
//   {
//     businessId: "B006",
//     id: "test-5",
//     name: "Green Valley Produce",
//     branchStreet: "102 Farm Way",
//     branchCityTown: "Fresno",
//     branchState: "CA",
//   },
//   {
//     businessId: "B007",
//     id: "test-6",
//     name: "City Tech Hub",
//     branchStreet: "300 Innovation Dr",
//     branchCityTown: "Austin",
//     branchState: "TX",
//   },
//   {
//     businessId: "B008",
//     id: "test-7",
//     name: "Harbor Seafood",
//     branchStreet: "88 Dock St",
//     branchCityTown: "Portland",
//     branchState: "ME",
//   },
//   {
//     businessId: "B009",
//     id: "test-8",
//     name: "Mountain Outfitters",
//     branchStreet: "12 Summit Rd",
//     branchCityTown: "Boulder",
//     branchState: "CO",
//   },
//   {
//     businessId: "B010",
//     id: "test-9",
//     name: "Urban Fitness",
//     branchStreet: "410 Pulse Ave",
//     branchCityTown: "Seattle",
//     branchState: "WA",
//   },
// ];

const filteredBranches = computed(() => {
  //   return businessBranches.value.filter((branch: BusinessBranch) =>
  //     // @ts-ignore
  //     branch.branchName.toLowerCase().includes(search.value.toLowerCase())
  //   );

  return businessBranches.value;
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
        severity: "info",
        summary: "INFO",
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

const deleteBranchAsync = async (id: string) => {
  if (!id) return;

  try {
    const res = await deleteBranch(id);
    if (res?.statusCode === 200) {
      await loadBranches();
    }
  } catch (error) {
    console.log(error);
  }
};

const showEditor = (type: string, data: BusinessBranch | null) => {
  if (type === "new") {
    resetBranch();
    openType.value = "new";
  } else {
    openType.value = "edit";
    branch.value.branchName = data?.name!;
    branch.value.branchStreet = data?.branchStreet!;
    branch.value.branchCityTown = data?.branchCityTown!;
    branch.value.branchState = data?.branchState!;
    branch.value.id = data?.id!;
  }

  openBranchEditor.value = true;
};

onBeforeMount(async () => {
  await loadBranches();
});
</script>
