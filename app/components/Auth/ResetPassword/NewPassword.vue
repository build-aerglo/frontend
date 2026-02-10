<template>
  <div>
    <form @submit.prevent="sendOtp" class="flex flex-col">
      <div class="text-[150%] font-bold">Reset password:</div>
      <div class="mb-[20px] text-[90%] text-[gray]">
        Input your new password.
      </div>
      <div>
        <label>New Password:</label>
        <Password
          v-model="password"
          fluid
          :invalid="isValid"
          :feedback="false"
          toggleMask
        />
        <div v-if="!allValid" class="flex flex-col mt-[10px]">
          <div class="flex items-center gap-2">
            <i
              class="text-[10px]"
              :class="
                validLength
                  ? 'pi pi-check text-green-500'
                  : 'pi pi-times text-red-500'
              "
            ></i>
            Min. of 8 characters
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
            Must contain a special character (@#&_?)
          </div>
          <div class="flex items-center gap-2">
            <i
              class="text-[10px]"
              :class="
                validForm
                  ? 'pi pi-check text-green-500'
                  : 'pi pi-times text-red-500'
              "
            ></i>
            Must contain at least one letter and number
          </div>
        </div>
      </div>
      <div class="mt-[15px]">
        <label>Confirm New Password:</label>
        <Password
          v-model="confirm_password"
          fluid
          :feedback="false"
          :toggleMask="true"
        />
      </div>
      <div class="mt-[20px]">
        <Button
          type="submit"
          fluid
          :loading="isSending"
          :label="isSending ? 'Reseting password...' : 'Reset Password'"
        />
        <NuxtLink
          to="/"
          class="justify-end items-center flex text-[90%] mt-[15px] gap-[5px]"
          ><i class="pi pi-angle-left text-[80%]"></i> Back to sign in</NuxtLink
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Password } from "primevue";
const { resetPassword } = useMethods();
import { encryptPasswordNative } from "~/utils/";
const props = defineProps(["id", "redirect"]);

const isSending = ref(false);
const toast = useToast();

const password = ref("");
const confirm_password = ref("");

const emit = defineEmits(["done"]);

const validLength = ref(false);
const validComplexity = ref(false);
const validForm = ref(false);
const isValid = ref(false);

const allValid = computed(
  () => validLength.value && validComplexity.value && validForm.value,
);

watch(password, (newVal) => {
  validLength.value = newVal.length >= 8; // length
  validComplexity.value = /[@#&_?$]/.test(newVal); // special char
  validForm.value = /[0-9]/.test(newVal) && /[A-Za-z]/.test(newVal); // number and letter
});

watch(password, () => {
  if (isValid.value) isValid.value = false;
});

const sendOtp = async () => {
  if (!allValid.value) return console.log("error");

  if (password.value !== confirm_password.value) {
    isValid.value = true;
    return toast.add({
      severity: "info",
      summary: `INFO`,
      detail: `Passwords do not match.`,
      life: 3000,
    });
  }

  try {
    isSending.value = true;
    const pass = await encryptPasswordNative(password.value);
    const res = await resetPassword(props.id, pass);
    if (res && res.statusCode === 200) {
      toast.add({
        severity: "success",
        summary: `SUCCESSFUL`,
        detail: `Password reset successful.`,
        life: 3000,
      });
      // logout and redirect to home cos idk where else to send them
      return await navigateTo(props.redirect ?? "/");
    }
  } catch (error) {
    console.log(error);
  } finally {
    isSending.value = false;
  }
};
</script>

<style scoped>
label {
  font-weight: 400;
  color: gray;
  font-size: 90%;
}
</style>
