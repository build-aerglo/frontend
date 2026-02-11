<template>
  <Card class="p-[20px] relative bg-[#F0FDF4] hover:shadow-md cursor-pointer">
    <template #content>
      <div
        v-if="tier.tier === 1"
        class="absolute top-[-10px] bg-gold text-white rounded-full py-[5px] px-[20px] text-[80%] left-1/2 -translate-x-1/2"
      >
        Most Popular
      </div>
      <div class="text-[160%] font-bold">{{ tier.name }}</div>
      <div class="text-[90%]">{{ tier.description }}</div>

      <div class="my-[20px] flex items-center border-t-2 border-b-2 py-[10px]">
        <div>N</div>
        <div class="text-[120%] font-bold ml-[5px] mr-[10px]">
          {{
            !isAnnually
              ? moneyFormat(tier.monthlyPrice)
              : moneyFormat(tier.annualPrice)
          }}
        </div>
        <div>/ {{ isAnnually ? "annually" : "monthly" }}</div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>
            {{
              tier.monthlyReplyLimit > 1000
                ? "Unlimited"
                : tier.monthlyReplyLimit
            }}
            Monthly reply limit
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>
            {{
              tier.monthlyDisputeLimit > 1000
                ? "Unlimited"
                : tier.monthlyDisputeLimit
            }}
            Monthly dispute limit
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>
            {{
              tier.externalSourceLimit > 1000
                ? "Unlimited"
                : tier.externalSourceLimit
            }}
            External source limit
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>{{ tier.userLoginLimit }} Support users</div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>
            {{
              tier.privateReviewsEnabled
                ? "Enabled private review"
                : "Disabled private review"
            }}
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>
            {{ tier.dataApiEnabled ? "Enabled data api" : "Disabled data api" }}
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>
            {{
              tier.dndModeEnabled
                ? "Enabled business DND mode"
                : "Disabled business DND mode"
            }}
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>
            {{
              tier.autoResponseEnabled
                ? "Enabled business auto response"
                : "Disabled business auto response"
            }}
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>
            {{
              tier.branchComparisonEnabled
                ? "Enabled business branch comparison"
                : "Disabled business branch comparison"
            }}
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-check !text-primary mb-[1px]"></i>
          <div>
            {{
              tier.competitorComparisonEnabled
                ? "Enabled competitor comparison"
                : "Disabled competitor comparison"
            }}
          </div>
        </div>
      </div>
      <div class="mt-[30px] flex justify-center items-center">
        <ButtonCustom
          label="Get Started"
          :input-class="tier.tier === 1 ? '!bg-gold' : ''"
          primary="true"
          size="lg"
          v-if="tier.id !== businessPlan"
          @click="emit('clicked', tier)"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
const props = defineProps(["tier", "isAnnually", "businessPlan"]);
const emit = defineEmits(["clicked"]);
</script>

<style scoped>
.pi-check {
  font-size: 80%;
  font-weight: bolder;
}
</style>
