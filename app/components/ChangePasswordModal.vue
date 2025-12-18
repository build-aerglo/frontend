<template> 
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> 
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"> 
      <h2 class="text-lg font-semibold mb-4">Change Password</h2> 
      <form @submit.prevent="submitPasswordChange"> 
        <div class="space-y-4"> 
          <div> 
            <label class="block text-sm font-medium text-gray-700">Current Password</label> 
            <input type="password" v-model="passwords.current" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"> 
          </div> 
          <div> 
            <label class="block text-sm font-medium text-gray-700">New Password</label> 
            <input type="password" v-model="passwords.new" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"> 
          </div> 
          <div> 
            <label class="block text-sm font-medium text-gray-700">Confirm New Password</label> 
            <input type="password" v-model="passwords.confirm" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"> 
          </div> 
        </div> 
        <div class="mt-6 flex justify-end gap-3"> 
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button> 
          <button type="submit" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Update Password</button> 
        </div> 
      </form> 
    </div> 
  </div> 
</template> 
<script setup> 
import { reactive } from 'vue'; 
const emit = defineEmits(['close']); 
const passwords = reactive({ 
  current: '', 
  new: '', 
  confirm: '', 
}); 
const submitPasswordChange = () => { 
  console.log('Password change submitted', passwords); 
  // Basic validation 
  if (passwords.new !== passwords.confirm) { 
    alert("New passwords don't match!"); 
    return; 
  } 
  alert('Password changed successfully!'); 
  emit('close'); 
}; 
</script> 
