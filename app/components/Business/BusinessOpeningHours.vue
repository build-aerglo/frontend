<!-- terrible code -- ignore -->
<template>
    <div>
        <div v-if="businessData?.openingHours" class="w-full mt-[20px]">
            <div v-if="businessData?.openingHours.same" class="flex flex-col gap-[10px] w-full mt-[20px]">
                <div class="flex justify-between items-center" v-for="day in weekdays" :key="day">
                    <div class="capitalize">{{ truncateDate(day) }}:</div>
                    <div v-if="businessData?.openingHours.same_time.closed"> Closed </div>
                    <div v-else>{{ `${timeFormat(businessData?.openingHours.same_time.open)} -
                        ${timeFormat(businessData?.openingHours.same_time.close)}` }}
                    </div>
                </div>
                <div class="flex justify-between items-center" v-for="day in weekends" :key="day">
                    <div class="capitalize">{{ truncateDate(day) }}:</div>
                    <div v-if="businessData?.openingHours[day].closed"> Closed </div>
                    <div v-else>{{ `${timeFormat(businessData?.openingHours[day].open)} -
                        ${timeFormat(businessData?.openingHours[day].close)}` }}</div>
                </div>
            </div>
            <div v-else class="flex flex-col gap-[10px] w-full mt-[20px]">
                <div class="flex justify-between items-center" v-for="day in allDays" :key="day">
                    <div class="capitalize">{{ truncateDate(day) }}:</div>
                    <div v-if="businessData?.openingHours[day].closed"> Closed </div>
                    <div v-else>{{ `${timeFormat(businessData?.openingHours[day].open)} -
                        ${timeFormat(businessData?.openingHours[day].close)}` }}</div>
                </div>
            </div>
        </div>
        <div v-else></div>
    </div>
</template>

<script setup lang="ts">
import type { BusinessProfileResponse } from '~/types/business';

const props = defineProps(['business', 'toEdit']);
const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
]
const weekends = [
    'saturday', 'sunday'
]
const allDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
]

const businessData = ref<BusinessProfileResponse>()
onBeforeMount(() => {
    if (props.business) {
        businessData.value = props.business;
        // //@ts-ignore
        // businessData.value.openingHours = {
        //     "same_time": {
        //         "open": "2025-03-20T09:00:00.918Z",
        //         "close": "2025-03-20T21:00:00.451Z",
        //         "closed": false
        //     },
        //     "monday": {
        //         "open": null,
        //         "close": null,
        //         "closed": true
        //     },
        //     "tuesday": {
        //         "open": null,
        //         "close": null,
        //         "closed": true
        //     },
        //     "wednesday": {
        //         "open": null,
        //         "close": null,
        //         "closed": true
        //     },
        //     "thursday": {
        //         "open": null,
        //         "close": null,
        //         "closed": true
        //     },
        //     "friday": {
        //         "open": null,
        //         "close": null,
        //         "closed": true
        //     },
        //     "saturday": {
        //         "open": null,
        //         "close": null,
        //         "closed": true
        //     },
        //     "sunday": {
        //         "open": null,
        //         "close": null,
        //         "closed": true
        //     },
        //     "same": true
        // }
    }
})
</script>