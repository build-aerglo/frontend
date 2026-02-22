<!-- components/CustomPlanBanner.vue -->
<template>
  <div class="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-5">

      <!-- Left: icon + text -->
      <div class="flex items-start gap-4">
        <!-- Icon bubble -->
        <div class="shrink-0 w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-lg">
          ⚙
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="text-[0.62rem] font-extrabold tracking-[0.18em] uppercase text-slate-400">
              Custom Plan
            </span>
            <span class="text-[0.58rem] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
              Tailored for you
            </span>
          </div>
          <p class="text-sm font-semibold text-slate-700">
            Need something beyond what's listed?
          </p>
          <p class="text-[0.75rem] text-slate-400 leading-relaxed max-w-md">
            Pricing, reply limits, dispute limits, external sources, sub-accounts, and every feature — all configured to match exactly what your business needs.
          </p>
        </div>
      </div>

      <!-- Right: features hint + CTA -->
      <div class="flex flex-col items-start sm:items-end gap-3 shrink-0 sm:pl-6 sm:border-l sm:border-slate-100 w-full sm:w-auto">
        <!-- CTA button -->
        <button
          class="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[0.75rem] font-bold border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all hover:-translate-y-0.5 hover:shadow-md"
          @click="emit('contact')"
        >
          ✉ Contact Us
        </button>
      </div>

    </div>

    <!-- Bottom strip -->
    <div class="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
      <p class="text-[0.65rem] text-slate-400">
        All features on request · Custom pricing · Dedicated support · Flexible contracts
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'contact'): void
}>()

const tags: string[] = [
  'Custom Pricing',
  'Reply Limit',
  'Dispute Limit',
  'External Sources',
  'Sub Accounts',
  'Private Review',
  'Secure API',
  'DND Mode',
  'Auto Response',
  'Branch Comparison',
  'Competitor Benchmarking',
]
</script>