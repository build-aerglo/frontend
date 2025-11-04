<template>
   <!--Header-->
   <NavBarReview/> 
   <!--Header-->

  <!--First Section Start-->
  <section
    class="relative flex flex-col bg-green-50 min-h-[20vh] px-6 overflow-hidden"
  >
    <!--content-->
    
      <div class="my-10">
        <ReviewDialog/>
      </div>
    
  </section>
  <!--First Section Ends-->

  <section class="mt-5">
    <div class="text-[#008253]  ml-5 text-2xl text-left">
      Have You Checked These Out Recently?
    </div>
    <div>
      <Suggestions/>
    </div>
  </section>

    <!--Footer-->
    <FooterSection/>
    <!--Footer-->
</template>
