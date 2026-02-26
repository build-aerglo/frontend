<template>
  <div>
    <!-- Update Email Modal -->
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
            <label class="block text-sm font-medium text-gray-700 mb-1">New email address:</label>
            <InputText v-model="updatedEmail.email" fluid required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Reason for change:</label>
            <Textarea v-model="updatedEmail.reason" rows="3" fluid />
          </div>
          <div class="text-sm bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800">
            <i class="pi pi-info-circle mr-2"></i>
            Changes to your email address require approval. Once approved, the updated email address will take effect.
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="resetEmail"
            class="custom-cancel-btn"
          />
          <Button 
            type="submit" 
            label="Submit Request"
            :loading="isUpdatingEmail"
            class="custom-primary-btn"
          />
        </div>
      </form>
    </Dialog>

    <!-- Update Password Modal -->
    <Dialog
      v-model:visible="updatePasswordToggle"
      :draggable="false"
      modal
      header="Update Password"
      :style="{ width: '35rem' }"
    >
      <form @submit.prevent="updatePasswordAsync">
        <div class="flex flex-col gap-4">
          <!-- Current Password with Toggle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div class="relative">
              <InputText 
                v-model="currentPassword" 
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="Enter current password"
                fluid 
                required 
                class="pr-10"
              />
              <i 
                :class="showCurrentPassword ? 'pi pi-eye' : 'pi pi-eye-slash'" 
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                @click="showCurrentPassword = !showCurrentPassword"
              ></i>
            </div>
          </div>
          
          <!-- New Password with Toggle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div class="relative">
              <InputText 
                v-model="newPassword" 
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                fluid 
                required 
                class="pr-10"
              />
              <i 
                :class="showNewPassword ? 'pi pi-eye' : 'pi pi-eye-slash'" 
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                @click="showNewPassword = !showNewPassword"
              ></i>
            </div>
          </div>

          <!-- Password Requirements -->
          <div v-if="newPassword && !allValid" class="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p class="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2 text-xs">
                <i
                  :class="validLength ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"
                ></i>
                <span :class="validLength ? 'text-green-700' : 'text-gray-600'">
                  At least 8 characters
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <i
                  :class="validNumeric ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"
                ></i>
                <span :class="validNumeric ? 'text-green-700' : 'text-gray-600'">
                  Contains a number
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <i
                  :class="validComplexity ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"
                ></i>
                <span :class="validComplexity ? 'text-green-700' : 'text-gray-600'">
                  Contains a special character (@#&$_?)
                </span>
              </div>
            </div>
          </div>

          <div v-if="allValid && newPassword" class="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm flex items-center gap-2">
            <i class="pi pi-check-circle"></i>
            Password meets all requirements
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="resetPassword"
            class="custom-cancel-btn"
          />
          <Button 
            type="submit" 
            label="Update Password"
            :disabled="!allValid || isUpdatingPassword"
            :loading="isUpdatingPassword"
            class="custom-primary-btn"
          />
        </div>
      </form>
    </Dialog>

    <div class="flex flex-col gap-3">
      <!-- Account Preferences -->
      <div class="card">
        <div class="card-body px-9 py-6">
          <h1 class="text-[150%] text-contrast mb-4 font-bold">
            Account Preferences
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
                  
                  <!-- Tooltip -->
                  <div v-if="item.showHelp" class="relative inline-block">
                    <i
                      class="pi pi-question-circle mt-[1px] cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                    ></i>
                    
                    <div class="tooltip-container">
                      <div class="tooltip-content">
                        {{ item.help }}
                      </div>
                    </div>
                  </div>
                </label>
                
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

      <!-- Account Security Section -->
      <div class="card">
        <div class="card-body px-9 py-6">
          <h1 class="text-[150%] text-contrast mb-4 font-bold">
            Account Security
          </h1>
          
          <p class="text-gray-600 text-sm mb-6">
            Manage your email address and password to keep your account secure.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Update Email Card -->
            <div class="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors bg-white">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-envelope text-blue-600"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">Email Address</h3>
                  <p class="text-sm text-gray-600 mb-3">Update your account email address</p>
                  <Button
                    label="Update Email"
                    size="small"
                    outlined
                    @click="updateEmailToggle = true"
                    class="custom-outlined-btn"
                  />
                </div>
              </div>
            </div>

            <!-- Update Password Card -->
            <div class="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors bg-white">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-lock text-purple-600"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">Password</h3>
                  <p class="text-sm text-gray-600 mb-3">Change your account password</p>
                  <Button
                    label="Update Password"
                    size="small"
                    outlined
                    @click="updatePasswordToggle = true"
                    class="custom-outlined-btn"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deactivate Account -->
      <div class="card">
        <div class="card-body px-6 py-5 flex flex-col">
          <h1 class="text-[150%] text-contrast mb-4 font-bold">
            Deactivate account
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

// Password validation
const validLength = ref(true);
const validComplexity = ref(true);
const validNumeric = ref(true);
const isValid = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
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

// Modal toggles
const updateEmailToggle = ref(false);
const updatePasswordToggle = ref(false);
const isUpdatingEmail = ref(false);
const isUpdatingPassword = ref(false);

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
    help: "Full review details are visible only to you. Customers see the rating and summary publicly. Note that some customers may prefer to read full reviews when making decisions.",
    label: "Private Reviews",
    model: isPrivateReview,
    id: "private_reviews",
  },
  {
    showHelp: true,
    help: "Pauses new review submissions for 48 hours. Existing reviews and ratings remain publicly visible. This can be helpful during operational disruptions or unexpected high-volume periods.",
    label: "Do Not Disturb",
    model: isDndMode,
    id: "dnd",
  },
  {
    showHelp: true,
    help: "Auto-response sends an instant acknowledgement to new reviews. Personalised responses are still recommended to build trust.",
    label: "Auto respond to reviews",
    model: allowAutoResponse,
    id: "allow_auto_response",
  },
  {
    showHelp: false,
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

  isUpdatingPassword.value = true;

  try {
    const [encryptedOldPassword, encryptedNewPassword] = await Promise.all([
      encryptPasswordNative(currentPassword.value),
      encryptPasswordNative(newPassword.value),
    ]);

    if (!encryptedOldPassword || !encryptedNewPassword) {
      return toast.add({
        severity: "error",
        summary: "ERROR",
        detail: "Error encrypting password.",
        life: 3000,
      });
    }

    const res = await updatePassword(
      business.businessEmail!,
      encryptedOldPassword,
      encryptedNewPassword,
    );
    
    if (res.ok) {
      resetPassword();
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
        detail: `${res.data?.message ?? "An error occurred while updating password."}`,
        life: 3000,
      });
    }
  } finally {
    isUpdatingPassword.value = false;
  }
};

const updateEmailAsync = async () => {
  try {
    isUpdatingEmail.value = true;
    const res = await updateEmail(
      updatedEmail.value.email,
      updatedEmail.value.reason,
    );

    if (res.ok) {
      resetEmail();
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
      detail: `${res.data.message ?? "An error occurred."}`,
      life: 3000,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isUpdatingEmail.value = false;
  }
};

const resetEmail = () => {
  updateEmailToggle.value = false;
  updatedEmail.value.email = "";
  updatedEmail.value.reason = "";
};

const resetPassword = () => {
  updatePasswordToggle.value = false;
  currentPassword.value = "";
  newPassword.value = "";
  showCurrentPassword.value = false; 
  showNewPassword.value = false;
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

<style scoped>
/* Tooltip styles */
.tooltip-container {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1000;
}

.relative:hover .tooltip-container {
  opacity: 1;
  pointer-events: auto;
}

.tooltip-content {
  background-color: #f0fdf4;
  color: #008253;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  line-height: 1.4;
  white-space: wrap;
  width: 310px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid #d1fae5;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #f0fdf4;
}

@media (max-width: 640px) {
  .tooltip-content {
    white-space: normal;
    max-width: 250px;
  }
}
:deep(.p-inputtext) {
  padding-right: 2.5rem !important;
}

.relative i.pi {
  z-index: 10;
}

/* Custom PrimeVue Button Styles */
.custom-primary-btn {
  background-color: #008253 !important;
  border-color: #008253 !important;
  color: white !important;
}

.custom-primary-btn:hover:not(:disabled) {
  background-color: #006f45 !important;
  border-color: #006f45 !important;
}

.custom-primary-btn:disabled {
  background-color: #a0a0a0 !important;
  border-color: #a0a0a0 !important;
  opacity: 0.6;
}

.custom-cancel-btn {
  background-color: #f3f4f6 !important;
  border-color: #d1d5db !important;
  color: #374151 !important;
}

.custom-cancel-btn:hover {
  background-color: #e5e7eb !important;
  border-color: #9ca3af !important;
}

.custom-outlined-btn {
  border-color: #008253 !important;
  color: #008253 !important;
  background-color: transparent !important;
}

.custom-outlined-btn:hover {
  background-color: #f0fdf4 !important;
  border-color: #006f45 !important;
  color: #006f45 !important;
}
</style>