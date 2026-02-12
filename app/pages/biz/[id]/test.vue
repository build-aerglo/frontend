<template>
  <div>
    <VirtualScroller
      :items="items"
      :itemSize="50"
      showLoader
      :delay="250"
      class="border border-surface-200 dark:border-surface-700 rounded"
      style="height: max-content"
    >
      <template v-slot:item="{ item, options }">
        <div
          :class="[
            'flex items-center p-2',
            { 'bg-surface-100 dark:bg-surface-700': options.odd },
          ]"
          style="height: 50px"
        >
          {{ item }}
        </div>
      </template>
      <template v-slot:loader="{ options }">
        <div
          :class="[
            'flex items-center p-2',
            { 'bg-surface-100 dark:bg-surface-700': options.odd },
          ]"
          style="height: 50px"
        >
          <Skeleton :width="options.even ? '60%' : '50%'" height="1.3rem" />
        </div>
      </template>
    </VirtualScroller>
    {{ normalizedToRaw(hors) }}
    {{
      rawToNormalized({
        monday: "09:00 - 21:00",
        tuesday: "09:00 - 21:00",
        wednesday: "09:00 - 21:00",
        thursday: "09:00 - 21:00",
        friday: "09:00 - 21:00",
        saturday: "00:00 - 00:00",
        sunday: "00:00 - 00:00",
      })
    }}

    <input v-model="id" />
    <Button @click="setId(id)">Set ID</Button>>
  </div>
</template>

<script setup lang="ts">
import useBusinessUser from "~/composables/business/useBusinessUser";

const items = ref(Array.from({ length: 100000 }).map((_, i) => `Item #${i}`));
// import useBusinessUser from ''
// const store = useBusinessUser();
const store = useBusinessUser();
const id = ref("");
const hours = {
  monday: {
    open: null,
    close: null,
    closed: true,
  },
  same_time: {
    open: "2025-03-20T09:00:00.918Z",
    close: "2025-03-20T21:00:00.451Z",
    closed: false,
  },
  tuesday: {
    open: null,
    close: null,
    closed: true,
  },
  wednesday: {
    open: null,
    close: null,
    closed: true,
  },
  thursday: {
    open: null,
    close: null,
    closed: true,
  },
  friday: {
    open: null,
    close: null,
    closed: true,
  },
  saturday: {
    open: null,
    close: null,
    closed: true,
  },
  sunday: {
    open: null,
    close: null,
    closed: true,
  },
  same: true,
};
const hors = {
  monday: {
    open: null,
    close: null,
    closed: true,
  },
  tuesday: {
    open: null,
    close: null,
    closed: true,
  },
  wednesday: {
    open: null,
    close: null,
    closed: true,
  },
  thursday: {
    open: null,
    close: null,
    closed: true,
  },
  friday: {
    open: null,
    close: null,
    closed: true,
  },
  saturday: {
    open: null,
    close: null,
    closed: true,
  },
  sunday: {
    open: null,
    close: null,
    closed: true,
  },
  same_time: {
    open: "2025-12-26T09:00:00.000Z",
    close: "2025-12-26T21:00:00.000Z",
    closed: false,
  },
  same: true,
};

const setId = (id: string) => {
  if (!id) return;
  store.setId(id);
  console.log("new store: ", store.getUser().user);
};
</script>
