<template>
  <NavBar />
  <div class="min-h-screen">

    <!-- Hero header -->
    <div class="relative bg-slate-800 overflow-hidden">
      <div class="absolute inset-0 opacity-10"
        style="background-image: linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px); background-size: 40px 40px;">
      </div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-[80px]"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
          <i class="pi pi-lock text-gold text-xs"></i>
          Legal Document
        </div>
        <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          Privacy Policy
        </h1>
        <p class="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
          Effective Date: <span class="text-white font-medium">March 2026</span> &nbsp;·&nbsp; Version: <span class="text-white font-medium">V.01</span>
        </p>
        <p class="text-slate-400 text-sm mt-2">
          A product of <span class="text-white font-medium">Aerglo Technology Ltd</span>
        </p>
      </div>
    </div>

    <!-- Main content -->
    <div class="mx-auto px-6 py-12 space-y-6">

      <!-- Intro card -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <p class="text-slate-600 leading-relaxed mb-4">
          CleReview is a product of <strong class="text-slate-800">Aerglo Technology Ltd</strong> ("Aerglo," "we," "our," or "us"). We are committed to protecting your personal data and ensuring transparency in how information is handled on our platform.
        </p>
        <p class="text-slate-600 leading-relaxed mb-4">
          This Privacy Policy explains how we collect, use, and protect your information when you use CleReview, including features such as business listings, reviews, verification systems, and moderation processes.
        </p>
        <p class="text-sm bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 !text-primary font-medium">
          <i class="pi pi-info-circle mr-2"></i>
          By using CleReview, you agree to this Privacy Policy.
        </p>
      </div>

      <!-- Section 2: Information We Collect -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
          <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
            <span class="!text-primary font-bold text-sm">2</span>
          </div>
          <span class="text-xl md:text-2xl font-bold text-slate-800">Information We Collect</span>
        </div>
        <div class="px-6 md:px-8 py-6 space-y-6 text-slate-600 leading-relaxed">

          <div>
            <p class="text-lg font-semibold text-slate-700 mb-2">a. Information You Provide</p>
            <ul class="space-y-2">
              <li v-for="item in infoYouProvide" :key="item" class="flex items-start gap-3">
                <i class="pi pi-user !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <div class="border-t border-slate-50 pt-5">
            <p class="text-lg font-semibold text-slate-700 mb-2">b. Automatically Collected Information</p>
    
            <ul class="space-y-2">
              <li v-for="item in autoCollected" :key="item" class="flex items-start gap-3">
                <i class="pi pi-desktop !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <div class="border-t border-slate-50 pt-5">
            <p class="text-lg font-semibold text-slate-700 mb-2">c. Verification Data</p>
            <p class="text-sm text-slate-500 mb-3">To maintain trust on our platform, we may collect additional data for verification purposes, such as:</p>
            <ul class="space-y-2">
              <li v-for="item in verificationData" :key="item" class="flex items-start gap-3">
                <i class="pi pi-verified !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Section 3: How We Use Your Information -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
          <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
            <span class="!text-primary font-bold text-sm">3</span>
          </div>
          <span class="text-xl md:text-2xl font-bold text-slate-800">How We Use Your Information</span>
        </div>
        <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed">
          <p class="mb-4">Aerglo Technology Ltd uses your information to:</p>
          <ul class="space-y-2">
            <li v-for="item in howWeUse" :key="item" class="flex items-start gap-3">
              <i class="pi pi-check-circle !text-primary mt-0.5 text-sm shrink-0"></i>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Section 4: Reviews, Verification & Moderation -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
          <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
            <span class="!text-primary font-bold text-sm">4</span>
          </div>
          <span class="text-xl md:text-2xl font-bold text-slate-800">Reviews, Verification &amp; Moderation</span>
        </div>
        <div class="px-6 md:px-8 py-6 space-y-6 text-slate-600 leading-relaxed">

          <div>
            <p class="text-lg font-semibold text-slate-700 mb-2">a. User-Generated Reviews</p>
            <p>CleReview allows users to publish reviews and ratings. These are publicly visible and may include your username and profile details.</p>
          </div>

          <div class="border-t border-slate-50 pt-5">
            <p class="text-lg font-semibold text-slate-700 mb-2">b. Verification Systems</p>
            <p class="mb-3">To improve trust and credibility:</p>
            <ul class="space-y-2 mb-3">
              <li v-for="item in verificationSystems" :key="item" class="flex items-start gap-3">
                <i class="pi pi-check-circle !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="text-sm bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-500">
              <i class="pi pi-info-circle mr-2 !text-primary"></i>
              Verification does not guarantee accuracy but indicates that reasonable checks have been completed.
            </p>
          </div>

          <div class="border-t border-slate-50 pt-5">
            <p class="text-lg font-semibold text-slate-700 mb-2">c. Flagged Reviews</p>
            <p class="mb-3">Users and businesses can flag reviews that they believe are:</p>
            <ul class="space-y-2 mb-4">
              <li v-for="item in flagReasons" :key="item" class="flex items-start gap-3">
                <i class="pi pi-flag text-red-400 mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="mb-3">When a review is flagged:</p>
            <ul class="space-y-2">
              <li v-for="item in flaggedProcess" :key="item" class="flex items-start gap-3">
                <i class="pi pi-arrow-right !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <div class="border-t border-slate-50 pt-5">
            <p class="text-lg font-semibold text-slate-700 mb-2">d. Moderation Process</p>
            <p class="mb-3">We use a combination of automated tools and human review to:</p>
            <ul class="space-y-2 mb-4">
              <li v-for="item in moderationUse" :key="item" class="flex items-start gap-3">
                <i class="pi pi-check-circle !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="mb-3">We reserve the right to:</p>
            <ul class="space-y-2">
              <li v-for="item in moderationRights" :key="item" class="flex items-start gap-3">
                <i class="pi pi-shield !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Section 5: Sharing -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
          <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
            <span class="!text-primary font-bold text-sm">5</span>
          </div>
          <span class="text-xl md:text-2xl font-bold text-slate-800">Sharing Your Information</span>
        </div>
        <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed">
          <p class="mb-4 text-sm bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 !text-primary font-medium">
            <i class="pi pi-lock mr-2"></i>
            We do not sell your personal data.
          </p>
          <p class="mb-4">We may share your data with:</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="item in sharingItems" :key="item.title"
              class="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <i :class="['pi', item.icon, '!text-primary mt-0.5 text-sm shrink-0']"></i>
              <div>
                <div class="font-semibold text-slate-700 text-sm">{{ item.title }}</div>
                <div class="text-slate-500 text-sm mt-0.5">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sections 6, 7 side by side -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Section 6: Cookies -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="!text-primary font-bold text-sm">6</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Cookies &amp; Tracking</span>
          </div>
          <div class="px-6 py-6 text-slate-600 leading-relaxed">
            <p class="mb-4">We use cookies to:</p>
            <ul class="space-y-2 mb-4">
              <li v-for="item in cookieUses" :key="item" class="flex items-start gap-3">
                <i class="pi pi-check-circle !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="text-sm text-slate-500">You can control cookies via your browser settings.</p>
          </div>
        </div>

        <!-- Section 7: Data Retention -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="!text-primary font-bold text-sm">7</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Data Retention</span>
          </div>
          <div class="px-6 py-6 text-slate-600 leading-relaxed">
            <p class="mb-4">We retain your data only as long as necessary to:</p>
            <ul class="space-y-2 mb-4">
              <li v-for="item in retentionReasons" :key="item" class="flex items-start gap-3">
                <i class="pi pi-clock !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="text-sm text-slate-500">Flagged or moderated content may be retained for investigation and dispute resolution.</p>
          </div>
        </div>

      </div>

      <!-- Section 8: Data Security -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
          <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
            <span class="!text-primary font-bold text-sm">8</span>
          </div>
          <span class="text-xl md:text-2xl font-bold text-slate-800">Data Security</span>
        </div>
        <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed space-y-4">
          <p>Keeping your personal data secure is our highest priority. We use various organisational, technical and administrative measures to protect your personal data within our organisation and we regularly audit our system for vulnerabilities.</p>
          <p class="text-sm bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-amber-700">
            <i class="pi pi-exclamation-triangle mr-2"></i>
            However, since the internet is not a completely secure environment, we cannot ensure or warrant the security of the information you transmit to us. Emails sent via the platform may not be encrypted — we therefore advise you not to include any confidential information in your emails to us.
          </p>
        </div>
      </div>

      <!-- Section 9: Your Rights -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
          <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
            <span class="!text-primary font-bold text-sm">9</span>
          </div>
          <span class="text-xl md:text-2xl font-bold text-slate-800">Your Rights (UK GDPR)</span>
        </div>
        <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed">
          <p class="mb-5">You have the right to:</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="right in gdprRights" :key="right.title"
              class="flex flex-col items-start gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div class="w-8 h-8 rounded-lg !bg-primary/10 flex items-center justify-center">
                <i :class="['pi', right.icon, '!text-primary text-sm']"></i>
              </div>
              <div class="font-semibold text-slate-700 text-sm">{{ right.title }}</div>
            </div>
          </div>
          <p class="text-sm mt-5 text-slate-500">
            To exercise your rights, contact us using the contact information provided below.
          </p>
        </div>
      </div>

      <!-- Sections 10, 11, 12, 13 grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Section 10 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="!text-primary font-bold text-sm">10</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Children's Privacy</span>
          </div>
          <div class="px-6 py-6 text-slate-600 leading-relaxed">
            <p>CleReview is not intended for individuals under the age of <strong class="text-slate-800">13</strong> and we do not knowingly collect personal data from such children. If you become aware that a child under the age of 13 has provided us with their personal data, please contact us using the contact information provided below.</p>
          </div>
        </div>

        <!-- Section 11 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="!text-primary font-bold text-sm">11</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">International Data Transfers</span>
          </div>
          <div class="px-6 py-6 text-slate-600 leading-relaxed">
            <p>Your data may be processed outside your country. We ensure appropriate safeguards are in place where required.</p>
          </div>
        </div>

        <!-- Section 12 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="!text-primary font-bold text-sm">12</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Third-Party Links</span>
          </div>
          <div class="px-6 py-6 text-slate-600 leading-relaxed">
            <p>CleReview may contain links to third-party websites. We are not responsible for their privacy practices.</p>
          </div>
        </div>

        <!-- Section 13 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="!text-primary font-bold text-sm">13</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Changes to This Policy</span>
          </div>
          <div class="px-6 py-6 text-slate-600 leading-relaxed">
            <p>We may update this Privacy Policy from time to time. Updates will be posted with a revised <strong class="text-slate-700">"Effective Date."</strong> We encourage you to review this policy periodically.</p>
          </div>
        </div>

      </div>

      <!-- Section 14: Contact -->
      <div class="bg-slate-800 rounded-2xl overflow-hidden">
        <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-white/10">
          <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <span class="text-gold font-bold text-sm">14</span>
          </div>
          <span class="text-xl md:text-2xl font-bold text-white">Contact Us</span>
        </div>
        <div class="px-6 md:px-8 py-8">
          <p class="text-slate-400 mb-6">If you have questions about this Privacy Policy or wish to exercise your data rights:</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 bg-white/5 border border-white/10 rounded-xl p-5">
              <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">Company</div>
              <div class="text-white font-semibold">Aerglo Technology Ltd</div>
              <div class="text-slate-400 text-sm mt-1">Owner of CleReview</div>
            </div>
            <div class="flex-1 bg-white/5 border border-white/10 rounded-xl p-5">
              <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">Email</div>
              <a href="mailto:contact@CleReview.com" class="text-gold font-semibold hover:underline">
                contact@CleReview.com
              </a>
            </div>
            <div class="flex-1 bg-white/5 border border-white/10 rounded-xl p-5">
              <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">Address</div>
              <div class="text-white font-semibold">Lagos, Nigeria</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  <NavigationFooter />
</template>

<script setup lang="ts">
// Section 2
const infoYouProvide = [
  'Name',
  'Email address',
  'Username and profile details',
  'Reviews, ratings, and comments',
  'Business information (for business owners)',
  'Verification details (if claiming or verifying a business)',
]

const autoCollected = [
  'IP address',
  'Device and browser type',
  'Usage data (pages visited, interactions)',
  'Cookies and tracking technologies',
]

const verificationData = [
  'Business ownership documentation',
  'Contact verification (email, phone)',
  'Identity confirmation (where necessary)',
]

// Section 3
const howWeUse = [
  'Provide, operate, and improve CleReview',
  'Enable users to post, view, and interact with reviews',
  'Verify businesses and user authenticity',
  'Personalize user experience',
  'Communicate updates, alerts, and support messages',
  'Monitor platform activity for safety and integrity',
  'Detect, investigate, and prevent fraudulent or misleading activity',
  'Enforce our moderation and review policies',
  'Comply with legal and regulatory obligations',
]

// Section 4
const verificationSystems = [
  'Businesses may go through a verification process',
  'Verified profiles may be labeled accordingly',
  'We may use submitted documents and contact methods to confirm authenticity',
]

const flagReasons = [
  'False or misleading',
  'Offensive or abusive',
  'In violation of our guidelines',
]

const flaggedProcess = [
  'It may be temporarily marked as "under review"',
  'Our moderation team may assess the content',
  'Additional information may be requested',
]

const moderationUse = [
  'Detect suspicious or harmful content',
  'Enforce platform guidelines',
  'Remove or restrict content that violates policies',
]

const moderationRights = [
  'Remove reviews that breach our guidelines',
  'Suspend or restrict user accounts',
  'Retain moderation data for audit and legal purposes',
]

// Section 5
const sharingItems = [
  { title: 'Service Providers', desc: 'Hosting, analytics, and support services', icon: 'pi-server' },
  { title: 'Public Platform', desc: 'Reviews and business profiles are publicly visible', icon: 'pi-globe' },
  { title: 'Legal Authorities', desc: 'Where required by law', icon: 'pi-building' },
  { title: 'Corporate Transactions', desc: 'In case of merger, acquisition, or restructuring', icon: 'pi-briefcase' },
]

// Section 6
const cookieUses = [
  'Improve functionality and performance',
  'Understand user behaviour',
  'Store preferences',
]

// Section 7
const retentionReasons = [
  'Provide services',
  'Maintain platform integrity (including moderation records)',
  'Comply with legal obligations',
]

// Section 9
const gdprRights = [
  { title: 'Access your personal data', icon: 'pi-eye' },
  { title: 'Correct inaccurate information', icon: 'pi-pencil' },
  { title: 'Request deletion of your data', icon: 'pi-trash' },
  { title: 'Restrict or object to processing', icon: 'pi-ban' },
  { title: 'Withdraw consent at any time', icon: 'pi-times-circle' },
]
</script>