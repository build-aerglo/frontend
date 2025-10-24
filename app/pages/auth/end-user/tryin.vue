<template>
    <div>
        <div class="relative w-full">
        <InputTextCustom
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password:"
            placeholder="Enter your password"
            inputClass="border border-light-300 hover:border-light-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none rounded-md p-2 w-full transition"
        />
        <i
            :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
            class="absolute right-3 top-9 cursor-pointer text-gray-500"
            @click="showPassword = !showPassword"
        ></i>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'

const password = ref('')
const showPassword = ref(false)
</script>


