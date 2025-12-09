<template>
    <div>
        <input type="file" @change="upload" />
        <img v-if="imageUrl" :src="imageUrl" class="w-48 mt-4" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const path = ref("tests");
const imageUrl = ref("");

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
</script>
