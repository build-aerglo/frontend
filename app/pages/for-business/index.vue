<template>
  <section
    id="hero"
    class="relative flex flex-col items-center justify-center text-center min-h-[80vh] py-6"
  >
    <!-- Background image with loading state -->
    <div
      class="absolute inset-0 bg-cover bg-top brightness-75 md:bg-fixed transition-opacity duration-500"
      :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
      :style="
        imageLoaded
          ? `background-image: url('/images/background/e-user-ldg.png');`
          : ''
      "
    ></div>

    <!-- Fallback gradient while image loads -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 transition-opacity duration-500"
      :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
    ></div>

    <div class="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

    <div class="relative z-10 max-w-3xl font-sans px-4">
      <h1
        class="font-bold text-white drop-shadow-lg mb-0 text-2xl sm:text-2xl md:text-3xl lg:text-4xl"
      >
        Turn Every Review Into a Growth Opportunity
      </h1>
      <p class="mt-1 text-[#008253] text-base sm:text-lg md:text-xl">
        Manage. Respond. Grow.
      </p>
    </div>

    <!-- Pills + CTAs -->
    <div
      class="relative z-10 w-full flex flex-col items-center gap-5 mt-6 px-4"
    >
      <div class="flex flex-wrap justify-center gap-2">
        <div
          v-for="pill in heroPills"
          :key="pill.label"
          class="bg-white/10 border border-white/20 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2"
        >
          <i :class="['pi', pill.icon, 'text-gold text-sm']"></i>
          <span>{{ pill.label }}</span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <NuxtLink to="/business/auth/sign-up">
          <button
            class="group px-7 py-3 rounded-xl !bg-primary text-white shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
          >
            Register Your Business
            <i
              class="pi pi-arrow-right group-hover:translate-x-1 transition-transform"
            ></i>
          </button>
        </NuxtLink>
        <NuxtLink to="/business/auth/sign-in">
          <button
            class="px-7 py-3 rounded-xl bg-white/10 border border-white/25 text-white hover:bg-white/20 transition-all"
          >
            Sign In
          </button>
        </NuxtLink>
      </div>
    </div>
  </section>

  <section class="">
    <ClientOnly>
      <template #fallback>
        <UserLandingStatisticsLoader bgClass="bg-white" :is-user="false" />
      </template>
      <UserLandingStatistics :statistics="statistics" bg-class="bg-white" />
    </ClientOnly>
  </section>

  <section class="py-14 px-2">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-1 h-8 rounded-full !bg-primary"></div>
        <span class="text-2xl md:text-3xl font-bold text-slate-800"
          >How It Works</span
        >
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
          <div
            class="w-12 h-12 rounded-xl !bg-primary/10 flex items-center justify-center mb-5 group-hover:!bg-primary/20 transition-colors"
          >
            <i :class="['pi', step.icon, '!text-primary text-xl']"></i>
          </div>
          <div
            class="absolute top-6 right-6 text-5xl font-black text-slate-100 select-none"
          >
            {{ i + 1 }}
          </div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">
            {{ step.title }}
          </h3>
          <p class="text-slate-500 text-sm leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="py-14 bg-white overflow-hidden px-2">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center gap-12">
        <!-- Mobile: dashboard card first; Desktop: right column -->
        <!-- Right: Mock dashboard card -->
        <div
          class="w-full md:w-1/2 md:order-2 relative flex justify-center items-center"
        >
          <div
            class="absolute w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"
          ></div>

          <div
            class="relative z-10 w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl animate-float overflow-hidden"
          >
            <div class="bg-slate-800 px-5 py-3 flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <div class="ml-3 text-xs text-slate-400 font-mono">
                Clereview · Business Dashboard
              </div>
            </div>

            <div class="p-5 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs text-slate-400 mb-1">Average Rating</div>
                  <div class="flex items-center gap-1">
                    <i
                      v-for="n in 5"
                      :key="n"
                      class="pi pi-star-fill text-gold text-sm"
                    ></i>
                    <span class="ml-2 font-bold text-slate-800 text-lg"
                      >4.8</span
                    >
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400 mb-1">Total Reviews</div>
                  <div class="font-bold text-2xl text-primary">1,204</div>
                </div>
              </div>

              <div class="space-y-2">
                <div
                  v-for="bar in ratingBars"
                  :key="bar.label"
                  class="flex items-center gap-2 text-xs text-slate-500"
                >
                  <span class="w-4 text-right">{{ bar.label }}</span>
                  <i class="pi pi-star-fill text-gold text-[10px]"></i>
                  <div class="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      class="h-2 rounded-full !bg-primary"
                      :style="`width:${bar.pct}%`"
                    ></div>
                  </div>
                  <span class="w-8 text-right">{{ bar.pct }}%</span>
                </div>
              </div>

              <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div class="text-xs text-slate-400 mb-1">Latest Review</div>
                <div class="flex items-center gap-1 mb-1">
                  <i
                    v-for="n in 5"
                    :key="n"
                    class="pi pi-star-fill text-gold text-[10px]"
                  ></i>
                </div>
                <p class="text-xs text-slate-600 italic">
                  "Absolutely seamless experience. I'll definitely be back!"
                </p>
                <div class="text-[10px] text-slate-400 mt-1">
                  — Adaeze O., 2 hours ago
                </div>
              </div>

              <div class="flex gap-2">
                <div
                  class="flex-1 !bg-primary/10 !text-primary text-xs font-semibold rounded-lg px-3 py-2 text-center"
                >
                  📣 Respond
                </div>
                <div
                  class="flex-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg px-3 py-2 text-center"
                >
                  📊 Analytics
                </div>
              </div>
            </div>
          </div>

          <div
            class="absolute -bottom-2 -right-2 md:right-4 bg-white border border-slate-100 p-3 rounded-xl shadow-xl animate-float-delayed z-20 hidden sm:flex items-center gap-2"
          >
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            <span
              class="text-[10px] font-bold text-slate-700 uppercase tracking-wider"
              >Live Insights</span
            >
          </div>
        </div>

        <!-- Left: Feature list -->
        <div class="w-full md:w-1/2 md:order-1 space-y-8">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <div class="w-1 h-8 rounded-full !bg-primary"></div>
              <span class="text-2xl md:text-3xl font-bold text-slate-800"
                >Your Business Dashboard</span
              >
            </div>
            <p class="text-slate-500 text-base">
              Everything you need to manage your reputation and grow customer
              trust all in one clean dashboard.
            </p>
          </div>

          <ul class="space-y-5">
            <li
              v-for="f in features"
              :key="f.title"
              class="flex items-start gap-4"
            >
              <div
                class="mt-0.5 w-9 h-9 rounded-lg !bg-primary/10 flex items-center justify-center shrink-0"
              >
                <i :class="['pi', f.icon, '!text-primary']"></i>
              </div>
              <div>
                <div class="font-semibold text-slate-800">{{ f.title }}</div>
                <div class="text-slate-500 text-sm mt-0.5">{{ f.desc }}</div>
              </div>
            </li>
          </ul>

          <div class="pt-2 flex justify-center md:justify-start">
            <NuxtLink to="/business/dashboard">
              <button class="group px-8 py-3.5 rounded-xl !bg-primary text-white font-medium  transition-all flex items-center gap-3 shadow-lg hover:shadow-xl">
                View dashboard
                <i
                  class="pi pi-arrow-right group-hover:translate-x-1 transition-transform"
                ></i>
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-14 px-2">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-1 h-8 rounded-full bg-gold"></div>
        <span class="text-2xl md:text-3xl font-bold text-slate-800"
          >What Businesses Are Saying</span
        >
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="review in testimonials"
          :key="review.name"
          class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <div class="flex items-center gap-1 mb-3">
            <i
              v-for="n in 5"
              :key="n"
              class="pi pi-star-fill text-gold text-xs"
            ></i>
          </div>
          <p class="text-slate-600 text-sm leading-relaxed italic mb-4">
            "{{ review.quote }}"
          </p>
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 rounded-full !bg-primary/20 flex items-center justify-center !text-primary font-bold text-sm"
            >
              {{ review.name[0] }}
            </div>
            <div>
              <div class="font-semibold text-slate-800 text-sm">
                {{ review.name }}
              </div>
              <div class="text-slate-400 text-xs">{{ review.business }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="categories" class="py-14 px-2 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-1 h-8 rounded-full !bg-primary"></div>
        <span class="text-2xl md:text-3xl font-bold text-slate-800"
          >Industries We Cover</span
        >
      </div>
      <p class="text-slate-500 mb-10 pl-4">
        Whatever your business type, customers are already looking for you on
        Clereview.
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <ClientOnly>
          <template #default>
            <div
              v-for="cat in _categories"
              :key="cat.name"
              class="group flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
            >
              <div
                class="w-12 h-12 rounded-xl !bg-primary/10 flex items-center justify-center group-hover:!bg-primary/20 transition-colors"
              >
                <i :class="['pi', cat.icon, '!text-primary text-xl']"></i>
              </div>
              <div class="font-semibold text-slate-700 text-sm leading-tight">
                {{ cat.name }}
              </div>
              <div class="text-xs text-slate-400">
                {{ cat.businessCount }} businesses
              </div>
            </div>
          </template>
          <template #fallback>
            <div
              v-for="i in isMobile() ? 2 : 8"
              :key="i"
              class="group flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
            >
              <Skeleton size="4rem"></Skeleton>
              <Skeleton width="10rem" borderRadius="16px"></Skeleton>
              <Skeleton width="5rem" borderRadius="16px"></Skeleton>
            </div>
          </template>
        </ClientOnly>
      </div>
      <p class="text-center text-slate-400 text-sm mt-8">
        Don't see your industry?
        <NuxtLink to="/business/auth/sign-up" class="!text-primary font-semibold hover:underline ml-1">
          List your business anyway →
        </NuxtLink>
      </p>
    </div>
  </section>

  <div
    class="p-[25px] flex sm:flex-row flex-col sm:items-center justify-end bg-gradient-to-r from-[#deae29] to-[#fbd85b]"
  >
    <div class="flex-1">
      <div class="font-bold text-[130%] text-white">
        Ready to grow with Clereview?
      </div>
      <div class="text-white">
        Join hundreds of businesses using real customer feedback to build trust
        and win more customers.
      </div>
    </div>
    <div class="sm:mt-0 mt-[20px] md:text-right">
      <NuxtLink to="/business/auth/sign-in">
        <button
          class="rounded-full !bg-[#1B1A1B] text-white px-[25px] py-[15px]"
        >
          Get Started Free
        </button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $statistics, $categories } = useNuxtApp();
const _statistics = computed(() => $statistics.value);
const _categories = computed(() => $categories.value);

definePageMeta({
  layout: "for-business",
});

// Image preload
const imageLoaded = ref<boolean>(false);
onMounted((): void => {
  const img: HTMLImageElement = new Image();
  img.src = "/images/background/e-user-ldg.png";
  img.onload = (): void => {
    imageLoaded.value = true;
  };
  if (img.complete) imageLoaded.value = true;
});

const heroPills = [
  { icon: "pi-verified", label: "Verified Reviews" },
  { icon: "pi-chart-bar", label: "Analytics Dashboard" },
  { icon: "pi-comments", label: "Respond to Customers" },
  { icon: "pi-shield", label: "Reputation Management" },
];

const statistics = computed(() => [
  {
    title: "Registered Businesses",
    count: _statistics.value.registeredBusinesses,
  },
  { title: "Active Reviewers", count: _statistics.value.registeredUsers },
  { title: "Reviews Uploaded", count: _statistics.value.uploadedReviews },
]);

const steps = [
  {
    icon: "pi-building",
    title: "Register Your Business",
    desc: "Create a free business profile in minutes. Add your logo, location, and details to get discovered.",
  },
  {
    icon: "pi-inbox",
    title: "Collect Genuine Reviews",
    desc: "Customers find you and leave honest, verified reviews. Your reputation builds automatically.",
  },
  {
    icon: "pi-chart-line",
    title: "Grow & Respond",
    desc: "Reply to reviews, monitor analytics, and use insights to improve customer experience and drive growth.",
  },
];

const features = [
  {
    icon: "pi-star",
    title: "Review Management",
    desc: "Read, respond, and flag reviews from one place.",
  },
  {
    icon: "pi-chart-line",
    title: "Performance Analytics",
    desc: "Track rating trends, review volume, and customer sentiment.",
  },
  {
    icon: "pi-bell",
    title: "Instant Notifications",
    desc: "Get alerted the moment a new review goes live.",
  },
  {
    icon: "pi-globe",
    title: "Public Business Profile",
    desc: "A beautiful profile page customers can find and trust.",
  },
  {
    icon: "pi-shield",
    title: "Reputation Tools",
    desc: "Flag unfair reviews and protect your brand image.",
  },
];

const ratingBars = [
  { label: "5", pct: 70 },
  { label: "4", pct: 18 },
  { label: "3", pct: 7 },
  { label: "2", pct: 3 },
  { label: "1", pct: 2 },
];

const testimonials = [
  {
    quote:
      "Since joining Clereview, our new customer enquiries went up 40%. Authentic reviews truly make a difference.",
    name: "Emeka Obi",
    business: "Obi Electronics, Lagos",
  },
  {
    quote:
      "The dashboard makes it so easy to respond quickly. Our customers feel heard and keep coming back.",
    name: "Fatima Bello",
    business: "Bella Beauty Studio, Abuja",
  },
  {
    quote:
      "Clereview helped us identify weak spots in our service. We fixed them and our rating jumped to 4.9.",
    name: "Chidi Nwosu",
    business: "NwoCatering Services, PH",
  },
];
</script>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-18px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes float-delayed {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(12px);
  }
  100% {
    transform: translateY(0px);
  }
}
.animate-float {
  animation: float 5s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
}
</style>
