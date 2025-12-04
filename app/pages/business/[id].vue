<template>
<NavBarProfile/>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-start justify-between gap-6 flex-wrap">
          <!-- Business Info -->
          <div class="flex-1 min-w-[300px]">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <i class="pi pi-building text-4xl text-gray-400"></i>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Business Name</h1>
                <div class="flex items-center gap-2 mt-1">
                  <span class="px-2 py-1 bg-amber-100 text-yellow-800 text-xs font-medium rounded">
                    Unclaimed
                  </span>
                  <span class="text-gray-500 text-sm">Category</span>
                </div>
              </div>
            </div>
            
            <!-- Rating -->
            <div class="flex items-center gap-2 mt-3">
              <div class="flex">
                <Stars v-for="n in 5" class="w-4 h-4"/>
              </div>
              <span class="text-gray-500 text-sm">No ratings yet</span>
            </div>
          </div>

          <!-- Claim Button -->
          <div>
            <button 
              @click="showModal = true"
              class="px-4 py-3 bg-[#008253] hover:bg-[#008257] text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <i class="pi pi-check-circle"></i>
              Claim This Business
            </button>
          </div>
        </div>

        <!-- Contact Info Placeholder -->
        <div class="mt-4 grid grid-cols-1 gap-2">
          <div class="flex items-center gap-2 text-gray-400">
            <i class="pi pi-map-marker"></i>
            <span>Address not available</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <i class="pi pi-phone"></i>
            <span>Phone not available</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <i class="pi pi-globe"></i>
            <span>Website not available</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Reviews -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Why Claim Banner -->
          <div class="bg-green-50 border border-blue-200 rounded-lg p-6">
            <h2 class="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
              <i class="pi pi-info-circle"></i>
              Is this your business?
            </h2>
            <p class="text-green-800 mb-4">
              Claim this business to manage your reviews, update business information, and engage with customers.
            </p>
            <ul class="space-y-2 text-sm text-green-800">
              <li class="flex items-start gap-2">
                <i class="pi pi-check text-green-600 mt-0.5"></i>
                <span>Respond to customer reviews</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="pi pi-check text-green-600 mt-0.5"></i>
                <span>Update business hours and contact information</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="pi pi-check text-green-600 mt-0.5"></i>
                <span>Upload photos and showcase your business</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="pi pi-check text-green-600 mt-0.5"></i>
                <span>Access analytics and insights</span>
              </li>
            </ul>
          </div>

          <!-- Reviews Section -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="pi pi-comment"></i>
              Customer Reviews
            </h2>
            
            <div class="text-center py-12">
              <i class="pi pi-comments text-6xl text-gray-300 mb-4"></i>
              <h3 class="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
            </div>
          </div>

          <!-- About Section -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="pi pi-info-circle"></i>
              About
            </h2>
            <div class="text-gray-400 italic">
              Business description not available. Claim this business to add information.
            </div>
          </div>
        </div>

        <!-- Right Column - Business Info -->
        <div class="space-y-6">
          <!-- Business Hours -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="pi pi-clock"></i>
              Business Hours
            </h3>
            <div class="space-y-2 text-gray-400 text-sm">
              <div class="flex justify-between">
                <span>Not available</span>
              </div>
            </div>
          </div>


          <!-- Location Map Placeholder -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="pi pi-map"></i>
              Location
            </h3>
            <div class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <i class="pi pi-map-marker text-4xl text-gray-300 mb-2"></i>
                <p class="text-gray-400 text-sm">Location not available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Claim Business Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-[#008253]">Claim This Business</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008253]"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008253]"
              placeholder="Email Address"
            />
          </div>

          <div>
            <input
              v-model="form.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008253]"
              placeholder="Phone Number"
            />
          </div>

          <div>
            <Dropdown
              v-model="form.role"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select your role"
              class="w-full"
              :pt="{
                root: { class: 'border border-gray-300 rounded-lg' },
                input: { class: 'px-3 py-2' }
              }"
            />
          </div>

          <div class="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
            <i class="pi pi-info-circle mr-1"></i>
            We'll verify your claim and contact you within 2-3 business days.
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="showModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="handleSubmit"
              class="flex-1 px-4 py-2 bg-[#008253] hover:bg-[#008260] text-white rounded-lg transition-colors"
            >
              Submit Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showModal = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  role: ''
})

const roleOptions = ref([
  { label: 'Owner', value: 'owner' },
  { label: 'Manager', value: 'manager' },
  { label: 'Employee', value: 'employee' },
  { label: 'Authorized Representative', value: 'authorized' }
])

const handleSubmit = () => {
  console.log('Claim submitted:', form.value)
  // Handle form submission
  showModal.value = false
  form.value = { name: '', email: '', phone: '', role: '' }
}
</script>