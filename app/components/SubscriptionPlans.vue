<template>
  <section class="min-h-screen bg-slate-50 pb-24">

    <!-- ══ PAGE HEADER ══ -->
    <div class="text-center px-6 pt-12 pb-6">
      <span class="items-center gap-1.5 text-[0.62rem] font-extrabold tracking-[0.2em] uppercase text-emerald-600 border border-emerald-300 bg-emerald-50 px-4 py-1 rounded-full mb-4 block w-fit mx-auto">
        ✦ Choose your plan
      </span>
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-3">
        Simple, <span class="text-emerald-600 text-3xl">Transparent</span> Pricing
      </h1>
      <p class="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Pick the plan that fits your scale. Upgrade or downgrade at any time — no hidden fees.
      </p>
    </div>

    <!-- ══ ANNUAL / MONTHLY TOGGLE ══ -->
    <div class="flex items-center justify-center gap-3 pb-8">
      <span
        class="text-sm font-semibold transition-colors"
        :class="!isAnnually ? 'text-slate-800' : 'text-slate-400'"
      >
        Monthly
      </span>
      <button
        class="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none"
        :class="isAnnually ? 'bg-emerald-500' : 'bg-slate-300'"
        @click="isAnnually = !isAnnually"
        aria-label="Toggle billing period"
      >
        <span
          class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
          :class="isAnnually ? 'translate-x-6' : 'translate-x-0'"
        />
      </button>
      <span
        class="text-sm font-semibold transition-colors flex items-center gap-2"
        :class="isAnnually ? 'text-slate-800' : 'text-slate-400'"
      >
        Annually
        <span class="text-[0.6rem] font-extrabold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          Save 20%
        </span>
      </span>
    </div>

    <div class="max-w-[1300px] mx-auto px-4 md:px-6">

      <!-- ══ STICKY PLAN HEADER (desktop + tablet) ══ -->
      <div class="hidden sm:block sticky top-0 z-50 justify-end">
        <div
          class="grid ml-auto bg-white border border-slate-200 border-b-0 rounded-t-2xl shadow-lg"
          :style="`grid-template-columns: repeat(${subscriptions.length}, 1fr); width: 80%;`"
        >
          <div
            v-for="(tier, idx) in subscriptions"
            :key="tier.id"
            class="relative flex flex-col items-center text-center px-3 py-6 md:px-5 hover:bg-slate-50 transition-colors"
            :class="{
              'border-r border-slate-100': idx < subscriptions.length - 1,
              'rounded-tl-2xl': idx === 0,
              'rounded-tr-2xl': idx === subscriptions.length - 1,
            }"
            :style="`border-top: 3px solid ${planColors[idx]?.color};`"
          >
            <!-- Most Popular badge -->
            <div
              v-if="tier.tier === 1"
              class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-700 to-amber-400 text-white text-[0.55rem] font-extrabold tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap shadow-md"
            >
              &#9733; Most Popular
            </div>

            <!-- Tier name badge -->
            <span
              class="text-[0.58rem] font-extrabold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded"
              :style="`color: ${planColors[idx]?.color}; background: ${planColors[idx]?.bgLight}; border: 1px solid ${planColors[idx]?.borderColor};`"
            >
              {{ tier.name }}
            </span>

            <!-- Price -->
            <div class="flex items-baseline gap-0.5 mt-2 mb-1">
              <span v-if="tier.monthlyPrice !== null" class="text-sm font-semibold text-slate-400">₦</span>
              <span
                class="font-extrabold tracking-tight"
                :class="tier.monthlyPrice === null ? 'text-base' : 'text-3xl lg:text-4xl text-slate-900'"
                :style="tier.monthlyPrice === null ? `color: ${planColors[idx]?.color}` : ''"
              >
               {{
                tier.monthlyPrice === null
                  ? 'Custom Prices'
                  : isAnnually
                    ? moneyFormat(tier.annualPrice ?? tier.monthlyPrice)
                    : moneyFormat(tier.monthlyPrice)
              }}
              </span>
            </div>

            <!-- Billing period label -->
            <span v-if="tier.monthlyPrice !== null" class="text-[0.6rem] text-slate-400 -mt-0.5 mb-1">
              / {{ isAnnually ? 'annually' : 'monthly' }}
            </span>

            <!-- Description -->
            <p class="text-[0.65rem] text-slate-500 leading-snug max-w-[130px] min-h-[2.8em] mb-3">
              {{ tier.description }}
            </p>

            <!-- Current Plan badge OR Get Started button -->
            <span
              v-if="tier.id === businessPlan"
              class="text-[0.65rem] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full"
            >
              ✓ Current Plan
            </span>
            <button
              v-else
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[0.7rem] font-bold border transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :style="`color: ${planColors[idx]?.color}; border-color: ${planColors[idx]?.borderColor}; background: ${planColors[idx]?.bgLight};`"
              :disabled="disabled"
              @click="emit('clicked', tier)"
            >
              <span v-if="disabled" class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {{ tier.monthlyPrice === null ? '✉ Contact Us' : '→ Get Started' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ══ FEATURES TABLE (desktop + tablet) ══ -->
      <div class="hidden sm:block border border-slate-200 rounded-b-2xl bg-white shadow-md overflow-x-auto">
        <table class="w-full border-collapse" style="table-layout: fixed; min-width: 640px;">
          <colgroup>
            <!-- Features label col = 20%, remaining split equally among plan cols -->
            <col style="width: 20%;">
            <col
              v-for="_ in subscriptions"
              :style="`width: ${80 / subscriptions.length}%;`"
            >
          </colgroup>
          <thead>
            <tr>
              <th class="text-left px-5 py-3 border-b border-slate-100">
                <span class="text-[0.6rem] font-extrabold tracking-[0.18em] uppercase text-slate-400">Features</span>
              </th>
              <th
                v-for="(tier, idx) in subscriptions"
                :key="tier.id"
                class="py-3 border-b border-slate-100"
                :style="`border-top: 2px solid ${planColors[idx]?.borderColor};`"
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(feature, i) in features"
              :key="i"
              :class="i % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'"
              class="hover:bg-slate-100/40 transition-colors"
            >
              
              <td class="px-5 py-3.5 border-b border-slate-100 border-r border-r-slate-100 text-[0.78rem] font-medium text-slate-700">
                <div class="relative inline-flex items-center gap-1">
                <span>{{ feature.name }}</span>

                <span
                  v-if="feature.description"
                  class="text-slate-400 text-[0.65rem] cursor-pointer"
                  @click="openFeature = openFeature === i ? null : i"
                >
                  ⓘ
                </span>

                <div
                  v-if="feature.description && openFeature === i"
                  class="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-56 p-2 rounded-lg bg-slate-900 text-white text-[0.65rem] shadow-lg z-50"
                >
                  {{ feature.description }}
                </div>
              </div>
              </td>

              <td
                v-for="(val, colIdx) in feature.values"
                :key="colIdx"
                class="px-2 py-3.5 text-center border-b border-slate-100"
                :class="{ 'border-r border-r-slate-100': colIdx < feature.values.length - 1 }"
                :style="`background: ${planColors[colIdx]?.color}18;`"
              >
                <FeatureVal :value="val" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ══ MOBILE: stacked plan cards ══ -->
      <div class="sm:hidden space-y-3 mb-6">
        <div
          v-for="(plan, idx) in mobilePlans"
          :key="plan.id"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          :style="`border-top: 3px solid ${plan.color};`"
        >
          <div class="flex items-start justify-between px-5 py-4">
            <div class="flex flex-col gap-1">
              <span
                class="text-[0.58rem] font-extrabold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded w-fit"
                :style="`color: ${plan.color}; background: ${plan.bgLight}; border: 1px solid ${plan.borderColor};`"
              >
                {{ plan.label }}
              </span>
              <div class="flex items-baseline gap-0.5 mt-1">
                <span v-if="!plan.isCustom" class="text-sm font-semibold text-slate-400">₦</span>
                <span
                  class="font-extrabold tracking-tight"
                  :class="plan.isCustom ? 'text-base' : 'text-2xl text-slate-900'"
                  :style="plan.isCustom ? `color: ${plan.color}` : ''"
                >
                  {{ plan.isCustom ? 'Custom Prices' : (isAnnually ? moneyFormat(plan.annualPrice!) : moneyFormat(plan.monthlyPrice!)) }}
                </span>
              </div>
              <p class="text-[0.68rem] text-slate-500 leading-snug max-w-[200px] mt-0.5">
                {{ plan.tagline }}
              </p>
            </div>

            <span
              v-if="plan.id === businessPlan"
              class="shrink-0 text-[0.65rem] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full mt-1"
            >
              ✓ Current Plan
            </span>
            <button
              v-else
              class="shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-[0.7rem] font-bold border transition-all mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              :style="`color: ${plan.color}; border-color: ${plan.borderColor}; background: ${plan.bgLight};`"
              :disabled="disabled"
              @click="emit('clicked', plan.tier)"
            >
              <span v-if="disabled" class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {{ plan.isCustom ? '✉ Contact Us' : '→ Get Started' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ══ MOBILE features table (scrollable) ══ -->
      <div class="sm:hidden border border-slate-200 rounded-2xl bg-white shadow-md overflow-x-auto">
        <table class="border-collapse" style="table-layout: fixed; min-width: 520px; width: 100%;">
          <colgroup>
            <col style="width: 36%;">
            <col
              v-for="_ in subscriptions"
              :style="`width: ${64 / subscriptions.length}%;`"
            >
          </colgroup>
          <thead>
            <tr>
              <th class="text-left px-4 py-3 border-b border-slate-100">
                <span class="text-[0.6rem] font-extrabold tracking-[0.15em] uppercase text-slate-400">Features</span>
              </th>
              <th
                v-for="(tier, idx) in subscriptions"
                :key="tier.id"
                class="py-3 text-center border-b border-slate-100 text-[0.58rem] font-extrabold"
                :style="`border-top: 2px solid ${planColors[idx]?.borderColor}; color: ${planColors[idx]?.color};`"
              >
                {{ tier.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(feature, i) in features"
              :key="i"
              :class="i % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'"
              class="hover:bg-slate-100/40 transition-colors"
            >

              <td class="px-4 py-3 border-b border-slate-100 border-r border-r-slate-100 text-[0.73rem] font-medium text-slate-700">
                <div class="relative inline-flex items-center gap-1">
                <span>{{ feature.name }}</span>

                <span
                  v-if="feature.description"
                  class="text-slate-400 text-[0.65rem] cursor-pointer"
                  @click="openFeature = openFeature === i ? null : i"
                >
                  ⓘ
                </span>

                <div
                  v-if="feature.description && openFeature === i"
                  class="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-52 p-2 rounded-lg bg-slate-900 text-white text-[0.65rem] shadow-lg z-50"
                >
                  {{ feature.description }}
                </div>
              </div>
              </td>

              <td
                v-for="(val, colIdx) in feature.values"
                :key="colIdx"
                class="px-1 py-3 text-center border-b border-slate-100"
                :class="{ 'border-r border-r-slate-100': colIdx < feature.values.length - 1 }"
                :style="`background: ${planColors[colIdx]?.color}18;`"
              >
                <FeatureVal :value="val" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, h, ref, computed, type PropType } from 'vue'
import type { Subscription } from "~/types/business";

const openFeature = ref<number | null>(null)

type FeatureValue = string | number | boolean | null

interface PlanColor {
  color: string
  bgLight: string
  borderColor: string
}

interface ComputedFeature {
  name: string
  description?: string
  values: FeatureValue[]
}

interface MobilePlan {
  id: string
  label: string
  tagline: string
  monthlyPrice: number | null
  annualPrice: number | null
  isCustom: boolean
  color: string
  bgLight: string
  borderColor: string
  tier: Subscription                       // full tier object for emit
}

// ── Props & Emits 
const props = defineProps<{
  subscriptions: Subscription[]
  businessPlan: string | null
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'clicked', tier: Subscription): void
}>()

// isAnnually lives here now — not passed in from the page
const isAnnually = ref(false)

const planColors: PlanColor[] = [
  { color: '#059669', bgLight: '#d1fae5', borderColor: '#6ee7b7' }, // Basic    → emerald
  { color: '#b45309', bgLight: '#fef3c7', borderColor: '#fcd34d' }, // Premium  → amber
  { color: '#4338ca', bgLight: '#e0e7ff', borderColor: '#a5b4fc' }, // Enterprise → indigo
  { color: '#be185d', bgLight: '#fce7f3', borderColor: '#f9a8d4' }, // Custom   → pink
]

// ── Utilities ───
const moneyFormat = (amount: number): string =>
  new Intl.NumberFormat('en-NG').format(amount)

// Helper: maps a raw limit number to a FeatureValue
// Values > 1000 treated as "unlimited", 0 treated as false (not available)
const limitVal = (n: number): FeatureValue => {
  if (n > 1000) return 'unlimited'
  if (n === 0)  return false
  return String(n)
}

const tempFrontendFeatures = {
  businessMedia: [3, 6, 8],
  brandedQR: [false, true, true],
  enhancedAI: [false, false, true],
  customReports: [false, false, true],
  support: ['24 hours', '12 hours', '4 hours'],
  websiteWidget: [true, true, true],
}

const features = computed<ComputedFeature[]>(() => [
  {
    name: 'Reply Limit',
    description:'Respond to customer reviews and control your public reputation.',
    values: props.subscriptions.map(t => limitVal(t.monthlyReplyLimit)),
  },
  {
    name: 'Dispute Limit',
    description:'Challenge unfair or inaccurate reviews and request moderation.',
    values: props.subscriptions.map(t => limitVal(t.monthlyDisputeLimit)),
  },
  {
    name: 'External Source Limit',
    description:'Bring in reviews from other platforms into one dashboard (X, Marketplaces etc).',
    values: props.subscriptions.map(t => limitVal(t.externalSourceLimit)),
  },
  {
    name: 'Sub Accounts',
    description:'Add team members to help manage reviews and responses.',
    values: props.subscriptions.map(t => limitVal(t.userLoginLimit)),
  },
  {
    name: 'Private Review',
    description:'Collect private customer feedback while keeping your overall rating transparent.',
    values: props.subscriptions.map(t => t.privateReviewsEnabled),
  },
  {
    name: 'Secure Data API',
    description:'Safely access your review data for internal tools and reporting.',
    values: props.subscriptions.map(t => t.dataApiEnabled),
  },
  {
    name: 'DND Mode',
    description:'Pause public reviews during sensitive periods or maintenance.',
    values: props.subscriptions.map(t => t.dndModeEnabled),
  },
  {
    name: 'Auto Response',
    description:'Instantly reply to reviews with smart, customizable templates.',
    values: props.subscriptions.map(t => t.autoResponseEnabled),
  },
  {
    name: 'Branch Comparison',
    description:'Compare performance across multiple business locations.',
    values: props.subscriptions.map(t => t.branchComparisonEnabled),
  },
  {
    name: 'Competitor Benchmarking',
    description:'See how your business stacks up against competitors nearby.',
    values: props.subscriptions.map(t => t.competitorComparisonEnabled),
  },
  {
  name: 'Business Media',
  description:'Showcase your business with images that build trust.',
  values: tempFrontendFeatures.businessMedia,
},
{
  name: 'Branded QR Display',
  description:'Use your business colours and font on your QR code printouts.',
  values: tempFrontendFeatures.brandedQR,
},
{
  name: 'Enhanced AI Analytics',
  description:'Understand trends, customer sentiment, and performance over time.',
  values: tempFrontendFeatures.enhancedAI,
},
{
  name: 'Custom Reports',
  description:'Download tailored reports for management or internal reviews.',
  values: tempFrontendFeatures.customReports,
},
{
  name: 'Support',
  description:'Get faster responses from our support team when you need help.',
  values: tempFrontendFeatures.support,
},
{
  name: 'Website Widget',
  description:'Proudly show your rating.',
  values: tempFrontendFeatures.websiteWidget,
},
])

const mobilePlans = computed<MobilePlan[]>(() =>
  props.subscriptions.map((t, idx) => ({
    id:           t.id,
    label:        t.name,
    tagline:      t.description,
    monthlyPrice: t.monthlyPrice,
    annualPrice:  t.annualPrice,
    isCustom:     t.monthlyPrice === null,
    color:        planColors[idx]?.color       ?? '#059669',
    bgLight:      planColors[idx]?.bgLight     ?? '#d1fae5',
    borderColor:  planColors[idx]?.borderColor ?? '#6ee7b7',
    tier:         t,
  }))
)

const FeatureVal = defineComponent({
  props: {
    value: {
      type: [String, Number, Boolean] as PropType<FeatureValue>,
      default: null,
    },
  },
  setup(props) {
    return () => {
      const v = props.value

      // ✓ TICK — deep slate circle, white SVG checkmark
      if (v === true) {
        return h(
          'span',
          { class: 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-700' },
          [
            h('svg', { viewBox: '0 0 12 12', fill: 'none', class: 'w-3 h-3' }, [
              h('polyline', {
                points: '1.5,6 4.5,9.5 10.5,2.5',
                stroke: 'white',
                'stroke-width': '2',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
              }),
            ]),
          ]
        )
      }

      // ✕ CROSS — light slate circle, slate SVG cross
      if (v === false) {
        return h(
          'span',
          { class: 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200' },
          [
            h('svg', { viewBox: '0 0 12 12', fill: 'none', class: 'w-2.5 h-2.5' }, [
              h('line', { x1: '2', y1: '2', x2: '10', y2: '10', stroke: '#475569', 'stroke-width': '2', 'stroke-linecap': 'round' }),
              h('line', { x1: '10', y1: '2', x2: '2', y2: '10', stroke: '#475569', 'stroke-width': '2', 'stroke-linecap': 'round' }),
            ]),
          ]
        )
      }

      // ∞ UNLIMITED — slate pill
      if (v === 'unlimited') {
        return h(
          'span',
          { class: 'inline-flex items-center gap-0.5 text-[0.66rem] font-bold text-slate-700 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded-full' },
          '∞ Unlimited'
        )
      }

      // null → not rendered (shouldn't appear since custom col is handled in header)
      if (v === null) {
        return h('span', { class: 'text-[0.66rem] font-medium italic text-pink-600' }, 'On Request')
      }

      // Number or plain string
      return h(
        'span',
        { class: 'text-[0.82rem] font-bold text-slate-700' },
        String(v)
      )
    }
  },
})
</script>