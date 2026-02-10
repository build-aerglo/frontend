<template>
  <div>
    <form @submit.prevent="sendOtp">
      <div class="text-[150%] font-bold">Confirm OTP</div>
      <div class="mb-[20px] text-[90%] text-[gray]">
        An otp was sent to "{{ id }}"<br />Confirm the code below to reset your
        account password.
      </div>
      <div class="mt-2.5">
        <!--  -->
        <div class="flex justify-center items-center">
          <InputOtp v-model="code" size="large" :length="6" fluid />
        </div>
        <div class="text-center mt-2.5" v-if="isLoadingResendOTP">
          <span
            class="mb-[1px] text-[90%] !text-primary flex items-center justify-center gap-[5px]"
          >
            <i class="pi pi-spinner pi-spin text-[90%]"></i> Resending...
          </span>
        </div>
        <div class="text-center mt-2.5" v-else>
          <span v-if="countdown > 0" class="mb-[1px] text-[90%] !text-primary">
            Resend OTP in {{ countdown }} sec(s)
          </span>
          <span
            v-else
            @click="sendCodeAsync('resend')"
            class="mb-[1px] text-[90%] !text-primary cursor-pointer"
          >
            Resend OTP
          </span>
        </div>
      </div>
      <!--  -->
      <div class="mt-[20px]">
        <Button
          fluid
          :loading="isVerifying || isLoadingResendOTP"
          :label="isVerifying ? 'Verifying reset code...' : 'Verify reset code'"
          @click="confirmCodeAsync"
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
import useVerificationMethods from "~/composables/verification/useVerificationMethods";

const { confirmVerificationOtp } = useVerificationMethods();
const { requestResetPassword } = useMethods();
const props = defineProps(["id", "type"]);
const isSending = ref(false);
const toast = useToast();
const code = ref();
const isVerifying = ref(false);

const emit = defineEmits(["done"]);

const sendOtp = async () => {
  try {
    isSending.value = true;
    const res = await confirmVerificationOtp(code.value, props.id, "email");
    if (res.statusCode === 200) {
      emit("done");
    }
  } catch (error) {
    console.log(error);
  } finally {
    isSending.value = false;
  }
};

const isSent = ref(false);
const isLoadingResendOTP = ref(false);
const countdown = ref(0);
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  countdown.value = 60;
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownInterval!);
      countdownInterval = null;
    }
  }, 1000);
};

const sendCodeAsync = async (sendType: string) => {
  try {
    if (sendType === "new") isSending.value = true;
    if (sendType === "resend") {
      if (isLoadingResendOTP.value || countdown.value > 0) return;
      isLoadingResendOTP.value = true;
    }

    const res = await requestResetPassword(props.id, "email");
    if (res && res.statusCode === 200) {
      startCountdown();
      if (sendType === "new") {
        isSent.value = true;

        return toast.add({
          severity: "success",
          summary: `${props.type.toUpperCase()} SENT!`,
          detail: `An OTP was sent to ${props.id}`,
          life: 3000,
        });
      }

      return toast.add({
        severity: "success",
        summary: `${props.type.toUpperCase()} SENT!`,
        detail: `A new OTP was sent to ${props.id}`,
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (sendType === "new") return (isSending.value = false);
    isLoadingResendOTP.value = false;
  }
};

const confirmCodeAsync = async () => {
  if (!code.value || code.value.length < 6)
    return toast.add({
      severity: "info",
      summary: `INFO`,
      detail: `Input a valid OTP.`,
      life: 3000,
    });
  isVerifying.value = true;

  const id = props.id;
  const res = await confirmVerificationOtp(code.value, id, "resetpassword");
  if (res.ok) {
    emit("done", props.id);
    toast.add({
      severity: "success",
      summary: `SUCCESS`,
      detail: `OTP Validated.`,
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: `ERROR`,
      detail: `OTP Error.`,
      life: 3000,
    });
  }

  isVerifying.value = false;
};
</script>

<style scoped>
label {
  font-weight: 400;
  color: gray;
  font-size: 90%;
}
</style>
