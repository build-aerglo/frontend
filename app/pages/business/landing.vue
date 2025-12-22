<template>
  <div>
    <Nav />
    <main>
      <Hero />
      <SocialProof />
      <KeyBenefit />
      <More />
      <PricingPreview />
      <CTA />
    </main>
  </div>
  <NavFooter/>
</template>

<script setup>
import Nav from '~/components/BusinessLanding/Nav.vue';
import Hero from '~/components/BusinessLanding/Hero.vue';
import SocialProof from '~/components/BusinessLanding/SocialProof.vue';
import KeyBenefit from '~/components/BusinessLanding/KeyBenefit.vue';
import More from '~/components/BusinessLanding/More.vue';
import PricingPreview from '~/components/BusinessLanding/PricingPreview.vue';
import CTA from '~/components/BusinessLanding/CTA.vue';
</script>
