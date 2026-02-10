<template>
  <Toast />
  <div
    class="bg-[#F0FDF4] min-h-screen p-[20px] flex justify-center items-start"
  >
    <div
      class="sm:mt-[100px] mt-[20px] border bg-white shadow-md rounded-[5px] p-[30px] w-full sm:w-[50%]"
    >
      <component
        :is="currentComponent"
        @done="goNext"
        :id="user_id"
        type="email"
        :redirect="redirect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Email from "./Email.vue";
import OTP from "./OTP.vue";
import Password from "./NewPassword.vue";

const stage = ref("email");
const user_id = ref("");

defineProps(["redirect"]);

const currentComponent = computed(() => {
  switch (stage.value) {
    case "email":
      return Email;
    case "otp":
      return OTP;
    case "password":
      return Password;
    default:
      return Email;
  }
});

const goNext = (id?: string) => {
  if (id) user_id.value = id;

  if (stage.value === "email") stage.value = "otp";
  else if (stage.value === "otp") stage.value = "password";
  else if (stage.value === "password") return;
};
</script>
