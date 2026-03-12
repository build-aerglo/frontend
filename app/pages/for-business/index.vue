<template>
  <div>
    <!-- landing -->
    <div
      class="section py-[50px] ..!bg-primary text-white"
      style="
        background-image:
          linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
          url(&quot;/images/auth/b-user-bg.png&quot;);
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

    <!-- why use us -->
    <div class="section py-[70px]">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div>
          <div class="text-3xl font-bold mb-[30px]">
            Unlock more value with Clereview powerful review tools!
          </div>
          <div class="flex flex-col gap-[10px]">
            <div>
              Encourage every customer to share their experience and help your
              brand grow through authentic feedback.
            </div>
            <div>
              Show that you care by actively responding to reviews and building
              stronger relationships with your audience.
            </div>
            <div>
              Highlight real customer experiences as social proof to build trust
              and boost conversions across your entire sales funnel.
            </div>
            <div>
              Turn feedback into actionable insights that help you refine your
              strategy and make smarter business decisions.
            </div>
            <div>Curious to see how it can work for you?</div>
          </div>
          <div class="mt-[20px]">
            <button class="rounded-full !bg-primary text-white">
              Get Started
            </button>
          </div>
        </div>
        <div class="flex justify-center items-center">
          <img
            src="/images/why-use-us.webp"
            class="h-[400px] w-full object-contain rounded-[10px] shadow-md"
          />
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
