<template>
    <div
        class="antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide">
        <div class="max-w-520px text-center">
            <h1 class="font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]">
                {{ error.statusCode }}
            </h1>
            <h2 class="font-semibold mb-2 sm:text-3xl text-2xl">{{ error.statusMessage || 'An error occured.' }}</h2>
            <p class="mb-4 px-2 text-[#64748B] text-md">{{ error.statusMessage || 'An error occured.' }}</p>
            <div class="flex items-center justify-center w-full">
                <a @click="handleError" class="font-medium hover:text-[#00DC82] text-sm underline underline-offset-3">Go
                    back home</a>
            </div>
        </div>
    </div>
</template>

<script setup>
const error = useError();

const handleError = () => {
    clearError({
        redirect: '/',
    });
};
</script>