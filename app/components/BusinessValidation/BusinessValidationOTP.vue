<template>
  <Dialog
    v-model:visible="show"
    :draggable="false"
    modal
    :header="!isSent ? 'Initiate Verification' : `Verify OTP`"
    :style="{ width: '30rem' }"
  >
    <div>
      <div v-if="!isSent">
        <div class="mb-2.5">A one time code would be sent to "{{ id }}".</div>
        <Button
          :loading="isSending"
          label="Send confirmation code"
          @click="sendCodeAsync('new')"
          fluid
        />
      </div>
      <div v-else>
        <div class="flex justify-center items-center">
          <InputOtp v-model="otp" size="large" :length="6" fluid />
        </div>
        <div>
          <div class="text-center mt-2.5" v-if="isLoadingResendOTP">
            <span class="mb-[1px] text-[90%] !text-primary flex gap-[5px]">
              <i class="pi pi-spinner pi-spin text-[90%]"></i> Resending...
            </span>
          </div>
          <div class="text-center mt-2.5" v-else>
            <span
              v-if="countdown > 0"
              class="mb-[1px] text-[90%] !text-primary"
            >
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
        <div class="mt-6">
          <Button
            @click="confirmCodeAsync"
            :loading="isVerifying"
            :label="`Verify ${type === 'email' ? 'email address' : 'phone number'}`"
            fluid
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import useVerificationMethods from "~/composables/verification/useVerificationMethods";

const { sendVerificationOtp, confirmVerificationOtp } =
  useVerificationMethods();
const otp = ref();
const props = defineProps(["id", "type"]);
const emit = defineEmits(["done", "close"]);
const show = ref(true);

const toast = useToast();
const isLoadingResendOTP = ref(false);
const isSending = ref(false);
const isSent = ref(false);
const isVerifying = ref(false);
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

    const type = props.type;
    const id = props.id;

    const typeResponse = type === "phone" ? "sms" : type;

    const res = await sendVerificationOtp(
      type,
      id,
      `${typeResponse}verification`,
    );
    if (res.statusCode === 200) {
      startCountdown();
      if (sendType === "new") {
        isSent.value = true;

        return toast.add({
          severity: "success",
          summary: `${typeResponse.toUpperCase()} SENT!`,
          detail: `An OTP was sent to ${id}`,
          life: 3000,
        });
      }

      return toast.add({
        severity: "success",
        summary: `${typeResponse.toUpperCase()} SENT!`,
        detail: `A new OTP was sent to ${id}`,
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
  if (!otp.value || otp.value.length !== 6) {
    return toast.add({
      severity: "error",
      summary: `ERROR`,
      detail: `Please provide a valid OTP.`,
      life: 3000,
    });
  }
  try {
    isVerifying.value = true;
    const id = props.id;

    const purpose = props.type === "email" ? "email" : "sms";

    const res = await confirmVerificationOtp(otp.value, id, purpose);
    if (res.statusCode === 200) {
      emit("done", props.type);
      return toast.add({
        severity: "success",
        summary: `SUCCESS`,
        detail: `Verification Successful.`,
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isVerifying.value = false;
  }
};

watch(show, async () => {
  if (!show.value) emit("close");
});
</script>
