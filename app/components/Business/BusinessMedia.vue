<template>
    <div v-if="image.url" class="relative h-[210px] w-[210px]">
        <div
            class="shadow-md bg-white rounded-full w-[40px] h-[40px] flex justify-center items-center p-[5px] cursor-pointer absolute top-[10px] right-[10px] z-[1000]">
            <i @click="deleteUrl" :class="`${isDeleting ? 'pi pi-spin pi-spinner' : 'pi pi-trash'}  text-[red]`"></i>
        </div>
        <!-- bg-white rounded-full w-[40px] h-[40px] flex justify-center items-center -->
        <img :src="image.url" class="object-cover object-center rounded-[5px] h-full w-full" />
    </div>
    <div v-else>
        <div @click="triggerFileInput"
            class="rounded-[5px] shadow-lg h-[210px] w-[210px] flex flex-col justify-center items-center"
            :class="isLoading ? 'bg-[#f3f0ec] cursor-not-allowed' : 'bg-white cursor-pointer'">
            <i :class="`${isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-image'}`"></i>
            Select Image
        </div>

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="upload" />
    </div>
</template>

<script setup>
const props = defineProps(['path', 'url'])
const emit = defineEmits(['uploaded', 'deleted'])

const image = ref({
    path: '',
    url: ''
})

const fileInput = ref(null);

const triggerFileInput = () => {
    fileInput.value?.click();
};

onBeforeMount(() => {
    if (props.path) image.value.path = props.path
    if (props.url) image.value.url = props.url;
})

const isLoading = ref(false);
const isDeleting = ref(false);

const upload = async (e) => {
    const file = e?.target?.files[0];
    const form = new FormData();

    form.append("file", file);
    form.append("path", props.path);

    try {
        isLoading.value = true
        const res = await $fetch("/api/upload", {
            method: "POST",
            body: form,
        });

        image.value.url = res.url;
        return emit('uploaded', res.url)
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false
    }
};

const deleteUrl = async () => {
    try {
        isDeleting.value = true
        await $fetch("/api/delete", {
            method: "GET",
            query: {
                url: image.value.url,
            },
        });
        return emit('deleted', image.value.url)
    } catch (error) {
        console.log(error)
    } finally {
        isDeleting.value = false
    }
};
</script>
