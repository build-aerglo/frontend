<template>
  <div class="min-h-screen bg-gray-950 text-white font-sans">
    <!-- Header -->
    <header class="relative overflow-hidden border-b border-emerald-900/40">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-950 via-gray-950 to-amber-950/30 pointer-events-none" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="max-w-3xl">
          <span class="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
            <i class="pi pi-headphones text-sm" />
            Business Support Hub
          </span>
          <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-5">
            How can we
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400"> help you?</span>
          </h1>
          <p class="text-gray-400 text-lg md:text-xl leading-relaxed mb-8">
            Everything you need to manage your business, resolve issues, and get the most out of your review platform.
          </p>
          <!-- Search Bar -->
          <div class="relative max-w-xl">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tutorials, articles, FAQs..."
              class="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all"
            />
          </div>
        </div>
      </div>
      <!-- Decorative orbs -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
    </header>

    <!-- Quick Nav Pills -->
    <nav class="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-1 overflow-x-auto scrollbar-hide py-3">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="scrollTo(section.id)"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
            :class="activeSection === section.id
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            <i :class="`pi ${section.icon} text-xs`" />
            {{ section.label }}
          </button>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

      <!-- ── 1. VIDEO TUTORIALS ── -->
      <section id="tutorials">
        <SectionHeader
          icon="pi-play-circle"
          label="Video Tutorials"
          title="Learn at your own pace"
          subtitle="Step-by-step video guides to help you set up and grow your business on the platform."
          color="emerald"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          <div
            v-for="video in filteredVideos"
            :key="video.id"
            class="group relative bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
            @click="openVideo(video)"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-video bg-gradient-to-br overflow-hidden" :class="video.gradient">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300">
                  <i class="pi pi-play text-white text-lg ml-0.5" />
                </div>
              </div>
              <div class="absolute top-3 left-3">
                <span class="text-xs bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md border border-white/10">
                  {{ video.duration }}
                </span>
              </div>
              <div class="absolute top-3 right-3">
                <span class="text-xs px-2 py-1 rounded-md font-medium" :class="video.levelClass">
                  {{ video.level }}
                </span>
              </div>
              <!-- Decorative icon in bg -->
              <i :class="`pi ${video.bgIcon} absolute bottom-3 right-3 text-4xl text-white/10`" />
            </div>
            <!-- Info -->
            <div class="p-5">
              <span class="text-xs text-emerald-400 font-semibold tracking-wide uppercase">{{ video.category }}</span>
              <h3 class="text-white font-semibold mt-1 mb-2 leading-snug group-hover:text-emerald-300 transition-colors">
                {{ video.title }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ video.description }}</p>
            </div>
          </div>
        </div>

        <div v-if="filteredVideos.length === 0" class="text-center py-12 text-gray-500">
          <i class="pi pi-video text-4xl mb-3 block" />
          No tutorials match your search.
        </div>
      </section>

      <!-- ── 2. HELPFUL ARTICLES ── -->
      <section id="articles">
        <SectionHeader
          icon="pi-book"
          label="Helpful Articles"
          title="In-depth guides & documentation"
          subtitle="Detailed written guides covering every feature of your business dashboard."
          color="amber"
        />

        <!-- Category Filter -->
        <div class="flex gap-2 flex-wrap mt-8 mb-8">
          <button
            v-for="cat in articleCategories"
            :key="cat"
            @click="activeArticleCategory = cat"
            class="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
            :class="activeArticleCategory === cat
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
              : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'"
          >
            {{ cat }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            class="group flex gap-4 p-5 bg-white/3 border border-white/8 rounded-2xl hover:border-amber-500/30 hover:bg-amber-500/3 transition-all duration-200 cursor-pointer"
          >
            <div class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors mt-0.5">
              <i :class="`pi ${article.icon} text-amber-400 text-sm`" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-white font-semibold text-sm leading-snug group-hover:text-amber-300 transition-colors">
                  {{ article.title }}
                </h3>
                <i class="pi pi-arrow-right text-gray-600 group-hover:text-amber-400 transition-all group-hover:translate-x-1 text-xs mt-1 shrink-0" />
              </div>
              <p class="text-gray-500 text-xs mt-1 leading-relaxed">{{ article.description }}</p>
              <div class="flex items-center gap-3 mt-3">
                <span class="text-xs text-gray-600">
                  <i class="pi pi-clock mr-1" />{{ article.readTime }}
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/8">
                  {{ article.category }}
                </span>
              </div>
            </div>
          </article>
        </div>

        <div v-if="filteredArticles.length === 0" class="text-center py-12 text-gray-500">
          <i class="pi pi-book text-4xl mb-3 block" />
          No articles match your search.
        </div>
      </section>

      <!-- ── 3. FAQs ── -->
      <section id="faqs">
        <SectionHeader
          icon="pi-question-circle"
          label="FAQs"
          title="Frequently asked questions"
          subtitle="Quick answers to the most common questions from business owners like you."
          color="emerald"
        />

        <div class="mt-10 max-w-3xl mx-auto space-y-3">
          <div
            v-for="(faq, index) in filteredFaqs"
            :key="index"
            class="border border-white/8 rounded-2xl overflow-hidden transition-all duration-200"
            :class="openFaq === index ? 'border-emerald-500/30 bg-emerald-500/3' : 'bg-white/3 hover:border-white/15'"
          >
            <button
              class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              @click="toggleFaq(index)"
            >
              <span class="font-medium text-sm text-white leading-snug">{{ faq.question }}</span>
              <i
                class="pi pi-chevron-down text-gray-400 text-xs shrink-0 transition-transform duration-300"
                :class="openFaq === index ? 'rotate-180 text-emerald-400' : ''"
              />
            </button>
            <Transition name="faq">
              <div v-if="openFaq === index" class="px-6 pb-5">
                <p class="text-gray-400 text-sm leading-relaxed">{{ faq.answer }}</p>
                <div v-if="faq.tag" class="mt-3">
                  <span class="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    <i class="pi pi-tag text-xs" />
                    {{ faq.tag }}
                  </span>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <div v-if="filteredFaqs.length === 0" class="text-center py-12 text-gray-500">
          <i class="pi pi-question-circle text-4xl mb-3 block" />
          No FAQs match your search.
        </div>
      </section>

      <!-- ── 4. RAISE A TICKET ── -->
      <section id="tickets">
        <SectionHeader
          icon="pi-ticket"
          label="Support Tickets"
          title="Contact our support team"
          subtitle="Can't find what you're looking for? Raise a ticket and our team will get back to you."
          color="amber"
        />

        <div class="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-8">

          <!-- Left: Contact cards -->
          <div class="lg:col-span-2 space-y-4">
            <div
              v-for="channel in contactChannels"
              :key="channel.title"
              class="p-5 bg-white/3 border border-white/8 rounded-2xl hover:border-emerald-500/20 transition-all cursor-pointer group"
            >
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="channel.iconBg">
                  <i :class="`pi ${channel.icon} text-sm`" :style="{ color: channel.iconColor }" />
                </div>
                <div>
                  <h4 class="text-white font-semibold text-sm">{{ channel.title }}</h4>
                  <p class="text-gray-500 text-xs mt-1 leading-relaxed">{{ channel.description }}</p>
                  <span class="inline-block mt-2 text-xs font-medium" :style="{ color: channel.iconColor }">
                    {{ channel.action }} <i class="pi pi-arrow-right text-xs" />
                  </span>
                </div>
              </div>
            </div>

            <!-- SLA Info -->
            <div class="p-5 bg-gradient-to-br from-emerald-950/60 to-amber-950/30 border border-emerald-900/40 rounded-2xl">
              <h4 class="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <i class="pi pi-clock text-emerald-400" /> Response Times
              </h4>
              <div class="space-y-2">
                <div v-for="sla in slaItems" :key="sla.priority" class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" :class="sla.dot" />
                    <span class="text-gray-400 text-xs">{{ sla.priority }}</span>
                  </div>
                  <span class="text-white text-xs font-medium">{{ sla.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Ticket Form -->
          <div class="lg:col-span-3 bg-white/3 border border-white/8 rounded-2xl p-6 md:p-8">
            <h3 class="text-white font-bold text-lg mb-1">Raise a Support Ticket</h3>
            <p class="text-gray-500 text-sm mb-6">Fill out the form below and we'll respond within 24 hours.</p>

            <!-- Success State -->
            <div v-if="ticketSubmitted" class="text-center py-10">
              <div class="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-check text-emerald-400 text-2xl" />
              </div>
              <h4 class="text-white font-bold text-lg mb-2">Ticket Raised Successfully!</h4>
              <p class="text-gray-400 text-sm mb-2">Your ticket ID is <span class="text-emerald-400 font-mono font-semibold">{{ ticketId }}</span></p>
              <p class="text-gray-500 text-xs">Our team will get back to you at <span class="text-white">{{ ticketForm.email }}</span></p>
              <button
                @click="resetTicket"
                class="mt-6 text-sm text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/30 px-5 py-2 rounded-lg hover:bg-emerald-500/10"
              >
                Raise Another Ticket
              </button>
            </div>

            <!-- Form -->
            <div v-else class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1.5">Full Name <span class="text-red-400">*</span></label>
                  <input
                    v-model="ticketForm.name"
                    type="text"
                    placeholder="Jane Doe"
                    class="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                    :class="formErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/60'"
                  />
                  <span v-if="formErrors.name" class="text-red-400 text-xs mt-1 block">{{ formErrors.name }}</span>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1.5">Business Email <span class="text-red-400">*</span></label>
                  <input
                    v-model="ticketForm.email"
                    type="email"
                    placeholder="you@business.com"
                    class="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                    :class="formErrors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/60'"
                  />
                  <span v-if="formErrors.email" class="text-red-400 text-xs mt-1 block">{{ formErrors.email }}</span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1.5">Business Name</label>
                <input
                  v-model="ticketForm.business"
                  type="text"
                  placeholder="Your Business Name"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1.5">Issue Category <span class="text-red-400">*</span></label>
                  <select
                    v-model="ticketForm.category"
                    class="w-full bg-gray-900 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors appearance-none cursor-pointer"
                    :class="[
                      formErrors.category ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/60',
                      ticketForm.category ? 'text-white' : 'text-gray-600'
                    ]"
                  >
                    <option value="" disabled class="text-gray-600">Select a category</option>
                    <option v-for="cat in ticketCategories" :key="cat" :value="cat" class="text-white bg-gray-900">{{ cat }}</option>
                  </select>
                  <span v-if="formErrors.category" class="text-red-400 text-xs mt-1 block">{{ formErrors.category }}</span>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1.5">Priority</label>
                  <div class="flex gap-2">
                    <button
                      v-for="p in priorities"
                      :key="p.value"
                      type="button"
                      @click="ticketForm.priority = p.value"
                      class="flex-1 py-3 rounded-xl text-xs font-medium border transition-all"
                      :class="ticketForm.priority === p.value ? p.activeClass : 'border-white/10 text-gray-500 hover:border-white/20'"
                    >
                      {{ p.label }}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1.5">Subject <span class="text-red-400">*</span></label>
                <input
                  v-model="ticketForm.subject"
                  type="text"
                  placeholder="Brief summary of your issue"
                  class="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                  :class="formErrors.subject ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/60'"
                />
                <span v-if="formErrors.subject" class="text-red-400 text-xs mt-1 block">{{ formErrors.subject }}</span>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1.5">Describe your issue <span class="text-red-400">*</span></label>
                <textarea
                  v-model="ticketForm.message"
                  rows="4"
                  placeholder="Please provide as much detail as possible so we can help you quickly..."
                  class="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors resize-none"
                  :class="formErrors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/60'"
                />
                <span v-if="formErrors.message" class="text-red-400 text-xs mt-1 block">{{ formErrors.message }}</span>
              </div>

              <button
                @click="submitTicket"
                :disabled="isSubmitting"
                class="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                :class="isSubmitting
                  ? 'bg-emerald-600/50 text-emerald-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-900/40 hover:shadow-emerald-800/50'"
              >
                <i :class="`pi ${isSubmitting ? 'pi-spin pi-spinner' : 'pi-send'} text-sm`" />
                {{ isSubmitting ? 'Submitting...' : 'Submit Ticket' }}
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer strip -->
    <footer class="border-t border-white/5 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-gray-600 text-sm">© {{ new Date().getFullYear() }} Your Review App. All rights reserved.</p>
        <div class="flex items-center gap-4 text-xs text-gray-600">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>

    <!-- Video Modal -->
    <Transition name="modal">
      <div
        v-if="selectedVideo"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="selectedVideo = null"
      >
        <div class="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <div>
              <h3 class="text-white font-semibold text-sm">{{ selectedVideo.title }}</h3>
              <p class="text-gray-500 text-xs mt-0.5">{{ selectedVideo.duration }} · {{ selectedVideo.category }}</p>
            </div>
            <button @click="selectedVideo = null" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <i class="pi pi-times text-sm" />
            </button>
          </div>
          <div class="aspect-video bg-gradient-to-br flex items-center justify-center" :class="selectedVideo.gradient">
            <div class="text-center">
              <i class="pi pi-play-circle text-white/40 text-6xl mb-3 block" />
              <p class="text-white/40 text-sm">Video player would render here</p>
            </div>
          </div>
          <div class="p-5">
            <p class="text-gray-400 text-sm">{{ selectedVideo.description }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// ── Types ─────────────────────────────────────────────────────────────────────
interface Video {
  id: number
  title: string
  description: string
  duration: string
  category: string
  level: string
  levelClass: string
  gradient: string
  bgIcon: string
}

interface Article {
  id: number
  title: string
  description: string
  icon: string
  category: string
  readTime: string
}

interface Faq {
  question: string
  answer: string
  tag?: string
}

interface TicketForm {
  name: string
  email: string
  business: string
  category: string
  priority: string
  subject: string
  message: string
}

// ── Navigation ─────────────────────────────────────────────────────────────────
const sections = [
  { id: 'tutorials', label: 'Video Tutorials', icon: 'pi-play-circle' },
  { id: 'articles',  label: 'Articles',        icon: 'pi-book' },
  { id: 'faqs',      label: 'FAQs',            icon: 'pi-question-circle' },
  { id: 'tickets',   label: 'Raise a Ticket',  icon: 'pi-ticket' },
]
const activeSection = ref<string>('tutorials')

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeSection.value = id
}

// ── Global Search ─────────────────────────────────────────────────────────────
const searchQuery = ref('')

// ── Videos ────────────────────────────────────────────────────────────────────
const selectedVideo = ref<Video | null>(null)

const videos: Video[] = [
  {
    id: 1,
    title: 'Getting Started: Setting Up Your Business Profile',
    description: 'Learn how to create a compelling profile that attracts customers and builds trust.',
    duration: '4:32',
    category: 'Onboarding',
    level: 'Beginner',
    levelClass: 'bg-emerald-500/20 text-emerald-300',
    gradient: 'from-emerald-900 to-teal-900',
    bgIcon: 'pi-building',
  },
  {
    id: 2,
    title: 'Managing & Responding to Customer Reviews',
    description: 'Best practices for engaging with reviews, handling negative feedback professionally.',
    duration: '6:15',
    category: 'Reviews',
    level: 'Beginner',
    levelClass: 'bg-emerald-500/20 text-emerald-300',
    gradient: 'from-amber-900 to-orange-900',
    bgIcon: 'pi-star',
  },
  {
    id: 3,
    title: 'Analytics Dashboard Deep Dive',
    description: 'Understand your business metrics, review trends, and customer sentiment insights.',
    duration: '9:48',
    category: 'Analytics',
    level: 'Intermediate',
    levelClass: 'bg-amber-500/20 text-amber-300',
    gradient: 'from-violet-900 to-purple-900',
    bgIcon: 'pi-chart-bar',
  },
  {
    id: 4,
    title: 'Customising Your Review Request Campaigns',
    description: 'Set up automated review requests to grow your review count effortlessly.',
    duration: '5:20',
    category: 'Campaigns',
    level: 'Intermediate',
    levelClass: 'bg-amber-500/20 text-amber-300',
    gradient: 'from-cyan-900 to-blue-900',
    bgIcon: 'pi-send',
  },
  {
    id: 5,
    title: 'Using the Business Verification Badge',
    description: 'How to get verified and display your trust badge across the platform.',
    duration: '3:10',
    category: 'Trust & Safety',
    level: 'Beginner',
    levelClass: 'bg-emerald-500/20 text-emerald-300',
    gradient: 'from-rose-900 to-pink-900',
    bgIcon: 'pi-verified',
  },
  {
    id: 6,
    title: 'Advanced Reporting & Data Exports',
    description: 'Export your review data, generate reports, and integrate with third-party tools.',
    duration: '11:05',
    category: 'Analytics',
    level: 'Advanced',
    levelClass: 'bg-red-500/20 text-red-300',
    gradient: 'from-slate-800 to-gray-900',
    bgIcon: 'pi-file-export',
  },
]

const filteredVideos = computed(() =>
  searchQuery.value
    ? videos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : videos
)

function openVideo(video: Video) {
  selectedVideo.value = video
}

// ── Articles ──────────────────────────────────────────────────────────────────
const activeArticleCategory = ref('All')
const articleCategories = ['All', 'Account', 'Reviews', 'Billing', 'Integrations', 'Security']

const articles: Article[] = [
  { id: 1,  title: 'How to claim your business listing',                   description: 'Step-by-step guide to verifying and taking ownership of your business page.',   icon: 'pi-building',      category: 'Account',       readTime: '3 min read' },
  { id: 2,  title: 'Understanding your review score calculation',           description: 'How we calculate your average rating and what factors influence it.',           icon: 'pi-calculator',    category: 'Reviews',       readTime: '4 min read' },
  { id: 3,  title: 'Flagging and disputing fake or inappropriate reviews',  description: 'Our process for reviewing disputes and what happens after you flag a review.',  icon: 'pi-flag',          category: 'Reviews',       readTime: '5 min read' },
  { id: 4,  title: 'Managing team members and user roles',                 description: 'Add staff accounts, assign roles, and control access permissions.',             icon: 'pi-users',         category: 'Account',       readTime: '4 min read' },
  { id: 5,  title: 'Subscription plans and billing cycles explained',       description: 'Compare plans, upgrade or downgrade, and understand invoice dates.',           icon: 'pi-credit-card',   category: 'Billing',       readTime: '3 min read' },
  { id: 6,  title: 'Integrating with Google My Business',                  description: 'Sync your reviews and profile data with your Google Business profile.',        icon: 'pi-globe',         category: 'Integrations',  readTime: '6 min read' },
  { id: 7,  title: 'Setting up two-factor authentication',                 description: 'Protect your business account with an added layer of security.',               icon: 'pi-shield',        category: 'Security',      readTime: '2 min read' },
  { id: 8,  title: 'How to request reviews from your customers',           description: 'Sending invites via email, SMS, and QR codes to grow your review count.',       icon: 'pi-envelope',      category: 'Reviews',       readTime: '5 min read' },
  { id: 9,  title: 'Cancelling your subscription',                         description: 'Steps to cancel, what data you retain, and reactivation options.',             icon: 'pi-times-circle',  category: 'Billing',       readTime: '2 min read' },
  { id: 10, title: 'Connecting your CRM via API or Zapier',               description: 'Automate workflows by integrating your CRM with your review dashboard.',       icon: 'pi-code',          category: 'Integrations',  readTime: '8 min read' },
]

const filteredArticles = computed(() => {
  let list = activeArticleCategory.value === 'All' ? articles : articles.filter(a => a.category === activeArticleCategory.value)
  if (searchQuery.value) {
    list = list.filter(a =>
      a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return list
})

// ── FAQs ──────────────────────────────────────────────────────────────────────
const openFaq = ref<number | null>(null)

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

const faqs: Faq[] = [
  {
    question: 'How long does it take for a new review to appear on my profile?',
    answer: 'Reviews are typically visible on your profile within a few minutes of submission. However, some reviews may go through an additional verification process, which can take up to 24 hours.',
    tag: 'Reviews',
  },
  {
    question: 'Can I respond to reviews privately?',
    answer: 'Currently, all responses to reviews are public and visible to anyone who views your profile. This transparency builds trust with potential customers. Private messaging with reviewers is not supported at this time.',
    tag: 'Reviews',
  },
  {
    question: 'What happens if a reviewer leaves an unfair or defamatory review?',
    answer: 'You can flag the review using the "Report" button on the review card. Our moderation team will investigate within 3–5 business days. Reviews that violate our community guidelines will be removed.',
    tag: 'Trust & Safety',
  },
  {
    question: 'Can I pause my subscription without losing my data?',
    answer: 'Yes. You can pause your subscription for up to 3 months. All your reviews, responses, and profile data will be preserved. Simply go to Account Settings > Billing > Pause Subscription.',
    tag: 'Billing',
  },
  {
    question: 'How do I transfer account ownership to another team member?',
    answer: 'Go to Settings > Team Management > Transfer Ownership. The new owner must have an active account. Ownership transfer requires email verification from both parties and takes effect immediately.',
    tag: 'Account',
  },
  {
    question: 'Do reviews get removed if a customer deletes their account?',
    answer: 'No. Reviews remain on your profile even if the reviewer later deletes their account. The review will be attributed to an anonymous user rather than removed entirely.',
    tag: 'Reviews',
  },
  {
    question: 'Can I embed my review widget on my own website?',
    answer: 'Yes! Business and Enterprise plan subscribers can embed a customisable review widget on their website. Navigate to Dashboard > Widgets > Get Embed Code to generate your snippet.',
    tag: 'Integrations',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as bank transfers for annual plans. Payments are processed securely via Stripe. We do not store card details on our servers.',
    tag: 'Billing',
  },
]

const filteredFaqs = computed(() =>
  searchQuery.value
    ? faqs.filter(f =>
        f.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : faqs
)

// ── Ticket Form ───────────────────────────────────────────────────────────────
const ticketSubmitted = ref(false)
const isSubmitting = ref(false)
const ticketId = ref('')

const ticketForm = reactive<TicketForm>({
  name: '',
  email: '',
  business: '',
  category: '',
  priority: 'medium',
  subject: '',
  message: '',
})

const formErrors = reactive<Partial<Record<keyof TicketForm, string>>>({})

const ticketCategories = [
  'Account & Login Issues',
  'Review Management',
  'Billing & Payments',
  'Technical Bug',
  'Profile & Listings',
  'Integrations',
  'Feature Request',
  'Other',
]

const priorities = [
  { value: 'low',    label: 'Low',    activeClass: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' },
  { value: 'medium', label: 'Medium', activeClass: 'border-amber-500/50 text-amber-400 bg-amber-500/10' },
  { value: 'high',   label: 'High',   activeClass: 'border-red-500/50 text-red-400 bg-red-500/10' },
]

function validateForm(): boolean {
  Object.keys(formErrors).forEach(k => delete (formErrors as Record<string, string>)[k])
  let valid = true
  if (!ticketForm.name.trim())    { formErrors.name = 'Full name is required.';       valid = false }
  if (!ticketForm.email.trim())   { formErrors.email = 'Email address is required.';  valid = false }
  else if (!/\S+@\S+\.\S+/.test(ticketForm.email)) { formErrors.email = 'Please enter a valid email.'; valid = false }
  if (!ticketForm.category)       { formErrors.category = 'Please select a category.'; valid = false }
  if (!ticketForm.subject.trim()) { formErrors.subject = 'A subject is required.';    valid = false }
  if (!ticketForm.message.trim()) { formErrors.message = 'Please describe your issue.'; valid = false }
  return valid
}

async function submitTicket() {
  if (!validateForm()) return
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 1800))
  ticketId.value = `TKT-${Date.now().toString(36).toUpperCase()}`
  isSubmitting.value = false
  ticketSubmitted.value = true
}

function resetTicket() {
  ticketSubmitted.value = false
  ticketId.value = ''
  Object.assign(ticketForm, { name: '', email: '', business: '', category: '', priority: 'medium', subject: '', message: '' })
}

// ── Contact Channels ──────────────────────────────────────────────────────────
const contactChannels = [
  {
    icon: 'pi-ticket',
    iconBg: 'bg-emerald-500/10 border border-emerald-500/20',
    iconColor: '#34d399',
    title: 'Support Ticket',
    description: 'Raise a detailed ticket for complex or non-urgent issues.',
    action: 'Fill out the form',
  },
  {
    icon: 'pi-envelope',
    iconBg: 'bg-amber-500/10 border border-amber-500/20',
    iconColor: '#fbbf24',
    title: 'Email Support',
    description: 'Send us an email at support@yourapp.com for general queries.',
    action: 'Send an email',
  },
  {
    icon: 'pi-comments',
    iconBg: 'bg-blue-500/10 border border-blue-500/20',
    iconColor: '#60a5fa',
    title: 'Live Chat',
    description: 'Chat with our support agents in real time during business hours.',
    action: 'Start a chat',
  },
]

const slaItems = [
  { priority: 'Critical',   dot: 'bg-red-500',     time: '< 2 hours'  },
  { priority: 'High',       dot: 'bg-amber-500',   time: '< 8 hours'  },
  { priority: 'Medium',     dot: 'bg-emerald-500', time: '< 24 hours' },
  { priority: 'Low',        dot: 'bg-gray-500',    time: '< 72 hours' },
]
</script>

<!-- SectionHeader as inline component (no separate file needed with <script setup>) -->
<script lang="ts">
// Sub-component defined globally isn't needed; we'll use a local component below.
export default { name: 'HelpCenterPage' }
</script>

<!-- Reusable SectionHeader component defined locally via defineComponent isn't
     directly supported in single-file Vue. We instead duplicate the markup
     via a local <component> approach or just inline it. For clarity and zero-error
     copy-paste, the SectionHeader tag above is resolved by registering it below. -->

<script setup lang="ts">
// Local child component: SectionHeader
// In Nuxt 4 with components/ auto-import, create this file:
// components/SectionHeader.vue  ← see below this file
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* FAQ transition */
.faq-enter-active, .faq-leave-active { transition: all 0.25s ease; }
.faq-enter-from, .faq-leave-to { opacity: 0; transform: translateY(-6px); }

/* Modal transition */
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > *, .modal-leave-to > * { transform: scale(0.96); }
</style>