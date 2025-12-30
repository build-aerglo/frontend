<template>
  <div class="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Identity -->
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Personal Identity</h3>
              <button v-if="!isEditing" @click="enterEditMode" class="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-100 rounded-lg hover:bg-emerald-200">Edit</button>
              <div v-else class="space-x-2">
                <button @click="cancelEdit" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button @click="saveChanges" class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">Save</button>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div class="flex-shrink-0">
                <div class="relative w-24 h-24">
                  <img class="h-24 w-24 rounded-full object-cover" :src="isEditing && editableUser.avatarUrl ? editableUser.avatarUrl : user.avatarUrl" alt="User avatar">
                  <div v-if="isEditing" @click="triggerFileInput" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                    <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                </div>
                <input type="file" ref="fileInput" @change="onFileChange" class="hidden" accept="image/*">
              </div>
              <div class="flex-1">
                <div v-if="!isEditing">
                  <div class="flex items-center space-x-3">
                     <h2 class="text-2xl font-bold text-gray-900">{{ user.fullName }}</h2>
                     <span :class="['px-2.5 py-0.5 rounded-full text-xs font-medium', user.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                        {{ user.accountStatus }}
                     </span>
                  </div>
                  <p class="text-gray-600 mt-1">@{{ user.username }}</p>
                </div>
                <div v-else class="space-y-4">
                   <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" v-model="editableUser.fullName" class="w-full px-4 py-3 text-lg font-bold border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                   </div>
                   <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input type="text" v-model="editableUser.username" class="w-full px-4 py-3 text-sm border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                   </div>
                   <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                      <Dropdown v-model="editableUser.accountStatus" :options="accountStatusOptions" placeholder="Select Status" class="w-full" />
                   </div>
                </div>
                
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ user.role }}</span>
                  <span class="text-gray-300">|</span>
                  <span>Joined on {{ user.dateJoined }}</span>
                </div>
              </div>
            </div>
            <div class="mt-6 border-t border-gray-200 pt-6">
               <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                  <div class="sm:col-span-1">
                     <dt class="font-medium text-gray-500">Work Email</dt>
                     <dd class="mt-1 text-gray-900">{{ user.email }}</dd>
                  </div>
               </dl>
            </div>
          </div>

          <!-- Professional Context -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">Professional Context</h3>
            <div class="mt-4 border-t border-gray-200 pt-4">
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <div class="sm:col-span-1">
                  <dt class="font-medium text-gray-500">Department</dt>
                  <dd class="mt-1 text-gray-900">{{ professional.department }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="font-medium text-gray-500">Timezone</dt>
                  <dd class="mt-1 text-gray-900">{{ professional.timezone }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="font-medium text-gray-500">Internal Notes</dt>
                  <dd class="mt-1 text-gray-900 bg-yellow-50 p-3 rounded-md">{{ professional.internalNotes }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Security Overview -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">Security Overview (Read-Only)</h3>
            <div class="mt-4 border-t border-gray-200 pt-4">
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <div class="sm:col-span-1">
                  <dt class="font-medium text-gray-500">Last Login</dt>
                  <dd class="mt-1 text-gray-900">{{ security.lastLogin }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="font-medium text-gray-500">Active Sessions</dt>
                  <dd class="mt-1 text-gray-900">{{ security.activeSessions }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="font-medium text-gray-500">2FA Status</dt>
                  <dd class="mt-1 text-gray-900">
                    <span :class="['px-2 py-0.5 rounded-full text-xs', security.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
                      {{ security.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
                    </span>
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="font-medium text-gray-500">Password Last Changed</dt>
                  <dd class="mt-1 text-gray-900">{{ security.passwordLastChanged }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Permissions Summary -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">Permissions Summary</h3>
            <ul class="mt-4 space-y-3 text-sm">
              <li v-for="permission in permissions" :key="permission.name" class="flex items-center">
                <svg :class="[permission.enabled ? 'text-green-500' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="ml-2 text-gray-700">{{ permission.name }}</span>
              </li>
            </ul>
          </div>
          
          <!-- Performance Snapshot -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">Performance Snapshot</h3>
            <dl class="mt-4 space-y-4">
              <div v-for="stat in performanceStats" :key="stat.name" class="flex items-center justify-between">
                <dt class="text-sm font-medium text-gray-500">{{ stat.name }}</dt>
                <dd class="text-sm font-semibold text-gray-900">{{ stat.value }}</dd>
              </div>
            </dl>
          </div>

          <!-- Recent Personal Activity -->
          <div class="bg-white p-5 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">Recent Personal Activity</h3>
            <ul class="mt-3 space-y-2">
              <li v-for="activity in recentActivity" :key="activity.id">
                <div class="flex items-start space-x-2">
                   <div class="flex-shrink-0">
                      <span class="inline-flex items-center justify-center h-4 w-4 rounded-full" :class="activity.bgColor">
                         <svg class="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path :d="activity.iconPath" /></svg>
                      </span>
                   </div>
                   <div class="flex-1">
                      <p class="text-sm text-gray-800">{{ activity.action }} <a href="#" class="font-medium text-emerald-600 hover:underline">{{ activity.target }}</a></p>
                      <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
                   </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
       <!-- Full-width Bottom Section -->
       <div class="mt-6 grid grid-cols-1 gap-6">
          <!-- Personal Notes & Drafts -->
          <div class="bg-white p-6 rounded-lg shadow">
             <h3 class="text-lg font-medium text-gray-900">Personal Notes & Drafts</h3>
             <div class="mt-4">
                <textarea v-model="personalNotes" rows="4" class="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" placeholder="Use this space for your private notes, response templates, or common rejection reasons..."></textarea>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isEditing = ref(false);
const user = ref({
  avatarUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
  fullName: 'Paul Obi',
  username: 'obi.paul',
  accountStatus: 'Active',
  role: 'Senior Support Agent',
  dateJoined: 'June 15, 2025',
  email: '111obipaul@example.com',
});
const editableUser = ref(null);
const fileInput = ref(null);
const accountStatusOptions = ref(['Active', 'Suspended']);

const professional = ref({
  department: 'Trust & Safety',
  timezone: 'WAT (Western Time)',
  internalNotes: 'Specializes in complex business claim disputes. Keep an eye on performance metrics for a potential team lead role.'
});

const security = ref({
  lastLogin: '2 hours ago from Yaba, Lagos, Nigeria',
  activeSessions: 3,
  twoFactorEnabled: true,
  passwordLastChanged: '3 weeks ago',
});

const permissions = ref([
  { name: 'Can approve business claims', enabled: true },
  { name: 'Can moderate reviews', enabled: true },
  { name: 'Can manage categories & tags', enabled: false },
  { name: 'Can manage businesses', enabled: false },
]);

const performanceStats = ref([
  { name: 'Total Claims Handled', value: '1,284' },
  { name: 'Total Reviews Moderated', value: '3,721' },
  { name: 'Avg. Response Time', value: '4.2 hours' },
  { name: 'Last Action', value: '15 minutes ago' },
]);

const recentActivity = ref([
  { id: 1, action: 'Approved claim for', target: 'The Grand Café', timestamp: '2 minutes ago', bgColor: 'bg-green-500'},
  { id: 2, action: 'Rejected review on', target: 'City Movers', timestamp: '1 hour ago', bgColor: 'bg-red-500'},
  { id: 3, action: 'Edited business details for', target: 'Tech Innovate', timestamp: '3 hours ago', bgColor: 'bg-yellow-500'},
]);

const personalNotes = ref('');

const enterEditMode = () => {
  editableUser.value = { ...user.value };
  isEditing.value = true;
};

const saveChanges = () => {
  user.value = { ...editableUser.value };
  isEditing.value = false;
  // API call here to save the changes.
  alert('Changes saved successfully!');
};

const cancelEdit = () => {
  isEditing.value = false;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editableUser.value.avatarUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

definePageMeta({ layout: 'support' });
</script>
<style scoped>
/* PrimeVue Dropdown Customization */ 
:global(.p-dropdown) { 
  border: 1px solid #D1D5DB; /* gray-300 */ 
  border-radius: 0.375rem; /* rounded-md */
  width: 100%;
} 
:global(.p-dropdown .p-dropdown-label) {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}
:global(.p-dropdown:not(.p-disabled):hover) { 
  border-color: #9CA3AF; /* gray-400 */ 
} 
:global(.p-dropdown:not(.p-disabled).p-focus) { 
  box-shadow: 0 0 0 1px #008253;  
  border-color: #008253;
} 
</style>
