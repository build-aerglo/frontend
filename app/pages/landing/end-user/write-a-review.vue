<template>
   <!--Header-->
   <NavBarReview/> 
   <!--Header-->

  <!--First Section Start-->
  <section
    id="hero"
    class="relative flex flex-col items-center bg-green-50 justify-center text-center min-h-[40vh] px-6 overflow-hidden"
  >
    <!--content-->
    <div class="relative z-10 max-w-3xl">
      <h1 class="text-3xl sm:text-3xl font-semibold mb-8 text-[#008253] drop-shadow-lg">
        Share Your Experience With Others
      </h1>
      <div class="mb-10">
        <SearchBarReview />
      </div>
    </div>
  </section>
  <!--First Section Ends-->

  <section class="mt-5">
    <div class="text-[#008253]  ml-8 text-2xl text-left">
      Have You Checked These Out Recently?
    </div>
  </section>

    <!--Footer-->
    <FooterSection/>
    <!--Footer-->
</template>
