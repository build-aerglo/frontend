<template>
  <!--Header-->
  <NavBar />
  <!--Header-->

  <!--First Section Start-->
  <section id="hero"
    class="relative flex flex-col items-center justify-center text-center min-h-[80vh] py-6">
    <!-- Background image div -->
    <div class="absolute inset-0 bg-cover bg-top brightness-75 md:bg-fixed"
      style="background-image: url('/images/background/e-user-ldg.png');">
    </div>
    <div class="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
    <!-- Beginning content -->
    <div class="relative z-10 max-w-3xl font-sans">
      <h1 class="text-3xl sm:text-3xl font-bold mb-0 text-white drop-shadow-lg">
        Let real experiences guide you
      </h1>
      <p class="mt-1 text-lg text-[#008253]">
        Clear reviews. Confident decisions.
      </p>
    </div>
    <SearchBarHome />
  </section>
  <!--First Section Ends-->

  <!--Fifth Section begins-->
  <section class="bg-white pb-10 pt-5">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="relative mb-2">
        <h2 class="text-xl md:text-2xl font-demibold text-left text-gray-700 dark:text-white">
          Categories
        </h2>
        <a href="/end-user/landing/categories"
          class="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-blue-600 hover:text-gray-900 dark:text-gray-300">
          ...
        </a>
      </div>
      <LandingCategories />
    </div>
  </section>
  <!--Fifth Section ends-->


  <!--Second Section Starts-->
  <section >
    <TopReviewed />
  </section>
  <!--Second Section Ends-->

  <!--Call to Action Section-->
  <section class="bg-gradient-to-r from-fuchsia-50 to-fuchsia-200 py-10 px-6 md:px-8">
      <div class="container mx-auto px-6 text-center">
          <h2 class="text-lg md:text-xl font-semibold text-slate-900">
            Ready to expand your brand?
          </h2>
          <p class="text-slate-600 mt-2">
            Boost credibility with authentic reviews.
          </p>
          <div class="flex justify-center space-x-4">
          <NuxtLink to="/business/landing">
          <button
          class="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium
                hover:opacity-90 transition"
          >
            Get Started
          </button>
        </NuxtLink>
        </div>
      </div>
  </section>



  <!--Third Section Begins-->
  <section class="my-0">
    <ReviewSlider />
  </section>
  <!--Third Section Ends-->

  <!--Fourth Section begins-->
  <section id="add-voice" class="bg-gradient-to-r from-fuchsia-50 to-fuchsia-200 py-10 mb-0">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-6">
        Add Your Voice
      </h2>
      <p class="text-gray-800 dark:text-gray-300 max-w-2xl mx-auto mb-8">
        Become part of a growing network of individuals who value transparency and trust. By joining our platform, you
        contribute to shaping authentic conversations, helping others make informed choices while discovering new and
        better experiences every day.
      </p>
      <div class="flex justify-center space-x-4">
        <NuxtLink to="/auth/end-user/sign-in"
          class="flex items-center space-x-2 bg-slate-900 hover:opacity-90 text-white px-6 py-3 rounded-xl transition-all duration-300">
          <span>Login/Register</span>
        </NuxtLink>
      </div>
    </div>
  </section>
  <!--Fourth Section Ends-->

  <!--sixth Section begins-->
  <section>
    
  </section>


  <!--Footer-->
  <NavFooter />
  <!--Footer-->

</template>
<script setup>
</script>
