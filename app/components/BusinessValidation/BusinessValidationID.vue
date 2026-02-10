<template>
  <Dialog
    v-model:visible="show"
    :draggable="false"
    modal
    header="Verify Business Identity"
    :style="{ width: '50rem' }"
  >
    <form @submit.prevent="verifyIdAsync(identity)">
      <div class="grid gap-[20px] grid-cols-1 sm:grid-cols-2">
        <div
          :class="selectedMode.requiresIdNumber ? 'col-span-1' : 'col-span-2'"
        >
          <label>Identification type:</label>
          <Select
            v-model="selectedMode"
            :options="idVerificationTypes"
            optionLabel="name"
            fluid
          />
        </div>

        <div v-if="selectedMode.requiresIdNumber">
          <label
            >Identification number
            {{ selectedMode.code === "other" ? "(optional)" : "" }}:</label
          >
          <InputText v-model="identity.id" fluid />
        </div>

        <div v-if="selectedMode.code === 'other'" class="col-span-2">
          <label>Identification name:</label>
          <InputText v-model="identity.name" fluid />
        </div>
        <div class="col-span-2">
          <InputFile
            accept-description="image / pdf"
            accept="image/*,.pdf"
            label="Upload Identity Document:"
            path="business_identity"
            @uploaded="setUpload"
            @deleted="setDeleted"
            :id="selectedMode.code"
            :edit-label="true"
          />
        </div>
      </div>
      <div class="mt-6">
        <Button type="submit" label="Upload Business Identity" fluid />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import useVerificationMethods from "~/composables/verification/useVerificationMethods";

const { verifyId } = useVerificationMethods();
interface IDRequest {
  id: string;
  url: string;
  type: string;
  name?: string;
}

const emit = defineEmits(["done", "close"]);
const show = ref(true);

const toast = useToast();
const identity = ref<IDRequest>({
  type: "cac",
  id: "",
  url: "",
  name: "",
});

const selectedMode = ref({
  code: "cac_certificate",
  name: "CAC Certificate",
  requiresIdNumber: true,
});

const setUpload = (url: string, id: string) => {
  identity.value.url = url;
};

const setDeleted = (url: string, id: string) => {
  identity.value.url = "";
};

watch(show, async () => {
  if (!show.value) emit("close");
});

const verifyIdAsync = async (data: IDRequest) => {
  if (!data.id || !data.url) {
    return toast.add({
      severity: "error",
      summary: `ERROR`,
      detail: `Missing ID parameters.`,
      life: 3000,
    });
  }
  try {
    if (data.type !== "other") data.name = selectedMode.value.name;
    data.type = selectedMode.value.code;

    const res = await verifyId(data);
    if (res.statusCode === 200) {
      emit("done");
      return toast.add({
        severity: "success",
        summary: `UPLOADED!`,
        detail: `ID verification in progress.`,
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
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
