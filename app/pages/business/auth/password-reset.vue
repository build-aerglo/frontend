<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Success State -->
        <div v-if="isSubmitted">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <i class="pi pi-check text-3xl text-[#008253]"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p class="text-gray-600">
              We've sent a password reset link to <span class="font-semibold text-gray-900">{{ email }}</span>
            </p>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex gap-3">
              <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
              <div class="text-sm text-blue-800">
                <p class="font-semibold mb-1">Didn't receive the email?</p>
                <p>Check your spam folder or try again in a few minutes.</p>
              </div>
            </div>
          </div>

          <button
            @click="isSubmitted = false"
            class="w-full bg-[#008253] hover:bg-[#006b44] text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Try Another Email
          </button>

          <div class="text-center mt-6">
            <NuxtLink to="/business/auth/sign-in" class="text-sm font-medium text-[#008253] hover:underline">
              <i class="pi pi-arrow-left mr-2"></i>
              Back to Sign In
            </NuxtLink>
          </div>
        </div>

        <!-- Form State -->
        <div v-else>
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <i class="pi pi-lock text-3xl text-[#008253]"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p class="text-gray-600">
              Type in your email address for reset instructions.
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <div class="relative">
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="block w-full pl-2 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all outline-none"
                  placeholder="Email"
                  :class="{ 'ring-2 ring-[#008253]': email }"
                />
              </div>
              <p v-if="error" class="mt-2 text-sm text-red-600 flex items-center gap-1">
                <i class="pi pi-exclamation-circle"></i>
                {{ error }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-[#008253] hover:bg-[#006b44] text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="isLoading" class="pi pi-spin pi-spinner"></i>
              <i v-else class="pi pi-send"></i>
              {{ isLoading ? 'Sending...' : 'Reset Password' }}
            </button>
          </form>

          <div class="text-center mt-6">
            <NuxtLink to="/business/auth/sign-in" class="text-sm font-medium text-[#008253] hover:underline">
              <i class="pi pi-arrow-left mr-2"></i>
              Back to Sign In
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref<string>('')
const isSubmitted = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const error = ref<string>('')

const handleSubmit = async () => {
  error.value = ''
  
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Please enter a valid email address'
    return
  }

  isLoading.value = true
  
  try {
    // call API 
    // await $fetch('/api/forgot-password', {
    //   method: 'POST',
    //   body: { email: email.value }
    // })
    
    // Simulate 
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    isSubmitted.value = true
  } catch (err) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>