<template>
  <GeneralLoader v-if="isLoading" />
  <div v-else class="flex justify-center items-center p-[20px] h-screen">
    <Card>
      <template #content>
        <div class="sm:w-[400px] w-full rounded-md text-center p-[20px]">
          <div class="flex justify-center items-center mb-[20px]">
            <i
              class="text-[500%]"
              :class="`${responseData.icon} text-[${responseData.color}]`"
            ></i>
          </div>
          <div
            class="text-[210%] font-bold"
            :class="`text-[${responseData.color}]`"
          >
            {{ responseData.header }}
          </div>
          <div>{{ responseData.description }}</div>
          <div class="mt-[30px]">
            <Button
              :label="responseData.button_label"
              primary="true"
              @click="validatePaymentAsync"
              :loading="isLoading"
              v-if="responseData.status === 'pending'"
              class="!px-[20px]"
            />
            <NuxtLink v-else :to="responseData.button_url">
              <ButtonCustom
                :no-zoom="true"
                :label="responseData.button_label"
                size="lg"
                primary="true"
              />
            </NuxtLink>
            <div v-if="responseData.allowHelp" class="mt-2.5">
              Have an issue?
              <a href="mailto:sales@clereview.com">sales@clereview.com</a>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
interface ValidateResponse {
  status: string;
  error?: string | null;
  success: boolean;
}

import usePayments from "~/composables/payment/usePayments";

const { validatePayment } = usePayments();
const isLoading = ref(true);

const response = ref<ValidateResponse>();

const route = useRoute();
const reference = route.query.reference as string;

const validatePaymentAsync = async () => {
  try {
    isLoading.value = true;
    const res = await validatePayment(reference);
    if (res.ok) {
      return (response.value = res.data);
    }

    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found",
      fatal: true,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onBeforeMount(async () => {
  if (!reference) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found",
      fatal: true,
    });
  }

  await validatePaymentAsync();
});

const responseData = computed(() => {
  return getResponseData(response.value?.status!);
});

const getResponseData = (status: string) => {
  let res = {
    icon: "",
    header: "",
    description: "",
    button_label: "",
    button_url: "",
    allowHelp: false,
    status: "",
    color: "",
  };
  switch (status) {
    case "success":
      res = {
        icon: "pi pi-check-circle",
        header: "Payment Successful!",
        description: "Transaction initialized successfully.",
        button_label: "Business Dashboard",
        button_url: "/business/setting/",
        allowHelp: false,
        status: status,
        color: "green",
      };
      break;

    case "pending":
      res = {
        icon: "pi pi-info-circle",
        header: "Payment Processing!",
        description: "Transaction still in process.",
        button_label: "Refresh Transaction",
        button_url: "/",
        allowHelp: true,
        status: status,
        color: "yellow",
      };
      break;

    case "failed":
      res = {
        icon: "pi pi-times",
        header: "Payment Error!",
        description: response.value?.error ?? "Transaction failed to process.",
        button_label: "Business Dashboard",
        button_url: "/business/setting/",
        allowHelp: true,
        status: status,
        color: "red",
      };
      break;

    case "abandoned":
      res = {
        icon: "pi pi-times",
        header: "Payment Error!",
        description:
          response.value?.error ?? "Transaction abandoned before completion.",
        button_label: "Business Dashboard",
        button_url: "/business/setting/",
        allowHelp: true,
        status: status,
        color: "red",
      };
      break;

    default:
      break;
  }

  return res;
};
</script>
