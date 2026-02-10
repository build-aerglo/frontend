<template>
  <!-- <div>
    <input type="file" @change="upload" />
    <img v-if="imageUrl" :src="imageUrl" class="w-48 mt-4" />
  </div>

  <div>
    <form @submit.prevent="deleteUrl">
      <input v-model="delUrl" />
      <button>Submit</button>
    </form>
  </div>

  <Button @click="createAnn">Create</Button> -->
  <div class="w-full flex justify-center items-center bg-[#F0FDF4] py-[20px]">
    <div
      class="w-[70%] rounded-[10px] flex flex-col gap-2.5 bg-[white] p-[30px]"
    >
      <div>
        <div class="text-[200%] font-bold mb-[20px]">
          <img
            src="https://aerglo-frontend-ify.vercel.app/_nuxt/e-user-logo.BUyXYbhk.png"
            alt="LOGO"
            class="w-[96px] h-[40px] object-contain"
          />
        </div>
      </div>
      <div class="text-center text-[150%] font-bold mb-[20px] text-[#008253]">
        Password Reset OTP
      </div>
      <div>Hi there,</div>
      <div>
        A one time authentication code was requested on your account. If that
        was you, enter this code:
      </div>
      <div
        class="flex justify-center items-center text-[150%] font-bold tracking-[10px] my-[20px]"
      >
        111111
      </div>
      <div>
        The OTP is valid for one hour.<br />
        Do not share this code with others.
      </div>
      <div class="mt-[20px]">
        Regards,<br />
        Clereview.
      </div>
      <hr />
      <div class="text-[90%] border-l-[5px] border-[#008253] pl-[10px]">
        This code was generated on
        <a href="https://clereview.com/" class="text-[#008253]"
          >https://clereview.com</a
        >
        for password reset, if you did not initiate this request, you can safely
        ignore this mail or contact
        <a href="mailto:support@cleriew.com" class="text-[#008253]"
          >support@cleriew.com</a
        >
        if you suspect suspicious activities on your account.
      </div>
      <hr />
      <div class="text-[80%] text-center">&copy; Clereview - 2025</div>
    </div>
  </div>

  old: {{ password }}<br />
  new: {{ password_2 }}
</template>

<script setup>
import useAnnouncementMethods from "~/composables/announcements/useAnnouncementMethods";

const { createAnnouncement } = useAnnouncementMethods();

const password = computed(async () => {
  const res = await encryptPasswordNative("Test2000$");
  console.log("password: ", res);
  if (res) return res;
});

const password_2 = computed(async () => {
  const res = await encryptPasswordNative("Test1000$");
  console.log("password 2: ", res);
  if (res) return res;
});
const createAnn = () => {
  createAnnouncement({
    id: "test",
    description: "Complete the next steps to launch your website",
    header: "Complete your onboarding",
    url: "/business/validate/",
    urlLabel: "Verify Business Details",
    isClosable: false,
    hasLink: true,
    percentageComplete: 60,
  });
};
import { ref } from "vue";

const path = ref("tests");
const imageUrl = ref("");

const delUrl = ref("");

const upload = async (e) => {
  const file = e.target.files[0];
  const form = new FormData();

  form.append("file", file);
  form.append("path", path.value);

  const res = await $fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  imageUrl.value = res.url;
};

const deleteUrl = async () => {
  const res = await $fetch("/api/delete", {
    method: "GET",
    query: {
      url: delUrl.value,
    },
  });

  console.log(res);
};
</script>
