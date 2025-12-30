<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h3 class="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Choose Your Plan</h3>
        <p class="text-md text-[#deae29] mb-6">Get 3 days free trial on any plan. No credit card required.</p>
        
        <!-- Billing Toggle -->
        <div class="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-200">
          <button 
            @click="billingCycle = 'monthly'"
            :class="billingCycle === 'monthly' ? 'bg-emerald-600 text-white' : 'text-gray-700'"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all"
          >
            Monthly
          </button>
          <button 
            @click="billingCycle = 'yearly'"
            :class="billingCycle === 'yearly' ? 'bg-emerald-600 text-white' : 'text-gray-700'"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all"
          >
            Yearly
            <span class="ml-2 px-2 py-0.5 bg-amber-100 text-[#deae29] text-xs rounded-full">Save 20%</span>
          </button>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
        <!-- Basic Plan -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-shadow">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Basic</h3>
            <p class="text-gray-600 mt-2">Perfect for small businesses starting out</p>
          </div>

          <div class="mb-6">
            <div class="flex items-baseline">
              <span class="text-3xl font-bold text-gray-900">₦{{ formatPrice(plans.basic[billingCycle]) }}</span>
              <span class="text-gray-600 ml-2">/{{ billingCycle === 'monthly' ? 'month' : 'year' }}</span>
            </div>
            <p class="text-sm text-[#deae29] font-medium mt-2">3 days free trial</p>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">Up to 50 reviews/month</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">1 business listing</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">Basic analytics</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">Email support</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">Review widgets</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-times text-gray-400 mt-1"></i>
              <span class="text-gray-400">Priority support</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-times text-gray-400 mt-1"></i>
              <span class="text-gray-400">Custom branding</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-times text-gray-400 mt-1"></i>
              <span class="text-gray-400">API access</span>
            </li>
          </ul>

          <button 
            @click="selectPlan('basic')"
            class="w-full py-3 px-6 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Start Free Trial
          </button>
        </div>

        <!-- Premium Plan (Popular) -->
        <div class="bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-8 relative transform md:scale-105 hover:shadow-2xl transition-all">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-gradient-to-r from-amber-300 to-[#deae29] text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </span>
          </div>

          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Premium</h3>
            <p class="text-gray-600 mt-2">Ideal for growing businesses</p>
          </div>

          <div class="mb-6">
            <div class="flex items-baseline">
              <span class="text-3xl font-bold text-gray-900">₦{{ formatPrice(plans.premium[billingCycle]) }}</span>
              <span class="text-gray-600 ml-2">/{{ billingCycle === 'monthly' ? 'month' : 'year' }}</span>
            </div>
            <p class="text-sm text-[#deae29] font-medium mt-2">3 days free trial</p>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700 font-medium">Unlimited reviews</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700 font-medium">Up to 5 business listings</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700 font-medium">Advanced analytics</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700 font-medium">Priority email support</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700 font-medium">Custom review widgets</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700 font-medium">Review moderation tools</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700 font-medium">Custom branding</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700 font-medium">Basic API access</span>
            </li>
          </ul>

          <button 
            @click="selectPlan('premium')"
            class="w-full py-3 px-6 bg-gradient-to-r from-amber-300 to-[#deae29] text-white rounded-xl font-semibold hover:from-amber-400 hover:to-[#deae29] transition-all shadow-lg"
          >
            Start Free Trial
          </button>
        </div>

        <!-- Enterprise Plan -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-shadow">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Enterprise</h3>
            <p class="text-gray-600 mt-2">For large organizations with custom needs</p>
          </div>

          <div class="mb-6">
            <div class="flex items-baseline">
              <span class="text-3xl font-bold text-gray-900">₦{{ formatPrice(plans.enterprise[billingCycle]) }}</span>
              <span class="text-gray-600 ml-2">/{{ billingCycle === 'monthly' ? 'month' : 'year' }}</span>
            </div>
            <p class="text-sm text-[#deae29] font-medium mt-2">3 days free trial</p>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700 font-semibold">Everything in Premium</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">Unlimited business listings</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">White-label solution</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">Dedicated account manager</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">24/7 phone support</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">Full API access</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">Custom integrations</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="pi pi-check text-[#deae29] mt-1"></i>
              <span class="text-gray-700">SLA guarantee</span>
            </li>
          </ul>

          <button 
            @click="selectPlan('enterprise')"
            class="w-full py-3 px-6 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </div>

      <!-- Trust Badges -->
      <div class="text-center mb-12">
        <p class="text-gray-600 mb-6">Trusted by businesses across Nigeria</p>
        <div class="flex flex-wrap items-center justify-center gap-8">
          <div class="flex items-center gap-2 text-gray-500">
            <i class="pi pi-shield text-xl text-emerald-700"></i>
            <span class="text-sm font-medium">Secure Payments</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="pi pi-clock text-xl text-blue-600"></i>
            <span class="text-sm font-medium">24/7 Support</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="pi pi-refresh text-xl text-fuchsia-600"></i>
            <span class="text-sm font-medium">Cancel Anytime</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            <i class="pi pi-star-fill text-xl text-[#deae29]"></i>
            <span class="text-sm font-medium">4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Selection Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-check text-green-600 text-3xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Start Your Free Trial</h3>
          <p class="text-gray-600">You've selected the <span class="font-semibold capitalize">{{ selectedPlan }}</span> plan</p>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">Plan:</span>
            <span class="font-semibold text-gray-900 capitalize">{{ selectedPlan }}</span>
          </div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">Billing:</span>
            <span class="font-semibold text-gray-900 capitalize">{{ billingCycle }}</span>
          </div>
          <div class="border-t border-gray-200 mt-3 pt-3">
            <div class="flex items-center justify-between">
              <span class="text-green-600 font-medium">Free Trial:</span>
              <span class="text-green-600 font-semibold">3 Days</span>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p class="text-sm text-blue-800">
            <i class="pi pi-info-circle mr-2"></i>
            No credit card required. Cancel anytime during trial.
          </p>
        </div>

        <div class="flex gap-3">
          <button 
            @click="closeModal"
            class="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmPlan"
            class="flex-1 py-3 px-6 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const billingCycle = ref<'monthly' | 'yearly'>('monthly')
const showModal = ref(false)
const selectedPlan = ref('')

const plans = {
  basic: {
    monthly: 5000,
    yearly: 48000 // 20% discount
  },
  premium: {
    monthly: 15000,
    yearly: 144000 // 20% discount
  },
  enterprise: {
    monthly: 50000,
    yearly: 480000 // 20% discount
  }
}

const comparisonFeatures = [
  { name: 'Reviews per month', basic: '50', premium: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Business listings', basic: '1', premium: '5', enterprise: 'Unlimited' },
  { name: 'Analytics dashboard', basic: true, premium: true, enterprise: true },
  { name: 'Email support', basic: true, premium: true, enterprise: true },
  { name: 'Review widgets', basic: true, premium: true, enterprise: true },
  { name: 'Priority support', basic: false, premium: true, enterprise: true },
  { name: 'Custom branding', basic: false, premium: true, enterprise: true },
  { name: 'API access', basic: false, premium: 'Basic', enterprise: 'Full' },
  { name: 'White-label solution', basic: false, premium: false, enterprise: true },
  { name: 'Dedicated account manager', basic: false, premium: false, enterprise: true },
  { name: '24/7 phone support', basic: false, premium: false, enterprise: true },
  { name: 'SLA guarantee', basic: false, premium: false, enterprise: true }
]

const formatPrice = (price: number) => {
  return price.toLocaleString('en-NG')
}

const selectPlan = (plan: string) => {
  selectedPlan.value = plan
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPlan.value = ''
}

const confirmPlan = () => {
  alert(`Starting your 3-day free trial for the ${selectedPlan.value} plan!`)
  closeModal()
  // redirect to signup/payment page
}

</script>

<style>
kbd {
  font-family: monospace;
  font-size: 0.875rem;
}
</style>