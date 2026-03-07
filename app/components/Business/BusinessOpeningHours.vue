<!-- terrible code -- ignore -->
<template>
  <div>
    <div v-if="openingHours" class="w-full mt-[20px]">
      <div
        v-if="openingHours.same"
        class="flex flex-col gap-[10px] w-full mt-[20px]"
      >
        <div
          class="flex justify-between items-center"
          v-for="day in weekdays"
          :key="day"
        >
          <div class="capitalize">{{ truncateDate(day) }}:</div>
          <div v-if="openingHours.same_time.closed">Closed</div>
          <div v-else>
            {{
              `${timeFormat(openingHours.same_time.open)} -
                        ${timeFormat(openingHours.same_time.close)}`
            }}
          </div>
        </div>
        <div
          class="flex justify-between items-center"
          v-for="day in weekends"
          :key="day"
        >
          <div class="capitalize">{{ truncateDate(day) }}:</div>
          <div v-if="openingHours[day].closed">Closed</div>
          <div v-else>
            {{
              `${timeFormat(openingHours[day].open)} -
                        ${timeFormat(openingHours[day].close)}`
            }}
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col gap-[10px] w-full mt-[20px]">
        <div
          class="flex justify-between items-center"
          v-for="day in allDays"
          :key="day"
        >
          <div class="capitalize">{{ truncateDate(day) }}:</div>
          <div v-if="openingHours[day].closed">Closed</div>
          <div v-else>
            {{
              `${timeFormat(openingHours[day].open)} -
                        ${timeFormat(openingHours[day].close)}`
            }}
          </div>
        </div>
      </div>
    </div>
    <div v-else></div>
  </div>
</template>

<script setup lang="ts">
import type { BusinessProfileResponse } from "~/types/business";

const props = defineProps(["openingHours"]);
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const weekends = ["saturday", "sunday"];
const allDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
</script>
