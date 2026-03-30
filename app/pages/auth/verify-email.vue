<template>
  <div class="flex justify-center items-center flex-col h-screen">
    <Card class="p-[20px] sm:min-w-[300px]">
      <template #content>
        <div
          v-if="isVerified"
          class="flex justify-center items-center flex-col"
        >
          <i class="pi pi-check text-[green] !text-[600%]"></i>
          <div class="mt-[10px] text-[150%] font-bold">Succesful!</div>
          <div>Email address validated</div>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center flex-col">
          <i class="pi pi-spin pi-spinner-dotted !text-[600%]"></i>
          <div class="mt-[10px]">Validating email address...</div>
        </div>

        <div v-if="isError" class="flex justify-center items-center flex-col">
          <i class="pi pi-info-circle !text-[600%]"></i>
          <div class="mt-[10px] text-[150%] font-bold">An error occured!</div>
          <div class="mb-[20px]">{{ errorMessge }}</div>
          <NuxtLink to="/">
            <ButtonCustom
              :no-zoom="true"
              label="Back Home"
              input-class="!px-[20px]"
              primary="true"
              size="lg"
            />
          </NuxtLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { verifyEmail } = useMethods();
const toast = useToast();

const isLoading = ref(true);
const isVerified = ref(false);
const isError = ref(false);
const errorMessge = ref("An error occured");

const token = ref("");
const email = ref("");
const type = ref("");

const verifyEmailAsync = async () => {
  try {
    const res = await verifyEmail(email.value, token.value);

    isLoading.value = false;

    if (res.statusCode === 200) {
      toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: `Email Validated Sucessfully!`,
        life: 3000,
      });

      isVerified.value = true;
      const redir_to = type.value === "user" ? "/" : "/business/auth/sign-in";

      return setTimeout(() => {
        navigateTo(redir_to);
      }, 2000);
    }

    isError.value = true;
    errorMessge.value = res.error?.message ?? "An error occured";
    toast.add({
      severity: "error",
      summary: "ERROR",
      detail: res.error?.message ?? "An error occured.",
      life: 3000,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (route.query.e && route.query.token && route.query.type) {
    token.value = decodeQueryParam(route.query.token as string);
    email.value = decodeQueryParam(route.query.e as string);
    type.value = decodeQueryParam(route.query.type as string);

    await verifyEmailAsync();
  }
});

function decodeQueryParam(param: string): string {
  if (!param) return "";

  return decodeURIComponent(param);
}

onBeforeMount(() => {
  if (!route.query.e || !route.query.token || !route.query.type) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found",
      fatal: true,
    });
  }
});
</script>
