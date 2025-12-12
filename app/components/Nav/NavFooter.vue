<template>
  <footer id="footer" class="bg-slate-900 text-white mt-0 border-t border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-6 py-12">
      <!-- Top Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        <!-- Brand -->
        <div>
          <h2 class="text-2xl font-extrabold text-gold mb-3">CleReview</h2>
          <p class="text-sm text-gray-400 leading-relaxed">
            Empowering users to make confident decisions through transparent and authentic reviews. 
            Discover, compare, and share experiences with ease.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-semibold text-white dark:text-white mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-[#008253] transition">Home</a></li>
            <li><a href="#add-voice" class="hover:text-[#008253] transition">About Us</a></li>
            <li><a href="#" class="hover:text-[#008253] transition">Browse Reviews</a></li>
            <li><a href="#footer" class="hover:text-[#008253] transition">Contact</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="font-semibold text-white dark:text-white mb-4">Support</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="hover:text-[#008253] transition">FAQs</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-[#008253] transition">Help Center</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-[#008253] transition">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/" class="hover:text-[#008253] transition">Privacy Policy</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact & Socials -->
        <div>
          <h3 class="font-semibold text-white dark:text-white mb-4">Get in Touch</h3>
          <p class="text-sm text-gray-400 mb-3">Email: <a href="mailto:support@clereview.com" class="text-gold hover:underline">support@clereview.com</a></p>

          <div class="flex gap-4 mt-4">
            <NuxtLink to="/" class="text-gray-500 hover:text-[#008253] transition"><i class="pi pi-facebook text-lg"></i></NuxtLink>
            <NuxtLink to="/" class="text-gray-500 hover:text-[#008253] transition"><i class="pi pi-twitter text-lg"></i></NuxtLink>
            <NuxtLink to="/" class="text-gray-500 hover:text-[#008253] transition"><i class="pi pi-instagram text-lg"></i></NuxtLink>
            <NuxtLink to="/" class="text-gray-500 hover:text-[#008253] transition"><i class="pi pi-linkedin text-lg"></i></NuxtLink>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="mt-5 mb-2 border-t border-gray-400 dark:border-gray-700"></div>

      <!-- Bottom Section -->
      <div class="flex flex-col sm:flex-row justify-between items-center text-sm text-white dark:text-gray-400">
        <p>© {{ new Date().getFullYear() }} <span class="font-semibold text-gold">CleReview</span>. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script></script>
