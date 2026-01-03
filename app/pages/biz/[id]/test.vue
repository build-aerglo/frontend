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
        {{ normalizedToRaw(hors) }}
        {{ rawToNormalized({
            "monday": "09:00 - 21:00", "tuesday": "09:00 - 21:00", "wednesday": "09:00 - 21:00",
            "thursday":
                "09:00 - 21:00", "friday": "09:00 - 21:00", "saturday": "00:00 - 00:00", "sunday": "00:00 - 00:00"
        }) }}
    </div>
</template>

<script setup>
const items = ref(Array.from({ length: 100000 }).map((_, i) => `Item #${i}`));
const hours = {
    "monday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "same_time": {
        "open": "2025-03-20T09:00:00.918Z",
        "close": "2025-03-20T21:00:00.451Z",
        "closed": false
    },
    "tuesday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "wednesday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "thursday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "friday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "saturday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "sunday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "same": true
}
const hors = {
    "monday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "tuesday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "wednesday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "thursday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "friday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "saturday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "sunday": {
        "open": null,
        "close": null,
        "closed": true
    },
    "same_time": {
        "open": "2025-12-26T09:00:00.000Z",
        "close": "2025-12-26T21:00:00.000Z",
        "closed": false
    },
    "same": true
}
</script>
