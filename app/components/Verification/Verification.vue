<template>
  <BusinessValidationOTP
    :id="id"
    :type="type"
    v-if="showValidateOtp"
    @done="updateVerification"
    @close="showValidateOtp = false"
  />
  <BusinessValidationID
    v-if="showUploadId"
    @done="updateId"
    @close="showUploadId = false"
  />

  <Dialog
    v-model:visible="showBusinessAddress"
    :draggable="false"
    modal
    header="Update Business Address"
    :style="{ width: '50rem' }"
  >
    <form @submit.prevent="saveBusinessAddress">
      <div class="mb-5">
        <label>Business Address:</label>
        <div>
          {{ address.businessStreet ?? "-" }}
          {{ address.businessCityTown ?? "-" }},
          {{ address.businessState ?? "-" }}
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
        <div>
          <label for="email">Street</label>
          <InputText
            fluid
            class="flex-auto"
            required
            autocomplete="off"
            v-model="address.businessStreet"
          />
        </div>
        <div>
          <label for="email">City / Town</label>
          <InputText
            fluid
            class="flex-auto"
            required
            autocomplete="off"
            v-model="address.businessCityTown"
          />
        </div>
        <div>
          <label for="email">State</label>
          <InputText
            fluid
            class="flex-auto"
            required
            autocomplete="off"
            v-model="address.businessState"
          />
        </div>
      </div>
      <div class="mt-6">
        <Button type="submit" label="Save Business Address" fluid />
      </div>
    </form>
  </Dialog>

  <div>
    <GeneralLoader v-if="isLoading" />
    <Card class="min-h-[500px] p-[10px]" v-else>
      <template #content>
        <div class="mb-[20px]">
          <div class="font-bold text-[140%]">Business Verifications</div>
          <small>Confirm and update business validated data.</small>
        </div>
        <div class="mb-[50px]">
          <!-- <div class="mb-2.5">Verification Status:</div> -->
          <ProgressBar
            :value="verification_data?.verificationProgress"
            :show-value="false"
            class="h-[10px]"
          ></ProgressBar>
          {{ verification_data?.verificationProgress }}% completed
        </div>
        <div class="flex flex-col gap-10">
          <!--  -->
          <div>
            <div class="text-[120%] font-bold head">
              Business Contact Information
            </div>
            <div class="flex justify-between gap-2.5">
              <div>Business Email Address:</div>
              <div class="flex items-center gap-2.5">
                <div>
                  {{ business.businessEmail }}
                </div>
                <div>
                  <i
                    v-if="verification_data?.emailVerified"
                    class="pi pi-verified !text-primary"
                    v-tooltip.top="{
                      value: 'verified',
                      pt: {
                        arrow: {
                          style: {
                            borderBottomColor: 'var(--p-primary-color)',
                          },
                        },
                        text: '!bg-primary !text-primary-contrast !font-medium !text-[90%]',
                      },
                    }"
                  ></i>
                  <i
                    v-else
                    class="pi pi-question-circle text-[red] cursor-pointer"
                    @click="validateOtp(business.businessEmail, 'email')"
                    v-tooltip.top="{
                      value: 'not verified',
                      pt: {
                        arrow: {
                          style: {
                            borderBottomColor: 'var(--p-primary-color)',
                          },
                        },
                        text: '!font-medium !text-[90%]',
                      },
                    }"
                  ></i>
                </div>
              </div>
            </div>
            <div class="flex justify-between gap-2.5">
              <div>Business Phone Number:</div>
              <div class="flex items-center gap-2.5">
                <div
                  v-if="
                    business.businessPhoneNumber &&
                    business.businessPhoneNumber.length > 0
                  "
                >
                  {{ business.businessPhoneNumber }}
                </div>
                <div v-else>-</div>
                <div>
                  <i
                    v-if="verification_data?.phoneVerified"
                    class="pi pi-verified !text-primary"
                    v-tooltip.top="{
                      value: 'verified',
                      pt: {
                        arrow: {
                          style: {
                            borderBottomColor: 'var(--p-primary-color)',
                          },
                        },
                        text: '!bg-primary !text-primary-contrast !font-medium !text-[90%]',
                      },
                    }"
                  ></i>
                  <i
                    v-else
                    class="pi pi-question-circle text-[red] cursor-pointer"
                    @click="validateOtp(business.businessPhoneNumber, 'phone')"
                    v-tooltip.top="{
                      value: 'not verified',
                      pt: {
                        arrow: {
                          style: {
                            borderBottomColor: 'var(--p-primary-color)',
                          },
                        },
                        text: '!font-medium !text-[90%]',
                      },
                    }"
                  ></i>
                </div>
              </div>
            </div>
            <div class="flex justify-between gap-2.5">
              <div>Business Address:</div>
              <div class="flex items-center gap-2.5">
                <div v-if="hasAddress">
                  {{ business.businessStreet ?? "-" }}
                  {{ business.businessCityTown ?? "-" }},
                  {{ business.businessState ?? "-" }}
                </div>
                <div v-else>-</div>
                <div>
                  <i
                    v-if="verification_data?.addressVerified"
                    class="pi pi-verified !text-primary"
                    v-tooltip.top="{
                      value: 'verified',
                      pt: {
                        arrow: {
                          style: {
                            borderBottomColor: 'var(--p-primary-color)',
                          },
                        },
                        text: '!bg-primary !text-primary-contrast !font-medium !text-[90%]',
                      },
                    }"
                  ></i>
                  <i
                    v-else
                    class="pi pi-question-circle text-[red] cursor-pointer"
                    @click="showBusinessAddress = true"
                    v-tooltip.top="{
                      value: 'address not set',
                      pt: {
                        arrow: {
                          style: {
                            borderBottomColor: 'var(--p-primary-color)',
                          },
                        },
                        text: '!font-medium !text-[90%]',
                      },
                    }"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <!--  -->

          <!--  -->
          <div>
            <div class="text-[120%] font-bold head">
              Business Claim Document
            </div>
            <div>
              <div class="flex justify-between gap-2.5">
                <div>ID verification</div>
                <div class="flex items-center gap-2.5">
                  <div>
                    {{
                      business.idVerified
                        ? `${business.idVerificationType}`
                        : "- -"
                    }}
                  </div>
                  <div>
                    <i
                      v-if="
                        verification_data?.idVerificationStatus === 'pending'
                      "
                      class="pi pi-info-circle text-[gold] cursor-pointer"
                      v-tooltip.top="{
                        value: 'verification in progress',
                        pt: {
                          arrow: {
                            style: {
                              borderBottomColor: 'var(--p-primary-color)',
                            },
                          },
                          text: '!font-medium !text-[90%]',
                        },
                      }"
                    ></i>
                    <i
                      v-else-if="verification_data?.idVerified"
                      class="pi pi-verified !text-primary"
                      v-tooltip.top="{
                        value: 'verified',
                        pt: {
                          arrow: {
                            style: {
                              borderBottomColor: 'var(--p-primary-color)',
                            },
                          },
                          text: '!bg-primary !text-primary-contrast !font-medium !text-[90%]',
                        },
                      }"
                    ></i>
                    <i
                      v-else
                      class="pi pi-question-circle text-[red] cursor-pointer"
                      @click="showUploadId = true"
                      v-tooltip.top="{
                        value: 'not verified',
                        pt: {
                          arrow: {
                            style: {
                              borderBottomColor: 'var(--p-primary-color)',
                            },
                          },
                          text: '!font-medium !text-[90%]',
                        },
                      }"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--  -->

          <!--  -->
          <div>
            <div class="text-[120%] font-bold head">Business Subscription</div>
            <div>
              <div class="flex justify-between gap-2.5">
                <div>Subscription Tier:</div>
                <div class="flex items-center gap-2.5">
                  <div>Tier {{ businessSubscription?.tier }}</div>
                  <div>
                    <i
                      class="pi pi-verified !text-primary"
                      v-tooltip.top="{
                        value: 'verified',
                        pt: {
                          arrow: {
                            style: {
                              borderBottomColor: 'var(--p-primary-color)',
                            },
                          },
                          text: '!bg-primary !text-primary-contrast !font-medium !text-[90%]',
                        },
                      }"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="flex justify-between gap-2.5">
                <div>Selected Plan:</div>
                <div class="flex items-center gap-2.5">
                  <div>{{ businessSubscription?.planName }}</div>
                  <div>
                    <i
                      class="pi pi-verified !text-primary"
                      v-tooltip.top="{
                        value: 'verified',
                        pt: {
                          arrow: {
                            style: {
                              borderBottomColor: 'var(--p-primary-color)',
                            },
                          },
                          text: '!bg-primary !text-primary-contrast !font-medium !text-[90%]',
                        },
                      }"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--  -->
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import useVerificationMethods from "~/composables/verification/useVerificationMethods";
import type {
  BusinessSubscription,
  BusinessVerification,
} from "~/types/business";

const {
  saveBusinessProfile,
  getBusinessUser,
  getBusinessSubscriptionFromStore,
  getBusinessVerificationFromStore,
} = useBusinessMethods();
const { updateBusinessVerificationStore } = useVerificationMethods();

const businessData = getBusinessUser();
const showValidateOtp = ref(false);
const showUploadId = ref(false);
const showBusinessAddress = ref(false);

const id = ref("");
const type = ref("email");

const isLoading = ref(true);

const toast = useToast();

const address = ref({
  businessState: null,
  businessCityTown: null,
  businessStreet: null,
});

const hasAddress = computed(() => {
  if (
    (business.value.businessCityTown &&
      business.value.businessCityTown?.length > 0) ||
    (business.value.businessStreet &&
      business.value.businessStreet?.length > 0) ||
    (business.value.businessState && business.value.businessState?.length > 0)
  ) {
    return true;
  }
  return false;
});

const business = computed(() => {
  return businessData;
});

const businessSubscription = ref<BusinessSubscription | null>(null);

const verification_data = ref<BusinessVerification | null>();

const validateOtp = (validate_id: string, validate_type: string) => {
  if (!validate_id) return;

  id.value = validate_id;
  type.value = validate_type;

  showValidateOtp.value = true;
};

const updateVerification = async (type: "phone" | "email") => {
  if (!verification_data.value) return;

  showValidateOtp.value = false;

  if (type === "phone") {
    verification_data.value.phoneVerified = true;
  } else {
    verification_data.value.emailVerified = true;
  }

  await resave();
};

const updateId = async () => {
  if (!verification_data.value) return;
  verification_data.value.idVerificationStatus = "pending";

  //
  await resave();
};

const saveBusinessAddress = async () => {
  if (
    !address.value.businessCityTown ||
    !address.value.businessState ||
    !address.value.businessStreet
  ) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Provide business street, city, and state.",
      life: 3000,
    });
  }

  business.value.businessCityTown = address.value.businessCityTown;
  business.value.businessState = address.value.businessState;
  business.value.businessStreet = address.value.businessStreet;

  await saveBusinessAsync();
};

const saveBusinessAsync = async () => {
  try {
    const res = await saveBusinessProfile(business.value.id, business.value);
    if (res) {
      return toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Business Address Saved.",
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const resave = async () => {
  await updateBusinessVerificationStore(verification_data.value!);
};

onBeforeMount(async () => {
  try {
    businessSubscription.value = await getBusinessSubscriptionFromStore();
    verification_data.value = await getBusinessVerificationFromStore();
    if (!businessSubscription.value || !verification_data.value) {
      throw createError({
        statusCode: 404,
        statusMessage: "Page Not Found",
        fatal: true,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<style scoped>
i.pi {
  margin-top: 5px;
}
.head {
  margin-bottom: 10px;
}
</style>
