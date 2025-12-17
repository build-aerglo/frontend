<!-- terrible code -- ignore -->
<template>
    <div v-if="!toEdit">
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
    <div v-else>
        <div v-if="businessData">
            <div class="flex gap-[20px] justify-between items-center mb-[30px]">
                <h1 class="font-bold text-[120%]">Opening Hours:</h1>
                <div class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="businessData.openingHours.same" inputId="gen" name="time" :value="true" />
                        <label for="gen">General Time For All Days</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="businessData.openingHours.same" inputId="spec" name="time"
                            :value="false" />
                        <label for="spec">Specific Time Per Day</label>
                    </div>
                </div>
            </div>
            <div v-if="businessData?.openingHours.same" class="flex flex-col gap-[10px]">
                <div class="flex justify-between items-start gap-[20px]">
                    <div class="flex items-center gap-[20px]">
                        Mondays - Fridays
                        <div class="flex items-center gap-[5px]">
                            (
                            <Checkbox v-model="businessData.openingHours.same_time.closed"
                                inputId="same_closed_mon_to_fri" name="same_closed_mon_to_fri" :binary="true" />
                            <label for="same_closed_mon_to_fri" class="ml-[5px]">Closed</label>
                            )
                        </div>
                    </div>
                    <div v-if="businessData?.openingHours.same_time.closed !== true">
                        <div class="flex gap-[10px] items-end">
                            <div>
                                <label class="label">Opens:</label>
                                <DatePicker id="datepicker-timeonly" hourFormat="12"
                                    v-model="businessData.openingHours.same_time.open" timeOnly fluid />
                            </div>
                            <div>
                                <label class="label">Closes:</label>
                                <DatePicker id="datepicker-timeonly" hourFormat="12"
                                    v-model="businessData.openingHours.same_time.close" timeOnly fluid />
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        Closed on Mondays to Fridays!
                    </div>
                </div>
                <!-- weekend -->
                <div class="flex justify-between items-start gap-[20px]" v-for="item in weekends" :key="genRand()">
                    <div class="flex items-center gap-[20px]">
                        <div class="capitalize">{{ item }}</div>
                        <div class="flex items-center gap-[5px]">
                            (
                            <Checkbox v-model="businessData.openingHours[item].closed" :name="item" :binary="true" />
                            <label :for="item" class="ml-[5px]">Closed</label>
                            )
                        </div>
                    </div>
                    <div v-if="businessData?.openingHours[item].closed !== true">
                        <div class="flex gap-[10px] items-end">
                            <div>
                                <label class="label">Opens:</label>
                                <DatePicker hourFormat="12" v-model="businessData.openingHours[item].open" timeOnly
                                    fluid />
                            </div>
                            <div>
                                <label class="label">Closes:</label>
                                <DatePicker hourFormat="12" v-model="businessData.openingHours[item].close" timeOnly
                                    fluid />
                            </div>
                        </div>
                    </div>
                    <div v-else class="capitalize">
                        Closed on {{ item }}!
                    </div>
                </div>
            </div>
            <div v-else class="flex flex-col gap-[10px]">
                <div class="flex justify-between items-start gap-[20px]" v-for="item in allDays" :key="genRand()">
                    <div class="flex items-center gap-[20px]">
                        <div class="capitalize">{{ item }}</div>
                        <div class="flex items-center gap-[5px]">
                            (
                            <Checkbox v-model="businessData.openingHours[item].closed" :name="item" :binary="true"
                                :inputId="item" />
                            <label :for="item" class="ml-[5px]">Closed</label>
                            )
                        </div>
                    </div>
                    <div v-if="businessData?.openingHours[item].closed !== true">
                        <div class="flex gap-[10px] items-end">
                            <div>
                                <label class="label">Opens:</label>
                                <DatePicker hourFormat="12" v-model="businessData.openingHours[item].open" timeOnly
                                    fluid />
                            </div>
                            <div>
                                <label class="label">Closes:</label>
                                <DatePicker hourFormat="12" v-model="businessData.openingHours[item].close" timeOnly
                                    fluid />
                            </div>
                        </div>
                    </div>
                    <div v-else class="capitalize">
                        Closed on {{ item }}!
                    </div>
                </div>
            </div>
        </div>
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
        //@ts-ignore
        businessData.value.openingHours = {
            "same_time": {
                "open": "2025-03-20T09:00:00.918Z",
                "close": "2025-03-20T21:00:00.451Z",
                "closed": false
            },
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
            "same": true
        }
    }
})
</script>