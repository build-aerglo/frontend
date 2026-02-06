<template>
  <div
    class="min-h-screen relative overflow-hidden
           bg-gradient-to-br from-green-100/60 via-transparent to-yellow-100/50"
  >
    <!-- ================= PRELOADER ================= -->
    <Transition name="fade">
      <div
        v-if="loading"
        class="absolute inset-0 z-50 flex items-center justify-center bg-green-50"
      >
        <GeneralLoader/>
      </div>
    </Transition>

    <!-- ================= DECORATIONS ================= -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        v-for="n in 3"
        :key="'orb' + n"
        class="absolute rounded-full bg-yellow-100 opacity-40 blur-3xl animate-float-slow"
        :style="randomOrbStyle()"
      />

      <i
        v-for="n in 12"
        :key="'star' + n"
        class="pi pi-star-fill absolute text-yellow-400 opacity-70 animate-float"
        :style="randomStarStyle()"
      />
    </div>

    <!-- ================= CONTENT ================= -->
    <Transition name="content-fade" appear>
      <div
        v-if="!loading"
        class="relative z-10 min-h-screen flex items-center justify-center"
      >
       <div class="relative max-w-3xl w-full px-6 text-center space-y-8">

      <!-- Logo -->
      <NuxtLink to="/" class="flex justify-center md:justify-start">
        <img
          src="~/assets/images/e-user-logo.png"
          alt="Logo"
          class="h-10"
        />
      </NuxtLink>

      <!-- Heading -->
      <h1 class="text-4xl md:text-5xl font-semibold leading-tight gradient-text animate-gradient pt-10">
            Review & Grow
            Your Business
        </h1>


      <Transition name="slide-fade" mode="out-in">
            <div v-if="!showTabs" key="intro" class="space-y-8">
              <p class="text-green-700 max-w-2xl mx-auto leading-relaxed">
                Collect real reviews, build customer trust, and grow your business
                effortlessly. We’re launching soon — join the waitlist.
              </p>

              <div class="flex justify-center">
                <button
                  @click="showTabs = true"
                  class="bg-green-700 text-yellow-200 px-12 py-4 rounded-full text-lg
                         flex items-center gap-2 shadow-md
                         hover:bg-green-800 hover:scale-105 transition"
                >
                  Join the waitlist
                  <i class="pi pi-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- ===== TABS ===== -->
            <div v-else key="tabs" class="space-y-6 pt-4 flex flex-col">
              <a
                href="https://forms.gle/your-business-form"
                target="_blank"
                class="block rounded-xl bg-white backdrop-blur border-2 border-green-100
                       p-3 text-left shadow-sm hover:shadow-md transition hover:-translate-y-1 hover:scale-[1.01]"
              >
                <div class="flex gap-4 items-center justify-start ">
                  <i class="pi pi-briefcase text-3xl text-yellow-700"></i>
                  <div class="flex flex-col gap-2">
                    <span class="font-medium text-green-900">Business</span>
                    <p class="text-sm text-green-700">
                      Collect reviews, build trust, and grow faster.
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="https://forms.gle/your-user-form"
                target="_blank"
                class="block rounded-lg bg-white backdrop-blur border-2 border-green-100
                       p-3 text-left shadow-sm hover:shadow-md transition hover:-translate-y-1 hover:scale-[1.01]"
              >
                <div class="flex gap-4 items-center justify-start ">
                  <i class="pi pi-user text-3xl text-yellow-600"></i>
                  <div  class="flex flex-col gap-2">
                    <span class="font-medium text-green-900">User</span>
                    <p class="text-sm text-green-700">
                      Discover trusted businesses and ....
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </Transition>


      <!-- Countdown -->
      <div class="pt-10">
        <div
          v-if="!timeLeft.expired"
          class="flex justify-center gap-4 text-3xl md:text-4xl font-mono text-green-900"
        >
          <div class="md:text-xl text-base"><span class="text-yellow-600 md:text-3xl text-xl">{{ pad(timeLeft.days) }}</span>d</div>
          <div class="md:text-3xl">:</div>
          <div class="md:text-xl text-base"><span class="text-yellow-600 md:text-3xl text-xl">{{ pad(timeLeft.hours) }}</span>h</div>
          <div class="md:text-3xl">:</div>
          <div class="md:text-xl text-base"><span class="text-yellow-600 md:text-3xl text-xl">{{ pad(timeLeft.minutes) }}</span>m</div>
          <div class="md:text-3xl">:</div>
          <div class="md:text-xl text-base"><span class="text-yellow-600 md:text-3xl text-xl">{{ pad(timeLeft.seconds) }}</span>s</div>
        </div>

        <div v-else class="text-yellow-600 font-semibold text-xl">
          🎉 We’re live!
        </div>
      </div>

      <!-- Socials -->
      <div class="flex justify-center gap-6 pt-12 text-2xl text-green-700">
        <i class="pi pi-twitter hover:text-green-900 transition"></i>
        <i class="pi pi-instagram hover:text-green-900 transition"></i>
        <i class="pi pi-facebook hover:text-green-900 transition"></i>
        <i class="pi pi-at hover:text-green-900 transition"></i>
      </div>

    </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";

const loading = ref(true);
const showTabs = ref(false);

// Fake preload delay (lets animations settle)
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1200); // tweak duration if needed
});

const target = new Date("2026-12-31T23:59:59");

const timeLeft = reactive({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  expired: false,
});

let timer: ReturnType<typeof setInterval>;

const calculate = () => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    timeLeft.expired = true;
    clearInterval(timer);
    return;
  }
  timeLeft.days = Math.floor(diff / (1000 * 60 * 60 * 24));
  timeLeft.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  timeLeft.minutes = Math.floor((diff / (1000 * 60)) % 60);
  timeLeft.seconds = Math.floor((diff / 1000) % 60);
};

onMounted(() => {
  calculate();
  timer = setInterval(calculate, 1000);
});

onUnmounted(() => clearInterval(timer));

const randomStarStyle = () => ({
  top: Math.random() * 100 + "%",
  left: Math.random() * 100 + "%",
  fontSize: Math.random() * 14 + 10 + "px",
  animationDuration: Math.random() * 8 + 6 + "s",
});

const randomOrbStyle = () => ({
  top: Math.random() * 100 + "%",
  left: Math.random() * 100 + "%",
  width: Math.random() * 220 + 200 + "px",
  height: Math.random() * 220 + 200 + "px",
  animationDuration: Math.random() * 20 + 20 + "s",
});

const pad = (num: number) => String(num).padStart(2, "0");
</script>

<style scoped>
/* ===== Preloader ===== */
.loader {
  width: 42px;
  height: 42px;
  border: 4px solid #d1fae5;
  border-top-color: #15803d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== Animations ===== */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-35px); }
}
.animate-float { animation: float ease-in-out infinite; }
.animate-float-slow { animation: floatSlow ease-in-out infinite; }

/* ===== Gradient Text ===== */
.gradient-text {
  background: linear-gradient(90deg, #065f46, #16a34a, #eab308);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  animation: gradientMove 6s ease-in-out infinite;
}

/* ===== Transitions ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content-fade-enter-active {
  transition: all 0.6s ease;
}
.content-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
