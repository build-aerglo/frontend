<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Sidebar - Conversations List -->
    <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
      <!-- Sidebar Header -->
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-lg font-semibold text-gray-900 mb-3">Messages</h1>
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <!-- Filters -->
      <div class="px-4 py-3 border-b border-gray-200 flex gap-2">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="activeFilter = filter.id"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            activeFilter === filter.id
              ? 'bg-blue-100 text-[#008253]'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ filter.label }}
          <span v-if="filter.count" class="ml-1">({{ filter.count }})</span>
        </button>
      </div>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto">
        <button
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          @click="selectedConversation = conversation.id"
          :class="[
            'w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left',
            selectedConversation === conversation.id ? 'bg-blue-50' : ''
          ]"
        >
          <div class="flex items-start gap-3">
            <div class="relative flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {{ conversation.customerName.charAt(0) }}
              </div>
              <div v-if="conversation.unread" class="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                {{ conversation.unread }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-900 truncate">{{ conversation.customerName }}</span>
                <span class="text-xs text-gray-500">{{ conversation.time }}</span>
              </div>
              <p class="text-xs text-gray-600 truncate">{{ conversation.lastMessage }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span v-if="conversation.status === 'open'" class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                  <i class="pi pi-circle-fill text-[6px]"></i>
                  Open
                </span>
                <span v-if="conversation.hasAttachment" class="text-gray-400">
                  <i class="pi pi-paperclip text-xs"></i>
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col">
      <div v-if="selectedConversation">
        <!-- Chat Header -->
        <div class="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {{ currentConversation?.customerName.charAt(0) }}
            </div>
            <div>
              <h2 class="text-sm font-semibold text-gray-900">{{ currentConversation?.customerName }}</h2>
              <p class="text-xs text-gray-500">{{ currentConversation?.email }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="pi pi-star text-sm"></i>
            </button>
            <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="pi pi-ellipsis-v text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div
            v-for="message in currentConversation?.messages"
            :key="message.id"
            :class="[
              'flex',
              message.sender === 'business' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div :class="[
              'max-w-md',
              message.sender === 'business' ? 'order-2' : 'order-1'
            ]">
              <div :class="[
                'px-4 py-2.5 rounded-lg text-sm',
                message.sender === 'business'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              ]">
                {{ message.text }}
              </div>
              <div class="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <span>{{ message.time }}</span>
                <i v-if="message.sender === 'business' && message.read" class="pi pi-check text-[#008253]"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="bg-white border-t border-gray-200 p-4">
          <div class="flex items-end gap-3">
            <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="pi pi-paperclip text-lg"></i>
            </button>
            <div class="flex-1">
              <textarea
                v-model="newMessage"
                rows="1"
                placeholder="Type your message..."
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                @keydown.enter.prevent="sendMessage"
              ></textarea>
            </div>
            <button
              @click="sendMessage"
              class="px-4 py-2.5 bg-[#008253] text-white rounded-lg hover:bg-[#008253] transition-colors text-sm font-medium"
            >
              <i class="pi pi-send"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-comments text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-medium text-gray-900 mb-1">No conversation selected</h3>
          <p class="text-sm text-gray-500">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: number;
  sender: 'customer' | 'business';
  text: string;
  time: string;
  read?: boolean;
}

interface Conversation {
  id: number;
  customerName: string;
  email: string;
  lastMessage: string;
  time: string;
  unread?: number;
  status: 'open' | 'closed';
  hasAttachment?: boolean;
  messages: Message[];
}

interface Filter {
  id: string;
  label: string;
  count?: number;
}

const searchQuery = ref<string>('');
const activeFilter = ref<string>('all');
const selectedConversation = ref<number | null>(null);
const newMessage = ref<string>('');
definePageMeta({ layout: 'business' })

const filters: Filter[] = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'unread', label: 'Unread', count: 3 },
  { id: 'open', label: 'Open', count: 8 },
];

const conversations: Conversation[] = [
  {
    id: 1,
    customerName: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    lastMessage: 'Thank you for the quick response!',
    time: '2m ago',
    unread: 2,
    status: 'open',
    messages: [
      { id: 1, sender: 'customer', text: 'Hi, I have a question about my recent review.', time: '10:30 AM', read: true },
      { id: 2, sender: 'business', text: 'Hello Sarah! I\'d be happy to help. What would you like to know?', time: '10:32 AM', read: true },
      { id: 3, sender: 'customer', text: 'Can I edit my review after posting?', time: '10:33 AM', read: true },
      { id: 4, sender: 'business', text: 'Yes, you can edit your review within 30 days of posting. Just go to your profile and click on the review.', time: '10:35 AM', read: true },
      { id: 5, sender: 'customer', text: 'Thank you for the quick response!', time: '10:36 AM' },
    ],
  },
  {
    id: 2,
    customerName: 'Michael Chen',
    email: 'mchen@email.com',
    lastMessage: 'I\'d like to update my feedback',
    time: '1h ago',
    unread: 1,
    status: 'open',
    hasAttachment: true,
    messages: [
      { id: 1, sender: 'customer', text: 'I\'d like to update my feedback', time: '9:15 AM' },
    ],
  },
  {
    id: 3,
    customerName: 'Emma Williams',
    email: 'emma.w@email.com',
    lastMessage: 'Great service, thanks!',
    time: '3h ago',
    status: 'closed',
    messages: [
      { id: 1, sender: 'customer', text: 'Just wanted to say great service!', time: '7:30 AM', read: true },
      { id: 2, sender: 'business', text: 'Thank you so much Emma! We appreciate your feedback.', time: '7:45 AM', read: true },
      { id: 3, sender: 'customer', text: 'Great service, thanks!', time: '8:00 AM', read: true },
    ],
  },
  {
    id: 4,
    customerName: 'David Rodriguez',
    email: 'drodriguez@email.com',
    lastMessage: 'When can I expect a response?',
    time: '5h ago',
    status: 'open',
    messages: [
      { id: 1, sender: 'customer', text: 'When can I expect a response?', time: '5:20 AM' },
    ],
  },
  {
    id: 5,
    customerName: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    lastMessage: 'Thank you for resolving my issue',
    time: 'Yesterday',
    status: 'closed',
    messages: [
      { id: 1, sender: 'customer', text: 'I need help with my account', time: 'Yesterday 3:00 PM', read: true },
      { id: 2, sender: 'business', text: 'I can help you with that. What seems to be the problem?', time: 'Yesterday 3:15 PM', read: true },
      { id: 3, sender: 'customer', text: 'Thank you for resolving my issue', time: 'Yesterday 4:00 PM', read: true },
    ],
  },
];

const currentConversation = computed(() => 
  conversations.find(c => c.id === selectedConversation.value)
);

const filteredConversations = computed(() => {
  let filtered = conversations;

  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(c => c.unread && c.unread > 0);
  } else if (activeFilter.value === 'open') {
    filtered = filtered.filter(c => c.status === 'open');
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c =>
      c.customerName.toLowerCase().includes(query) ||
      c.lastMessage.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const sendMessage = () => {
  if (newMessage.value.trim() && currentConversation.value) {
    currentConversation.value.messages.push({
      id: currentConversation.value.messages.length + 1,
      sender: 'business',
      text: newMessage.value.trim(),
      time: 'Just now',
      read: false,
    });
    newMessage.value = '';
  }
};
</script>

<style scoped>
textarea {
  min-height: 42px;
  max-height: 120px;
}
</style>