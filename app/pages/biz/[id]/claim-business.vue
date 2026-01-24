<template>
  <GeneralLoader v-if="isLoading" height="500px" />
  <div v-else>
    <div
      v-if="isClaimed"
      class="flex justify-center items-center min-h-[500px] flex-col"
    >
      <i class="pi pi-verified text-primary text-[500%] mb-[30px]"></i>
      <div class="mb-2.5 text-[150%]">
        "{{ business?.name }}" has been claimed and verified!
      </div>
      <div>
        <NuxtLink :to="`/biz/${route.params.id as string}/`">
          <ButtonCustom
            label="Back to profile"
            primary="true"
            icon="angle-left"
            size="lg"
          />
        </NuxtLink>
      </div>
    </div>
    <div
      v-else
      class="min-h-screen ..flex ..justify-center ..items-center ..p-[20px]"
    >
      <Card class="p-5">
        <template #content>
          <div class="sm:text-[160%] mb-5 font-bold">
            Claim "{{ business?.name }}"
          </div>
          <div class="mb-5 w-full sm:max-w-[1000px]">
            If you are the owner or authorized representative of this business,
            you can claim this page to manage your public information,
            communicate with customers, and keep your listing accurate.
            <br />Ownership verification is required.
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
              <InputFile
                accept-description="image / pdf"
                accept="image/*,.pdf"
                label="Personal Identity Document"
                path="userid"
                @uploaded="setUpload"
                @deleted="setDeleted"
                id="userId"
              />
            </div>

            <div class="mt-10 header font-bold">Business Information:</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label>CAC Number:</label>
                <InputText
                  fluid
                  class="flex-auto"
                  autocomplete="off"
                  v-model="claimData.cacNumber"
                />
              </div>
              <InputFile
                accept-description="image / pdf"
                accept="image/*,.pdf"
                label="CAC Document:"
                path="business_cac"
                @uploaded="setUpload"
                @deleted="setDeleted"
                id="cac"
              />
              <InputFile
                accept-description="image / pdf"
                accept="image/*,.pdf"
                label="Proof of Business Ownership:"
                path="business_ownership_proof"
                @uploaded="setUpload"
                @deleted="setDeleted"
                id="proof"
              />
            </div>

            <div class="mt-20 text-[90%] mb-5">
              <span class="font-bold">NOTICE:</span> Due to high traffic, we
              would verify and approve your claim and contact you within 2-3
              business days.
            </div>
            <div class="flex justify-end gap-2.5">
              <ButtonCustom
                size="lg"
                label="Cancel"
                type="button"
                input-class="w-max"
                @clicked="reset(claimData)"
              />
              <ButtonCustom
                label="Claim Business"
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
import { usePageData } from "~/composables/method/usePageData";
import type { BusinessProfileResponse, ClaimData } from "~/types/business";

const pageData = usePageData();
const route = useRoute();
const toast = useToast();
const { getBusinessProfile, claimBusinessAsync } = useBusinessMethods();

const isLoading = ref(true);
const business = ref<BusinessProfileResponse>();

const isClaimed = ref(false);
const isSubmitting = ref(false);

const claimData = ref<ClaimData>({
  fullName: "",
  businessId: route.params.id as string,
  phoneNumber: "",
  email: "",
  role: "",
  idDocumentUrl: null,
  cacDocumentUrl: null,
  proofOfOwnerShipUrl: null,
  cacNumber: "",
});

const claimBusiness = async (data: ClaimData) => {
  try {
    isSubmitting.value = true;
    const res = await claimBusinessAsync(data);
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
      detail: "Business approval in progress.",
      life: 3000,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isSubmitting.value = false;
  }
};

const loadBusinessData = async () => {
  const id = route.params.id as string;
  
  try {
    isLoading.value = true;
    const res = await getBusinessProfile(id);

    if (res?.statusCode === 200 && res.data) {
      business.value = res.data;
      
      // Update claimData with the verified ID
      claimData.value.businessId = res.data.id;

      // If already approved, show the "Verified" screen
      if (res.data.businessStatus === "approved") {
        isClaimed.value = true;
      } else {
        isClaimed.value = false;
      }
    } else {
      // If the ID is invalid or doesn't exist, show 404
      throw createError({ statusCode: 404, statusMessage: "Business not found" });
    }
  } catch (error) {
    console.error("Error loading business for claim:", error);
    throw createError({ statusCode: 404, statusMessage: "Business not found" });
  } finally {
    isLoading.value = false;
  }
};

const pageTitle = computed(
  () =>
    `${business.value?.name ?? "Business Profile"} - ${
      business.value?.categories[0]?.name ?? ""
    } | Clereview`
);
useHead({
  title: pageTitle,
  meta: [
    {
      name: "description",
      content: computed(() => business.value?.businessDescription ?? ""),
    },
  ],
});

onBeforeMount(async () => {
  await loadBusinessData();
});

const setUpload = (url: string, id: string) => {
  switch (id) {
    case "userId":
      claimData.value.idDocumentUrl = url;
      break;

    case "cac":
      claimData.value.cacDocumentUrl = url;
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
      claimData.value.cacDocumentUrl = null;
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
    deleteUrl(data.cacDocumentUrl),
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
    idDocumentUrl: null,
    cacDocumentUrl: null,
    proofOfOwnerShipUrl: null,
    cacNumber: "",
  };
};
</script>
<style scoped>
.header {
  margin-bottom: 10px;
}
</style>
