<template>
    <!--Header-->
    <NavBar/>
    <!--Header-->

    <!--First Section Start-->
    <section
    id="hero"
    class="relative flex flex-col items-center justify-center text-center min-h-[80vh] px-6 overflow-hidden"
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
        <div class="text-[#008253] text-2xl text-center my-11">Top Reviewed</div>
            <div class="container mt-10 mb-11">
              <div class="row gy-6">
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-primary">
                        
                      </div>
                      <h5 class="mb-0 text-gray-950">The Mall</h5>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-success shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-success">
                        
                      </div>
                      <h5 class="mb-0 text-gray-950">Eazi Travels</h5>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-info shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-info">
                        
                      </div>
                      <h5 class="mb-0 text-gray-950">The Pork Place</h5>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-warning shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-warning">
                        
                      </div>
                      <h5 class="mb-0 text-gray-950">Comfy Airbnb</h5>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </section>
    <!--Second Section Ends-->

    <!--Third Section Begins-->
    <section class="my-8">
        <ReviewSlider /> 
    </section> 
    <!--Third Section Ends-->

    <!--Fourth Section begins-->
    <section  class="my-8">
        <div class="text-[#008253] text-2xl text-center my-11">Categories</div>
            <div class="container mt-8 mb-11">
              <div class="row gy-6"> 
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer"> 
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-primary"> 
                      </div>
                        <i class="pi pi-building-columns text-gray-950"></i>
                      <h4 class="mb-0 text-gray-950">Restuarants</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
              
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-primary"> 
                      </div>
                        <i class="pi pi-wrench text-gray-950"></i>
                      <h4 class="mb-0 text-gray-950">Electronics</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-primary"> 
                      </div>
                      <i class="pi pi-car text-gray-950"></i>
                      <h4 class="mb-0 text-gray-950">Travel</h4>
                      
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-primary"> 
                      </div>
                      <i class="pi pi-home mr-2 text-gray-800"></i>
                      <h4 class="mb-0 text-gray-800">Home Services</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-primary shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-primary"> 
                      </div>
                        <i class="pi pi-building text-gray-950"></i>
                      <h4 class="mb-0 text-gray-950">Medical</h4>
                    
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-info shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-info">
                        
                      </div>
                      <i class="pi pi-briefcase text-gray-950"></i>
                      <h4 class="mb-0 text-gray-950">Business Services</h4>
                    
                    </div>
                  </div>
                  </NuxtLink>
                </div>
                
                
                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-warning shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-warning">
                        
                      </div>
                      <i class="pi pi-shopping-cart mr-2 text-gray-950"></i>
                      <h4 class="mb-0 text-gray-950">Shopping</h4>
                    </div>
                  </div>
                  </NuxtLink>
                </div>

                <div class="col-sm-6 col-lg-3">
                  <NuxtLink to="/" class="cursor-pointer">
                  <div class="card border border-success shadow-none">
                    <div class="card-body text-center">
                      <div class="mb-4 text-success"> 
                      </div>
                      <h4 class="mb-4 text-gray-950">More</h4>
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
