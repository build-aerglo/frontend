<template>
  <div>
    <!-- landing -->
    <div
      class="section py-[50px] ..!bg-primary text-white"
      style="
        background:
          linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), #008253;
      "
    >
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-[20px]">
        <div class="flex justify-center flex-col">
          <span
            class="border-l-[7px] border-l-gold pl-2.5 text-gold mb-2.5 font-bold"
          >
            CLEREVIEW
          </span>
          <div class="text-5xl font-bold">
            Build real trust with real customers experience
          </div>
          <div class="text-[120%] sm:max-w-[400px] w-full mt-[10px]">
            Collect reviews, strengthen credibility, and turn feedback into
            growth with Clereview.
          </div>
          <div class="mt-[40px]">
            <button class="rounded-full bg-gold text-white">Get Started</button>
          </div>
        </div>
        <div>
          <div class="flex gap-4 w-full mx-auto">
            <div
              v-for="(img, index) in images"
              :key="img"
              @click="setActive(index)"
              class="cursor-pointer overflow-hidden rounded-xl transition-all duration-500 h-[500px]"
              :class="
                index === activeIndex
                  ? 'flex-[5]'
                  : 'flex-[1] opacity-80 hover:opacity-100'
              "
            >
              <img
                :src="img"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- stats -->
    <div class="section py-[50px] bg-white">
      <div class="flex flex-col justify-center">
        <div class="font-bold text-3xl text-center drop-shadow-lg">
          Why businesses trust CleReview?
        </div>
        <div class="text-center">
          Clereview contains authentic reviews from real people to help you make
          better decisions.
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-[20px] mt-[10px]">
        <div
          v-for="(i, idx) in statistics"
          :key="idx"
          class="flex flex-col justify-center items-center p-[20px]"
        >
          <div class="font-bold text-[300%] drop-shadow-lg">
            {{ i.count }}
          </div>
          <div>{{ i.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "for-business",
});

const statistics = [
  { title: "Registered Businesses", count: "200+" },
  { title: "Reviewing Users", count: "100k+" },
  { title: "Uploaded Reviews", count: "10M+" },
  { title: "Uptime", count: "99.9%" },
];

const images = ref([
  "/images/img/pages/app-academy-tutor-5.png",
  "/images/img/pages/app-academy-tutor-3.png",
  "/images/img/pages/app-academy-tutor-4.png",
]);

const activeIndex = ref(0);

const setActive = (index: number) => {
  activeIndex.value = index;
};
</script>

<style scoped>
button {
  padding-inline: 25px;
  padding-block: 15px;
}
</style>
