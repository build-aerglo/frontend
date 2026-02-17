<template>
  <div>
    <Dialog
      v-model:visible="updateEmailToggle"
      :draggable="false"
      modal
      header="Update Email Address"
      :style="{ width: '35rem' }"
    >
      <form @submit.prevent="updateEmailAsync">
        <div class="flex flex-col gap-2.5">
          <div>
            <label>New email address:</label>
            <InputText v-model="updatedEmail.email" fluid required />
          </div>
          <div>
            <label>Reason for change:</label>
            <Textarea v-model="updatedEmail.reason" rows="3" fluid />
          </div>
          <div class="text-[90%]">
            NOTE: Changes to your email address require approval.<br />
            Once a request is submitted and approved, the updated email address
            will take effect.
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-[20px]">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="reset"
          ></Button>
          <Button type="submit" label="Request email update"></Button>
        </div>
      </form>
    </Dialog>

    <div class="flex flex-col gap-3">
      <div class="card">
        <div class="card-body px-9 py-6">
          <h1 class="text-[150%] text-contrast mb-4 font-bold">
            Account Preferences:
          </h1>

          <div class="flex flex-col gap-4">
            <div
              class="flex flex-col gap-2.5"
              v-for="(item, index) in preferenceToggles"
              :key="index"
            >
              <div class="flex justify-between items-center">
                <label
                  class="text-contrast text-[15px] flex items-center gap-[5px]"
                >
                  <i
                    class="pi pi-lock mt-[1px] text-[red] cursor-pointer"
                    v-if="item.id === 'dnd' && !canDnd"
                    @click="planNotAllowed"
                  ></i>
                  <i
                    class="pi pi-lock mt-[1px] text-[red] cursor-pointer"
                    v-if="item.id === 'private_reviews' && !canPrivateReviews"
                    @click="planNotAllowed"
                  ></i>
                  <i
                    class="pi pi-lock mt-[1px] text-[red] cursor-pointer"
                    v-if="item.id === 'allow_auto_response' && !canAutoResponse"
                    @click="planNotAllowed"
                  ></i>

                  {{ item.label }}
                  <i
                    class="pi pi-question-circle mt-[1px] cursor-pointer"
                    @click="item.showingHelp = !item.showingHelp"
                    v-if="item.showHelp"
                  ></i
                ></label>
                <ToggleSwitch
                  v-if="item.id === 'dnd'"
                  v-model="item.model"
                  :disabled="!canDnd"
                />
                <ToggleSwitch
                  v-else-if="item.id === 'private_reviews'"
                  v-model="item.model"
                  :disabled="!canPrivateReviews"
                />
                <ToggleSwitch
                  v-else-if="item.id === 'allow_auto_response'"
                  v-model="item.model"
                  :disabled="!canAutoResponse"
                />
                <ToggleSwitch v-else v-model="item.model" />
              </div>
              <div
                v-if="item.showHelp && item.showingHelp && item.help"
                class="bg-yellow-50 text-[80%] rounded-sm p-[10px] relative"
              >
                <i
                  class="pi pi-times absolute top-[10px] right-[10px] cursor-pointer text-[90%]"
                  @click="item.showingHelp = !item.showingHelp"
                ></i>
                {{ item.help }}
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-between items-center w-full">
            <label class="font-medium text-contrast flex items-center">
              Preferred mode of contact
            </label>

            <div class="flex items-center gap-x-8">
              <Select
                v-model="selectedContactModes"
                :options="contactModes"
                optionLabel="name"
                checkmark
                :highlightOnSelect="false"
              />
            </div>
          </div>
          <Divider class="mt-20 mb-[20px]" />
          <div class="flex justify-end">
            <ButtonCustom
              label="Update Account Preferences"
              size="lg"
              primary="true"
              input-class="p-[10px] w-auto"
              @click="savePreferences"
            />
          </div>
        </div>
      </div>

      <!-- flex flex-col gap-3 -->
      <div class="grid-cols-1 sm:grid-cols-2 grid gap-3">
        <!--  -->

        <div class="card">
          <div class="card-body px-3 py-1">
            <form class="px-6 py-5">
              <div class="flex justify-between items-center gap-2.5">
                <h1 class="text-[150%] text-contrast font-bold">
                  Account Security:
                </h1>
                <Button
                  label="Update Email"
                  @click="updateEmailToggle = true"
                />
              </div>
              <InputTextCustom
                type="password"
                label="Current Password"
                v-model="currentPassword"
              />
              <InputTextCustom
                type="password"
                label="New Password"
                v-model="newPassword"
              />
              <div v-if="!allValid" class="flex flex-col mt-[10px] mb-[10px]">
                <div class="flex items-center gap-2">
                  <i
                    class="text-[10px]"
                    :class="
                      validLength
                        ? 'pi pi-check text-green-500'
                        : 'pi pi-times text-red-500'
                    "
                  ></i>
                  Password must be greater than 8 characters
                </div>
                <div class="flex items-center gap-2">
                  <i
                    class="text-[10px]"
                    :class="
                      validNumeric
                        ? 'pi pi-check text-green-500'
                        : 'pi pi-times text-red-500'
                    "
                  ></i>
                  Password must contain a number
                </div>
                <div class="flex items-center gap-2">
                  <i
                    class="text-[10px]"
                    :class="
                      validComplexity
                        ? 'pi pi-check text-green-500'
                        : 'pi pi-times text-red-500'
                    "
                  ></i>
                  Password must contain a special character (@#&_$?)
                </div>
              </div>
              <Divider class="mt-0 mb-[20px]" />
              <div class="flex justify-end">
                <ButtonCustom
                  label="Update Account Password"
                  size="lg"
                  primary="true"
                  input-class="p-[10px] w-auto"
                  @click="updatePasswordAsync"
                  :disabled="!allValid"
                />
              </div>
            </form>
          </div>
        </div>

        <div class="card">
          <div class="card-body px-6 py-5 flex flex-col">
            <h1 class="text-[150%] text-contrast mb-4 font-bold">
              Deactivate account:
            </h1>
            <div class="flex-1">
              <div
                class="mb-6 bg-yellow-50 border-l-4 border-gold p-4 rounded-md"
              >
                <h5 class="text-yellow-700 font-semibold mb-1">
                  Are you sure you want to delete your account?
                </h5>
                <p class="text-yellow-700 text-sm">
                  This action will permanently delete your account and all
                  associated data. Are you sure you want to proceed?
                </p>
              </div>
            </div>
            <form @submit.prevent>
              <div class="flex items-center gap-2 mb-5">
                <input
                  id="accountActivation"
                  type="checkbox"
                  v-model="confirmDeactivate"
                  class="w-4 h-4 accent-red-600 cursor-pointer"
                />
                <label for="accountActivation" class="text-sm text-contrast">
                  I no longer need this account. Please proceed with deletion.
                </label>
              </div>

              <div class="flex justify-end">
                <ButtonCustom
                  label="Deactivate Account"
                  size="lg"
                  primary="true"
                  input-class="p-[10px] w-auto hover:!bg-red-700 disabled:!bg-red-300 !bg-red-600"
                  :disabled="!confirmDeactivate"
                />
              </div>
            </form>
          </div>
        </div>

        <!--  -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isEditing: Boolean,
  canDnd: Boolean,
  canAutoResponse: Boolean,
  canPrivateReviews: Boolean,
});

import { encryptPasswordNative } from "~/utils";

import type {
  BusinessSettings,
  BusinessSettingsRequest,
} from "~/types/business";

import useBusinessMethods from "~/composables/business/useBusinessMethods";
const {
  getBusinessSettings,
  getBusinessUser,
  updateBusinessSettings,
  updateEmail,
} = useBusinessMethods();
const { updatePassword } = useMethods();

const toast = useToast();

const newPassword = ref("");
const currentPassword = ref("");

const businessSettings = ref<BusinessSettingsRequest>();

const isPrivateReview = computed({
  get: () => businessSettings.value?.reviewsPrivate ?? false,
  set: (val) => {
    if (!businessSettings.value) return;
    businessSettings.value.reviewsPrivate = val;
  },
});

const allowAutoResponse = computed({
  get: () => businessSettings.value?.autoResponseEnabled ?? false,
  set: (val) => {
    if (!businessSettings.value) return;
    businessSettings.value.autoResponseEnabled = val;
  },
});

const isDndMode = computed({
  get: () => businessSettings.value?.dndModeEnabled ?? false,
  set: (val) => {
    if (!businessSettings.value) return;
    businessSettings.value.dndModeEnabled = val;
  },
});

const isDarkMode = ref(false);

const confirmDeactivate = ref(false);

// password
const validLength = ref(true);
const validComplexity = ref(true);
const validNumeric = ref(true);
const isValid = ref(false);

const allValid = computed(
  () => validLength.value && validNumeric.value && validComplexity.value,
);

watch(newPassword, (newVal) => {
  validLength.value = newVal.length >= 8;
  validNumeric.value = /[0-9]/.test(newVal);
  validComplexity.value = /[@#&$_?]/.test(newVal);
});

watch([newPassword, currentPassword], () => {
  if (isValid.value) isValid.value = false;
});

const updateEmailToggle = ref(false);
const updatedEmail = ref({
  email: "",
  reason: "",
});

const selectedContactModes = ref({ name: "Email", code: "email" });
const contactModes = ref([
  { name: "Email", code: "email" },
  { name: "SMS", code: "sms" },
]);

const preferenceToggles = ref([
  {
    showHelp: true,
    showingHelp: false,
    help: "Test Help",
    label: "Private Reviews",
    model: isPrivateReview,
    id: "private_reviews",
  },
  {
    showHelp: true,
    showingHelp: false,
    help: "Test Help 2",
    label: "Do Not Disturb",
    model: isDndMode,
    id: "dnd",
  },
  {
    showHelp: true,
    showingHelp: false,
    help: "Auto response blah blah",
    label: "Auto respond to reviews",
    model: allowAutoResponse,
    id: "allow_auto_response",
  },
  {
    showHelp: false,
    showingHelp: false,
    help: null,
    label: "Dark Mode",
    model: isDarkMode,
    id: "dark_mode",
  },
]);

const business = getBusinessUser();

const savePreferences = async () => {
  try {
    const res = await updateBusinessSettings(
      business.id!,
      business.id!,
      businessSettings.value,
    );
    if (res?.statusCode === 200) {
      return toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Account preferences updated successfully.",
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updatePasswordAsync = async () => {
  if (!allValid.value) return;
  if (!currentPassword.value || !newPassword.value) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Please enter valid passwords.",
      life: 3000,
    });
  }

  if (currentPassword.value === newPassword.value) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "New password cannot be the same as old password.",
      life: 3000,
    });
  }

  // encrypt them passwords
  const [encryptedOldPassword, encryptedNewPassword] = await Promise.all([
    encryptPasswordNative(currentPassword.value),
    encryptPasswordNative(newPassword.value),
  ]);

  if (!encryptedOldPassword || !encryptedNewPassword) {
    return toast.add({
      severity: "error",
      summary: "ERROR",
      detail: "Error encrypting passsword.",
      life: 3000,
    });
  }

  const res = await updatePassword(
    business.businessEmail!,
    encryptedOldPassword,
    encryptedNewPassword,
  );
  if (res.ok) {
    return toast.add({
      severity: "success",
      summary: "SUCCESS",
      detail: "Password updated successfully.",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: `ERROR`,
      detail: `${res.data?.message ?? "An error occured while updating password."}`,
      life: 3000,
    });
  }
};

const isUpdatingEmail = ref(false);
const updateEmailAsync = async () => {
  try {
    isUpdatingEmail.value = true;
    const res = await updateEmail(
      updatedEmail.value.email,
      updatedEmail.value.reason,
    );

    if (res.ok) {
      return toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Email update request submitted.",
        life: 3000,
      });
    }

    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: `${res.data.message ?? "An error occured."}`,
      life: 3000,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isUpdatingEmail.value = false;
  }
};

const reset = () => {
  updateEmailToggle.value = false;
  updatedEmail.value.email = "";
  updatedEmail.value.reason = "";
};

const planNotAllowed = () => {
  return toast.add({
    severity: "info",
    summary: "INFO",
    detail: "Purchased plan does not support this feature.",
    life: 3000,
  });
};

onBeforeMount(async () => {
  const res = await getBusinessSettings();
  if (res?.statusCode === 200) {
    businessSettings.value = {
      reviewsPrivate: res.data?.reviewsPrivate,
      privateReviewsReason: res.data?.privateReviewsReason,
      dndModeEnabled: res.data?.dndModeEnabled,
      dndModeDurationHours: res.data?.dndModeDurationHours ?? 0,
      dndModeReason: "",
      dndModeMessage: res.data?.dndModeMessage,
      autoResponseEnabled: res.data?.autoResponseEnabled,
    };
  }
});
</script>
