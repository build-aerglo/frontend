<template>
  <GeneralLoader v-if="isLoading" />
  <div v-else>
    <div
      v-if="isClaimed"
      class="flex justify-center items-center min-h-[500px] flex-col"
    >
      CLOSED!
    </div>
    <div
      v-else
      class="min-h-screen ..flex ..justify-center ..items-center ..p-[20px]"
    >
      <Card class="p-5">
        <template #content>
          <div class="sm:text-[160%] mb-5 font-bold">
            Appeal Claim For "{{ businessClaim?.businessName }}"
          </div>
          <div class="mb-5 w-full sm:max-w-[1000px]">
            Fix pending rejection issues and re-open business claim request.
          </div>
          <div class="bg-[#F4FDF6] mb-5 p-5 rounded-[10px] shadow-md">
            <div>Claim Status: {{ businessClaim?.statusName }}</div>
            <div>
              Claim Rejected: {{ businessClaim?.requiresReverification }}
            </div>
            <div>
              Rejection Reason:
              {{ businessClaim?.reverificationReason ?? "None" }}
            </div>
          </div>
          <form
            @submit.prevent="claimBusiness(claimData)"
            class=".flex .flex-col .gap-5 mt-5 .border .rounded-md .p-10 .bg-white"
          >
            <div class="header font-bold">Personal Information:</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label>Fullname:</label>
                <InputText
                  fluid
                  class="flex-auto"
                  autocomplete="off"
                  v-model="claimData.fullName"
                  required
                />
              </div>
              <div>
                <label>Email Address:</label>
                <InputText
                  type="email"
                  required
                  fluid
                  class="flex-auto"
                  autocomplete="off"
                  v-model="claimData.email"
                />
              </div>
              <div>
                <label>Phone Number:</label>
                <InputText
                  fluid
                  class="flex-auto"
                  autocomplete="off"
                  v-model="claimData.phoneNumber"
                />
              </div>
              <div>
                <label>Role:</label>
                <InputText
                  fluid
                  class="flex-auto"
                  autocomplete="off"
                  v-model="claimData.role"
                  placeholder="eg. Manager, Business Owner, Business Representative..."
                  required
                />
              </div>
              <div>
                <label>Business Category:</label>
                <Select
                  v-model="selectedCategory"
                  :options="categories"
                  optionLabel="name"
                  optionValue="id"
                  required
                  placeholder="Select Category"
                  fluid
                />
              </div>
              <div>
                <InputFile
                  accept-description="image / pdf"
                  accept="image/*,.pdf"
                  label="Personal Identity Document:"
                  path="userid"
                  :url="claimData.personalIdDocumentUrl"
                  @uploaded="setUpload"
                  @deleted="setDeleted"
                  id="userId"
                />
              </div>
            </div>

            <div class="mt-10 header font-bold">Business Identification:</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label>Identification Type:</label>
                <Select
                  v-model="selectedMode"
                  :options="idVerificationTypes"
                  optionLabel="name"
                  fluid
                />
              </div>

              <div>
                <label
                  >Identification number
                  {{
                    selectedMode.code === "other" ? "(optional)" : ""
                  }}:</label
                >
                <InputText
                  fluid
                  class="flex-auto"
                  autocomplete="off"
                  v-model="claimData.idNumber"
                />
              </div>
              <InputFile
                accept-description="image / pdf"
                accept="image/*,.pdf"
                label="Identification Document:"
                path="business_cac"
                @uploaded="setUpload"
                @deleted="setDeleted"
                :url="claimData.idDocumentUrl"
                id="cac"
              />
              <InputFile
                accept-description="image / pdf"
                accept="image/*,.pdf"
                label="Proof of Business Ownership:"
                path="business_ownership_proof"
                @uploaded="setUpload"
                @deleted="setDeleted"
                :url="claimData.proofOfOwnerShipUrl"
                id="proof"
              />
            </div>

            <div class="mt-20 text-[90%] mb-5">
              <span class="font-bold">NOTICE:</span> Due to high traffic, we
              would verify and approve your appeal and contact you within 2-3
              business days.
            </div>
            <div
              class="flex justify-end gap-2.5"
              v-if="approvedStatus.includes(businessClaim?.status!)"
            >
              <ButtonCustom
                size="lg"
                label="Cancel"
                type="button"
                input-class="w-max"
                @clicked="reset(claimData)"
              />
              <ButtonCustom
                label="Appeal Business Claim"
                type="submit"
                input-class="w-max"
                primary="true"
                size="lg"
                :is-loading="isSubmitting"
              />
            </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "biz",
});
import { onBeforeMount } from "vue";
import InputFile from "~/components/Input/InputFile.vue";
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import type {
  ClaimData,
  Category,
  BusinessClaimResponse,
} from "~/types/business";

const route = useRoute();
const toast = useToast();

const approvedStatus = [4, 2];

const { updateClaimBusinessAsync, getCategories, getBusinessClaim } =
  useBusinessMethods();

const isLoading = ref(true);
const businessClaim = ref<BusinessClaimResponse>();

const isClaimed = ref(false);
const isSubmitting = ref(false);

const selectedMode = ref({
  code: "cac_certificate",
  name: "CAC Certificate",
  requiresIdNumber: true,
});

const selectedCategory = ref<Category>();
const claimData = ref<ClaimData>({
  fullName: "",
  businessId: "",
  phoneNumber: "",
  email: "",
  role: "",

  idType: "",
  idDocumentUrl: null,
  idNumber: "",

  personalIdDocumentUrl: null,
  proofOfOwnerShipUrl: null,

  categoryId: "",
});

const claimBusiness = async (data: ClaimData) => {
  if (!approvedStatus.includes(businessClaim?.value!.status!)) {
    return toast.add({
      severity: "error",
      summary: "ERROR",
      detail: "Unable to update business claim!",
      life: 3000,
    });
  }

  try {
    data.categoryId = selectedCategory.value?.id!;
    isSubmitting.value = true;

    data.idType = selectedMode.value.code;
    const res = await updateClaimBusinessAsync(data);
    if (res?.statusCode !== 200) {
      return toast.add({
        severity: "error",
        summary: "ERROR",
        detail:
          res?.data?.title ??
          res?.data.error ??
          res?.data.message ??
          "An error occurred",
        life: 3000,
      });
    }

    softReset();
    return toast.add({
      severity: "success",
      summary: "SUCCESS",
      detail: "Business claim appeal in progress.",
      life: 3000,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isSubmitting.value = false;
  }
};

const categories = ref<Category[]>([]);
const isLoadingCategory = ref(false);

const claimId = ref("");
const businessId = ref("");

const loadCategoryAsync = async () => {
  try {
    isLoadingCategory.value = true;
    const res = await getCategories();
    categories.value = res;
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingCategory.value = false;
  }
};

const loadBusinessData = async () => {
  try {
    isLoading.value = true;
    const res = await getBusinessClaim(claimId.value);

    if (res?.statusCode === 200 && res.data) {
      // load categories
      await loadCategoryAsync();

      businessClaim.value = res.data;

      // Update claimData
      claimData.value.businessId = res.data.businessId;
      claimData.value.fullName = res.data.fullName;
      claimData.value.phoneNumber = res.data.phoneNumber;
      claimData.value.role = res.data.role;
      claimData.value.email = res.data.email;
      claimData.value.categoryId = res.data.categoryId;

      // id
      claimData.value.idType = res.data.idType;
      claimData.value.idDocumentUrl = res.data.idDocumentUrl;
      claimData.value.idNumber = res.data.idNumber;

      // externals
      claimData.value.proofOfOwnerShipUrl = res.data.proofOfOwnerShipUrl;
      claimData.value.personalIdDocumentUrl = res.data.personalIdDocumentUrl;

      // If already closed, show the "closed" screen
      if (res.data.status === 5) {
        isClaimed.value = true;
      } else {
        isClaimed.value = false;
      }
    } else {
      // If the ID is invalid or doesn't exist, show 404
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
      });
    }
  } catch (error) {
    console.error("Error loading business for claim:", error);
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
      fatal: true,
    });
  } finally {
    isLoading.value = false;
  }
};

onBeforeMount(async () => {
  if (!route.query.id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
      fatal: true,
    });
  }

  businessId.value = route.params.id as string;
  claimId.value = route.query.id as string;
  await loadBusinessData();
});

const setUpload = (url: string, id: string) => {
  switch (id) {
    case "userId":
      claimData.value.idDocumentUrl = url;
      break;

    case "cac":
      claimData.value.personalIdDocumentUrl = url;
      break;

    case "proof":
      claimData.value.proofOfOwnerShipUrl = url;
      break;

    default:
      break;
  }
};

const setDeleted = (id: string) => {
  switch (id) {
    case "userId":
      claimData.value.idDocumentUrl = null;
      break;

    case "cac":
      claimData.value.personalIdDocumentUrl = null;
      break;

    case "proof":
      claimData.value.proofOfOwnerShipUrl = null;
      break;

    default:
      break;
  }
};

const deleteUrl = async (url: string | null) => {
  if (url === null) return;
  try {
    await $fetch("/api/delete", {
      method: "GET",
      query: {
        url: url,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const reset = async (data: ClaimData) => {
  // clear data
  await Promise.all([
    deleteUrl(data.personalIdDocumentUrl),
    deleteUrl(data.idDocumentUrl),
    deleteUrl(data.proofOfOwnerShipUrl),
  ]);

  softReset();
};

const softReset = () => {
  claimData.value = {
    fullName: "",
    businessId: route.params.id as string,
    phoneNumber: "",
    email: "",
    role: "",
    idType: "NIN",
    idDocumentUrl: null,
    idNumber: "",
    proofOfOwnerShipUrl: null,
    personalIdDocumentUrl: null,
    categoryId: "",
  };
};

const pageTitle = computed(
  () =>
    `${businessClaim.value?.businessName ?? "Business Profile"} | Clereview`,
);

useHead({
  title: pageTitle,
});
</script>
<style scoped>
.header {
  margin-bottom: 10px;
}
</style>
