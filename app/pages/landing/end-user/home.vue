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
    <section id="add-voice" class="bg-gray-100 dark:bg-gray-900 py-12 mb-0">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-[#008253] dark:text-white mb-6">
          Add Your Voice
        </h2>
        <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
        Become part of a growing network of individuals who value transparency and trust. By joining our platform, you contribute to shaping authentic conversations, helping others make informed choices while discovering new and better experiences every day.
        </p>
        <div class="flex justify-center space-x-4">
          <NuxtLink
            to="/auth/end-user/sign-in"
            class="flex items-center space-x-2 bg-[#008253] hover:bg-[#006f46] text-white px-6 py-2 rounded-full transition-all duration-300"
          >
            <span>Login/Register</span>
          </NuxtLink>
        </div>
      </div>
    </section>
    <!--Fourth Section Ends-->

    <!--Fifth Section begins-->  
    <section class="bg-white dark:bg-gray-900 pb-5 pt-10">
     <div class="container mx-auto px-4">
       <!-- Header -->
        <div class="relative mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-left text-[#008253] dark:text-white">
            Categories
          </h2>
          <a
            href="/landing/end-user/categories"
            class="absolute right-0 top-1/2 -translate-y-1/2 text-3xl text-blue-600 hover:text-gray-900 dark:text-gray-300"
          >
            ...
          </a>
        </div>
        <div class="container mt-8 mb-11">
        <div class="row gy-6"> 
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/categories" class="cursor-pointer"> 
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
                  <NuxtLink to="/landing/end-user/categories" class="cursor-pointer">
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
                  <NuxtLink to="/landing/end-user/categories" class="cursor-pointer">
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Drill class="w-6 h-6 text-gray-500 "/>
            
                      </div>
                      
                      <h4 class="mb-0 text-gray-800">Home Services</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
      
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/categories" class="cursor-pointer">
                  <div class="card border border-success shadow-none">
                    <div class="card-body text-center">
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <School class="w-6 h-6 text-gray-500 "/>
                      </div>
                      <h4 class="mb-0 text-gray-950">Academic</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/categories" class="cursor-pointer">
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
                  <NuxtLink to="/landing/end-user/categories" class="cursor-pointer">
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
                  <NuxtLink to="/landing/end-user/categories" class="cursor-pointer">
                  <div class="card border border-success shadow-none">
                    <div class="card-body text-center">
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Clapperboard class="w-6 h-6 text-gray-500 "/>
                      </div>  
                      <h4 class="mb-0 text-gray-950">Entertainment</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>

                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/landing/end-user/categories" class="cursor-pointer">
                  <div class="card border border-success shadow-none">
                    <div class="card-body text-center">
                      <div class="flex items-center justify-center mb-2 -mt-1"> 
                        <Dumbbell class="w-6 h-6 text-gray-500 "/>
                      </div>
                      <h4 class="mb-0 text-gray-950">Fitness</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>  
              </div>
            </div>        
      </div>
    </section>
    <!--Fifth Section ends-->  


    <!--Footer-->
    <FooterSection/>
    <!--Footer-->

 </template>

 <script setup>
import { Dumbbell, School, Clapperboard, Drill, Martini, Handshake, Plane, ShoppingCart,} from 'lucide-vue-next'
</script>