<template>
  <Toast />
  <GeneralLoader v-if="loadingPage" />
  <div
    v-else
    class="flex justify-center items-center min-h-screen sm:p-[50px] p-[30px]"
  >
    <div
      class="rounded-[20px] shadow-sm w-full sm:max-w-[1000px] flex rounded-r-[10px]"
    >
      <div
        class="w-full sm:w-[65%] flex flex-col p-[30px] rounded-r-[10px] bg-white"
      >
        <NuxtLink
          to="/"
          class="uppercase w-max text-[80%] text-primary mb-[30px] flex items-center gap-[5px]"
        >
          <i class="pi pi-angle-left mt-[5px]"></i> CleReview
        </NuxtLink>
        <div class="flex-1 text-center py-[20px]">
          <div class="text-primary sm:text-[200%] text-[150%] font-bold">
            Complete Business Registration
          </div>
          <div class="mb-[20px] flex justify-center items-center mt-[-10px]">
            <hr class="!bg-primary w-[100px] h-[10px] rounded-full" />
          </div>
          <div v-if="showSentVerification" class="text-center">
            A confirmation email was sent to "{{ signUp.email }}", follow the
            outlined process to complete your business registration.
          </div>
          <form @submit.prevent="submitForm" v-else>
            <div class="mb-[10px]">
              <label class="block text-sm text-left text-contrast mb-1 gap-2"
                >Business Name:</label
              >
              <InputText
                fluid
                class="bg-[#F9F9F7] cursor-not-allowed"
                :readonly="true"
                :value="businessData?.name"
              />
              <!-- <div class="w-full text-left">{{ businessData?.name }}</div> -->
            </div>
            <div>
              <InputTextCustom
                v-model="signUp.email"
                label="Business Email Address:"
                type="email"
                required
              />
            </div>
            <div>
              <InputTextCustom
                v-model="signUp.phoneNumber"
                label="Business Phone Number (optional):"
                required
              />
            </div>
            <div>
              <InputTextCustom
                v-model="signUp.password"
                label="Account Password:"
                type="password"
                required
              />
            </div>
            <div>
              <ButtonCustom
                :no-zoom="true"
                :label="
                  isLoading
                    ? 'Creating Business Account...'
                    : 'Create Business Account'
                "
                :disabled="isLoading"
                size="lg"
                primary="true"
                type="submit"
              />
            </div>
            <div class="flex justify-center mt-[30px] gap-[10px] items-center">
              <NuxtLink>Privacy Policy</NuxtLink>
              <div>|</div>
              <div>Terms of Service</div>
            </div>
          </form>
        </div>
      </div>
      <div
        class="w-full sm:w-[35%] sm:block hidden !bg-primary text-white border rounded-r-[10px]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import type { BusinessProfileResponse } from "~/types/business";
const { getBusinessProfile } = useBusinessMethods();
const { createBusinessAccount } = useMethods();
const toast = useToast();

const route = useRoute();
const isLoading = ref(false);
const isLoadingBusiness = ref(false);
const showSentVerification = ref(false);
const loadingPage = ref(true);
const businessData = ref<BusinessProfileResponse>();

const businessId = ref("");
const signUp = ref({
  businessId: "",
  email: "",
  password: "",
  phoneNumber: "",
});

const submitForm = async () => {
  if (!signUp.value.email || !signUp.value.password) {
    return toast.add({
      severity: "info",
      summary: "ERROR",
      detail: "Email & Password is required!",
      life: 4000,
    });
  }

  try {
    isLoading.value = true;
    signUp.value.businessId = businessId.value;
    const res = await createBusinessAccount(signUp.value);
    if (res?.statusCode === 201) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Registration successful!",
        life: 2000,
      });
      return (showSentVerification.value = true);
    }

    toast.add({
      severity: "error",
      summary: "ERROR",
      detail: res?.data.error || "An error occured",
      life: 4000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "ERROR",
      detail: (error as string) || "An error occured",
      life: 4000,
    });
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const loadBusinessData = async () => {
  try {
    const res = await getBusinessProfile(businessId.value, true);
    if (res.statusCode !== 200) {
      throw createError({
        statusCode: 404,
        statusMessage: "Business not found",
        fatal: true,
      });
    }
    businessData.value = res.data;

    if (res.data.businessStatus !== "in_progress") {
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingBusiness.value = true;
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

  businessId.value = route.query.id as string;
  await loadBusinessData();
});

onMounted(() => {
  loadingPage.value = false;
});
</script>
