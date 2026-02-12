<template>
  <Dialog
    v-model:visible="showPaymentMethods"
    :draggable="false"
    position="top"
    modal
    header="Select Payment Method"
    :style="{ width: '30rem' }"
  >
    <div class="flex gap-[20px] flex-wrap">
      <img
        v-for="(i, idx) in paymentMethods"
        :key="idx"
        :src="i.logo"
        :alt="i.name"
        class="w-[96px] h-[40px] cursor-pointer rounded-[5px] object-cover object-center"
        :class="i.id === paymentSetup.method ? 'border border-primary' : ''"
        @click="setPaymentMethod(i.id)"
      />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <ButtonCustom
          label="Continue to checkout"
          primary="true"
          input-class="w-max"
          @click="checkoutAsync"
          size="lg"
        />
      </div>
    </template>
  </Dialog>

  <div>
    <Card class="px-[10px] mb-[20px]">
      <template #content>
        <h1 class="text-[150%] text-contrast mb-4 font-bold">
          Business Subscription:
        </h1>
        <GeneralLoader height="200px" v-if="isLoadingSubscriptions" />
        <div class="flex flex-col gap-2.5" v-else>
          <div>Selected Plan: {{ businessSubscription?.planName }}</div>
          <div>
            Start Date: {{ dateFormat(businessSubscription?.startDate!) }}
          </div>
          <div>End Date: {{ dateFormat(businessSubscription?.endDate!) }}</div>
          <div class="border w-[10%] my-[20px]"></div>
          <div>
            Replies Usage:
            {{
              `${businessSubscription?.usage.repliesUsed}/${businessSubscription?.usage.repliesRemaining}`
            }}
          </div>
          <div>
            Disputes Usage:
            {{
              `${businessSubscription?.usage.disputesUsed}/${businessSubscription?.usage.disputesRemaining}`
            }}
          </div>
        </div>

        <!-- Header Section -->
        <div class="mt-[100px] mb-[50px]">
          <div class="max-w-7xl mx-auto text-center">
            <h4 class="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Upgrade Business Plan
            </h4>
            <p class="text-gray-600 w-full sm:w-[500px] mx-auto">
              With our flexible pricing options, you can upgrade, downgrade, or
              cancel a subscription service anytime.
            </p>
          </div>
        </div>

        <div class="pb-[20px]">
          <div
            v-if="subscriptions.length > 0"
            class="flex mb-[20px] gap-2.5 items-center justify-end"
          >
            <ToggleSwitch v-model="isAnnually" />
            <div>Annual Payment</div>
          </div>
          <GeneralLoader v-if="isLoading" height="300px" />
          <div class="grid sm:grid-cols-3 grid-cols-1 gap-2.5" v-else>
            <SubscriptionSingle
              v-for="(i, idx) in subscriptions"
              :key="idx"
              :tier="i"
              :business-plan="businessSubscription?.subscriptionPlanId ?? null"
              :is-annually="isAnnually"
              @clicked="setPaymentPlan"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- FAQ Section -->
    <div class="py-8 px-4 sm:px-3 lg:px-4 bg-white">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div class="space-y-3">
          <details
            class="group border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors"
          >
            <summary
              class="font-semibold text-gray-900 cursor-pointer flex justify-between items-center"
            >
              Can I change my plan later?
              <svg
                class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p class="mt-2 text-gray-600">
              Yes! You can upgrade or downgrade your plan at any time. Changes
              will be reflected in your next billing cycle.
            </p>
          </details>

          <details
            class="group border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors"
          >
            <summary
              class="font-semibold text-gray-900 cursor-pointer flex justify-between items-center"
            >
              Do you offer a free trial?
              <svg
                class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p class="mt-3 text-gray-600">
              Yes, we offer a 14-day free trial on all plans. No credit card
              required to start your trial.
            </p>
          </details>

          <details
            class="group border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors"
          >
            <summary
              class="font-semibold text-gray-900 cursor-pointer flex justify-between items-center"
            >
              What payment methods do you accept?
              <svg
                class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p class="mt-3 text-gray-600">
              We accept all major credit cards, PayPal, and can arrange
              invoicing for Enterprise customers.
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
          Join thousands of companies using our platform to manage their reviews
          effectively
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
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import usePayments from "~/composables/payment/usePayments";
import type { Subscription, BusinessSubscription } from "~/types/business";
const { getBusinessSubscriptions, getBusinessSubscriptionSummary } =
  useBusinessMethods();
const { checkoutPaystack } = usePayments();

const isAnnually = ref(false);
const toast = useToast();

const business = ref({
  businessEmail: "etiketochukwu@gmail.com",
});
const paymentSetup = ref({
  plan: "",
  amount: 0,
  method: "paystack",
  email: business.value.businessEmail,
  reference: "",
});

const showPaymentMethods = ref(false);
const setPaymentMethod = (method: string) => {
  paymentSetup.value.method = method;
};
const setPaymentPlan = (plan: Subscription) => {
  if (!plan) return;

  paymentSetup.value.plan = plan.id;
  paymentSetup.value.amount = isAnnually.value
    ? plan.annualPrice
    : plan.monthlyPrice;

  showPaymentMethods.value = true;
};

const checkoutAsync = async () => {
  if (!paymentSetup.value.plan || !paymentSetup.value.email) {
    return toast.add({
      severity: "error",
      summary: "ERROR",
      detail: "Missing Payment Setup.",
      life: 3000,
    });
  }

  if (paymentSetup.value.method === "stripe") {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Stripe setup coming soon.",
      life: 3000,
    });
  }

  try {
    const res = await checkoutPaystack({
      email: paymentSetup.value.email,
      amount: paymentSetup.value.amount * 100,
    });

    if (res.ok) {
      paymentSetup.value.reference = res.reference!;
      console.log(res.url);
    }
  } catch (error) {
    console.log(error);
  }
};

const paymentMethods = [
  { id: "paystack", name: "Paystack", logo: "/images/paystack-logo.webp" },
  { id: "stripe", name: "Stripe", logo: "/images/stripe-logo.png" },
];

// SEO Meta tags
useHead({
  title: "Subscription Plans - Choose Your Perfect Plan",
  meta: [
    {
      name: "description",
      content:
        "Choose the perfect subscription plan for your review management needs. From Basic to Enterprise, we have a plan that fits your business.",
    },
  ],
});

const businessSubscription = ref<BusinessSubscription>();
const subscriptions = ref<Subscription[]>([]);

const isLoadingSubscriptions = ref(false);
const getBusinessSubscriptionsAsync = async () => {
  try {
    isLoadingSubscriptions.value = true;
    if (subscriptions.value !== null) {
      return await getBusinessSubscriptions();
    }

    return null;
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingSubscriptions.value = false;
  }
};

const isLoading = ref(false);
const getBusinessSubscriptionSummaryAsync = async () => {
  try {
    isLoading.value = true;
    return await getBusinessSubscriptionSummary();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onBeforeMount(async () => {
  try {
    const [res, businessRes] = await Promise.all([
      getBusinessSubscriptionsAsync(),
      getBusinessSubscriptionSummaryAsync(),
    ]);

    if (res && res.statusCode === 200) {
      subscriptions.value = res.data;
    }

    if (businessRes?.statusCode === 200) {
      businessSubscription.value = businessRes.data;
    }

    // subscriptions.value = [
    //   {
    //     id: "cdd7c928-f88f-4a96-b3fc-00dc9b6ecb4f",
    //     name: "Basic",
    //     tier: 0,
    //     description: "Free plan with essential features",
    //     monthlyPrice: 0,
    //     annualPrice: 0,
    //     currency: "NGN",
    //     monthlyReplyLimit: 10,
    //     monthlyDisputeLimit: 5,
    //     externalSourceLimit: 1,
    //     userLoginLimit: 1,
    //     privateReviewsEnabled: false,
    //     dataApiEnabled: false,
    //     dndModeEnabled: false,
    //     autoResponseEnabled: false,
    //     branchComparisonEnabled: false,
    //     competitorComparisonEnabled: false,
    //     isActive: true,
    //   },
    //   {
    //     id: "fca29884-95a2-4673-a09d-69cf9e8885a1",
    //     name: "Premium",
    //     tier: 1,
    //     description: "Enhanced features for growing businesses",
    //     monthlyPrice: 15000,
    //     annualPrice: 150000,
    //     currency: "NGN",
    //     monthlyReplyLimit: 120,
    //     monthlyDisputeLimit: 25,
    //     externalSourceLimit: 3,
    //     userLoginLimit: 3,
    //     privateReviewsEnabled: true,
    //     dataApiEnabled: false,
    //     dndModeEnabled: false,
    //     autoResponseEnabled: false,
    //     branchComparisonEnabled: false,
    //     competitorComparisonEnabled: false,
    //     isActive: true,
    //   },
    //   {
    //     id: "9832a474-f956-4408-b1de-82fb872f4ad5",
    //     name: "Enterprise",
    //     tier: 2,
    //     description: "Full-featured plan for large businesses",
    //     monthlyPrice: 50000,
    //     annualPrice: 500000,
    //     currency: "NGN",
    //     monthlyReplyLimit: 2147483647,
    //     monthlyDisputeLimit: 2147483647,
    //     externalSourceLimit: 2147483647,
    //     userLoginLimit: 10,
    //     privateReviewsEnabled: true,
    //     dataApiEnabled: true,
    //     dndModeEnabled: true,
    //     autoResponseEnabled: true,
    //     branchComparisonEnabled: true,
    //     competitorComparisonEnabled: true,
    //     isActive: true,
    //   },
    // ];
  } catch (error) {
    console.log(error);
  }
});
</script>
