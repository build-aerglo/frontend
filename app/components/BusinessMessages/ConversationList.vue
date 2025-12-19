<template>
  <div class="h-full flex flex-col bg-gray-50 border-r border-gray-200">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900">Inbox</h2>
      <p class="text-sm text-gray-600">{{ unreadCount }} unread conversations</p>
    </div>

    <!-- Search and Filter -->
    <div class="p-4 space-y-3 border-b border-gray-200">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search conversations..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div>
        <select v-model="activeFilter" class="w-full text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
          <option value="all">All Conversations</option>
          <option value="unread">Unread</option>
          <option value="customer">Customers</option>
          <option value="support">Support</option>
          <option value="starred">Starred</option>
        </select>
      </div>
    </div>

    <!-- Conversation List -->
    <div class="flex-1 overflow-y-auto">
      <ul class="divide-y divide-gray-200">
        <li
          v-for="convo in filteredConversations"
          :key="convo.id"
          @click="$emit('select-conversation', convo.id)"
          :class="[
            'p-4 cursor-pointer hover:bg-gray-100 transition-colors',
            convo.id === selectedConversationId ? 'bg-blue-100' : 'bg-white'
          ]"
        >
          <div class="flex items-start space-x-3">
            <div class="relative flex-shrink-0">
               <span :class="[
                  'absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full ring-2 ring-white',
                  convo.online ? 'bg-green-400' : 'bg-gray-300'
               ]"></span>
               <div :class="[
                  'h-10 w-10 rounded-full flex items-center justify-center font-bold text-white',
                  convo.type === 'customer' ? 'bg-orange-500' : 'bg-indigo-500'
               ]">
                  {{ convo.name.charAt(0) }}
               </div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ convo.name }}</p>
                <p class="text-xs text-gray-500">{{ convo.timestamp }}</p>
              </div>
              <div class="flex items-center justify-between mt-1">
                <p class="text-sm text-gray-600 truncate">{{ convo.lastMessage }}</p>
                <div class="flex items-center space-x-2">
                   <svg v-if="convo.starred" class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                   </svg>
                   <span v-if="convo.unreadCount > 0" class="h-5 min-w-[1.25rem] px-1.5 flex items-center justify-center text-xs font-semibold text-white bg-blue-600 rounded-full">
                      {{ convo.unreadCount }}
                   </span>
                </div>
              </div>
              <div class="mt-1">
                 <span :class="[
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    convo.type === 'customer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                 ]">{{ convo.type }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  conversations: {
    type: Array,
    required: true,
  },
  selectedConversationId: {
    type: Number,
    default: null,
  }
});
defineEmits(['select-conversation']);

const searchQuery = ref('');
const activeFilter = ref('all');

const unreadCount = computed(() => {
  return props.conversations.filter(c => c.unreadCount > 0).length;
});

const filteredConversations = computed(() => {
  let filtered = props.conversations;

  // Apply filter
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'unread') {
      filtered = filtered.filter(c => c.unreadCount > 0);
    } else if (activeFilter.value === 'starred') {
      filtered = filtered.filter(c => c.starred);
    } else {
      filtered = filtered.filter(c => c.type === activeFilter.value);
    }
  }

  // Apply search query
  if (searchQuery.value) {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(lowerCaseQuery) ||
      c.lastMessage.toLowerCase().includes(lowerCaseQuery)
    );
  }

  return filtered;
});
</script>
