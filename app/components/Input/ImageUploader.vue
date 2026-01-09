<template>
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ label }} <span v-if="max">(max {{ max }})</span>
        </label>

        <input ref="fileInput" type="file" multiple accept="image/*" @change="handleUpload"
            class="text-sm text-gray-600" :disabled="isUploading || images.length >= max" />

        <div class="flex mt-2 gap-2 flex-wrap">
            <div v-for="(img, index) in images" :key="index"
                class="relative w-20 h-20 rounded-lg overflow-hidden border">
                <img :src="img" class="object-cover w-full h-full" />
                <i class="pi pi-times absolute top-1 right-1 bg-white rounded-full p-1 text-xs cursor-pointer hover:bg-gray-100"
                    @click="removeImage(index)"></i>
            </div>

            <div v-if="isUploading" class="w-20 h-20 rounded-lg border flex items-center justify-center bg-gray-50">
                <i class="pi pi-spin pi-spinner text-gray-400"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    label: { type: String, default: 'Add Images' },
    max: { type: Number, default: 3 },
    path: { type: String, required: true },
    modelValue: { type: Array as PropType<string[]>, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null)
const images = ref<string[]>([...props.modelValue])
const isUploading = ref(false)

const handleUpload = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files) return

    const remaining = props.max - images.value.length
    if (remaining <= 0) {
        alert(`Maximum ${props.max} images allowed`)
        return
    }

    const filesToUpload = Array.from(files).slice(0, remaining)

    isUploading.value = true

    for (const file of filesToUpload) {
        try {
            const form = new FormData()
            form.append('file', file)
            form.append('path', props.path)

            const res = await $fetch('/api/upload', {
                method: 'POST',
                body: form
            })

            if (res && 'url' in res && res.url) {
                images.value.push(res.url)
            } else {
                console.error('Upload failed:', res)
                alert('Failed to upload image')
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Failed to upload image')
        }
    }

    isUploading.value = false
    emit('update:modelValue', images.value)

    if (fileInput.value) fileInput.value.value = ''
}

const removeImage = async (index: number) => {
    const url = images.value[index]

    try {
        await $fetch('/api/delete', {
            method: 'GET',
            query: { url }
        })

        images.value.splice(index, 1)
        emit('update:modelValue', images.value)
    } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete image')
    }
}

watch(() => props.modelValue, (newVal) => {
    images.value = [...newVal]
})
</script>