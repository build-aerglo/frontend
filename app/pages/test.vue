<template>
    <div>
        <input type="file" @change="upload" />
        <img v-if="imageUrl" :src="imageUrl" class="w-48 mt-4" />
    </div>

    <div>
        <form @submit.prevent="deleteUrl">
            <input v-model="delUrl" />
            <button>Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const path = ref("tests");
const imageUrl = ref("");

const delUrl = ref('')

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
