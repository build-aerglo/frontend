<template>
  <div>
    <form @submit.prevent="sendOtp">
      <div class="text-[150%] font-bold">Reset Password</div>
      <div class="mb-[50px] text-[90%] text-[gray]">
        Enter your CleReview registered email address below.
      </div>
      <div>
        <label>Email Address:</label>
        <InputText
          required
          fluid
          class="flex-auto"
          autocomplete="off"
          v-model="email"
          type="email"
        />
      </div>
      <div class="mt-[20px]">
        <Button
          type="submit"
          fluid
          :loading="isSending"
          :label="
            isSending
              ? 'Sending verification code...'
              : 'Send verification code'
          "
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
const { requestResetPassword } = useMethods();
const email = ref("");
const isSending = ref(false);
const toast = useToast();

const emit = defineEmits(["done"]);

const sendOtp = async () => {
  if (!email.value) return;

  isSending.value = true;

  const res = await requestResetPassword(email.value, "email");

  if (res.ok) {
    emit("done", email.value);
  } else {
    toast.add({
      severity: "error",
      summary: `ERROR`,
      detail: `${res.data?.message === "Id does not exist" ? "Email address not registered on Clereview." : "An error occured"}`,
      life: 3000,
    });
  }

  isSending.value = false;
};
</script>

<style scoped>
label {
  font-weight: 400;
  color: gray;
  font-size: 90%;
}
</style>
