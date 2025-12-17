<template>
    <div>
        <VirtualScroller :items="items" :itemSize="50" showLoader :delay="250"
            class="border border-surface-200 dark:border-surface-700 rounded" style="height: max-content">
            <template v-slot:item="{ item, options }">
                <div :class="['flex items-center p-2', { 'bg-surface-100 dark:bg-surface-700': options.odd }]"
                    style="height: 50px">{{ item }}</div>
            </template>
            <template v-slot:loader="{ options }">
                <div :class="['flex items-center p-2', { 'bg-surface-100 dark:bg-surface-700': options.odd }]"
                    style="height: 50px">
                    <Skeleton :width="options.even ? '60%' : '50%'" height="1.3rem" />
                </div>
            </template>
        </VirtualScroller>
    </div>
</template>

<script setup>
const items = ref(Array.from({ length: 100000 }).map((_, i) => `Item #${i}`));
</script>
