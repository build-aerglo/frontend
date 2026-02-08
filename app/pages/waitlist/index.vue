<template>
  <div
    class="min-h-screen relative overflow-hidden py-5 md:py-0
           bg-gradient-to-br from-green-100/60 via-transparent to-yellow-100/50"
  >
    <!-- ================= PRELOADER ================= -->
    <Transition name="fade">
      <div
        v-if="loading"
        class="absolute inset-0 z-50 flex items-center justify-center bg-green-50"
      >
        <GeneralLoader />
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
          <div class="flex justify-center md:justify-start">
            <img
              src="~/assets/images/e-user-logo.png"
              alt="Logo"
              class="h-10 "
            />
          </div>

          <!-- Heading -->
          <h1 class="text-2xl md:text-4xl font-semibold leading-tight gradient-text animate-gradient">
            Let real experiences guide you
          </h1>

          <p class="text-green-700 max-w-xl md:text-base text-sm mx-auto leading-relaxed">
            Real reviews from real people. Build trust, choose smarter, and grow with confidence.
            We’re launching soon — join the waitlist.
          </p>

          <!-- ================= ROLE SELECTION ================= -->
          <div class="pt">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">

              <!-- Business Card -->
              <button
                @click="selectedRole = 'business'"
                :class="[
                  baseCardClass,
                  selectedRole === 'business'
                    ? activeCardClass
                    : inactiveCardClass
                ]"
              >
                <div class="flex gap-4 items-start">
                <i class="pi pi-briefcase md:text-3xl text-2xl text-yellow-700"></i>
                  <div class="space-y-2">
                    <span class="font-medium text-green-900 md:text-lg text-base">
                      Business
                    </span>
                    <p class="md:text-sm text-xs text-green-700">
                      Collect authentic reviews, build lasting trust,
                      and turn happy customers into your strongest marketing channel.
                    </p>
                  </div>
                </div>
              </button>

              <!-- User Card -->
              <button
                @click="selectedRole = 'user'"
                :class="[
                  baseCardClass,
                  selectedRole === 'user'
                    ? activeCardClass
                    : inactiveCardClass
                ]"
              >
                <div class="flex gap-4 items-start">
                  <i class="pi pi-user md:text-3xl text-2xl text-yellow-600"></i>
                  <div class="space-y-2">
                    <span class="font-medium text-green-900 md:text-lg text-base">
                      User
                    </span>
                    <p class="md:text-sm text-xs text-green-700">
                      Discover trusted businesses, read honest experiences,
                      and make decisions you actually feel good about.
                    </p>
                  </div>
                </div>
              </button>

            </div>
          </div>

          <!-- ================= CTA ================= -->
          <div class="flex flex-col items-center md:pt-6 pt-3 gap-3">
            <button
              :disabled="!selectedRole"
              @click="joinWaitlist"
              class="bg-green-700 text-yellow-200 md:px-12 px-8 py-4 rounded-full text-base md:text-lg
                     flex items-center gap-2 shadow-md transition
                     hover:bg-green-800 hover:scale-105
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Join the waitlist
              <i class="pi pi-arrow-right"></i>
            </button>

            <!-- Social Proof -->
            <p class="text-sm text-green-700 flex items-center gap-2">
              <i class="pi pi-users text-green-600"></i>
              <span>
                <strong>{{ waitlistCount.toLocaleString() }}</strong>
                people already joined
              </span>
            </p>
          </div>

            <!-- ================= COUNTDOWN ================= -->
            <div class="">
            <div
                v-if="!timeLeft.expired"
                class="flex justify-center gap-2 md:gap-6 px-5"
            >
                <!-- Days -->
                <div class="countdown-card">
                <span class="countdown-number">
                    {{ pad(timeLeft.days) }}
                </span>
                <span class="countdown-label">Days</span>
                </div>

                <!-- Hours -->
                <div class="countdown-card">
                <span class="countdown-number">
                    {{ pad(timeLeft.hours) }}
                </span>
                <span class="countdown-label">Hours</span>
                </div>

                <!-- Minutes -->
                <div class="countdown-card">
                <span class="countdown-number">
                    {{ pad(timeLeft.minutes) }}
                </span>
                <span class="countdown-label">Minutes</span>
                </div>

                <!-- Seconds -->
                <div class="countdown-card">
                <span class="countdown-number">
                    {{ pad(timeLeft.seconds) }}
                </span>
                <span class="countdown-label">Seconds</span>
                </div>
            </div>

            <div v-else class="text-yellow-600 font-semibold text-xl text-center">
                🎉 We’re live!
            </div>
            </div>

          <!-- ================= SOCIALS ================= -->
          <div class="flex justify-center gap-6 text-2xl text-green-700">
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
const selectedRole = ref<"business" | "user" | null>(null);

// Fake preload delay
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1200);
});

/* ================= WAITLIST COUNT =================
   Replace this later with a real API call.
*/
const waitlistCount = ref(1342);

/* ================= JOIN HANDLER ================= */
const joinWaitlist = () => {
  if (selectedRole.value === "business") {
    window.open("https://forms.gle/your-business-form", "_blank");
  }
  if (selectedRole.value === "user") {
    window.open("https://forms.gle/your-user-form", "_blank");
  }
};

/* ================= COUNTDOWN ================= */
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

/* ================= STYLES ================= */
const baseCardClass =
  "h-full text-left rounded-xl bg-white border-2 p-4 shadow-sm transition " +
  "hover:-translate-y-1 hover:shadow-md";

const activeCardClass =
  "border-green-600 ring-2 ring-green-300 scale-[1.02]";

const inactiveCardClass =
  "border-green-100";

/* ================= DECORATIONS ================= */
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

/* ===== Countdown Cards ===== */
.countdown-card {
  /* background: white; */
  background: #ca8a04;;
  border: 2px solid #d1fae5; /* green-100 */
  border-radius: 0.75rem;
  padding: 0.75rem 0.5rem;
  min-width: 72px;
  text-align: center;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.countdown-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.countdown-number {
  display: block;
  font-size: 1.50rem;
  font-weight: 700;
  line-height: 1;
  /* color: #ca8a04; */
  color: white;
}

.countdown-label {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  /* color: #065f46; green-800 */
  color: white;

}
@media screen and (max-width: 600px) {
  .countdown-card {
  /* background: white; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ca8a04;;
  border: 2px solid #d1fae5; /* green-100 */
  border-radius: 0.75rem;
  padding: 0.6rem .7rem;
  min-width: 50px;
  text-align: center;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

  .countdown-number {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  /* color: #ca8a04; */
  color: white;
}

.countdown-label {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.4rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  /* color: #065f46; green-800 */
  color: white;

}
}

</style>
