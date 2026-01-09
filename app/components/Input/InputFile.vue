<template>
  <div v-if="image.url">
    <label>{{ label }}</label>
    <div class="flex justify-between items-center gap-2.5">
      <div class="flex-1" v-if="isDeleting">Deleting Uploaded File...</div>
      <div class="flex-1" v-else>{{ fileData.name }}</div>
      <Button
        icon="pi pi-trash"
        @click="deleteUrl"
        :loading="isDeleting"
      ></Button>
    </div>
  </div>
  <div v-else>
    <label>{{ label }}</label>
    <div class="flex justify-between items-center gap-2.5">
      <div class="flex-1" v-if="isLoading">Uploading File...</div>
      <div class="flex-1" v-else>Select File ({{ acceptDescription }})</div>
      <Button
        icon="pi pi-plus"
        @click="triggerFileInput"
        :loading="isLoading"
      ></Button>
    </div>

    <input
      ref="fileInput"
      type="file"
      :accept="accept ?? 'image/*'"
      class="hidden"
      @change="upload"
    />
  </div>
</template>

<script setup>
const props = defineProps([
  "path",
  "url",
  "label",
  "accept",
  "acceptDescription",
  "id",
]);
const emit = defineEmits(["uploaded", "deleted"]);

const image = ref({
  path: "",
  url: "",
});

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

onBeforeMount(() => {
  if (props.path) image.value.path = props.path;
  if (props.url) image.value.url = props.url;
});

const isLoading = ref(false);
const isDeleting = ref(false);
const fileData = ref();

const upload = async (e) => {
  const file = e?.target?.files[0];
  fileData.value = file;
  const form = new FormData();

  form.append("file", file);
  form.append("path", props.path);

  try {
    isLoading.value = true;
    const res = await $fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    image.value.url = res.url;
    return emit("uploaded", res.url, props.id);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const deleteUrl = async () => {
  try {
    isDeleting.value = true;
    await $fetch("/api/delete", {
      method: "GET",
      query: {
        url: image.value.url,
      },
    });
    image.value.url = null;
    return emit("deleted", props.id);
  } catch (error) {
    console.log(error);
  } finally {
    isDeleting.value = false;
  }
};
</script>
