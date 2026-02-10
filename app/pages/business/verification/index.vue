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
    <Card class="min-h-[500px]">
      <template #content>
        <div class="mb-[50px]">
          <div class="mb-2.5">Verification Status:</div>
          <ProgressBar
            :value="verification_data.verificationProgress"
            :show-value="false"
            class="h-[10px]"
          ></ProgressBar>
          {{ verification_data.verificationProgress }}/100
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
                    v-if="verification_data.emailVerified"
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
                <div>
                  {{ business.businessPhoneNumber }}
                </div>
                <div>
                  <i
                    v-if="verification_data.phoneVerified"
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
                <div>
                  {{ business.businessStreet ?? "-" }}
                  {{ business.businessCityTown ?? "-" }},
                  {{ business.businessState ?? "-" }}
                </div>
                <div>
                  <i
                    v-if="verification_data.addressVerified"
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
                        ? `${business.verificationName} - ${business.verificationNumber}`
                        : "- -"
                    }}
                  </div>
                  <div>
                    <i
                      v-if="
                        verification_data.idVerificationStatus === 'pending'
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
                      v-else-if="verification_data.idVerified"
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
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import useVerificationMethods from "~/composables/verification/useVerificationMethods";
const { saveBusinessProfile, getBusinessUser, getBusinessProfile } =
  useBusinessMethods();
const { getBusinessVerification } = useVerificationMethods();

definePageMeta({
  layout: "business",
});

const businessId = getBusinessUser();
const showValidateOtp = ref(false);
const showUploadId = ref(false);
const showBusinessAddress = ref(false);
const isLoadingVerification = ref(false);
const isLoading = ref(false);

const id = ref("etiketochukwu@gmail.com");
const type = ref("email");

const toast = useToast();

const address = ref({
  businessState: null,
  businessCityTown: null,
  businessStreet: null,
});

const business = ref({
  id: "test",
  businessEmail: "etiketochukwu@gmail.com",
  businessPhoneNumber: "+2348139024815",
  idVerified: true,
  verificationName: null,
  verificationNumber: null,
  businessState: null,
  businessCityTown: null,
  businessStreet: null,
});

const verification_data = ref({
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  businessId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  level: 0,
  levelName: "string",
  levelIcon: "string",
  cacVerified: true,
  phoneVerified: false,
  emailVerified: true,
  addressVerified: false,
  onlinePresenceVerified: true,
  otherIdsVerified: true,
  businessDomainEmailVerified: true,
  requiresReverification: true,
  reverificationReason: "string",
  completedRequirements: 0,
  totalRequirements: 0,
  verificationProgress: 0,
  createdAt: "2026-01-26T17:06:17.574Z",
  updatedAt: "2026-01-26T17:06:17.574Z",

  //   additions
  status: "completed",
  idVerified: false,
  idVerificationStatus: "rejected", // completed | pending
});

const validateOtp = (validate_id: string, validate_type: string) => {
  if (!validate_id) return;
  id.value = validate_id;
  type.value = validate_type;

  showValidateOtp.value = true;
};

const updateVerification = (type: "phone" | "email") => {
  showValidateOtp.value = false;
  if (type === "phone") return (verification_data.value.phoneVerified = true);
  verification_data.value.emailVerified = true;
};

const updateId = () => {
  verification_data.value.idVerificationStatus = "pending";
};

const saveBusinessAddress = async () => {
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

const loadBusinessProfile = async () => {
  try {
    isLoading.value = true;
    const res = await getBusinessProfile(businessId.id);
    if (res?.statusCode === 200) {
      business.value = res.data;

      // #misc
      id.value = business.value.businessEmail;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const loadBusinessVerification = async () => {
  try {
    isLoadingVerification.value = true;
    const res = await getBusinessVerification(businessId.id!);
    if (res?.statusCode === 200) {
      verification_data.value = res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingVerification.value = false;
  }
};

onBeforeMount(async () => {
  // const [res, verify_res] = await Promise.all([
  //   loadBusinessProfile(),
  //   loadBusinessVerification(),
  // ]);
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
