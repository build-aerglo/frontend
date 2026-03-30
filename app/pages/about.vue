<template>
  <NavBar />
  <div class="min-h-screen">
    <div class="relative bg-slate-800 overflow-hidden">
      <div class="absolute inset-0 opacity-10"
        style="background-image: linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px); background-size: 40px 40px;">
      </div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-[80px]"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
          <i class="pi pi-star-fill text-gold text-xs"></i>
          Our Story
        </div>
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          About <span class="text-gold">CleReview</span>
        </h1>
        <p class="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          A platform built on transparency, trust, and the power of real human experiences.
        </p>
      </div>
    </div>

    <div class=" mx-auto px-6 py-14">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        <div class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 rounded-full !bg-primary"></div>
            <span class="text-2xl md:text-3xl font-bold text-slate-800">Who We Are</span>
          </div>
          <p class="text-slate-600 leading-relaxed">
            CleReview is a product of <strong class="text-slate-800">Aerglo Technology Ltd</strong> — a technology company dedicated to building tools that create clarity and confidence in everyday decisions.
          </p>
          <p class="text-slate-600 leading-relaxed">
            We believe that the best guide for any decision is the honest experience of someone who has been there before. CleReview was built to give that voice a home — a trusted, verified, and accessible space where real people share real experiences.
          </p>
          <p class="text-slate-600 leading-relaxed">
            Whether you're a customer looking for a business you can trust, or a business ready to build a reputation worth standing behind, CleReview is the platform for you.
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div v-for="stat in stats" :key="stat.label"
            class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-xl !bg-primary/10 flex items-center justify-center mb-3">
              <i :class="['pi', stat.icon, '!text-primary text-xl']"></i>
            </div>
            <div class="text-2xl font-bold text-primary mb-1">{{ stat.value }}</div>
            <div class="text-slate-500 text-sm">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white py-14 px-6">
      <div class="mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div class="bg-[#f4fdf6] rounded-2xl border border-primary/10 p-8 space-y-4">
            <div class="w-12 h-12 rounded-xl !bg-primary/10 flex items-center justify-center">
              <i class="pi pi-compass !text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800">Our Mission</h3>
            <p class="text-slate-600 leading-relaxed">
              To empower users to make confident, informed decisions through transparent and authentic reviews — while giving businesses the tools they need to build trust and grow with integrity.
            </p>
          </div>

          <div class="bg-slate-800 rounded-2xl p-8 space-y-4">
            <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <i class="pi pi-eye text-gold text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white">Our Vision</h3>
            <p class="text-slate-400 leading-relaxed">
              To become the most trusted review platform in Africa — where every review matters, every voice is heard, and every business has a fair chance to shine.
            </p>
          </div>

        </div>
      </div>
    </div>

    <div class="mx-auto px-6 py-14">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-1 h-8 rounded-full bg-gold"></div>
        <span class="text-2xl md:text-3xl font-bold text-slate-800">What We Stand For</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <div v-for="value in values" :key="value.title"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all group">
          <div class="w-11 h-11 rounded-xl !bg-primary/10 flex items-center justify-center mb-4 group-hover:!bg-primary/20 transition-colors">
            <i :class="['pi', value.icon, '!text-primary text-lg']"></i>
          </div>
          <h4 class="font-bold text-slate-800 mb-2">{{ value.title }}</h4>
          <p class="text-slate-500 text-sm leading-relaxed">{{ value.desc }}</p>
        </div>
      </div>
    </div>

    <!-- contact us -->
    <div class="bg-white py-14 px-6 scroll-mt-20">
      <div class="mx-auto">

        <div class="flex items-center gap-3 mb-2">
          <div class="w-1 h-8 rounded-full !bg-primary"></div>
          <span class="text-2xl md:text-3xl font-bold text-slate-800">Get In Touch</span>
        </div>
        <p class="text-slate-500 mb-10 pl-4">Have a question, feedback, or want to report something? We'd love to hear from you.</p>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">

          <!-- Contact info -->
          <div class="md:col-span-2 space-y-4">

            <div v-for="info in contactInfo" :key="info.label"
              class="flex items-start gap-4 bg-[#f4fdf6] border border-primary/10 rounded-2xl p-5">
              <div class="w-10 h-10 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <i :class="['pi', info.icon, '!text-primary']"></i>
              </div>
              <div>
                <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{{ info.label }}</div>
                <a v-if="info.href" :href="info.href" class="text-slate-700 font-medium hover:!text-primary transition-colors text-sm">
                  {{ info.value }}
                </a>
                <div v-else class="text-slate-700 font-medium text-sm">{{ info.value }}</div>
              </div>
            </div>

            <!-- Social links -->
            <div class="bg-[#f4fdf6] border border-primary/10 rounded-2xl p-5">
              <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Follow Us</div>
              <div class="flex gap-3">
                <a v-for="social in socials" :key="social.icon"
                  href="/"
                  class="w-9 h-9 rounded-lg !bg-primary/10 flex items-center justify-center hover:!bg-primary hover:text-white transition-all group">
                  <i :class="['pi', social.icon, '!text-primary group-hover:text-white text-sm']"></i>
                </a>
              </div>
            </div>

          </div>

          <!-- Contact form -->
          <div id="contact-us" class="md:col-span-3 bg-[#f4fdf6] border border-slate-100 rounded-2xl p-6 md:p-8">
            <h3 class="font-bold text-slate-800 text-lg mb-6">Send Us a Message</h3>

            <form class="space-y-5" @submit.prevent="handleSubmit">

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <InputText
                  v-model="form.name"
                  placeholder="e.g. Adaeze Okonkwo"
                  class="w-full"
                  :class="{ 'p-invalid': errors.name }"
                />
                <small v-if="errors.name" class="text-red-500 text-xs mt-1 block">{{ errors.name }}</small>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <InputText
                  v-model="form.email"
                  type="email"
                  placeholder="e.g. adaeze@email.com"
                  class="w-full"
                  :class="{ 'p-invalid': errors.email }"
                />
                <small v-if="errors.email" class="text-red-500 text-xs mt-1 block">{{ errors.email }}</small>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <Textarea
                  v-model="form.message"
                  placeholder="Tell us how we can help..."
                  rows="5"
                  class="w-full resize-none"
                  :class="{ 'p-invalid': errors.message }"
                />
                <small v-if="errors.message" class="text-red-500 text-xs mt-1 block">{{ errors.message }}</small>
              </div>

              <div class="pt-1">
                <ButtonCustom
                  primary="true"
                  label="Send Message"
                  size="lg"
                  icon="send"
                  :isLoading="isSubmitting"
                  type="submit"
                />
              </div>

              <!-- Success message -->
              <div v-if="submitted"
                class="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-primary text-sm font-medium">
                <i class="pi pi-check-circle text-lg"></i>
                <span>Your message has been sent! We'll get back to you shortly.</span>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>

    <!-- =============================================
         BOTTOM CTA STRIP
    ============================================== -->
    <div class="p-[25px] flex sm:flex-row flex-col sm:items-center justify-end bg-gradient-to-r from-[#deae29] to-[#fbd85b]">
      <div class="flex-1">
        <div class="font-bold text-[130%] text-white">Ready to explore CleReview?</div>
        <div class="text-white">Discover businesses, read real reviews, and share your own experiences.</div>
      </div>
      <div class="sm:mt-0 mt-[20px] md:text-right">
        <NuxtLink to="/">
          <button class="rounded-full !bg-[#1B1A1B] text-white px-[25px] py-[15px]">
            Explore Now
          </button>
        </NuxtLink>
      </div>
    </div>

  </div>
  <NavigationFooter />
</template>

<script setup lang="ts">
// ── Stats ─────────────────────────────────────────────────────
const stats = [
  { value: '200+',  label: 'Registered Businesses', icon: 'pi-building' },
  { value: '100k+', label: 'Active Reviewers',       icon: 'pi-users' },
  { value: '10M+',  label: 'Reviews Uploaded',       icon: 'pi-star-fill' },
  { value: '4.8★',  label: 'Avg Business Rating',    icon: 'pi-chart-line' },
]

// ── Values ────────────────────────────────────────────────────
const values = [
  {
    icon: 'pi-verified',
    title: 'Authenticity',
    desc: 'Every review on CleReview is from a real person with a real experience. We protect the integrity of every submission.',
  },
  {
    icon: 'pi-eye',
    title: 'Transparency',
    desc: 'We never edit reviews to favour businesses, and no payment can remove honest feedback from our platform.',
  },
  {
    icon: 'pi-shield',
    title: 'Trust & Safety',
    desc: 'Our moderation systems and verification processes ensure the platform remains a safe space for everyone.',
  },
  {
    icon: 'pi-users',
    title: 'Community',
    desc: 'We are building a growing network of users and businesses who value honesty and constructive engagement.',
  },
  {
    icon: 'pi-chart-line',
    title: 'Growth',
    desc: 'We help businesses turn real feedback into real growth — using insights and reputation to attract loyal customers.',
  },
  {
    icon: 'pi-globe',
    title: 'Accessibility',
    desc: 'CleReview is built for everyone — from the individual consumer to the small business owner across Africa.',
  },
]

// ── Contact info ──────────────────────────────────────────────
const contactInfo = [
  {
    label: 'Email',
    value: 'contact@clereview.com',
    href: 'mailto:contact@clereview.com',
    icon: 'pi-envelope',
  },
  {
    label: 'Address',
    value: 'Yaba, Lagos, Nigeria',
    href: null,
    icon: 'pi-map-marker',
  },
  {
    label: 'Company',
    value: 'Aerglo Technology Ltd',
    href: null,
    icon: 'pi-building',
  },
]

const socials = [
  { icon: 'pi-facebook' },
  { icon: 'pi-twitter' },
  { icon: 'pi-instagram' },
  { icon: 'pi-linkedin' },
]

// ── Form ──────────────────────────────────────────────────────
const form = reactive({ name: '', email: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })
const isSubmitting = ref(false)
const submitted = ref(false)
const handleSubmit = () => {
  console.log("form submitted!")
}

</script>