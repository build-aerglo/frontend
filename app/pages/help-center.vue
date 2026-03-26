<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-[#08bb79] to-[#109e68] text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-3xl md:text-5xl font-bold mb-4">How can we help you?</h1>
          <p class="text-sm md:text-xl text-green-50 mb-8">Find answers, guides, and support resources</p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for help articles..."
                class="w-full px-6 py-4 pr-12 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                @input="handleSearch"
              />
              <i class="pi pi-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
            </div>
            
            <!-- Quick Search Results -->
            <div v-if="searchQuery && filteredArticles.length > 0" class="mt-4 bg-white rounded-xl shadow-xl max-h-96 overflow-y-auto">
              <div
                v-for="article in filteredArticles.slice(0, 5)"
                :key="article.id"
                @click="scrollToArticle(article.id)"
                class="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div class="flex items-start gap-3">
                  <i :class="article.icon" class="text-[#008253] mt-1"></i>
                  <div class="flex gap-2">
                    <p class="font-semibold text-gray-900">{{ article.title }}</p>
                    <p class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-2xl">{{ article.category }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="link in quickLinks"
          :key="link.title"
          @click="scrollToCategory(link.category)"
          class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border-2 border-transparent hover:border-[#008253]"
        >
          <div class="flex items-center gap-4 mb-3">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i :class="link.icon" class="text-[#008253] text-xl"></i>
            </div>
            <span class="font-bold text-lg text-gray-900">{{ link.title }}</span>
          </div>
          <p class="text-gray-600 text-sm">{{ link.description }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <h3 class="font-bold text-lg mb-4 text-gray-900">Categories</h3>
            <nav class="space-y-2">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="scrollToCategory(category.id)"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3',
                  activeCategory === category.id
                    ? 'bg-[#008253] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                ]"
              >
                <i :class="category.icon"></i>
                <span class="font-medium">{{ category.name }}</span>
              </button>
            </nav>

            <!-- Contact Support -->
            <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-gray-900 mb-2">Need More Help?</h4>
              <p class="text-sm text-gray-600 mb-3">Can't find what you're looking for?</p>
              <button class="w-full bg-[#008253] text-white py-2 rounded-lg hover:bg-[#006f45] transition-colors font-medium text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        <!-- Articles -->
        <div class="lg:col-span-3">
          <div
            v-for="category in categories"
            :key="category.id"
            :id="category.id"
            class="mb-12 scroll-mt-8"
          >
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-[#008253] bg-opacity-10 rounded-full flex items-center justify-center">
                <i :class="category.icon" class="text-[#008253] text-xl"></i>
              </div>
              <span class="text-2xl md:text-3xl font-bold text-gray-900">{{ category.name }}</span>
            </div>

            <div class="space-y-4">
              <div
                v-for="article in getArticlesByCategory(category.id)"
                :key="article.id"
                :id="article.id"
                class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <button
                  @click="toggleArticle(article.id)"
                  class="w-full p-6 text-left flex items-start justify-between gap-4"
                >
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <i :class="article.icon" class="text-[#008253]"></i>
                      <h3 class="font-semibold text-lg text-gray-900">{{ article.title }}</h3>
                    </div>
                    <p class="text-sm text-gray-600">{{ article.summary }}</p>
                  </div>
                  <i
                    :class="expandedArticles.includes(article.id) ? 'pi-chevron-up' : 'pi-chevron-down'"
                    class="pi text-gray-400 mt-1"
                  ></i>
                </button>

                <!-- Expanded Content -->
                <Transition name="expand">
                  <div v-if="expandedArticles.includes(article.id)" class="px-6 pb-6">
                    <div class="border-t border-gray-200 pt-6">
                      <div v-html="article.content" class="prose prose-sm max-w-none text-gray-700"></div>
                      
                      <!-- Helpful Section -->
                      <div class="mt-6 pt-6 border-t border-gray-200">
                        <p class="text-sm text-gray-600 mb-3">Was this article helpful?</p>
                        <div class="flex gap-3">
                          <button class="px-4 py-2 bg-green-100 text-[#008253] rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                            <i class="pi pi-thumbs-up mr-2"></i>Yes
                          </button>
                          <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                            <i class="pi pi-thumbs-down mr-2"></i>No
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div id="faqs" class="bg-white py-16 border-t border-gray-200 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p class="text-gray-600">Quick answers to common questions</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div
            v-for="faq in faqs"
            :key="faq.id"
            class="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
          >
            <span class="font-semibold text-lg sm:text-xl text-gray-900 mb-2 flex items-start gap-2">
              <i class="pi pi-question-circle text-[#008253] mt-1"></i>
              {{ faq.question }}
            </span>
            <p class="text-gray-600 text-sm">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="bg-gradient-to-r from-[#08bb79] to-[#109e68] text-white py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <i class="pi pi-headphones text-5xl mb-4"></i>
        <h2 class="text-3xl font-bold mb-4">Still Need Help?</h2>
        <p class="text-sm md:text-lg text-green-50 mb-8">Our support team is here to assist you</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@clereview.com"
            class="px-8 py-4 bg-white text-[#008253] rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <i class="pi pi-envelope"></i>
            Email Support
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('');
const activeCategory = ref('getting-started');
const expandedArticles = ref<string[]>([]);

const quickLinks = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using Clereview',
    icon: 'pi pi-play-circle',
    category: 'getting-started'
  },
  {
    title: 'Write a Review',
    description: 'Share your experience with businesses',
    icon: 'pi pi-pencil',
    category: 'reviews'
  },
  {
    title: 'Business Tools',
    description: 'Manage your business profile',
    icon: 'pi pi-building',
    category: 'business'
  }
];

const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: 'pi pi-play-circle' },
  { id: 'reviews', name: 'Reviews & Ratings', icon: 'pi pi-star' },
  { id: 'business', name: 'For Businesses', icon: 'pi pi-building' },
  { id: 'account', name: 'Account & Settings', icon: 'pi pi-user' },
  { id: 'privacy', name: 'Privacy & Security', icon: 'pi pi-shield' },
  { id: 'troubleshooting', name: 'Troubleshooting', icon: 'pi pi-exclamation-circle' }
];

const articles = [
  // Getting Started
  {
    id: 'what-is-clereview',
    category: 'getting-started',
    icon: 'pi pi-info-circle',
    title: 'What is Clereview?',
    summary: 'Learn about Clereview and how it helps you make informed decisions',
    content: `
      <p class="mb-4">Clereview is a trusted review platform that connects customers with businesses through authentic, verified reviews. Our mission is to build transparency and trust in the marketplace.</p>
      <h4 class="font-semibold text-gray-900 mb-2">Key Features:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>Read and write authentic reviews from real customers</li>
        <li>Discover businesses with verified badges and ratings</li>
        <li>Access detailed business information and opening hours</li>
        <li>Connect with businesses through direct contact options</li>
        <li>Filter and search businesses by category, location, and ratings</li>
      </ul>
      <p class="mb-4">Whether you're a customer looking for trusted businesses or a business owner wanting to build your reputation, Clereview provides the tools you need.</p>
    `
  },
  {
    id: 'create-account',
    category: 'getting-started',
    icon: 'pi pi-user-plus',
    title: 'How do I create an account?',
    summary: 'Step-by-step guide to signing up for Clereview',
    content: `
      <p class="mb-4">Creating an account on Clereview is quick and easy. Follow these steps:</p>
      <h4 class="font-semibold text-gray-900 mb-2">For Customers:</h4>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li>Click "Sign Up" in the top navigation bar</li>
        <li>Enter your email address and create a password</li>
        <li>Or sign up quickly using Google authentication</li>
        <li>Verify your email address through the confirmation link</li>
        <li>Complete your profile with a username and photo (optional)</li>
      </ol>
      <h4 class="font-semibold text-gray-900 mb-2">For Business Owners:</h4>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li>Click "Register Your Business" in the navigation</li>
        <li>Enter your business information (name, category, contact details)</li>
        <li>Provide your business email and create a password</li>
        <li>Submit for verification</li>
      </ol>
      <p class="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <strong>Tip:</strong> Use a strong password with at least 8 characters, including numbers and special characters (@#&$_?)
      </p>
    `
  },

  // Reviews
  {
    id: 'write-review',
    category: 'reviews',
    icon: 'pi pi-pencil',
    title: 'How do I write a review?',
    summary: 'Learn how to share your experience with businesses',
    content: `
      <p class="mb-4">Writing a review helps other customers make informed decisions. Here's how:</p>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li><strong>Find the business:</strong> Search for the business you want to review</li>
        <li><strong>Click "Write a Review":</strong> On the business profile page</li>
        <li><strong>Rate your experience:</strong> Select 1-5 stars based on your experience</li>
        <li><strong>Write your review:</strong> Share details about your experience (minimum 50 characters)</li>
        <li><strong>Add photos (optional):</strong> Upload up to 3 photos to illustrate your review</li>
        <li><strong>Submit:</strong> Click "Submit Review" to publish</li>
      </ol>
      <h4 class="font-semibold text-gray-900 mb-2">Review Guidelines:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>Be honest and specific about your experience</li>
        <li>Avoid offensive language or personal attacks</li>
        <li>Focus on the service, product quality, and customer experience</li>
        <li>Don't include personal information (phone numbers, addresses)</li>
        <li>Reviews must be based on your own experience</li>
      </ul>
      <p class="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <strong>Note:</strong> Anonymous reviewers will be required to submit thier email address to write a review
      </p>
    `
  },
  // {
  //   id: 'edit-delete-review',
  //   category: 'reviews',
  //   icon: 'pi pi-pencil',
  //   title: 'Can I edit or delete my review?',
  //   summary: 'Learn how to manage your published reviews',
  //   content: `
  //     <p class="mb-4">Yes! You can edit or delete your reviews at any time.</p>
  //     <h4 class="font-semibold text-gray-900 mb-2">To Edit a Review:</h4>
  //     <ol class="list-decimal pl-6 space-y-2 mb-4">
  //       <li>Go to your profile page</li>
  //       <li>Navigate to "My Reviews"</li>
  //       <li>Find the review you want to edit</li>
  //       <li>Click the edit icon (pencil)</li>
  //       <li>Make your changes and click "Update Review"</li>
  //     </ol>
  //     <h4 class="font-semibold text-gray-900 mb-2">To Delete a Review:</h4>
  //     <ol class="list-decimal pl-6 space-y-2 mb-4">
  //       <li>Go to your profile page</li>
  //       <li>Navigate to "My Reviews"</li>
  //       <li>Find the review you want to delete</li>
  //       <li>Click the delete icon (trash)</li>
  //       <li>Confirm the deletion</li>
  //     </ol>
  //     <p class="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
  //       <strong>Warning:</strong> Deleted reviews cannot be recovered. Make sure you want to permanently remove the review before confirming.
  //     </p>
  //   `
  // },

  // Business
  {
    id: 'claim-business',
    category: 'business',
    icon: 'pi pi-check-circle',
    title: 'How do I claim my business?',
    summary: 'Take control of your business profile on Clereview',
    content: `
      <p class="mb-4">If your business already exists on Clereview, you can claim it to manage your profile and respond to reviews.</p>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li><strong>Search for your business:</strong> Find your business profile on Clereview</li>
        <li><strong>Click "Claim This Business":</strong> On your business profile page</li>
        <li><strong>Verify ownership:</strong> Provide documentation proving you own or manage the business</li>
        <li><strong>Submit verification:</strong> Upload required documents (business license, utility bill, etc.)</li>
        <li><strong>Wait for approval:</strong> Our team will review your claim within 2-3 business days</li>
        <li><strong>Get access:</strong> Once approved, you'll receive login credentials to manage your profile</li>
      </ol>
      <h4 class="font-semibold text-gray-900 mb-2">Required Documents:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>Business registration certificate or license</li>
        <li>Proof of business address (utility bill, lease agreement)</li>
        <li>Government-issued ID of business owner/manager</li>
      </ul>
      <p class="text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <strong>Already claimed?</strong> If you get a message that your business has been claimed, contact support at <a href="mailto:support@clereview.com" class="underline font-semibold">support@clereview.com</a> for assistance.
      </p>
    `
  },
  {
    id: 'respond-reviews',
    category: 'business',
    icon: 'pi pi-comment',
    title: 'How do I respond to reviews?',
    summary: 'Engage with customers through review responses',
    content: `
      <p class="mb-4">Responding to reviews shows customers you care about their feedback and helps build trust.</p>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li><strong>Log in to your business account</strong></li>
        <li><strong>Go to your business dashboard</strong></li>
        <li><strong>Navigate to the "Reviews" section</strong></li>
        <li><strong>Find the review you want to respond to</strong></li>
        <li><strong>Click "Respond"</strong></li>
        <li><strong>Write your response</strong> (be professional and constructive)</li>
        <li><strong>Click "Submit Response"</strong></li>
      </ol>
      <h4 class="font-semibold text-gray-900 mb-2">Best Practices for Responding:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li><strong>Thank customers:</strong> Appreciate positive reviews</li>
        <li><strong>Address concerns:</strong> For negative reviews, acknowledge issues and explain how you'll improve</li>
        <li><strong>Stay professional:</strong> Always maintain a respectful tone</li>
        <li><strong>Keep it brief:</strong> 2-3 sentences are usually enough</li>
        <li><strong>Personalize:</strong> Mention specific details from their review</li>
        <li><strong>Take it offline:</strong> For complex issues, invite them to contact you directly</li>
      </ul>
      <div class="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <h5 class="font-semibold text-green-900 mb-2">Example Response to Positive Review:</h5>
        <p class="text-sm text-green-800">"Thank you so much for your kind words, Sarah! We're thrilled you enjoyed your experience with us. We look forward to serving you again soon!"</p>
      </div>
      <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
        <h5 class="font-semibold text-orange-900 mb-2">Example Response to Negative Review:</h5>
        <p class="text-sm text-orange-800">"We're sorry to hear about your experience, John. This doesn't reflect our usual standards. We'd love to make this right. Please contact us at [email/phone] so we can address your concerns directly."</p>
      </div>
    `
  },
  {
    id: 'business-badges',
    category: 'business',
    icon: 'pi pi-verified',
    title: 'What are business badges?',
    summary: 'Understand verification badges and how to earn them',
    content: `
      <p class="mb-4">Badges help customers identify trustworthy, high-quality businesses on Clereview.</p>
      <h4 class="font-semibold text-gray-900 mb-2">Types of Badges:</h4>
      <div class="space-y-4 mb-4">
        <div class="border-l-4 border-[#008253] pl-4">
          <h5 class="font-semibold text-gray-900 mb-1">✓ Verified Badge</h5>
          <p class="text-sm text-gray-600">Awarded to businesses that have completed identity verification and provided proof of business registration.</p>
        </div>
        <div class="border-l-4 border-blue-500 pl-4">
          <h5 class="font-semibold text-gray-900 mb-1">⭐ Trusted Badge</h5>
          <p class="text-sm text-gray-600">Earned by businesses with consistently high ratings (4.5+ stars) and excellent customer feedback over 6+ months.</p>
        </div>
        <div class="border-l-4 border-purple-500 pl-4">
          <h5 class="font-semibold text-gray-900 mb-1">👑 Premium Badge</h5>
          <p class="text-sm text-gray-600">Available to businesses with premium subscription plans, offering enhanced profile features and visibility.</p>
        </div>
      </div>
      <h4 class="font-semibold text-gray-900 mb-2">How to Earn a Verified Badge:</h4>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li>Claim your business profile</li>
        <li>Complete all profile sections (description, hours, contact info, photos)</li>
        <li>Provide business verification documents</li>
        <li>Wait for admin approval (typically 2-3 business days)</li>
      </ol>
      <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 mt-4">
        <strong>Note:</strong> Badges can be revoked if business information becomes outdated or if there are serious customer complaints.
      </p>
    `
  },

  // Account
  {
    id: 'reset-password',
    category: 'account',
    icon: 'pi pi-key',
    title: 'How do I reset my password?',
    summary: 'Recover access to your account',
    content: `
      <p class="mb-4">If you've forgotten your password, you can reset it easily:</p>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li>Go to the login page</li>
        <li>Click "Forgot Password?"</li>
        <li>Enter the email address associated with your account</li>
        <li>Check your email for a password reset link</li>
        <li>Click the link (valid for 1 hour)</li>
        <li>Enter your new password (must meet security requirements)</li>
        <li>Confirm your new password</li>
        <li>Log in with your new password</li>
      </ol>
      <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 mt-4">
        <strong>Didn't receive the email?</strong> Check your spam folder. If you still don't see it, request another reset link or contact support.
      </p>
      <h4 class="font-semibold text-gray-900 mb-2 mt-4">Password Requirements:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>At least 8 characters long</li>
        <li>Contains at least one number</li>
        <li>Contains at least one special character (@#&$_?)</li>
      </ul>
    `
  },
  {
    id: 'update-email',
    category: 'account',
    icon: 'pi pi-envelope',
    title: 'Can I change my email address?',
    summary: 'Update your account email',
    content: `
      <p class="mb-4">Yes, you can update your email address from your account settings. Here's how:</p>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li>Log in to your account</li>
        <li>Go to "Account Settings"</li>
        <li>Navigate to "Account Security"</li>
        <li>Click "Update Email"</li>
        <li>Enter your new email address</li>
        <li>Provide a reason for the change</li>
        <li>Submit your request</li>
      </ol>
      <p class="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <strong>Important:</strong> Email changes require admin approval for security reasons. You'll receive a notification once your request is approved. This typically takes 1-2 business days.
      </p>
      <h4 class="font-semibold text-gray-900 mb-2 mt-4">Why is approval needed?</h4>
      <p class="mb-2 text-sm text-gray-700">Email verification helps prevent unauthorized account changes and protects your account from being hijacked. Once approved, you'll receive a confirmation email at both your old and new email addresses.</p>
    `
  },

  // Privacy
  {
    id: 'data-privacy',
    category: 'privacy',
    icon: 'pi pi-lock',
    title: 'How is my data protected?',
    summary: 'Learn about our data protection measures',
    content: `
      <p class="mb-4">At Clereview, we take your privacy seriously and implement industry-standard security measures to protect your information.</p>
      <h4 class="font-semibold text-gray-900 mb-2">Security Measures:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li><strong>Encryption:</strong> All data is encrypted in transit (SSL/TLS) and at rest</li>
        <li><strong>Secure authentication:</strong> Passwords are hashed using industry-standard algorithms</li>
        <li><strong>OAuth integration:</strong> Secure third-party login via Google</li>
        <li><strong>Regular security audits:</strong> Continuous monitoring for vulnerabilities</li>
        <li><strong>Access controls:</strong> Strict internal access policies</li>
      </ul>
      <h4 class="font-semibold text-gray-900 mb-2">What we collect:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>Email address and account credentials</li>
        <li>Profile information (name, photo - optional)</li>
        <li>Reviews and ratings you submit</li>
        <li>Usage data (pages visited, features used)</li>
      </ul>
      <h4 class="font-semibold text-gray-900 mb-2">What we DON'T do:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>Sell your personal information to third parties</li>
        <li>Share your data without your consent</li>
        <li>Use your data for unauthorized marketing</li>
      </ul>
      <p class="text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <strong>Read more:</strong> For complete details, please review our <a href="/privacy-policy" class="underline font-semibold">Privacy Policy</a> and <a href="/terms" class="underline font-semibold">Terms of Service</a>.
      </p>
    `
  },
  {
    id: 'delete-account',
    category: 'privacy',
    icon: 'pi pi-trash',
    title: 'How do I delete my account?',
    summary: 'Permanently remove your Clereview account',
    content: `
      <p class="mb-4">You can delete your account at any time from your account settings.</p>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li>Log in to your account</li>
        <li>Go to "Account Settings"</li>
        <li>Scroll to "Deactivate Account"</li>
        <li>Read the warning about permanent deletion</li>
        <li>Check the confirmation box</li>
        <li>Click "Deactivate Account"</li>
        <li>Confirm your decision</li>
      </ol>
      <p class="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
        <strong>Warning:</strong> This action is permanent and cannot be undone. When you delete your account:
      </p>
      <ul class="list-disc pl-6 space-y-2 mb-4 mt-2">
        <li>All your reviews will be permanently deleted</li>
        <li>Your profile information will be removed</li>
        <li>You'll lose access to saved businesses</li>
        <li>Business owners: Your business profile will be marked as unclaimed</li>
        <li>Your username will become available for others to use</li>
      </ul>
      <p class="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 mt-4">
        <strong>Alternative:</strong> If you just need a break, consider temporarily deactivating your account instead of permanent deletion. Contact support for assistance.
      </p>
    `
  },

  // Troubleshooting
  {
    id: 'login-issues',
    category: 'troubleshooting',
    icon: 'pi pi-sign-in',
    title: "I can't log in to my account",
    summary: 'Solve common login problems',
    content: `
      <p class="mb-4">Having trouble logging in? Try these solutions:</p>
      <h4 class="font-semibold text-gray-900 mb-2">Check your credentials:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>Make sure you're using the correct email address</li>
        <li>Check for typos in your password (passwords are case-sensitive)</li>
        <li>Verify there are no extra spaces before or after your email/password</li>
      </ul>
      <h4 class="font-semibold text-gray-900 mb-2">Clear your browser cache:</h4>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li>Open your browser settings</li>
        <li>Find "Clear browsing data" or "Clear cache"</li>
        <li>Select "Cookies and site data" and "Cached images and files"</li>
        <li>Click "Clear data"</li>
        <li>Try logging in again</li>
      </ol>
      <h4 class="font-semibold text-gray-900 mb-2">Try a different browser:</h4>
      <p class="mb-4 text-sm text-gray-700">Sometimes browser-specific issues can prevent login. Try Chrome, Firefox, Safari, or Edge.</p>
      <h4 class="font-semibold text-gray-900 mb-2">Reset your password:</h4>
      <p class="mb-4 text-sm text-gray-700">If you've forgotten your password or think it might be incorrect, use the "Forgot Password" link on the login page.</p>
      <h4 class="font-semibold text-gray-900 mb-2">Check for account issues:</h4>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>Your account may have been deactivated or suspended</li>
        <li>You might have signed up with Google - try "Sign in with Google"</li>
        <li>Your email might not be verified - check for verification email</li>
      </ul>
      <p class="text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <strong>Still can't log in?</strong> Contact our support team at <a href="mailto:support@clereview.com" class="underline font-semibold">support@clereview.com</a> with your registered email address.
      </p>
    `
  },
  {
    id: 'review-not-showing',
    category: 'troubleshooting',
    icon: 'pi pi-eye-slash',
    title: 'My review is not showing',
    summary: 'Understand why your review might not be visible',
    content: `
      <p class="mb-4">If your review isn't appearing, here are the most common reasons:</p>
      <h4 class="font-semibold text-gray-900 mb-2">1. Under Review:</h4>
      <p class="mb-4 text-sm text-gray-700">New reviews go through a brief moderation process (usually 24-48 hours) to ensure they meet our community guidelines. You'll receive a notification once it's approved.</p>
      <h4 class="font-semibold text-gray-900 mb-2">2. Doesn't Meet Guidelines:</h4>
      <p class="mb-4 text-sm text-gray-700">Your review may have been flagged for:</p>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>Offensive or inappropriate language</li>
        <li>Personal information (phone numbers, addresses, full names)</li>
        <li>Too short (minimum 50 characters)</li>
        <li>Spam or promotional content</li>
        <li>Fake or fraudulent review</li>
      </ul>
      <h4 class="font-semibold text-gray-900 mb-2">3. Technical Issue:</h4>
      <p class="mb-4 text-sm text-gray-700">Sometimes reviews don't submit properly. Try:</p>
      <ul class="list-disc pl-6 space-y-2 mb-4">
        <li>Refreshing the page</li>
        <li>Checking your "My Reviews" section in your profile</li>
        <li>Looking for any error messages during submission</li>
      </ul>
      <h4 class="font-semibold text-gray-900 mb-2">4. Business Privacy Settings:</h4>
      <p class="mb-4 text-sm text-gray-700">Some businesses have enabled private reviews, meaning only they can see the full review content. The rating still contributes to their overall score.</p>
      <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 mt-4">
        <strong>Check status:</strong> Go to your profile → "My Reviews" to see the status of all your reviews (Pending, Approved, Rejected).
      </p>
    `
  }
];

const faqs = [
  {
    id: 'faq-1',
    question: 'Is Clereview free to use?',
    answer: 'Yes! Creating an account, reading reviews, and writing reviews is completely free for customers. Business owners can claim their profile for free, with optional premium features available.'
  },
  {
    id: 'faq-2',
    question: 'Can I review a business anonymously?',
    answer: 'Yes, reviewing a business anonymously will require you to provide your email address at the point of submission.'
  },
  {
    id: 'faq-3',
    question: 'How do I report a fake review?',
    answer: 'Click the flag icon on any review to report it. Select a reason (spam, fake, offensive, etc.) and submit. Our moderation team will investigate within 24-48 hours.'
  },
  {
    id: 'faq-4',
    question: 'Can businesses delete negative reviews?',
    answer: 'No, businesses cannot delete reviews. They can only respond to them. Reviews can only be removed if they violate our community guidelines or are proven to be fake.'
  },
  {
    id: 'faq-5',
    question: 'How is the average rating calculated?',
    answer: 'The average rating is calculated from all approved reviews. Ratings are rounded using a smart algorithm: ≤0.35 rounds down, 0.36-0.65 shows as half-star, ≥0.66 rounds up.'
  },
  {
    id: 'faq-6',
    question: 'What if my business information is incorrect?',
    answer: 'Business owners can update their information after claiming their profile. Customers can suggest edits by contacting support with the correct information and proof.'
  }
];

const handleSearch = () => {
  // Search functionality
};

const filteredArticles = computed(() => {
  if (!searchQuery.value) return [];
  
  const query = searchQuery.value.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(query) ||
    article.summary.toLowerCase().includes(query) ||
    article.content.toLowerCase().includes(query)
  );
});

const getArticlesByCategory = (categoryId: string) => {
  return articles.filter(article => article.category === categoryId);
};

const toggleArticle = (id: string) => {
  const index = expandedArticles.value.indexOf(id);
  if (index > -1) {
    expandedArticles.value.splice(index, 1);
  } else {
    expandedArticles.value.push(id);
  }
};

const scrollToCategory = (categoryId: string) => {
  activeCategory.value = categoryId;
  const element = document.getElementById(categoryId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const scrollToArticle = (articleId: string) => {
  searchQuery.value = ''; // Close search results
  
  // First expand the article
  if (!expandedArticles.value.includes(articleId)) {
    expandedArticles.value.push(articleId);
  }
  
  // Then scroll to it
  setTimeout(() => {
    const element = document.getElementById(articleId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};

// Track active category on scroll
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeCategory.value = entry.target.id;
        }
      });
    },
    { threshold: 0.5 }
  );

  categories.forEach(category => {
    const element = document.getElementById(category.id);
    if (element) observer.observe(element);
  });
});
</script>

<style scoped>
/* Smooth expand/collapse animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Prose styling for article content */
:deep(.prose) {
  line-height: 1.6;
}

:deep(.prose h4) {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

:deep(.prose h5) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

:deep(.prose p) {
  margin-bottom: 1rem;
  color: #4b5563;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin-bottom: 1rem;
}

:deep(.prose li) {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

:deep(.prose strong) {
  color: #1f2937;
  font-weight: 600;
}

:deep(.prose a) {
  color: #008253;
  text-decoration: underline;
}

:deep(.prose a:hover) {
  color: #006f45;
}
</style>