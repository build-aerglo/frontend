<script setup lang="ts">
import { ref } from 'vue'

interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

const billingCycle = ref<'monthly' | 'yearly'>('monthly')

const plans: Plan[] = [
  {
    name: 'Basic',
    price: billingCycle.value === 'monthly' ? '$29' : '$290',
    period: billingCycle.value === 'monthly' ? '/month' : '/year',
    description: 'Perfect for small businesses starting with reviews',
    features: [
      'Up to 100 reviews per month',
      'Basic analytics dashboard',
      'Email support',
      'Review moderation tools',
      'Single website integration'
    ],
    cta: 'Start Basic'
  },
  {
    name: 'Premium',
    price: billingCycle.value === 'monthly' ? '$79' : '$790',
    period: billingCycle.value === 'monthly' ? '/month' : '/year',
    description: 'Best for growing businesses with active customers',
    features: [
      'Unlimited reviews',
      'Advanced analytics & insights',
      'Priority support (24/7)',
      'AI-powered sentiment analysis',
      'Multiple website integrations',
      'Custom branding',
      'Review widgets & embeds'
    ],
    highlighted: true,
    cta: 'Start Premium'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with specific needs',
    features: [
      'Everything in Premium',
      'Dedicated account manager',
      'Custom integrations & API',
      'Advanced security features',
      'SLA guarantee',
      'White-label solution',
      'Custom training & onboarding'
    ],
    cta: 'Contact Sales'
  }
]

const getPlans = () => {
  return plans.map(plan => ({
    ...plan,
    price: plan.name === 'Enterprise' ? 'Custom' : 
           (billingCycle.value === 'monthly' ? 
            (plan.name === 'Basic' ? '$29' : '$79') : 
            (plan.name === 'Basic' ? '$290' : '$790')),
    period: plan.name === 'Enterprise' ? '' : 
            (billingCycle.value === 'monthly' ? '/month' : '/year')
  }))
}
</script>

<template>
  <div class="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Choose Your Perfect Plan
        </h2>
        <p class="text-base md:text-lg text-slate-600 mb-8">
          Start collecting and managing reviews that drive growth
        </p>

        <!-- Billing Toggle -->
        <div class="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-200">
          <button
            @click="billingCycle = 'monthly'"
            :class="[
              'px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all',
              billingCycle === 'monthly'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            Monthly
          </button>
          <button
            @click="billingCycle = 'yearly'"
            :class="[
              'px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all',
              billingCycle === 'yearly'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            Yearly
            <span class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      <!-- Plans Grid - Column on mobile, Row on md+ -->
      <div class="flex flex-col md:flex-row gap-6 md:gap-8 max-w-6xl mx-auto">
        <div
          v-for="(plan, index) in getPlans()"
          :key="index"
          :class="[
            'relative bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col transition-all duration-300',
            plan.highlighted
              ? 'ring-2 ring-slate-900 md:scale-105 md:z-10'
              : 'hover:shadow-xl',
            'md:flex-1'
          ]"
        >
          <div
            v-if="plan.highlighted"
            class="absolute -top-4 left-1/2 -translate-x-1/2"
          >
            <span class="bg-slate-900 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>

          <div class="mb-6">
            <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2">
              {{ plan.name }}
            </h3>
            <p class="text-slate-600 text-sm">{{ plan.description }}</p>
          </div>

          <div class="mb-6">
            <div class="flex items-baseline">
              <span class="text-4xl md:text-5xl font-bold text-slate-900">
                {{ plan.price }}
              </span>
              <span class="text-slate-600 ml-2">{{ plan.period }}</span>
            </div>
          </div>

          <ul class="space-y-3 md:space-y-4 mb-8 flex-grow">
            <li
              v-for="(feature, i) in plan.features"
              :key="i"
              class="flex items-start"
            >
              <svg
                class="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="text-slate-700 text-sm">{{ feature }}</span>
            </li>
          </ul>

          <button
            :class="[
              'w-full py-3 px-6 rounded-lg font-medium transition-all',
              plan.highlighted
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            ]"
          >
            {{ plan.cta }}
          </button>
        </div>
      </div>

      <!-- Footer Note -->
      <div class="text-center mt-12">
        <p class="text-slate-600 text-sm">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  </div>
</template>