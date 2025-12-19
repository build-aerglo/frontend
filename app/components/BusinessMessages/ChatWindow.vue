<template>
  <div class="h-full flex flex-col bg-white">
    <div v-if="!conversation">
      <div class="h-full flex items-center justify-center">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Select a conversation</h3>
          <p class="mt-1 text-sm text-gray-500">
            Choose a conversation from the list to start chatting.
          </p>
        </div>
      </div>
    </div>
    <div v-else class="h-full flex flex-col">
      <!-- Chat Header -->
      <div class="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="relative">
             <span :class="['absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full ring-2 ring-white', conversation.online ? 'bg-green-400' : 'bg-gray-300']"></span>
             <div :class="['h-10 w-10 rounded-full flex items-center justify-center font-bold text-white', conversation.type === 'customer' ? 'bg-orange-500' : 'bg-indigo-500']">
                {{ conversation.name.charAt(0) }}
             </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ conversation.name }}</h3>
            <p class="text-sm text-gray-500">{{ conversation.online ? 'Online' : 'Offline' }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
           <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
           </button>
           <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
             <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
           </button>
           <button @click="$emit('toggle-context')" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
             <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
           </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 p-4 overflow-y-auto bg-gray-100">
        <div v-for="message in conversation.messages" :key="message.id" class="flex" :class="message.isSender ? 'justify-end' : 'justify-start'">
          <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg my-2" :class="message.isSender ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-sm'">
            <p>{{ message.text }}</p>
            <div class="text-xs mt-1" :class="message.isSender ? 'text-blue-200' : 'text-gray-500'">{{ message.timestamp }}</div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="flex-shrink-0 p-4 bg-white border-t border-gray-200">
        <div class="relative">
          <textarea
             v-model="newMessage"
             @keydown.enter.prevent="sendMessage"
             rows="1"
             class="w-full p-3 pr-28 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500"
             placeholder="Type a message..."
          ></textarea>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
             <button class="p-2 text-gray-500 hover:text-gray-700">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
             </button>
             <button @click="sendMessage" class="p-2 text-blue-600 hover:text-blue-800">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  conversation: {
    type: Object,
    default: null,
  }
});
const emit = defineEmits(['toggle-context', 'send-message']);

const newMessage = ref('');

const sendMessage = () => {
  if (newMessage.value.trim() === '') return;
  
  emit('send-message', newMessage.value);
  
  newMessage.value = '';
};
</script>
