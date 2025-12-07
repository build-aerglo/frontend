<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="card p-6 col-span-2">
      
      <div class="flex justify-between items-center mb-6">
        <p class="text-[110%] font-bold text-contrast">PROFILE DETAILS</p>
        
        <button class="text-gray-500 hover:text-primary transition-colors p-2 rounded-full">
          <i class="pi pi-pencil text-lg"></i>
        </button>
      </div>
  
      <section class="mb-6">
        <h2 class="text-xs font-semibold uppercase text-gray-500 mb-4">Profile Details</h2>
        
        <div class="space-y-4">
          
          <div class="flex items-center text-gray-700">
            <i class="pi pi-briefcase w-6 text-lg"></i>
            <span class="ml-3">Name: <span class="font-medium text-gray-900">CleReview Solutions</span></span>
          </div>
          
          <div class="flex items-center text-gray-700">
            <i class="pi pi-tag w-6 text-lg"></i>
            <span class="ml-3">Sector: <span class="font-medium text-gray-900">E-commerce / Retail</span></span>
          </div>
          
          <div class="flex items-center text-gray-700">
            <i class="pi pi-calendar-clock w-6 text-lg"></i>
            <span class="ml-3">Days: <span class="font-medium text-gray-900">Monday - Saturday</span></span>
          </div>
          
          <div class="flex items-center text-gray-700">
            <i class="pi pi-clock w-6 text-lg"></i>
            <span class="ml-3">Time: <span class="font-medium text-gray-900">9:00 AM - 5:00 PM</span></span>
          </div>
        </div>
      </section>
      
      <section class="mb-6 pt-6 border-t border-gray-100">
        <h2 class="text-xs font-semibold uppercase text-gray-500 mb-4">Description</h2>
        <p class="text-sm text-gray-700">
          Providing insightful feedback solutions to help businesses optimize operations and enhance customer satisfaction.
        </p>
      </section>
  
      <section class="mb-6 pt-6 border-t border-gray-100">
        <h2 class="text-xs font-semibold uppercase text-gray-500 mb-4">Address</h2>
        
        <div class="space-y-4">
          
          <div class="flex items-start text-gray-700">
            <i class="pi pi-map-marker w-6 text-lg mt-1"></i>
            <span class="ml-3 flex flex-col">
              <span class="font-medium text-gray-900">123 Feedback Lane, Suite 4A</span>
              <span class="text-sm text-gray-600">City/Town: Metropolis, State: Lagos</span>
              <span class="text-sm text-gray-600">LGA: Ikeja</span>
            </span>
          </div>
        </div>
      </section>
  
      <section class="pt-6 border-t border-gray-100">
        <h2 class="text-xs font-semibold uppercase text-gray-500 mb-4">Contacts</h2>
        
        <div class="space-y-4">
          
          <div class="flex items-center text-gray-700">
            <i class="pi pi-phone w-6 text-lg"></i>
            <span class="ml-3">Phone: <span class="font-medium text-gray-900">(+234) 800 123 4567</span></span>
          </div>
          
          <div class="flex items-center text-gray-700">
            <i class="pi pi-envelope w-6 text-lg"></i>
            <span class="ml-3">Email: <span class="font-medium text-gray-900">support@clereview.com</span></span>
          </div>
        </div>
      </section>
    </div>
    <div class="card p-6 col-span-1">
      <div class="mb-4 flex items-center gap-2">
        <i class="pi pi-clock font-bold !text-primary"></i>
        <span class="text-[110%] font-bold text-contrast">ACTIVITY SUMMARY</span>
      </div>
      
      <div class="space-y-4">
        
        <div class="pt-3">
          <h2 class="text-lg font-semibold text-gray-700">Review Summary</h2>
          <p class="text-sm text-gray-500 mt-1">Overall rating visualization will go here.</p>
        </div>
        
        <hr class="border-gray-200" />
        
        <div class="pt-1">
          <h2 class="text-lg font-semibold text-gray-700">Total Review</h2>
          <p class="text-sm text-gray-500 mt-1">Total number of reviews received.</p>
        </div>
        
        <hr class="border-gray-200" />
        
        <div class="pt-1">
          <h2 class="text-lg font-semibold text-gray-700">Average Response Time</h2>
          <p class="text-sm text-gray-500 mt-1">Average time taken to respond to reviews.</p>
        </div>
        
        <hr class="border-gray-200" />
        
        <div class="pt-1">
          <h2 class="text-lg font-semibold text-gray-700">Number of profile hits</h2>
          <p class="text-sm text-gray-500 mt-1">Total number of unique views on the profile.</p>
        </div>
  
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>