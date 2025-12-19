<template>
  <div class="h-full flex flex-col bg-gray-50 border-l border-gray-200">
    <div v-if="!conversation">
      <div class="p-6 text-center text-gray-500">
        <p>No conversation selected</p>
      </div>
    </div>
    <div v-else class="flex-1 flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-bold text-gray-900">Details</h3>
      </div>
      
      <!-- Customer Context -->
      <div v-if="conversation.type === 'customer'" class="p-4 space-y-4">
        <div class="text-center">
            <div :class="['h-16 w-16 rounded-full flex items-center justify-center font-bold text-white text-2xl mx-auto', 'bg-orange-500']">
               {{ conversation.name.charAt(0) }}
            </div>
            <h4 class="mt-2 text-lg font-semibold">{{ conversation.name }}</h4>
            <p class="text-sm text-gray-500">Customer</p>
        </div>
        <div class="space-y-3 text-sm">
           <h5 class="font-semibold text-gray-800 border-b pb-2">Related Review</h5>
           <div v-if="conversation.context.review">
             <div class="flex items-center">
                <span v-for="i in 5" :key="i" :class="[i <= conversation.context.review.rating ? 'text-yellow-400' : 'text-gray-300']">
                   <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </span>
             </div>
             <p class="mt-1 text-gray-600 italic">"{{ conversation.context.review.excerpt }}"</p>
             <a href="#" class="text-blue-600 hover:underline">View full review</a>
           </div>
           <div v-else>
             <p class="text-gray-500">No review associated.</p>
           </div>
        </div>
        <div class="space-y-2 text-sm">
           <h5 class="font-semibold text-gray-800 border-b pb-2">Actions</h5>
           <button class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-md">Escalate to Support</button>
           <button class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-md">Mark as Resolved</button>
           <button class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 rounded-md">Report Content</button>
        </div>
      </div>

      <!-- Support Context -->
      <div v-if="conversation.type === 'support'" class="p-4 space-y-4">
        <div class="text-center">
            <div :class="['h-16 w-16 rounded-full flex items-center justify-center font-bold text-white text-2xl mx-auto', 'bg-indigo-500']">
               {{ conversation.name.charAt(0) }}
            </div>
            <h4 class="mt-2 text-lg font-semibold">{{ conversation.name }}</h4>
            <p class="text-sm text-gray-500">Platform Support</p>
        </div>
         <div class="space-y-3 text-sm">
           <h5 class="font-semibold text-gray-800 border-b pb-2">Ticket Details</h5>
           <dl class="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt class="font-medium text-gray-500">Ticket ID</dt>
              <dd class="text-gray-900">{{ conversation.context.ticketId }}</dd>

              <dt class="font-medium text-gray-500">Status</dt>
              <dd>
                 <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    conversation.context.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                 ]">{{ conversation.context.status }}</span>
              </dd>
              
              <dt class="font-medium text-gray-500">Priority</dt>
              <dd class="text-gray-900">{{ conversation.context.priority }}</dd>
              
              <dt class="font-medium text-gray-500">Agent</dt>
              <dd class="text-gray-900">{{ conversation.context.agent }}</dd>
           </dl>
        </div>
         <div class="space-y-2 text-sm">
           <h5 class="font-semibold text-gray-800 border-b pb-2">Actions</h5>
           <button class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-md">Attach Logs/Screenshots</button>
           <button class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-md">Close Ticket</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  conversation: {
    type: Object,
    default: null
  }
});
</script>
