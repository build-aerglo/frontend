<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-3">
          <!-- Back Button (Mobile Only) -->
          <button
            v-if="selectedMessage && isMobileView"
            @click="closeConversation"
            class="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="pi pi-arrow-left"></i>
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Messages</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        
        <!-- Messages List -->
        <div 
          :class="[
            'lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col',
            selectedMessage && isMobileView ? 'hidden' : 'block',
            'lg:block'
          ]"
        >
          <!-- Search Bar -->
          <div class="p-4 border-b border-gray-200">
            <div class="relative">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search messages..."
                class="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Filter Tabs -->
          <div class="flex border-b border-gray-200">
            <button
              v-for="tab in filterTabs"
              :key="tab.value"
              @click="activeFilter = tab.value"
              :class="[
                'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                activeFilter === tab.value
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="tab.value === 'unread' && unreadCount > 0"
                class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-emerald-600 rounded-full"
              >
                {{ unreadCount }}
              </span>
            </button>
          </div>

          <!-- Messages List with Scroll -->
          <div class="flex-1 overflow-y-auto">
            <div
              v-for="message in filteredMessages"
              :key="message.id"
              @click="selectMessage(message)"
              :class="[
                'p-4 border-b border-gray-100 cursor-pointer transition-colors',
                selectedMessage?.id === message.id
                  ? 'bg-green-50 border-l-4 border-l-emerald-600'
                  : 'hover:bg-gray-50',
                message.unread ? 'bg-emerald-50/50' : ''
              ]"
            >
              <div class="flex items-start space-x-3">
                <!-- Avatar -->
                <div
                  :class="[
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm',
                    message.senderType === 'customer' ? 'bg-emerald-400' : 'bg-amber-400'
                  ]"
                >
                  {{ message.avatar }}
                </div>

                <!-- Message Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <p :class="['text-sm font-medium truncate', message.unread ? 'text-gray-900' : 'text-gray-700']">
                      {{ message.sender }}
                    </p>
                    <span class="text-xs text-gray-500 ml-2">{{ message.timestamp }}</span>
                  </div>
                  <p :class="['text-sm mb-1 truncate', message.unread ? 'font-medium text-gray-900' : 'text-gray-600']">
                    {{ message.subject }}
                  </p>
                  <p class="text-sm text-gray-500 truncate">{{ message.preview }}</p>
                </div>

                <!-- Unread Indicator -->
                <div v-if="message.unread" class="flex-shrink-0">
                  <span class="inline-block w-2 h-2 bg-emerald-600 rounded-full"></span>
                </div>
              </div>
            </div>

            <div v-if="filteredMessages.length === 0" class="p-8 text-center text-gray-500">
              <i class="pi pi-inbox text-3xl mb-2"></i>
              <p>No messages found</p>
            </div>
          </div>
        </div>

        <!-- Conversation View -->
        <div 
          :class="[
            'lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col',
            !selectedMessage && isMobileView ? 'hidden' : 'block',
            'lg:block'
          ]"
        >
          <div v-if="!selectedMessage" class="flex-1 flex items-center justify-center text-gray-400">
            <div class="text-center">
              <i class="pi pi-comments text-6xl my-4"></i>
              <p class="text-lg">Select a message to view conversation</p>
            </div>
          </div>

          <template v-else>
            <!-- Conversation Header -->
            <div class="p-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
                      selectedMessage.senderType === 'customer' ? 'bg-emerald-400' : 'bg-amber-400'
                    ]"
                  >
                    {{ selectedMessage.avatar }}
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">{{ selectedMessage.sender }}</h2>
                    <p class="text-sm text-gray-600">{{ selectedMessage.subject }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <i class="pi pi-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages with Scroll -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
              <div
                v-for="msg in currentConversation"
                :key="msg.id"
                :class="['flex', msg.isOwner ? 'justify-end' : 'justify-start']"
              >
                <div :class="['max-w-2xl', msg.isOwner ? 'order-2' : 'order-1']">
                  <div
                    :class="[
                      'rounded-lg px-4 py-3 shadow-sm',
                      msg.isOwner
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    ]"
                  >
                    <p class="text-sm leading-relaxed">{{ msg.content }}</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 px-1">{{ msg.timestamp }}</p>
                </div>
              </div>
            </div>

            <!-- Reply Input -->
            <div class="p-4 border-t border-gray-200 bg-gray-50">
              <form @submit.prevent="sendMessage" class="space-y-3">
                <textarea
                  v-model="replyText"
                  placeholder="Type your message..."
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                ></textarea>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <button
                      type="button"
                      class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Attach file"
                    >
                      <i class="pi pi-paperclip"></i>
                    </button>
                    <button
                      type="button"
                      class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Add emoji"
                    >
                      <i class="pi pi-face-smile"></i>
                    </button>
                  </div>
                  <button
                    type="submit"
                    :disabled="!replyText.trim()"
                    class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                  >
                    <span>Send</span>
                    <i class="pi pi-send"></i>
                  </button>
                </div>
              </form>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Message {
  id: number
  sender: string
  senderType: 'customer' | 'support'
  subject: string
  preview: string
  timestamp: string
  unread: boolean
  avatar: string
}

interface ConversationMessage {
  id: number
  sender: string
  content: string
  timestamp: string
  isOwner: boolean
}

interface Conversations {
  [key: number]: ConversationMessage[]
}

const searchQuery = ref('')
const activeFilter = ref('all')
const selectedMessage = ref<Message | null>(null)
const replyText = ref('')
const isMobileView = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const filterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Customers', value: 'customers' },
  { label: 'Support', value: 'support' }
]

// Sample messages - ready to be replaced with real data
const messages = ref<Message[]>([
  {
    id: 1,
    sender: 'Sarah Johnson',
    senderType: 'customer',
    subject: 'Question about review response',
    preview: 'Hi, I noticed you responded to my review. I wanted to clarify...',
    timestamp: '2 hours ago',
    unread: true,
    avatar: 'SJ'
  },
  {
    id: 2,
    sender: 'Michael Chen',
    senderType: 'customer',
    subject: 'Billing inquiry',
    preview: 'I have a question about the charges on my account...',
    timestamp: '5 hours ago',
    unread: true,
    avatar: 'MC'
  },
  {
    id: 3,
    sender: 'Support Team',
    senderType: 'support',
    subject: 'New feature announcement',
    preview: "We're excited to share some updates to our platform...",
    timestamp: '1 day ago',
    unread: false,
    avatar: 'ST'
  }
])

// Separate conversations for each message - ready to be replaced with real data
const conversations = ref<Conversations>({
  1: [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hi, I noticed you responded to my review. I wanted to clarify something about the product I received. The quality was great, but the shipping took longer than expected.',
      timestamp: '2 hours ago',
      isOwner: false
    },
    {
      id: 2,
      sender: 'You',
      content: "Thank you for reaching out, Sarah! I appreciate your feedback. I'm sorry about the shipping delay. We've been experiencing some logistics challenges lately. Would you mind sharing your order number so I can look into this for you?",
      timestamp: '1 hour ago',
      isOwner: true
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'Sure! My order number is #12345. I understand these things happen. Overall, I\'m happy with the product itself.',
      timestamp: '45 minutes ago',
      isOwner: false
    }
  ],
  2: [
    {
      id: 1,
      sender: 'Michael Chen',
      content: 'I have a question about the charges on my account. I was billed twice for the same subscription period.',
      timestamp: '5 hours ago',
      isOwner: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Hi Michael, I sincerely apologize for the billing error. Let me look into this immediately. Can you please provide me with your account email and the transaction IDs?',
      timestamp: '4 hours ago',
      isOwner: true
    },
    {
      id: 3,
      sender: 'Michael Chen',
      content: 'My email is michael.chen@example.com. The transaction IDs are TXN-12345 and TXN-12346, both charged on the same day.',
      timestamp: '4 hours ago',
      isOwner: false
    },
    {
      id: 4,
      sender: 'You',
      content: 'Thank you for that information. I\'ve confirmed the duplicate charge and initiated a full refund for TXN-12346. You should see it back in your account within 3-5 business days. Again, my apologies for the inconvenience.',
      timestamp: '3 hours ago',
      isOwner: true
    }
  ],
  3: [
    {
      id: 1,
      sender: 'Support Team',
      content: "We're excited to announce new features coming to your review management platform! We've added advanced analytics, automated response templates, and sentiment analysis.",
      timestamp: '1 day ago',
      isOwner: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'This sounds great! When will the sentiment analysis feature be available? That would really help us prioritize which reviews need immediate attention.',
      timestamp: '1 day ago',
      isOwner: true
    },
    {
      id: 3,
      sender: 'Support Team',
      content: 'The sentiment analysis feature will be rolling out to all accounts over the next week. You should have access by next Monday. We\'ll send you a detailed guide on how to use it effectively!',
      timestamp: '1 day ago',
      isOwner: false
    }
  ]
})

const unreadCount = computed(() => {
  return messages.value.filter(m => m.unread).length
})
definePageMeta({ layout: 'business' })
const filteredMessages = computed(() => {
  let filtered = messages.value

  // Apply filter
  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(m => m.unread)
  } else if (activeFilter.value === 'customers') {
    filtered = filtered.filter(m => m.senderType === 'customer')
  } else if (activeFilter.value === 'support') {
    filtered = filtered.filter(m => m.senderType === 'support')
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m =>
      m.sender.toLowerCase().includes(query) ||
      m.subject.toLowerCase().includes(query) ||
      m.preview.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Get current conversation based on selected message
const currentConversation = computed(() => {
  if (!selectedMessage.value) return []
  return conversations.value[selectedMessage.value.id] || []
})

const checkMobileView = () => {
  isMobileView.value = window.innerWidth < 1024
}

const selectMessage = (message: Message) => {
  selectedMessage.value = message
  
  // Mark as read
  const msg = messages.value.find(m => m.id === message.id)
  if (msg) {
    msg.unread = false
  }
}

const closeConversation = () => {
  selectedMessage.value = null
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = () => {
  if (!replyText.value.trim() || !selectedMessage.value) return

  const newMessage: ConversationMessage = {
    id: currentConversation.value.length + 1,
    sender: 'You',
    content: replyText.value,
    timestamp: 'Just now',
    isOwner: true
  }

  // Add message to the current conversation
  if (!conversations.value[selectedMessage.value.id]) {
    conversations.value[selectedMessage.value.id] = []
  }
  conversations.value[selectedMessage.value.id]?.push(newMessage)

  replyText.value = ''
  scrollToBottom()
}

// Watch for conversation changes and scroll to bottom
watch(selectedMessage, () => {
  scrollToBottom()
})

onMounted(() => {
  checkMobileView()
  window.addEventListener('resize', checkMobileView)
  scrollToBottom()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobileView)
})
</script>