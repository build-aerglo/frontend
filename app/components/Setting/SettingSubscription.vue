<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
    <!-- Header Section -->
    <div class="pt-4 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <h4 class="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
          Choose Your Perfect Plan
        </h4>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Get started with our flexible pricing options. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>
    </div>

    <!-- Pricing Cards -->
    <div class="pb-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <SubscriptionCard
            v-for="tier in subscriptionTiers"
            :key="tier.name"
            :tier="tier"
            @subscribe="handleSubscribe"
          />
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="py-8 px-4 sm:px-3 lg:px-4 bg-white">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div class="space-y-3">
          <details class="group border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors">
            <summary class="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
              Can I change my plan later?
              <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </summary>
            <p class="mt-2 text-gray-600">
              Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </details>

          <details class="group border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors">
            <summary class="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
              Do you offer a free trial?
              <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </summary>
            <p class="mt-3 text-gray-600">
              Yes, we offer a 14-day free trial on all plans. No credit card required to start your trial.
            </p>
          </details>

          <details class="group border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors">
            <summary class="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
              What payment methods do you accept?
              <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </summary>
            <p class="mt-3 text-gray-600">
              We accept all major credit cards, PayPal, and can arrange invoicing for Enterprise customers.
            </p>
          </details>
        </div>
      </div>
    </div>

    <!-- Trust Section -->
    <div class="py-16 px-4 sm:px-6 lg:px-8 bg-[#008253]">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-2xl font-bold text-white mb-4">
          Trusted by 10,000+ businesses worldwide
        </h3>
        <p class="text-indigo-100 mb-8">
          Join thousands of companies using our platform to manage their reviews effectively
        </p>
        <div class="flex justify-center space-x-8 text-white">
          <div>
            <div class="text-4xl font-bold">10k+</div>
            <div class="text-indigo-200">Active Users</div>
          </div>
          <div>
            <div class="text-4xl font-bold">1M+</div>
            <div class="text-indigo-200">Reviews Managed</div>
          </div>
          <div>
            <div class="text-4xl font-bold">99.9%</div>
            <div class="text-indigo-200">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SubscriptionTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'enterprise';
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Basic',
    price: 10000,
    period: 'month',
    description: 'Perfect for individuals and small projects',
    features: [
      'Up to 100 reviews per month',
      'Basic analytics dashboard',
      'Email support',
      '1 team member'
    ],
    buttonText: 'Start Free Trial'
  },
  {
    name: 'Premium',
    price: 50000,
    period: 'month',
    description: 'Best for growing businesses and teams',
    features: [
      'Unlimited reviews',
      'Advanced analytics & insights',
      'Priority email & chat support',
      'API access',
      'Up to 10 team members',
      'Automated review requests'
    ],
    highlighted:true,
    buttonText: 'Get Premium',
    buttonVariant: 'primary'
  },
  {
    name: 'Enterprise',
    price: 100000,
    period: 'month',
    description: 'For large organizations with advanced needs',
    features: [
      'Everything in Premium',
      'Unlimited team members',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'Advanced security features',
      'Custom contract terms',
      'On-premise deployment option',
      'Training & onboarding'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'enterprise'
  }
];

const handleSubscribe = (tierName: string) => {
  console.log(`Subscribing to ${tierName} plan`);
  // Add your subscription logic here
  // For example: navigateTo('/checkout?plan=' + tierName.toLowerCase())
  alert(`You selected the ${tierName} plan! Redirecting to checkout...`);
};

// SEO Meta tags
useHead({
  title: 'Subscription Plans - Choose Your Perfect Plan',
  meta: [
    {
      name: 'description',
      content: 'Choose the perfect subscription plan for your review management needs. From Basic to Enterprise, we have a plan that fits your business.'
    }
  ]
});
</script>