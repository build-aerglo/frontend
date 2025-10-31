<template>
    <!--Header-->
    <NavBar/>
    <!--Header-->

    <!--First Section Start-->
    <section
    id="hero"
    class="relative flex flex-col items-center justify-center text-center min-h-[80vh] py-6 overflow-hidden"
  >
    <!-- Background image div -->
    <div
      class="absolute inset-0 bg-cover bg-top blur-sm brightness-75 bg-fixed"
      style="background-image: url('/images/e-user-ldg.png');"
    ></div>

    <!-- Foreground content -->
    <div class="relative z-10 max-w-3xl">
      <h1 class="text-3xl sm:text-3xl font-bold mb-4 text-[#008253] drop-shadow-lg">
        Clear reviews, Confident decisions.
      </h1>
      <SearchBarHome />
      <div class="mt-6 text-gray-100">
        Join our community of satisfied users who trust our platform for authentic reviews and informed choices...
      </div>
    </div>
    </section>
    <!--First Section Ends-->


    <!--Second Section Starts-->
    <section class="my-0">
    <TopReviewed/>
    </section>
    <!--Second Section Ends-->

    <!--Third Section Begins-->
    <section class="my-0">
        <ReviewSlider /> 
    </section> 
    <!--Third Section Ends-->

  <!--Fourth Section begins-->
    <section id="categories" class="my-8">
      <div class="text-2xl text-[#008253] text-center">Categories</div>
            <div class="container mt-8 mb-11">
              <div class="row gy-6"> 
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/home" class="cursor-pointer"> 
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Martini class="w-6 h-6 text-gray-500 "/>
                      </div>
                      <h4 class="mb-0 text-gray-950">Restuarants</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/home" class="cursor-pointer">
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Plane class="w-6 h-6 text-gray-500 "/>

                      </div>
                      
                      <h4 class="mb-0 text-gray-950">Travel</h4>
                      
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/home" class="cursor-pointer">
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Tablets class="w-6 h-6 text-gray-500 "/>
                      </div> 
                      <h4 class="mb-0 text-gray-950">Medical</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/home" class="cursor-pointer">
                  <div class="card border border-info shadow-none">
                    <div class="card-body text-center">
                      
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Handshake class="w-6 h-6 text-gray-500 "/>
                      </div>
                      
                      <h4 class="mb-0 text-gray-950">Business Services</h4>
                    
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/home" class="cursor-pointer">
                  <div class="card border border-warning shadow-none">
                    <div class="card-body text-center">
                      
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <ShoppingCart class="w-6 h-6 text-gray-500 "/>
                      </div>
                      
                      <h4 class="mb-0 text-gray-950">Shopping</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>


                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/home" class="cursor-pointer">
                  <div class="card border border-success shadow-none">
                    <div class="card-body text-center">
                      
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Clapperboard class="w-6 h-6 text-gray-500 "/>
                      </div>
                      
                      <h4 class="mb-4 text-gray-950">Entertainment</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>

                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/home" class="cursor-pointer">
                  <div class="card border border-success shadow-none">
                    <div class="card-body text-center">
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Dumbbell class="w-6 h-6 text-gray-500 "/>
                      </div>
                      <h4 class="mb-4 text-gray-950">Fitness</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                 
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/categories" class="cursor-pointer">
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Ellipsis class="w-6 h-6 text-gray-500 "/>
                      </div>
                        
                      <h4 class="mb-0 text-gray-950">More</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>

              </div>
            </div>
          </section>
    <!--Fourth Section Ends-->

    <!--Footer-->
    <FooterSection/>
    <!--Footer-->

</template>

<script setup>

import { Dumbbell,Cake,Plane, Clapperboard,Martini, Handshake, Tablets,ShoppingCart, Ellipsis,} from 'lucide-vue-next'
</script>