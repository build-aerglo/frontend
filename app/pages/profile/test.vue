<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sticky Navbar -->
    <nav
      class="fixed top-0 inset-x-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>

        <div class="flex items-center gap-4">
          <!-- Notifications -->
          <button
            class="relative text-gray-700 dark:text-gray-200 hover:text-[#008253] transition"
          >
            <i class="pi pi-bell text-xl"></i>
            <span
              class="absolute top-0 right-0 w-2.5 h-2.5 bg-[#008253] rounded-full"
            ></span>
          </button>

          <!-- Sign Out -->
          <button
            @click="handleSignOut"
            class="flex items-center gap-2 px-4 py-2 text-[#008253] hover:bg-green-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <i class="pi pi-sign-out"></i>
            <span class="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <div
      class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-2 pt-5 pb-4 space-y-4"
    >
      <!-- === Top Row: Profile Info + Badges === -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Profile Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-start items-center gap-6"
        >
          <!-- Avatar -->
          <div class="relative group">
            <img
              :src="user.avatar"
              alt="Profile"
              class="w-28 h-28 rounded-full object-cover border-4 border-[#008253] shadow-lg"
            />
            <label
              for="avatarUpload"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              <i class="pi pi-camera text-white text-2xl"></i>
            </label>
            <input
              id="avatarUpload"
              type="file"
              class="hidden"
              accept="image/*"
              @change="handleAvatarUpload"
            />
            <div class="text-center">
                <a
              href="#"
              class="text-xs text-gray-500 text-right underline hover:text-[#008253]"
              >Edit Profile</a
            >
            </div>
          </div>

          <!-- Info -->
          <div class="space-y-1 flex-1 text-center sm:text-left">
            <h2
              class="text-lg font-bold text-gray-900 dark:text-white truncate"
            >
              {{ user.username }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">{{ user.email }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ user.phone }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ user.address }}
            </p>
          </div>
        </div>

        <!-- Badges -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h3
            class="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"
          >
            <i class="pi pi-trophy text-[#008253]"></i> Badges Earned
          </h3>
          <div class="flex flex-col gap-3">
            <div
              v-for="(badge, idx) in user.stats.badges"
              :key="idx"
              class="flex items-center gap-3 text-gray-700 dark:text-gray-300"
            >
              <i class="pi pi-star-fill text-[#008253]"></i>
              <span>{{ badge }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- === Middle Row: Stats + Top Sector + Location === -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Stats -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex justify-between flex-wrap"
        >
          <div
            class="text-center flex-1 min-w-[80px] mb-4 sm:mb-0"
            v-for="stat in stats"
            :key="stat.label"
          >
            <i :class="stat.icon + ' text-[#008253] text-lg'"></i>
            <p class="text-xl font-bold text-[#008253] mt-1">
              {{ stat.value }}
            </p>
            <p class="text-sm text-gray-600">{{ stat.label }}</p>
          </div>
        </div>

        <!-- Top Sectors -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h3
            class="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"
          >
            <i class="pi pi-briefcase text-[#008253]"></i> Top Reviewed Sectors
          </h3>
          <ul class="space-y-2">
            <li
              v-for="(sector, idx) in user.topSectors"
              :key="idx"
              class="flex items-center justify-between text-gray-700 dark:text-gray-300"
            >
              <span>{{ sector }}</span>
              <i class="pi pi-star-fill text-gold"></i>
            </li>
          </ul>
        </div>

        <!-- Top Locations -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3
            class="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"
          >
            <i class="pi pi-map-marker text-[#008253]"></i> Most Reviewed
            Locations
          </h3>
          <ul class="space-y-2">
            <li
              v-for="(location, idx) in user.topLocations"
              :key="idx"
              class="flex items-center justify-between text-gray-700 dark:text-gray-300"
            >
              <span>{{ location }}</span>
              <i class="pi pi-star-fill text-gold"></i>
            </li>
          </ul>
        </div>
      </div>

      <!-- Reviews Section -->
        <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <h3 class="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <i class="pi pi-comments text-[#008253]"></i>
            Your Reviews
        </h3>

        <!-- Reviews Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
            v-for="review in user.reviews.slice(0, 3)"
            :key="review.id"
            class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900 hover:shadow-lg transition"
            >
            <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-gray-900 dark:text-white">
                {{ review.title }}
                </h4>
                <div class="flex gap-1">
                <i
                    v-for="n in 5"
                    :key="n"
                    class="text-sm"
                    :class="n <= review.rating ? 'pi pi-star-fill text-gold' : 'pi pi-star text-gray-400'"
                ></i>
                </div>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {{ review.location }} • {{ review.date }} • {{ review.status }}
            </p>

            <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                {{ review.content }}
            </p>
            </div>
        </div>
        </section>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Review {
  id: number;
  title: string;
  location: string;
  date: string;
  status: string;
  rating: number;
  content: string;
}

interface UserStats {
  reviews: number;
  helpfulVotes: number;
  points: number;
  badges: string[];
}

interface User {
  avatar: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  stats: UserStats;
  topSectors: string[];
  topLocations: string[];
  reviews: Review[];
}

const user = ref<User>({
  avatar: "/images/profile-images/3.png",
  username: "John Doe",
  phone: "+234 810-9876-888",
  email: "johndoe@mail.com",
  address: "13 Akinwale Street, Ikeja, Lagos",
  stats: {
    reviews: 3,
    helpfulVotes: 128,
    points: 720,
    badges: ["Top Reviewer", "Helpful Member", "Community Star"],
  },
  topSectors: ["Restaurants", "Hotels", "Electronics"],
  topLocations: ["Abulegba", "Ikorodu", "Oju Elegba", "Ikeja", "Abeokuta"],
  reviews: [
    {
      id: 1,
      title: "Oceanview Hotel",
      location: "Ikeja",
      date: "Oct 20, 2025",
      status: "pending",
      rating: 5,
      content:
        "Had a wonderful stay with excellent service and beautiful ocean views. Highly recommend!",
    },
    {
      id: 2,
      title: "Ken's Electronics",
      location: "Abeokuta",
      date: "Sep 18, 2025",
      status: "posted",
      rating: 4,
      content:
        "Impressed by the sound quality of these headphones, but the price feels a bit too high.",
    },
    {
      id: 3,
      title: "TastyBites",
      location: "Abuja",
      date: "Aug 30, 2025",
      status: "investigating",
      rating: 3,
      content:
        "Loved the food! But the waiting time was longer than expected.",
    },
  ],
});

const stats = computed(() => [
  {
    icon: "pi pi-comment",
    value: user.value.stats.reviews,
    label: "Reviews",
  },
  {
    icon: "pi pi-thumbs-up",
    value: user.value.stats.helpfulVotes,
    label: "Helpful Votes",
  },
  {
    icon: "pi pi-wallet",
    value: user.value.stats.points,
    label: "Points",
  },
  {
    icon: "pi pi-star",
    value: user.value.stats.badges.length,
    label: "Badges",
  },
]);

const handleAvatarUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      user.value.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleSignOut = () => {
  if (confirm("Are you sure you want to sign out?")) {
    console.log("User signed out");
  }
};
</script>

<style scoped>
.text-gold {
  color: #fbbf24;
}
</style>
