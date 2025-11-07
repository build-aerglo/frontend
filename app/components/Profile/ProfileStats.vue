<template>
  <div class="grid grid-cols-1 md:grid-cols-5 gap-3 h-[800px]">
    <div class="card md:col-span-2 flex flex-col items-start justify-start p-3">
      <p class="text-contrast text[100%]">STATS</p>
    </div>
    <div class="card md:col-span-3 flex flex-col items-start justify-start p-3">
      <p class="text-contrast text[100%]">REVIEW SUMMARY</p>
    </div>
  </div>
  <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"> 
    <div 
      class="card flex flex-col items-start justify-start p-3"
      v-for="review in reviews" 
      :key="review.id"
    >
      <p class="text-contrast text-[110%]">{{ review.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const reviews = [
  {id: '1', name: 'Review One'},
  {id: '2', name: 'Review Two'},
  {id: '3', name: 'Review Three'},
  {id: '4', name: 'Review Four'},
  {id: '5', name: 'Review Five'},
  {id: '6', name: 'Review Six'}
]
</script>

<style scoped>

</style>