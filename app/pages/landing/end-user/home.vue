<template>
  <nav
    class="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
  >
    <div class="container mx-auto px-6 flex items-center justify-between h-16">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2">
        <img
          src="/assets/images/e-user-logo.png"
          alt="Welcome"
          class="h-10 w-auto object-contain"
        />
      </NuxtLink>

      <!-- Desktop Nav Links -->
      <ul class="hidden md:flex items-center space-x-8 text-gray-700 dark:text-gray-200 font-medium">
        <li><NuxtLink to="/">Write a Review</NuxtLink></li>
        <li><NuxtLink to="/">Categories</NuxtLink></li>

        <!-- For Business Dropdown -->
        <li class="relative">
          <button
            @click="toggleBusinessDropdown"
            class="flex items-center hover:text-primary focus:outline-none"
          >
            For Business
            <i class="pi pi-chevron-down ml-1 text-sm"></i>
          </button>

          <div
            v-if="showBusinessDropdown"
            class="absolute mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-56 z-50"
          >
            <NuxtLink
              to="/"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-briefcase mr-2 text-primary"></i>
              Add a Business
            </NuxtLink>
            <NuxtLink
              to="/"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-sign-in mr-2 text-primary"></i>
              Log in to Your Business Account
            </NuxtLink>
          </div>
        </li>
      </ul>

      <!-- Right buttons -->
      <div class="flex items-center space-x-8">

        <!-- Login/Register -->
        <NuxtLink
          to="/auth/end-user/sign-in"
          class="hidden md:inline-flex items-center bg-[#008253] text-white px-4 py-2 rounded-lg ml-2 hover:bg-primary/90 transition"
        >
          Login/Register
        </NuxtLink>

        <!-- Mobile toggle -->
        <button
          class="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none"
          @click="isOpen = !isOpen"
        >
          <i :class="isOpen ? 'pi pi-bars text-sm' : 'pi pi-bars text-sm'"></i>
        </button>
      </div>
    </div>

    <!-- Sidebar for small screens -->
    <div
      :class="[
        'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 md:hidden z-50',
        isOpen ? 'translate-y-0' : '-translate-x-full',
      ]"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <img src="/assets/images/e-user-logo.png" alt="Logo" class="h-8 w-auto" />
        <button @click="isOpen = false" class="text-gray-600 dark:text-gray-200">
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>

      <ul class="flex flex-col bg-white border-b border-gray-200 text-gray-800 dark:text-white font-medium p-8 space-y-4">
        <li><NuxtLink to="/">Write a Review</NuxtLink></li>
        <li><NuxtLink to="/">Categories</NuxtLink></li>

        <!-- For Business Dropdown (Mobile) -->
        <li>
          <button
            @click="toggleBusinessDropdown"
            class="flex items-center justify-between w-full hover:text-primary focus:outline-none"
          >
            <span>For Business</span>
            <i class="pi pi-chevron-down text-sm"></i>
          </button>

          <div v-if="showBusinessDropdown" class="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <NuxtLink
              to="/"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-briefcase mr-2 text-primary"></i>
              Add a Business
            </NuxtLink>
            <NuxtLink
              to="/"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="pi pi-sign-in mr-2 text-primary"></i>
              Log in to Your Business Account
            </NuxtLink>
          </div>
        </li>

        <li>
          <NuxtLink
            to="/auth/end-user/sign-in"
            class="inline-flex items-center justify-center bg-[#008253] text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition w-full text-center"
          >
            Login/Register
          </NuxtLink>
        </li>
      </ul>
    </div>
    <!-- Overlay when sidebar is open -->
    <div
    v-if="isOpen"
    class="fixed inset-0 z-30 md:hidden bg-black/5 backdrop-blur-md transition-all duration-300"
    @click="isOpen = false"
    ></div>
  </nav>
  <!-- Overlay when sidebar is open -->
    <div
    v-if="isOpen"
    class="fixed inset-0 z-30 md:hidden bg-black/5 backdrop-blur-md transition-all duration-300"
    @click="isOpen = false"
    ></div>

<!--First Section Start-->
  <section
    id="hero"
    class="flex flex-col items-center justify-center text-center min-h-[90vh] px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
  >
    <div class="max-w-3xl">
      <h1 class="text-4xl sm:text-4xl md:text-4xl my-0 font-extrabold text-[#008253] mb-4">
       Clear reviews, Confident decisions. 
      </h1>
        <SearchBar />
    </div>
  </section>
<!--First Section Ends-->

<!--Second Section Ends-->
<section>
    <div class="text-[#008253] text-2xl text-center my-11">Top Reviewed</div>
        <div class="container mt-10 mb-11">
          <div class="row gy-6">
            <div class="col-sm-6 col-lg-3">
              <NuxtLink to="/" class="cursor-pointer">
              <div class="card border border-primary shadow-none">
                <div class="card-body text-center">
                  <div class="mb-4 text-primary">
                    
                  </div>
                  <h5 class="mb-0">The Mall</h5>
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
                  <h5 class="mb-0">Eazi Travels</h5>
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
                  <h5 class="mb-0">The Pork Place</h5>
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
                  <h5 class="mb-0">Comfy Airbnb</h5>
                </div>
              </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
<!--Second Section Ends-->

<!--Third Section Begins-->
<section class="my-4">
    <ReviewSlider /> 
</section> 
<!--Third Section Ends-->

<!--Fourth Section begins-->
<section  class="my-4">
    <div class="text-[#008253] text-2xl text-center my-11">Categories</div>
        <div class="container mt-8 mb-11">
          <div class="row gy-6"> 
            <div class="col-sm-6 col-lg-3">
              <NuxtLink to="/" class="cursor-pointer"> 
              <div class="card border border-primary shadow-none">
                <div class="card-body text-center">
                  <div class="mb-4 text-primary"> 
                  </div>
                    <i class="pi pi-building-columns"></i>
                  <h4 class="mb-0">Restuarants</h4>
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
                    <i clss="pi pi-wrench"></i>
                  <h4 class="mb-0">Electronics</h4>
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
                  <i class="pi pi-car"></i>
                  <h4 class="mb-0">Travel</h4>
                  
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
                  <h4 class="mb-0">Home Services</h4>
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
                    <i class="pi pi-warehouse"></i>
                  <h4 class="mb-0">Medical</h4>
                
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
                  <i class="building-columns"></i>
                  <h4 class="mb-0">Hotels</h4>
                  
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
                   <i class="pi pi-briefcase"></i>
                  <h4 class="mb-0">Finance</h4>
                 
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
                  <i class="pi pi-shopping-cart mr-2 text-gray-800"></i>
                  <h4 class="mb-0">Shopping</h4>
                </div>
              </div>
              </NuxtLink>
            </div>
            
          </div>
        </div>
      </section>
<!--Fourth Section Ends-->

</template>


<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const isOpen = ref(false)
const isDark = ref(false)
const showBusinessDropdown = ref(false)

// Theme setup
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const themeIcon = computed(() =>
  isDark.value ? 'pi pi-moon text-xl' : 'pi pi-sun text-xl'
)

// For Business dropdown
const toggleBusinessDropdown = (event: MouseEvent) => {
  event.stopPropagation()
  showBusinessDropdown.value = !showBusinessDropdown.value
}

const handleClickOutside = () => {
  showBusinessDropdown.value = false
}
</script>
