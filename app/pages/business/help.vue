<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h3 class="text-3xl font-bold text-gray-900">Help Center</h3>
        <p class="text-gray-600">Find answers and learn how to get the most from your account</p>
      </div>
    </header>

    <!-- Search Bar -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for help articles..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008253] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Help Articles -->
      <div class="mb-3">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          {{ activeCategory === 'all' ? 'Popular Articles' : categories.find(c => c.id === activeCategory)?.label }}
        </h2>
        <div class="bg-white rounded-sm border border-gray-200 divide-y divide-gray-200">
          <a
            v-for="article in filteredArticles"
            :key="article.id"
            href="#"
            class="block p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start gap-2">
              <div class="p-2 bg-gray-100 rounded">
                <i :class="`pi ${article.icon} text-md text-gray-600`"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-sm text-gray-900 mb-2">{{ article.title }}</h3>
                <p class="text-gray-400 text-sm">{{ article.description }}</p>
              </div>
              <i class="pi pi-chevron-right text-gray-400"></i>
            </div>
          </a>
        </div>
      </div>

      <!-- FAQ Section -->
      <div>
        <h2 class="text-2xl font-semibold text-gray-900 my-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <details
            v-for="faq in faqs"
            :key="faq.id"
            class="bg-white rounded-lg border border-gray-200"
          >
            <summary class="p-6 cursor-pointer font-semibold text-gray-900 flex items-center justify-between hover:bg-gray-50">
              {{ faq.question }}
              <i class="pi pi-chevron-down text-gray-400"></i>
            </summary>
            <div class="px-6 pb-6 text-gray-600">
              {{ faq.answer }}
            </div>
          </details>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-center text-gray-600 text-sm">
          Still need help? Contact us at <a href="mailto:support@example.com" class="text-blue-600 hover:underline">support@example.com</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string;
  label: string;
  icon: string;
  count: number;
}

interface Article {
  id: number;
  category: string;
  title: string;
  description: string;
  icon: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const searchQuery = ref<string>('');
const activeCategory = ref<string>('all');
definePageMeta({ layout: 'business' })

const categories: Category[] = [
  { id: 'all', label: 'All Topics', icon: 'pi-th-large', count: 24 },
  { id: 'getting-started', label: 'Getting Started', icon: 'pi-flag', count: 6 },
  { id: 'reviews', label: 'Managing Reviews', icon: 'pi-star', count: 8 },
  { id: 'business', label: 'Business Profile', icon: 'pi-building', count: 5 },
  { id: 'analytics', label: 'Analytics', icon: 'pi-chart-line', count: 4 },
  { id: 'billing', label: 'Billing & Plans', icon: 'pi-credit-card', count: 5 },
];

const helpArticles: Article[] = [
  {
    id: 1,
    category: 'getting-started',
    title: 'Creating Your Business Account',
    description: 'Step-by-step guide to setting up your business profile and getting started with collecting reviews.',
    icon: 'pi-user-plus',
  },
  {
    id: 2,
    category: 'getting-started',
    title: 'Inviting Team Members',
    description: 'Learn how to add team members and manage user permissions for your business account.',
    icon: 'pi-users',
  },
  {
    id: 3,
    category: 'reviews',
    title: 'Responding to Reviews',
    description: 'Best practices for responding to customer reviews professionally and effectively.',
    icon: 'pi-comment',
  },
  {
    id: 4,
    category: 'reviews',
    title: 'Requesting Customer Reviews',
    description: 'How to invite your customers to leave reviews through email, SMS, or QR codes.',
    icon: 'pi-send',
  },
  {
    id: 5,
    category: 'reviews',
    title: 'Flagging Inappropriate Reviews',
    description: 'Report reviews that violate our community guidelines or contain inappropriate content.',
    icon: 'pi-flag',
  },
  {
    id: 6,
    category: 'business',
    title: 'Customizing Your Business Profile',
    description: 'Add your logo, business hours, and other details to create a complete profile.',
    icon: 'pi-pencil',
  },
  {
    id: 7,
    category: 'analytics',
    title: 'Understanding Your Dashboard',
    description: 'Learn how to read and interpret your review analytics and performance metrics.',
    icon: 'pi-chart-bar',
  },
  {
    id: 8,
    category: 'billing',
    title: 'Upgrading Your Plan',
    description: 'Compare plans and learn how to upgrade to unlock more features for your business.',
    icon: 'pi-arrow-up',
  },
];

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'How do I get started collecting reviews?',
    answer: 'After creating your account, you can start inviting customers through email, SMS, or by sharing a custom review link. You can also display QR codes in your physical location.',
  },
  {
    id: 2,
    question: 'Can I respond to negative reviews?',
    answer: 'Yes, responding to all reviews (positive and negative) shows you value customer feedback. Our platform allows you to respond publicly to any review on your profile.',
  },
  {
    id: 3,
    question: 'How do I add team members to my account?',
    answer: 'Navigate to Settings > Team Members and click "Invite Member". You can assign different permission levels to control what each team member can access.',
  },
  {
    id: 4,
    question: 'What happens if a review violates your guidelines?',
    answer: 'You can flag reviews that violate our guidelines. Our team will review flagged content within 24-48 hours and take appropriate action.',
  },
  {
    id: 5,
    question: 'Can I export my reviews data?',
    answer: 'Yes, business account holders can export their reviews data in CSV or JSON format from the Analytics dashboard.',
  },
];

const filteredArticles = computed(() => {
  let articles = helpArticles;
  
  if (activeCategory.value !== 'all') {
    articles = articles.filter(article => article.category === activeCategory.value);
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    articles = articles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query)
    );
  }
  
  return articles;
});
</script>

<style scoped>
details summary::-webkit-details-marker {
  display: none;
}

details[open] summary i {
  transform: rotate(180deg);
  transition: transform 0.2s;
}

details summary i {
  transition: transform 0.2s;
}
</style>