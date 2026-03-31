<template>
  <Dialog
    v-model:visible="showRejectReason"
    :draggable="false"
    modal
    header="Reject Reason:"
    :style="{ width: '20rem' }"
  >
    <form @submit.prevent="rejectClaimAsync">
      <div class="mb-[20px]">
        <label>Reject Reason:</label>
        <Textarea :rows="4" required fluid></Textarea>
      </div>
      <ButtonCustom
        size="lg"
        :no-zoom="true"
        label="Reject Claim"
        primary="true"
        :disabled="isLoading"
        :is-loading="isLoading"
        type="submit"
      />
    </form>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
  <Card class="p-[10px]">
    <template #content>
      <div class="w-full min-h-screen">
        <NuxtLink
          @click="emit('close')"
          class="uppercase w-max text-[80%] text-primary mb-[30px] flex items-center gap-[5px]"
        >
          <i class="pi pi-angle-left mt-[5px]"></i> Back
        </NuxtLink>
        <div class="flex flex-col gap-2.5">
          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div>
              <label>Claim ID:</label>
              <div>{{ data.id }}</div>
            </div>
            <div>
              <label>Claim Status:</label>
              <div>{{ data.statusName }}</div>
            </div>
            <div>
              <label>Uploaded On:</label>
              <div>{{ dateFormat(data.createdAt) }}</div>
            </div>
          </div>
          <div>
            <label>Business:</label>
            <div>{{ data.businessName }}</div>
          </div>

          <div class="mt-[20px] font-bold text-[150%]">
            Claimer Information:
          </div>
          <div>
            <label>Name:</label>
            <div>{{ data.fullName }}</div>
          </div>
          <div>
            <label>Phone Number:</label>
            <div>{{ data.phoneNumber }}</div>
          </div>
          <div>
            <label>Email Address:</label>
            <div>{{ data.email }}</div>
          </div>
          <div>
            <label>Role:</label>
            <div>{{ data.role }}</div>
          </div>
          <div>
            <label>Personal ID Document:</label>
            <div>
              <a target="_blank" class="bb" :href="data.personalIdDocumentUrl"
                >View Uploaded File</a
              >
            </div>
          </div>

          <div class="mt-[20px] font-bold text-[150%]">
            Business Claim Information:
          </div>
          <div>
            <label>Uploaded Business Id Type:</label>
            <div>{{ getVerificationName(data.idType) }}</div>
          </div>
          <div>
            <label>Uploaded Business Id Number:</label>
            <div>{{ data.idNumber }}</div>
          </div>
          <div>
            <label>Uploaded Business Id:</label>
            <div>
              <a target="_blank" class="bb" :href="data.idDocumentUrl"
                >View Uploaded File</a
              >
            </div>
          </div>
          <div>
            <label>Proof of ownership:</label>
            <div>
              <a target="_blank" class="bb" :href="data.proofOfOwnershipUrl"
                >View Uploaded File</a
              >
            </div>
          </div>
        </div>
        <div class="flex justify-between gap-[20px] mt-[30px]">
          <div>
            <ButtonCustom
              :no-zoom="true"
              label="Close"
              size="lg"
              @clicked="emit('close')"
              :disabled="isLoading"
              input-class="!w-max"
            />
          </div>
          <div class="flex justify-end gap-[20px]">
            <ButtonCustom
              :no-zoom="true"
              label="Reject Claim"
              size="lg"
              :disabled="isLoading"
              @clicked="openRejectModal"
              input-class="!w-max"
            />
            <ButtonCustom
              :no-zoom="true"
              label="Approve Claim"
              size="lg"
              @click="confirmApprove()"
              primary="true"
              :disabled="isLoading"
              :is-loading="isLoading"
              input-class="!w-max"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import useSupportMethods from "~/composables/support/useSupportMethods";
import type { BusinessClaimResponse } from "~/types/business";
const { approveClaim, rejectClaim, updateClaimStatus } = useSupportMethods();
const props = defineProps<{
  data: BusinessClaimResponse;
}>();
const userId = "01debeb8-09fd-429a-ba56-6be01475f56c";
const emit = defineEmits(["close", "updated"]);
const toast = useToast();
const confirm = useConfirm();

const isLoading = ref(false);
const approveClaimAsync = async () => {
  isLoading.value = true;

  try {
    const res = await approveClaim(props.data.id, userId);
    if (res?.statusCode === 200) {
      toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Business claim approved successfully!",
        life: 3000,
      });
      return emit("updated");
    }

    toast.add({
      severity: "error",
      summary: "ERROR",
      detail: res?.data?.error ?? res?.data?.message ?? "An error occurred",
      life: 3000,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const rejectReason = ref("");
const showRejectReason = ref(false);
const rejectClaimAsync = async () => {
  if (!rejectReason.value || rejectReason.value.length > 0) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Invalid reject reason.",
      life: 3000,
    });
  }

  isLoading.value = true;

  try {
    const res = await rejectClaim(props.data.id, userId, rejectReason.value);
    if (res?.statusCode === 200) {
      showRejectReason.value = false;
      toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Business claim rejected successfully!",
        life: 3000,
      });
      return emit("updated");
    }

    toast.add({
      severity: "error",
      summary: "ERROR",
      detail: res?.data?.error ?? res?.data?.message ?? "An error occurred",
      life: 3000,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const openRejectModal = () => {
  rejectReason.value = "";
  showRejectReason.value = true;
};

const confirmApprove = () => {
  confirm.require({
    message: "Are you sure you want to proceed?",
    header: "Confirm Approval",
    icon: "pi pi-exclamation-circle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Approve Claim",
    },
    accept: async () => {
      await approveClaimAsync();
    },
    reject: () => {
      return;
    },
  });
};

function getVerificationName(code: string): string | undefined {
  return idVerificationTypes.find((item) => item.code === code)?.name;
}
</script>
<style scoped>
label {
  font-weight: 400;
  color: gray;
  font-size: 90%;
  display: block;
}
</style>
