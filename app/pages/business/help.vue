<!-- pages/help-center.vue -->
<template>
  <div class="min-h-screen bg-green-50">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-[#1A1A2E] leading-none">Business Help Center</h1>
          <p class="text-xs text-gray-500 mt-0.5">Find tutorials, articles & support</p>
        </div>
        <nav class="hidden md:flex items-center gap-1">
          <a v-for="section in navSections" :key="section.id" :href="`#${section.id}`"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#1A1A2E] hover:bg-gray-100 transition-all duration-200">
            {{ section.label }}
          </a>
        </nav>
        <button
          class="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen">
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-[#1A1A2E]"></i>
        </button>
      </div>
      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1">
          <a v-for="section in navSections" :key="section.id" :href="`#${section.id}`"
            class="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-[#1A1A2E] hover:bg-gray-100 transition-all"
            @click="mobileMenuOpen = false">
            {{ section.label }}
          </a>
        </div>
      </Transition>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden py-20 px-4">
      <div class="absolute inset-0 pointer-events-none">
        <div
          class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F4A836]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4">
        </div>
        <div
          class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1A1A2E]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/4">
        </div>
      </div>
      <div class="relative max-w-3xl mx-auto text-center">
        <span
          class="inline-flex items-center gap-2 bg-[#1A1A2E] text-[#F4A836] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
          <i class="pi pi-headphones"></i>
          Support & Resources
        </span>
        <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1A2E] leading-tight mb-5">
          How can we<br />
          <span class="relative inline-block">
            help you today?
            <svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M2 9C50 3 150 1 298 9" stroke="#F4A836" stroke-width="4" stroke-linecap="round" />
            </svg>
          </span>
        </h2>
        <p class="text-[#6B6358] text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Everything you need to get the most out of CleReview — tutorials, articles, answers, and direct support.
        </p>
        <!-- Search Bar -->
        <div class="relative max-w-lg mx-auto">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#A09890]"></i>
          <input v-model="searchQuery" type="text" placeholder="Search for help..."
            class="w-full pl-11 pr-4 py-4 rounded-2xl bg-white border border-[#E2DDD5] shadow-sm text-[#1A1A2E] placeholder-[#B0A898] focus:outline-none focus:ring-2 focus:ring-[#F4A836]/50 focus:border-[#F4A836] transition-all text-sm" />
        </div>
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-24">

      <!-- ── SECTION 1: Video Tutorials ── -->
      <section id="tutorials">
        <SectionHeader icon="pi-video" label="Video Tutorials" title="Learn by Watching"
          description="Step-by-step video guides to help you master every feature of CleReview." />
        <!-- Category Tabs -->
        <div class="flex gap-2 flex-wrap mb-8 mt-8">
          <button v-for="cat in videoCategories" :key="cat" @click="activeVideoCategory = cat" :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            activeVideoCategory === cat
              ? 'bg-[#1A1A2E] text-white shadow-md'
              : 'bg-white text-[#6B6358] border border-[#E2DDD5] hover:border-[#1A1A2E]'
          ]">
            {{ cat }}
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="video in filteredVideos" :key="video.id"
            class="group bg-white rounded-2xl overflow-hidden border border-[#E2DDD5] hover:border-[#F4A836] hover:shadow-lg transition-all duration-300 cursor-pointer"
            @click="openVideo(video)">
            <!-- Thumbnail -->
            <div class="relative aspect-video overflow-hidden" :style="{ background: video.gradient }">
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <i class="pi pi-play text-white text-xl ml-1"></i>
                </div>
              </div>
              <div class="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-mono">
                {{ video.duration }}
              </div>
              <div
                class="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/30">
                {{ video.category }}
              </div>
            </div>
            <!-- Info -->
            <div class="p-5">
              <h3
                class="font-display font-bold text-[#1A1A2E] text-base mb-1.5 group-hover:text-[#F4A836] transition-colors">
                {{ video.title }}</h3>
              <p class="text-[#8A8070] text-sm leading-relaxed mb-3">{{ video.description }}</p>
              <div class="flex items-center gap-3 text-xs text-[#A09890]">
                <span class="flex items-center gap-1"><i class="pi pi-eye"></i> {{ video.views }}</span>
                <span class="flex items-center gap-1"><i class="pi pi-clock"></i> {{ video.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Video Modal -->
        <Transition name="fade">
          <div v-if="activeVideo"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            @click.self="activeVideo = null">
            <div class="bg-white rounded-3xl overflow-hidden w-full max-w-3xl shadow-2xl">
              <div class="flex items-center justify-between p-5 border-b border-[#E2DDD5]">
                <h3 class="font-display font-bold text-[#1A1A2E] text-lg">{{ activeVideo.title }}</h3>
                <button @click="activeVideo = null"
                  class="w-9 h-9 rounded-lg hover:bg-[#F0EDE8] flex items-center justify-center transition-colors">
                  <i class="pi pi-times text-[#6B6358]"></i>
                </button>
              </div>
              <div class="aspect-video w-full flex items-center justify-center"
                :style="{ background: activeVideo.gradient }">
                <div class="text-center text-white">
                  <div
                    class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/30">
                    <i class="pi pi-play text-4xl ml-2"></i>
                  </div>
                  <p class="text-white/80 text-sm">Video player would render here</p>
                </div>
              </div>
              <div class="p-5">
                <p class="text-[#6B6358] text-sm">{{ activeVideo.description }}</p>
              </div>
            </div>
          </div>
        </Transition>
      </section>

      <!-- ── SECTION 2: Helpful Articles ── -->
      <section id="articles">
        <SectionHeader icon="pi-book" label="Helpful Articles" title="Deep Dive Guides"
          description="In-depth articles written by our team to help you grow your business on CleReview." />
        <!-- Featured Article -->
        <div
          class="mt-8 mb-6 rounded-3xl bg-[#1A1A2E] p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-center group cursor-pointer hover:bg-[#252544] transition-colors duration-300">
          <div class="flex-1">
            <span
              class="inline-flex items-center gap-1.5 text-[#F4A836] text-xs font-semibold tracking-wider uppercase mb-4">
              <i class="pi pi-bookmark-fill"></i> Featured
            </span>
            <h3 class="font-display font-black text-white text-2xl sm:text-3xl mb-3 leading-tight">The Complete Guide to
              Managing Your Business Reputation Online</h3>
            <p class="text-[#A09890] text-sm leading-relaxed mb-5">Learn proven strategies to respond to reviews, build
              trust with customers, and leverage feedback to grow your business.</p>
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5 text-[#8A8070] text-xs"><i class="pi pi-clock"></i> 12 min
                read</span>
              <span class="flex items-center gap-1.5 text-[#8A8070] text-xs"><i class="pi pi-calendar"></i> Mar 1,
                2026</span>
            </div>
          </div>
          <div
            class="flex-shrink-0 w-full sm:w-48 h-40 rounded-2xl bg-gradient-to-br from-[#F4A836] to-[#E8832A] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <i class="pi pi-chart-line text-white text-6xl opacity-60"></i>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="article in articles" :key="article.id"
            class="bg-white rounded-2xl p-6 border border-[#E2DDD5] hover:border-[#F4A836] hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
              :style="{ background: article.iconBg }">
              <i :class="`pi ${article.icon}`" :style="{ color: article.iconColor }"></i>
            </div>
            <span class="text-xs font-semibold text-[#A09890] tracking-wider uppercase mb-2">{{ article.category
            }}</span>
            <h3
              class="font-display font-bold text-[#1A1A2E] text-base mb-2 group-hover:text-[#E8832A] transition-colors leading-snug flex-1">
              {{ article.title }}</h3>
            <p class="text-[#8A8070] text-sm leading-relaxed mb-4">{{ article.excerpt }}</p>
            <div class="flex items-center justify-between pt-4 border-t border-[#F0EDE8]">
              <span class="text-xs text-[#A09890] flex items-center gap-1"><i class="pi pi-clock"></i> {{
                article.readTime }}</span>
              <span
                class="text-xs font-medium text-[#E8832A] flex items-center gap-1 group-hover:gap-2 transition-all">Read
                more <i class="pi pi-arrow-right text-xs"></i></span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── SECTION 3: FAQs ── -->
      <section id="faqs">
        <SectionHeader icon="pi-question-circle" label="FAQs" title="Frequently Asked Questions"
          description="Quick answers to the questions business owners ask us most often." />
        <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Category sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl border border-[#E2DDD5] p-2 sticky top-24">
              <button v-for="cat in faqCategories" :key="cat.id" @click="activeFaqCategory = cat.id" :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left',
                activeFaqCategory === cat.id
                  ? 'bg-[#1A1A2E] text-white'
                  : 'text-[#5C5449] hover:bg-[#F7F6F2]'
              ]">
                <i
                  :class="`pi ${cat.icon} text-sm ${activeFaqCategory === cat.id ? 'text-[#F4A836]' : 'text-[#A09890]'}`"></i>
                {{ cat.label }}
                <span
                  :class="['ml-auto text-xs px-2 py-0.5 rounded-full', activeFaqCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#F0EDE8] text-[#8A8070]']">
                  {{ cat.count }}
                </span>
              </button>
            </div>
          </div>
          <!-- FAQ items -->
          <div class="lg:col-span-2 space-y-3">
            <div v-for="faq in filteredFaqs" :key="faq.id"
              class="bg-white rounded-2xl border border-[#E2DDD5] overflow-hidden"
              :class="activeFaq === faq.id ? 'border-[#F4A836]' : ''">
              <button class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                @click="activeFaq = activeFaq === faq.id ? null : faq.id">
                <span class="font-semibold text-[#1A1A2E] text-sm leading-snug">{{ faq.question }}</span>
                <i
                  :class="['pi text-[#A09890] transition-transform duration-300 flex-shrink-0', activeFaq === faq.id ? 'pi-chevron-up text-[#F4A836]' : 'pi-chevron-down']"></i>
              </button>
              <Transition name="accordion">
                <div v-if="activeFaq === faq.id" class="px-6 pb-5">
                  <div class="h-px bg-[#F0EDE8] mb-4"></div>
                  <p class="text-[#6B6358] text-sm leading-relaxed">{{ faq.answer }}</p>
                  <div class="mt-4 flex items-center gap-2">
                    <span class="text-xs text-[#A09890]">Was this helpful?</span>
                    <button
                      class="text-xs flex items-center gap-1 text-[#6B6358] hover:text-green-600 transition-colors px-2.5 py-1 rounded-lg hover:bg-green-50"><i
                        class="pi pi-thumbs-up"></i> Yes</button>
                    <button
                      class="text-xs flex items-center gap-1 text-[#6B6358] hover:text-red-500 transition-colors px-2.5 py-1 rounded-lg hover:bg-red-50"><i
                        class="pi pi-thumbs-down"></i> No</button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </section>

      <!-- ── SECTION 4: Raise a Ticket ── -->
      <section id="tickets">
        <SectionHeader icon="pi-ticket" label="Support Tickets" title="Contact Our Team"
          description="Can't find what you're looking for? Raise a ticket and our team will get back to you." />
        <div class="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <!-- Contact options -->
          <div class="lg:col-span-2 space-y-4">
            <div v-for="channel in contactChannels" :key="channel.id"
              class="bg-white rounded-2xl p-5 border border-[#E2DDD5] flex items-start gap-4 hover:border-[#F4A836] hover:shadow-sm transition-all cursor-pointer group">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                :style="{ background: channel.bg }">
                <i :class="`pi ${channel.icon}`" :style="{ color: channel.color }"></i>
              </div>
              <div>
                <h4 class="font-semibold text-[#1A1A2E] text-sm mb-0.5 group-hover:text-[#E8832A] transition-colors">{{
                  channel.label }}</h4>
                <p class="text-[#8A8070] text-xs leading-relaxed">{{ channel.description }}</p>
                <span class="inline-block mt-2 text-xs font-semibold" :style="{ color: channel.color }">{{
                  channel.availability }}</span>
              </div>
            </div>

            <!-- SLA card -->
            <div class="bg-[#1A1A2E] rounded-2xl p-5">
              <div class="flex items-center gap-2 mb-3">
                <i class="pi pi-shield text-[#F4A836]"></i>
                <span class="text-white font-semibold text-sm">Our Response Commitment</span>
              </div>
              <div class="space-y-2.5">
                <div v-for="sla in slaItems" :key="sla.label" class="flex items-center justify-between">
                  <span class="text-[#A09890] text-xs">{{ sla.label }}</span>
                  <span class="text-white text-xs font-semibold">{{ sla.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ticket Form -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-3xl border border-[#E2DDD5] p-7 shadow-sm">
              <h3 class="font-display font-bold text-[#1A1A2E] text-xl mb-6">Raise a Support Ticket</h3>

              <Transition name="fade" mode="out-in">
                <div v-if="ticketSubmitted" class="text-center py-10">
                  <div class="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <i class="pi pi-check-circle text-green-500 text-4xl"></i>
                  </div>
                  <h4 class="font-display font-bold text-[#1A1A2E] text-xl mb-2">Ticket Raised!</h4>
                  <p class="text-[#6B6358] text-sm mb-1">Your ticket <strong class="text-[#1A1A2E]">#{{ ticketNumber
                  }}</strong> has been submitted.</p>
                  <p class="text-[#8A8070] text-sm mb-6">We'll get back to you within the committed timeframe.</p>
                  <button @click="resetForm"
                    class="px-6 py-2.5 rounded-xl bg-[#1A1A2E] text-white text-sm font-medium hover:bg-[#252544] transition-colors">
                    Raise Another Ticket
                  </button>
                </div>

                <form v-else @submit.prevent="submitTicket" class="space-y-5">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-[#5C5449] mb-1.5 uppercase tracking-wide">Your
                        Name</label>
                      <input v-model="ticketForm.name" type="text" placeholder="John Adewale" required
                        class="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#F7F6F2] text-sm text-[#1A1A2E] placeholder-[#B0A898] focus:outline-none focus:ring-2 focus:ring-[#F4A836]/40 focus:border-[#F4A836] transition-all" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-[#5C5449] mb-1.5 uppercase tracking-wide">Business
                        Email</label>
                      <input v-model="ticketForm.email" type="email" placeholder="you@business.com" required
                        class="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#F7F6F2] text-sm text-[#1A1A2E] placeholder-[#B0A898] focus:outline-none focus:ring-2 focus:ring-[#F4A836]/40 focus:border-[#F4A836] transition-all" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-[#5C5449] mb-1.5 uppercase tracking-wide">Business
                      Name</label>
                    <input v-model="ticketForm.business" type="text" placeholder="Acme Corp"
                      class="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#F7F6F2] text-sm text-[#1A1A2E] placeholder-[#B0A898] focus:outline-none focus:ring-2 focus:ring-[#F4A836]/40 focus:border-[#F4A836] transition-all" />
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-[#5C5449] mb-1.5 uppercase tracking-wide">Issue
                        Category</label>
                      <select v-model="ticketForm.category" required
                        class="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#F7F6F2] text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#F4A836]/40 focus:border-[#F4A836] transition-all appearance-none cursor-pointer">
                        <option value="" disabled>Select category...</option>
                        <option>Account & Billing</option>
                        <option>Review Management</option>
                        <option>Profile & Settings</option>
                        <option>Technical Issue</option>
                        <option>Analytics & Reports</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label
                        class="block text-xs font-semibold text-[#5C5449] mb-1.5 uppercase tracking-wide">Priority</label>
                      <div class="flex gap-2">
                        <button v-for="p in ['Low', 'Medium', 'High']" :key="p" type="button"
                          @click="ticketForm.priority = p" :class="[
                            'flex-1 py-3 rounded-xl text-xs font-semibold border transition-all',
                            ticketForm.priority === p
                              ? p === 'High' ? 'bg-red-500 text-white border-red-500' : p === 'Medium' ? 'bg-[#F4A836] text-white border-[#F4A836]' : 'bg-[#1A1A2E] text-white border-[#1A1A2E]'
                              : 'bg-[#F7F6F2] text-[#6B6358] border-[#E2DDD5] hover:border-[#1A1A2E]'
                          ]">{{ p }}</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-xs font-semibold text-[#5C5449] mb-1.5 uppercase tracking-wide">Subject</label>
                    <input v-model="ticketForm.subject" type="text" placeholder="Brief summary of your issue" required
                      class="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#F7F6F2] text-sm text-[#1A1A2E] placeholder-[#B0A898] focus:outline-none focus:ring-2 focus:ring-[#F4A836]/40 focus:border-[#F4A836] transition-all" />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-[#5C5449] mb-1.5 uppercase tracking-wide">Describe
                      the Issue</label>
                    <textarea v-model="ticketForm.message" rows="4"
                      placeholder="Please describe the issue in detail, including any steps to reproduce it..." required
                      class="w-full px-4 py-3 rounded-xl border border-[#E2DDD5] bg-[#F7F6F2] text-sm text-[#1A1A2E] placeholder-[#B0A898] focus:outline-none focus:ring-2 focus:ring-[#F4A836]/40 focus:border-[#F4A836] transition-all resize-none"></textarea>
                  </div>

                  <!-- Attachment -->
                  <div
                    class="border-2 border-dashed border-[#E2DDD5] rounded-xl p-5 text-center hover:border-[#F4A836] transition-colors cursor-pointer group"
                    @click="triggerFileInput">
                    <input ref="fileInput" type="file" class="hidden" accept="image/*,.pdf"
                      @change="handleFileChange" />
                    <i
                      class="pi pi-paperclip text-2xl text-[#A09890] group-hover:text-[#F4A836] transition-colors mb-2 block"></i>
                    <p class="text-sm text-[#6B6358]" v-if="!ticketForm.attachment">
                      Attach a screenshot or file <span class="text-[#A09890] text-xs block mt-0.5">(PNG, JPG, PDF — max
                        5MB)</span>
                    </p>
                    <p class="text-sm text-[#E8832A] font-medium" v-else>
                      <i class="pi pi-check-circle mr-1"></i>{{ ticketForm.attachment }}
                    </p>
                  </div>

                  <button type="submit" :disabled="isSubmitting"
                    class="w-full py-4 rounded-xl bg-[#1A1A2E] text-white font-semibold text-sm hover:bg-[#252544] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
                    <i v-else class="pi pi-send"></i>
                    {{ isSubmitting ? 'Submitting...' : 'Submit Ticket' }}
                  </button>
                </form>
              </Transition>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-[#E2DDD5] bg-white py-8 px-4 text-center">
      <p class="text-[#8A8070] text-sm">© 2026 CleReview · Business Help Center · <a href="#"
          class="text-[#E8832A] hover:underline">Privacy Policy</a></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ layout: 'business' })

// ── Types ──
interface Video { id: number; title: string; description: string; duration: string; views: string; date: string; gradient: string; category: string }
interface Article { id: number; title: string; excerpt: string; category: string; readTime: string; icon: string; iconBg: string; iconColor: string }
interface FAQ { id: number; question: string; answer: string; category: string }

// ── Nav ──
const navSections = [
  { id: 'tutorials', label: 'Tutorials' },
  { id: 'articles', label: 'Articles' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'tickets', label: 'Support' },
]

const mobileMenuOpen = ref(false)
const searchQuery = ref('')

// ── Videos ──
const videoCategories = ['All', 'Getting Started', 'Review Management', 'Analytics', 'Settings']
const activeVideoCategory = ref('All')
const activeVideo = ref<Video | null>(null)

const videos: Video[] = [
  { id: 1, title: 'Getting Started with CleReview', description: 'Set up your business profile and start collecting reviews in minutes.', duration: '4:32', views: '12.4k', date: '2 weeks ago', gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', category: 'Getting Started' },
  { id: 2, title: 'How to Respond to Reviews', description: 'Best practices for replying to positive and negative customer reviews.', duration: '6:15', views: '8.1k', date: '1 month ago', gradient: 'linear-gradient(135deg, #E8832A 0%, #F4A836 100%)', category: 'Review Management' },
  { id: 3, title: 'Reading Your Analytics Dashboard', description: 'Understand your review metrics, ratings trends, and customer sentiment.', duration: '8:47', views: '5.3k', date: '3 weeks ago', gradient: 'linear-gradient(135deg, #2E4057 0%, #048A81 100%)', category: 'Analytics' },
  { id: 4, title: 'Setting Up Review Request Campaigns', description: 'Automate review requests via email and SMS to boost your review count.', duration: '5:20', views: '7.8k', date: '5 days ago', gradient: 'linear-gradient(135deg, #6B2D8B 0%, #9B5DE5 100%)', category: 'Review Management' },
  { id: 5, title: 'Managing Multiple Business Locations', description: 'Handle reviews and profiles for multiple branches from one dashboard.', duration: '7:03', views: '3.9k', date: '2 months ago', gradient: 'linear-gradient(135deg, #1B4332 0%, #40916C 100%)', category: 'Settings' },
  { id: 6, title: 'Competitor Benchmarking', description: 'Track how your ratings compare to competitors in your industry.', duration: '9:11', views: '6.2k', date: '1 week ago', gradient: 'linear-gradient(135deg, #9D0208 0%, #E85D04 100%)', category: 'Analytics' },
]

const filteredVideos = computed(() =>
  activeVideoCategory.value === 'All' ? videos : videos.filter(v => v.category === activeVideoCategory.value)
)
const openVideo = (video: Video) => { activeVideo.value = video }

// ── Articles ──
const articles: Article[] = [
  { id: 1, title: 'How to Turn Negative Reviews Into Business Opportunities', excerpt: 'A structured approach to responding professionally and recovering customer trust.', category: 'Review Strategy', readTime: '5 min read', icon: 'pi-refresh', iconBg: '#FEF3C7', iconColor: '#D97706' },
  { id: 2, title: 'Understanding Your Review Rating Score', excerpt: 'How CleReview calculates your overall score and what factors influence it.', category: 'Analytics', readTime: '3 min read', icon: 'pi-chart-bar', iconBg: '#EDE9FE', iconColor: '#7C3AED' },
  { id: 3, title: 'Getting More Reviews: Ethical Strategies That Work', excerpt: 'Proven, compliant methods to encourage genuine customer feedback.', category: 'Growth', readTime: '7 min read', icon: 'pi-users', iconBg: '#D1FAE5', iconColor: '#059669' },
  { id: 4, title: 'Setting Up Your Business Profile for Success', excerpt: 'Optimize every field in your profile to attract and convert more customers.', category: 'Getting Started', readTime: '4 min read', icon: 'pi-building', iconBg: '#FEE2E2', iconColor: '#DC2626' },
  { id: 5, title: 'Using Review Widgets on Your Website', excerpt: 'Embed live review badges and carousels to build credibility on your site.', category: 'Integrations', readTime: '6 min read', icon: 'pi-code', iconBg: '#DBEAFE', iconColor: '#2563EB' },
  { id: 6, title: 'Managing Your Team Access & Permissions', excerpt: 'Invite team members and control who can respond, view analytics, or manage settings.', category: 'Settings', readTime: '4 min read', icon: 'pi-lock', iconBg: '#F0FDF4', iconColor: '#16A34A' },
]

// ── FAQs ──
const faqCategories = [
  { id: 'all', label: 'All Questions', icon: 'pi-list', count: 12 },
  { id: 'account', label: 'Account & Billing', icon: 'pi-credit-card', count: 4 },
  { id: 'reviews', label: 'Reviews', icon: 'pi-star', count: 4 },
  { id: 'technical', label: 'Technical', icon: 'pi-cog', count: 4 },
]
const activeFaqCategory = ref('all')
const activeFaq = ref<number | null>(null)

const faqs: FAQ[] = [
  { id: 1, question: 'How do I claim my business profile?', answer: 'To claim your business profile, search for your business on CleReview, click "Claim this business," and follow the verification steps. We support verification via phone, email, or postcard for your business address. The process usually takes 1–3 business days.', category: 'account' },
  { id: 2, question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, Mastercard, American Express), bank transfers for annual plans, and mobile money options including MTN MoMo, Airtel Money, and Opay for Nigerian businesses.', category: 'account' },
  { id: 3, question: 'Can I cancel my subscription at any time?', answer: 'Yes. You can cancel your subscription at any time from Settings → Billing. Your access continues until the end of your current billing period. We do not offer refunds for partial periods, but you will not be charged again after cancellation.', category: 'account' },
  { id: 4, question: 'How do I add team members to my account?', answer: 'Go to Settings → Team, click "Invite Member," enter their email and assign a role (Admin, Manager, or Viewer). They will receive an invitation email. You can manage or revoke access at any time from the same screen.', category: 'account' },
  { id: 5, question: 'Can I remove a fake or fraudulent review?', answer: 'You can flag any review you believe is fraudulent by clicking the flag icon on the review. Our moderation team investigates flagged reviews within 5–7 business days. We evaluate against our review authenticity policy and remove confirmed fake reviews.', category: 'reviews' },
  { id: 6, question: 'How long does it take for a new review to appear?', answer: 'New reviews go through automated checks before publishing. Most reviews appear within 5–30 minutes. In rare cases where additional moderation is needed, it may take up to 24 hours.', category: 'reviews' },
  { id: 7, question: 'Can I respond to reviews privately?', answer: 'Currently, review responses on CleReview are public and visible to all visitors. This transparency helps other customers see how your business handles feedback. We do not support private replies at this time.', category: 'reviews' },
  { id: 8, question: 'How is my overall star rating calculated?', answer: 'Your overall rating is a weighted average of all verified reviews, with more recent reviews given slightly higher weight. Unverified or flagged reviews are excluded from the calculation until cleared by moderation.', category: 'reviews' },
  { id: 9, question: 'Why is my review widget not showing on my website?', answer: 'First, ensure the widget script is placed before the closing </body> tag. Clear your browser cache and disable any ad blockers for testing. If issues persist, check that your domain is whitelisted in Settings → Integrations → Widget Domains.', category: 'technical' },
  { id: 10, question: 'How do I connect CleReview to Google My Business?', answer: 'Go to Settings → Integrations → Google My Business and click "Connect." Sign in with your Google account and grant the requested permissions. Your GMB reviews will begin syncing within 1–2 hours.', category: 'technical' },
  { id: 11, question: 'Is my customer data secure?', answer: 'Yes. CleReview is ISO 27001 certified and NDPR compliant. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We never sell your data to third parties. You can request a data export or deletion at any time.', category: 'technical' },
  { id: 12, question: 'Does CleReview have a mobile app?', answer: 'Yes! CleReview is available on iOS and Android. Search "CleReview Business" in the App Store or Google Play. The mobile app supports review monitoring, responding, and real-time notifications for new reviews.', category: 'technical' },
]

const filteredFaqs = computed(() =>
  activeFaqCategory.value === 'all' ? faqs : faqs.filter(f => f.category === activeFaqCategory.value)
)

// ── Contact Channels ──
const contactChannels = [
  {
    id: 1, label: 'Email Support', description: 'Send us a detailed message and we\'ll reply to your inbox.', icon: 'pi-envelope', bg: '#FEF3C7', color: '#D97706', availability: 'Response within 4 hours'
  },
  { id: 2, label: 'Live Chat', description: 'Chat with a support agent directly in the dashboard.', icon: 'pi-comments', bg: '#D1FAE5', color: '#059669', availability: 'Mon–Fri, 8am–8pm WAT' },
  { id: 3, label: 'Schedule a Call', description: 'Book a video call with our business success team.', icon: 'pi-video', bg: '#DBEAFE', color: '#2563EB', availability: 'Available this week' },
]

const slaItems = [
  { label: '🔴 High Priority', time: '< 2 hours' },
  { label: '🟡 Medium Priority', time: '< 8 hours' },
  { label: '🟢 Low Priority', time: '< 24 hours' },
]

// ── Ticket Form ──
const fileInput = ref<HTMLInputElement | null>(null)
const isSubmitting = ref(false)
const ticketSubmitted = ref(false)
const ticketNumber = ref('')

const ticketForm = ref({
  name: '', email: '', business: '', category: '', priority: 'Medium', subject: '', message: '', attachment: ''
})

const triggerFileInput = () => fileInput.value?.click()
const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) ticketForm.value.attachment = file.name
}

const submitTicket = async () => {
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 1800))
  ticketNumber.value = `RH-${Math.floor(100000 + Math.random() * 900000)}`
  isSubmitting.value = false
  ticketSubmitted.value = true
}

const resetForm = () => {
  ticketSubmitted.value = false
  ticketForm.value = { name: '', email: '', business: '', category: '', priority: 'Medium', subject: '', message: '', attachment: '' }
}
</script>

<!-- SectionHeader component (inline as a local component below, or create a separate file) -->
<script lang="ts">
import { defineComponent, h } from 'vue'
const SectionHeader = defineComponent({
  props: { icon: String, label: String, title: String, description: String },
  setup(props) {
    return () => h('div', { class: 'flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 border-b border-[#E2DDD5] pb-6' }, [
      h('div', { class: 'flex-1' }, [
        h('div', { class: 'flex items-center gap-2.5 mb-2' }, [
          h('div', { class: 'w-8 h-8 rounded-lg bg-[#1A1A2E] flex items-center justify-center' },
            [h('i', { class: `pi ${props.icon} text-[#F4A836] text-sm` })]
          ),
          h('span', { class: 'text-xs font-bold text-[#A09890] tracking-widest uppercase' }, props.label),
        ]),
        h('h2', { class: 'font-display font-black text-[#1A1A2E] text-3xl sm:text-4xl' }, props.title),
      ]),
      h('p', { class: 'text-[#6B6358] text-sm max-w-sm leading-relaxed' }, props.description),
    ])
  }
})
export default { components: { SectionHeader } }
</script>

<style scoped>
/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 400px;
  opacity: 1;
}
</style>