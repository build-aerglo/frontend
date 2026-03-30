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
          <i class="pi pi-shield text-gold text-xs"></i>
          Legal Document
        </div>
        <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          Review Policy, Content Guidelines<br class="hidden md:block" />
          <span class="text-gold">&amp; Terms of Use</span>
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
    <div class=" mx-auto px-6 py-12">

      <!-- Intro card -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-8">
        <p class="text-slate-600 leading-relaxed">
          CleReview is a product of <strong class="text-slate-800">Aerglo Technology Ltd</strong> ("Aerglo," "we," "our," or "us").
          This Review Policy and Terms outlines the rules, standards, and processes governing user-generated content on the CleReview platform.
          By submitting and using reviews on CleReview, you agree to comply with this policy.
        </p>
      </div>

      <!-- Sections -->
      <div class="space-y-6">

        <!-- Section 1 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary font-bold text-sm">1</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Purpose of Reviews</span>
          </div>
          <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed">
            <p class="mb-4">CleReview exists to provide a transparent and trustworthy platform where users can share genuine experiences about businesses.</p>
            <p class="font-medium text-slate-700 mb-3">Reviews should:</p>
            <ul class="space-y-2">
              <li v-for="item in purposeItems" :key="item" class="flex items-start gap-3">
                <i class="pi pi-check-circle !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary font-bold text-sm">2</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Who Can Leave a Review</span>
          </div>
          <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed">
            <p class="mb-4">You may submit a review if:</p>
            <ul class="space-y-2 mb-4">
              <li v-for="item in whoCanReviewItems" :key="item" class="flex items-start gap-3">
                <i class="pi pi-check-circle !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="text-sm bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-500">
              <i class="pi pi-info-circle mr-2 !text-primary"></i>
              We reserve the right to request proof of interaction or experience.
            </p>
          </div>
        </div>

        <!-- Section 3 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary font-bold text-sm">3</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Content Guidelines</span>
          </div>
          <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed space-y-6">
            <!-- Allowed -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span class="text-lg font-semibold text-slate-700">Allowed Content</span>
              </div>
              <ul class="space-y-2">
                <li v-for="item in allowedContent" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-check-circle text-green-500 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <!-- Prohibited -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <span class="text-lg font-semibold text-slate-700">Prohibited Content</span>
              </div>
              <p class="text-sm text-slate-500 mb-3">The following, but not limited to the list below, is not allowed on CleReview:</p>
              <ul class="space-y-2">
                <li v-for="item in prohibitedContent" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-times-circle text-red-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Section 4 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary font-bold text-sm">4</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Business Reviews &amp; Conflict of Interest</span>
          </div>
          <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed">
            <p class="mb-4">To maintain fairness:</p>
            <ul class="space-y-2 mb-4">
              <li v-for="item in conflictItems" :key="item" class="flex items-start gap-3">
                <i class="pi pi-exclamation-circle text-amber-500 mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="text-sm bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-amber-700">
              <i class="pi pi-exclamation-triangle mr-2"></i>
              Failure to disclose conflicts may result in removal or account action.
            </p>
          </div>
        </div>

        <!-- Section 5 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary font-bold text-sm">5</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Verification &amp; Authenticity</span>
          </div>
          <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed space-y-5">
            <div>
              <p class="mb-3">CleReview may use verification systems to:</p>
              <ul class="space-y-2">
                <li v-for="item in verificationSystems" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-check-circle !text-primary mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <div>
              <p class="mb-3">We may request supporting evidence, such as:</p>
              <ul class="space-y-2">
                <li v-for="item in evidenceItems" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-file !text-primary mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <p class="text-sm bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-500">
              <i class="pi pi-info-circle mr-2 !text-primary"></i>
              Failure to provide requested information may result in content removal.
            </p>
          </div>
        </div>

        <!-- Sections 6 & 7 side-by-side on md+ -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Section 6 -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
              <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
                <span class="text-primary font-bold text-sm">6</span>
              </div>
              <span class="text-xl md:text-2xl font-bold text-slate-800">Flagging Reviews</span>
            </div>
            <div class="px-6 py-6 text-slate-600 leading-relaxed">
              <p class="mb-4">Users and businesses can report reviews they believe violate this policy. Common reasons include:</p>
              <ul class="space-y-2">
                <li v-for="item in flagReasons" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-flag text-red-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Section 7 -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
              <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
                <span class="text-primary font-bold text-sm">7</span>
              </div>
              <span class="text-xl md:text-2xl font-bold text-slate-800">Removal of Reviews</span>
            </div>
            <div class="px-6 py-6 text-slate-600 leading-relaxed">
              <p class="mb-4">We may remove reviews that:</p>
              <ul class="space-y-2">
                <li v-for="item in removalReasons" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-trash text-red-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <p class="text-sm mt-4 text-slate-500 italic">We are not obligated to publish or retain any review.</p>
            </div>
          </div>
        </div>

        <!-- Section 8: Moderation Process -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary font-bold text-sm">8</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Moderation Process</span>
          </div>
          <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed">
            <p class="mb-6">CleReview uses a combination of automated systems and human moderators to review flagged or suspicious content. When a review is flagged:</p>
            <div class="flex flex-col md:flex-row gap-4">
              <div v-for="(step, i) in moderationSteps" :key="step" class="flex-1 relative">
                <div class="flex flex-col items-center text-center p-4 bg-slate-50 rounded-xl border border-slate-100 h-full">
                  <div class="w-8 h-8 rounded-full !bg-primary flex items-center justify-center text-white font-bold text-sm mb-3">{{ i + 1 }}</div>
                  <p class="text-sm text-slate-600">{{ step }}</p>
                </div>
              </div>
            </div>
            <p class="mt-5 text-sm bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 !text-primary font-medium">
              <i class="pi pi-shield mr-2"></i>
              We aim to handle moderation fairly, consistently, and transparently.
            </p>
          </div>
        </div>

        <!-- Sections 9 & 10 side-by-side -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Section 9 -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
              <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
                <span class="text-primary font-bold text-sm">9</span>
              </div>
              <span class="text-xl md:text-2xl font-bold text-slate-800">Account Actions</span>
            </div>
            <div class="px-6 py-6 text-slate-600 leading-relaxed">
              <p class="mb-4">If users repeatedly violate this policy, we may:</p>
              <ul class="space-y-2">
                <li v-for="item in accountActions" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-ban text-red-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Section 10 -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
              <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
                <span class="text-primary font-bold text-sm">10</span>
              </div>
              <span class="text-xl md:text-2xl font-bold text-slate-800">Business Right of Reply</span>
            </div>
            <div class="px-6 py-6 text-slate-600 leading-relaxed">
              <p class="mb-4">Businesses have the right to:</p>
              <ul class="space-y-2">
                <li v-for="item in businessRights" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-check-circle !text-primary mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <p class="text-sm mt-4 text-slate-500">We encourage constructive engagement between users and businesses.</p>
            </div>
          </div>
        </div>

        <!-- Section 11 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary font-bold text-sm">11</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Transparency &amp; Independence</span>
          </div>
          <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed">
            <p class="mb-4">CleReview is committed to neutrality:</p>
            <ul class="space-y-2">
              <li v-for="item in transparencyItems" :key="item" class="flex items-start gap-3">
                <i class="pi pi-eye !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Section 12 -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary font-bold text-sm">12</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Legal Considerations</span>
          </div>
          <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed">
            <p class="mb-4">Users are solely responsible for the content they post. By submitting a review, you confirm that:</p>
            <ul class="space-y-2">
              <li v-for="item in legalItems" :key="item" class="flex items-start gap-3">
                <i class="pi pi-verified !text-primary mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="text-sm mt-4 text-slate-500">We may cooperate with legal authorities where required.</p>
          </div>
        </div>

        <!-- Section 13: Disclaimer -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-slate-50">
            <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary font-bold text-sm">13</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-slate-800">Disclaimer and Liability</span>
          </div>
          <div class="px-6 md:px-8 py-6 text-slate-600 leading-relaxed space-y-6">

            <p>All content on CleReview, including reviews, ratings, comments, and business listings, is provided for general informational purposes only. We do not:</p>
            <ul class="space-y-2 mb-2">
              <li v-for="item in disclaimerItems" :key="item" class="flex items-start gap-3">
                <i class="pi pi-times-circle text-red-400 mt-0.5 text-sm shrink-0"></i>
                <span>{{ item }}</span>
              </li>
            </ul>

            <div class="border-t border-slate-100 pt-5">
              <span class="text-lg font-semibold text-slate-700 mb-2">a. Business Interaction Disclaimer</span>
              <p class="mb-3">Any interaction, transaction, or engagement between users and businesses listed on CleReview is solely between those parties. Aerglo Technology Ltd shall not be liable for:</p>
              <ul class="space-y-2">
                <li v-for="item in bizInteractionDisclaimer" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-minus text-slate-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <p class="text-sm mt-3 text-slate-500">Users are encouraged to conduct their own due diligence before engaging with any business.</p>
            </div>

            <div class="border-t border-slate-100 pt-5">
              <span class="text-lg font-semibold text-slate-700 mb-2">b. No Professional Advice</span>
              <p class="mb-3">Content on CleReview does not constitute:</p>
              <ul class="space-y-2">
                <li v-for="item in noProfAdvice" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-minus text-slate-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <p class="text-sm mt-3 text-slate-500">You should seek independent professional advice where necessary.</p>
            </div>

            <div class="border-t border-slate-100 pt-5">
              <span class="text-lg font-semibold text-slate-700 mb-2">c. Platform Availability Disclaimer</span>
              <p class="mb-3">We do not guarantee that:</p>
              <ul class="space-y-2">
                <li v-for="item in platformAvailability" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-minus text-slate-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <p class="text-sm mt-3 text-slate-500">Use of CleReview is at your own risk.</p>
            </div>

            <div class="border-t border-slate-100 pt-5">
              <span class="text-lg font-semibold text-slate-700 mb-2">d. Limitation of Liability</span>
              <p class="mb-3">To the fullest extent permitted under the laws of the Federal Republic of Nigeria, Aerglo Technology Ltd shall not be liable for:</p>
              <ul class="space-y-2">
                <li v-for="item in liabilityItems" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-minus text-slate-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <p class="text-sm mt-3 text-slate-500">Even where we have been advised of the possibility of such damages.</p>
            </div>

            <div class="border-t border-slate-100 pt-5">
              <span class="text-lg font-semibold text-slate-700 mb-2">e. Liability Cap</span>
              <p class="mb-3">Where liability cannot be excluded under applicable law, the total liability of Aerglo Technology Ltd to any user shall be limited to:</p>
              <ul class="space-y-2">
                <li v-for="item in liabilityCap" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-minus text-slate-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="border-t border-slate-100 pt-5">
              <span class="text-lg font-semibold text-slate-700 mb-2">f. Indemnity</span>
              <p class="mb-3">You agree to indemnify and hold harmless Aerglo Technology Ltd, its directors, employees, and affiliates from any claims, damages, liabilities, or expenses arising from:</p>
              <ul class="space-y-2">
                <li v-for="item in indemnityItems" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-minus text-slate-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Sections 14 & 15 side by side -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
              <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
                <span class="text-primary font-bold text-sm">14</span>
              </div>
              <span class="text-xl md:text-2xl font-bold text-slate-800">Third-Party Links</span>
            </div>
            <div class="px-6 py-6 text-slate-600 leading-relaxed">
              <p class="mb-4">CleReview may contain links to third-party websites or services. We are not responsible for:</p>
              <ul class="space-y-2">
                <li v-for="item in thirdPartyItems" :key="item" class="flex items-start gap-3">
                  <i class="pi pi-external-link text-slate-400 mt-0.5 text-sm shrink-0"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
              <div class="w-9 h-9 rounded-xl !bg-primary/10 flex items-center justify-center shrink-0">
                <span class="text-primary font-bold text-sm">15</span>
              </div>
              <span class="text-xl md:text-2xl font-bold text-slate-800">Changes to This Document</span>
            </div>
            <div class="px-6 py-6 text-slate-600 leading-relaxed">
              <p>We may update this document from time to time. Updates will be posted with a revised effective date. We encourage you to review this policy periodically to stay informed about how we manage content and protect the platform.</p>
            </div>
          </div>
        </div>

        <!-- Section 16: Contact -->
        <div class="bg-slate-800 rounded-2xl overflow-hidden">
          <div class="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-white/10">
            <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <span class="text-gold font-bold text-sm">16</span>
            </div>
            <span class="text-xl md:text-2xl font-bold text-white">Contact Information</span>
          </div>
          <div class="px-6 md:px-8 py-8">
            <p class="text-slate-400 mb-6">If you have questions or wish to report a review:</p>
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 bg-white/5 border border-white/10 rounded-xl p-5">
                <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">Company</div>
                <div class="text-white font-semibold">Aerglo Technology Ltd</div>
                <div class="text-slate-400 text-sm mt-1">Owner of CleReview</div>
              </div>
              <div class="flex-1 bg-white/5 border border-white/10 rounded-xl p-5">
                <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">Email</div>
                <a href="mailto:contact@CleReview.com" class="text-gold font-semibold hover:underline">contact@CleReview.com</a>
              </div>
              <div class="flex-1 bg-white/5 border border-white/10 rounded-xl p-5">
                <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">Address</div>
                <div class="text-white font-semibold">Yaba, Lagos</div>
                <div class="text-slate-400 text-sm mt-1">Nigeria</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <NavigationFooter />
</template>

<script setup lang="ts">
const purposeItems = [
  'Reflect real, first-hand experiences',
  'Be honest, fair, and constructive',
  'Help other users make informed decisions',
]

const whoCanReviewItems = [
  'You have had a genuine experience with the business',
  'You are not posting on behalf of someone else (unless clearly stated)',
  'You are not being incentivised in a misleading or undisclosed way',
]

const allowedContent = [
  'Based on real experiences',
  'Relevant to the business being reviewed',
  'Respectful, even when negative',
]

const prohibitedContent = [
  'False, misleading, or fabricated reviews',
  'Defamatory statements or allegations presented as fact',
  'Hate speech, harassment, or abusive language',
  'Discriminatory content (race, gender, religion, etc.)',
  'Personal data (e.g., phone numbers, addresses)',
  'Spam, promotional content, or advertising',
  'Conflicts of interest (e.g., reviewing your own business)',
  'Content that violates any applicable laws or regulations',
]

const conflictItems = [
  'Business owners must not review their own business as a customer',
  'Employees must disclose their relationship when reviewing',
  'Competitors must not post misleading or harmful reviews',
]

const verificationSystems = [
  'Confirm user identity or activity',
  'Validate business ownership',
  'Detect suspicious or fraudulent behaviour',
]

const evidenceItems = [
  'Receipts or proof of purchase',
  'Communication records',
  'Booking confirmations',
  'Proof of business ownership',
  'Identification where necessary',
]

const flagReasons = [
  'False or misleading content',
  'Offensive or abusive language',
  'Spam or promotional material',
  'Conflict of interest',
]

const moderationSteps = [
  'Review may be marked as "Under Review"',
  'Our team assesses content against this policy',
  'Additional information may be requested',
  'A decision is made: Keep, Edit, or Remove the review',
]

const removalReasons = [
  'Violate this policy',
  'Cannot be verified when required',
  'Pose legal risks (e.g., defamation)',
  'Are deemed fraudulent or manipulative',
]

const accountActions = [
  'Issue warnings',
  'Temporarily restrict account activity',
  'Permanently suspend accounts',
]

const businessRights = [
  'Respond publicly to reviews',
  'Provide context or clarification',
  'Report reviews they believe are unfair or inaccurate',
]

const transparencyItems = [
  'We do not edit reviews to favour businesses',
  'Businesses cannot pay to remove negative reviews',
  'Verification does not guarantee a positive rating',
]

const legalItems = [
  'Your review is truthful to the best of your knowledge',
  'You have the right to share the information',
  'Your content does not infringe on any third-party rights',
]

const disclaimerItems = [
  'Guarantee the accuracy, completeness, or reliability of any content',
  'Endorse, recommend, or verify all businesses listed',
  'Act as an agent, intermediary, or party to any transaction between users and businesses',
]

const bizInteractionDisclaimer = [
  'The quality, safety, or legality of goods or services',
  'Misrepresentation by businesses',
  'Any disputes, losses, or damages arising from such interactions',
]

const noProfAdvice = [
  'Legal advice',
  'Financial advice',
  'Medical advice',
  'Professional or expert recommendations',
]

const platformAvailability = [
  'The platform will always be available, uninterrupted, or error-free',
  'Defects will be corrected immediately',
  'The platform will be free from viruses or harmful components',
]

const liabilityItems = [
  'Any indirect, incidental, special, or consequential damages',
  'Loss of profits, revenue, business opportunities, or data',
  'Reputational damage',
  'Losses arising from reliance on reviews or platform content',
  'Any unauthorised access to or use of our systems',
]

const liabilityCap = [
  'The amount paid by the user (if any) for use of the platform in the preceding 3 months, or',
  '₦37,500 (Thirty Seven Thousand, Five Hundred Naira), whichever is lower',
]

const indemnityItems = [
  'Your use of CleReview',
  'Your violation of applicable laws or regulations',
  'Your submitted content, including reviews',
  'Any disputes between you and other users or businesses',
]

const thirdPartyItems = [
  'The content of such websites',
  'Their privacy practices',
  'Any loss or damage arising from their use',
]
</script>