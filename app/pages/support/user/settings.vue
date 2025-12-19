<template> 
  <div class="min-h-screen bg-gray-50 p-4 md:p-6"> 
    <div class="max-w-5xl mx-auto"> 
      <!-- Header --> 
      <div class="mb-6 md:mb-8"> 
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1> 
        <p class="text-gray-600 mt-2">Manage your account preferences and workflow settings</p> 
      </div> 
      <!-- Tabs Navigation --> 
      <div class="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto"> 
        <div class="border-b border-gray-200"> 
          <nav class="flex min-w-max"> 
            <button 
              v-for="tab in tabs" 
              :key="tab.id" 
              @click="activeTab = tab.id" 
              :class="activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'" 
              class="px-6 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap" 
            > 
              <i :class="tab.icon" class="mr-2"></i> 
              {{ tab.label }} 
            </button> 
          </nav> 
        </div> 
      </div> 
      <!-- Tab Content --> 
      <div class="bg-white rounded-lg shadow-sm p-6"> 
        <!-- Account & Security Tab --> 
        <div v-if="activeTab === 'account'" class="space-y-6"> 
          <div> 
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Account & Security</h2> 
            <p class="text-sm text-gray-600 mb-6">Manage your account credentials and security settings</p> 
          </div> 
          <!-- Email --> 
          <div class="border-b pb-6"> 
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label> 
            <div class="flex flex-col sm:flex-row gap-3"> 
              <input 
                v-model="accountSettings.email" 
                type="email" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              > 
              <button @click="updateEmail" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"> 
                Update Email 
              </button> 
            </div> 
            <p class="text-xs text-gray-500 mt-2">You'll need to verify your new email address</p> 
          </div> 
          <!-- Password --> 
          <div class="border-b pb-6"> 
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label> 
            <button @click="showChangePasswordModal = true" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"> 
              <i class="pi pi-lock mr-2"></i> 
              Change Password 
            </button> 
          </div> 
          <!-- Two-Factor Authentication --> 
          <div class="border-b pb-6"> 
            <div class="flex items-center justify-between mb-3"> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Two-Factor Authentication</h3> 
                <p class="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p> 
              </div> 
              <label class="relative inline-flex items-center cursor-pointer"> 
                <input type="checkbox" v-model="accountSettings.twoFactorEnabled" class="sr-only peer"> 
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
              </label> 
            </div> 
            <div v-if="accountSettings.twoFactorEnabled" class="bg-green-50 border border-green-200 rounded-lg p-3"> 
              <p class="text-sm text-green-800"> 
                <i class="pi pi-check-circle mr-2"></i> 
                Two-factor authentication is enabled 
              </p> 
            </div> 
          </div> 
          <!-- Login Alerts --> 
          <div class="border-b pb-6"> 
            <div class="flex items-center justify-between mb-3"> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Login Alerts</h3> 
                <p class="text-xs text-gray-500 mt-1">Get notified when someone logs into your account from a new device</p> 
              </div> 
              <label class="relative inline-flex items-center cursor-pointer"> 
                <input type="checkbox" v-model="accountSettings.loginAlerts" class="sr-only peer"> 
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
              </label> 
            </div> 
          </div> 
          <!-- Active Sessions --> 
          <div> 
            <h3 class="text-sm font-medium text-gray-900 mb-3">Active Sessions</h3> 
            <div class="space-y-3"> 
              <div v-for="session in activeSessions" :key="session.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"> 
                <div class="flex items-center gap-3"> 
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"> 
                    <i :class="session.device === 'Desktop' ? 'pi pi-desktop' : 'pi pi-mobile'" class="text-emerald-600"></i> 
                  </div> 
                  <div> 
                    <p class="text-sm font-medium text-gray-900">{{ session.device }}</p> 
                    <p class="text-xs text-gray-500">{{ session.location }} • {{ session.lastActive }}</p> 
                    <span v-if="session.current" class="text-xs text-green-600 font-medium">Current Session</span> 
                  </div> 
                </div> 
                <button v-if="!session.current" @click="logoutSession(session.id)" class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"> 
                  Logout 
                </button> 
              </div> 
            </div> 
          </div> 
          <!-- Save Button --> 
          <div class="pt-6 border-t"> 
            <button @click="saveAccountSettings" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"> 
              <i class="pi pi-save mr-2"></i> 
              Save Changes 
            </button> 
          </div> 
        </div> 
        <!-- Notifications Tab --> 
        <div v-if="activeTab === 'notifications'" class="space-y-6"> 
          <div> 
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2> 
            <p class="text-sm text-gray-600 mb-6">Choose how you want to be notified about important events</p> 
          </div> 
          <!-- Email Notifications --> 
          <div class="border-b pb-6"> 
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Email Notifications</h3> 
            <div class="space-y-4"> 
              <div class="flex items-center justify-between"> 
                <div> 
                  <p class="text-sm font-medium text-gray-900">New Claim Requests</p> 
                  <p class="text-xs text-gray-500">Get notified when a business ownership claim is submitted</p> 
                </div> 
                <label class="relative inline-flex items-center cursor-pointer"> 
                  <input type="checkbox" v-model="notificationSettings.email.newClaim" class="sr-only peer"> 
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
                </label> 
              </div> 
              <div class="flex items-center justify-between"> 
                <div> 
                  <p class="text-sm font-medium text-gray-900">Flagged Reviews</p> 
                  <p class="text-xs text-gray-500">Get notified when a review is reported or flagged</p> 
                </div> 
                <label class="relative inline-flex items-center cursor-pointer"> 
                  <input type="checkbox" v-model="notificationSettings.email.flaggedReview" class="sr-only peer"> 
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
                </label> 
              </div> 
              <div class="flex items-center justify-between"> 
                <div> 
                  <p class="text-sm font-medium text-gray-900">System Announcements</p> 
                  <p class="text-xs text-gray-500">Important updates and platform announcements</p> 
                </div> 
                <label class="relative inline-flex items-center cursor-pointer"> 
                  <input type="checkbox" v-model="notificationSettings.email.systemAnnouncements" class="sr-only peer"> 
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
                </label> 
              </div> 
              <div class="flex items-center justify-between"> 
                <div> 
                  <p class="text-sm font-medium text-gray-900">Daily Summary Digest</p> 
                  <p class="text-xs text-gray-500">Receive a daily summary of pending tasks</p> 
                </div> 
                <label class="relative inline-flex items-center cursor-pointer"> 
                  <input type="checkbox" v-model="notificationSettings.email.dailyDigest" class="sr-only peer"> 
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
                </label> 
              </div> 
            </div> 
          </div> 
          <!-- In-App Notifications --> 
          <div> 
            <h3 class="text-sm font-semibold text-gray-900 mb-4">In-App Notifications</h3> 
            <div class="space-y-4"> 
              <div class="flex items-center justify-between"> 
                <div> 
                  <p class="text-sm font-medium text-gray-900">Real-time Alerts</p> 
                  <p class="text-xs text-gray-500">Show pop-up notifications for urgent items</p> 
                </div> 
                <label class="relative inline-flex items-center cursor-pointer"> 
                  <input type="checkbox" v-model="notificationSettings.inApp.realTimeAlerts" class="sr-only peer"> 
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
                </label> 
              </div> 
              <div class="flex items-center justify-between"> 
                <div> 
                  <p class="text-sm font-medium text-gray-900">Sound Notifications</p> 
                  <p class="text-xs text-gray-500">Play sound for new notifications</p> 
                </div> 
                <label class="relative inline-flex items-center cursor-pointer"> 
                  <input type="checkbox" v-model="notificationSettings.inApp.sound" class="sr-only peer"> 
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
                </label> 
              </div> 
            </div> 
          </div> 
          <!-- Save Button --> 
          <div class="pt-6 border-t"> 
            <button @click="saveNotificationSettings" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"> 
              <i class="pi pi-save mr-2"></i> 
              Save Changes 
            </button> 
          </div> 
        </div> 
        <!-- Interface Tab --> 
        <div v-if="activeTab === 'interface'" class="space-y-6"> 
          <div> 
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Interface Preferences</h2> 
            <p class="text-sm text-gray-600 mb-6">Customize how the support panel looks and behaves</p> 
          </div> 
          <!-- Theme --> 
          <div class="border-b pb-6"> 
            <label class="block text-sm font-medium text-gray-700 mb-3">Theme</label> 
            <div class="grid grid-cols-3 gap-3"> 
              <button 
                v-for="theme in themeOptions" 
                :key="theme.value" 
                @click="interfaceSettings.theme = theme.value" 
                :class="interfaceSettings.theme === theme.value ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300'" 
                class="flex flex-col items-center p-4 border-2 rounded-lg hover:border-emerald-400 transition-colors" 
              > 
                <i class="text-2xl mb-2" :class="interfaceSettings.theme === theme.value ? 'text-emerald-600' : 'text-gray-600'"></i> 
                <span class="text-sm font-medium">{{ theme.label }}</span> 
              </button> 
            </div> 
          </div> 
          <!-- Default Landing Page --> 
          <div class="border-b pb-6"> 
            <label class="block text-sm font-medium text-gray-700 mb-3">Default Landing Page</label> 
            <Dropdown 
              v-model="interfaceSettings.defaultLandingPage" 
              :options="landingPageOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="Select default page" 
              class="w-full" 
            /> 
            <p class="text-xs text-gray-500 mt-2">The page you see first when you log in</p> 
          </div> 
          <!-- Table Density --> 
          <div class="border-b pb-6"> 
            <label class="block text-sm font-medium text-gray-700 mb-3">Table Density</label> 
            <div class="grid grid-cols-2 gap-3"> 
              <button 
                v-for="density in densityOptions" 
                :key="density.value" 
                @click="interfaceSettings.tableDensity = density.value" 
                :class="interfaceSettings.tableDensity === density.value ? 'border-emerald-600 bg-blue-50 text-emerald-700' : 'border-gray-300 text-gray-700'" 
                class="px-4 py-3 border-2 rounded-lg hover:border-emerald-400 transition-colors text-sm font-medium" 
              > 
                {{ density.label }} 
              </button> 
            </div> 
          </div> 
          <!-- Items Per Page --> 
          <div class="border-b pb-6"> 
            <label class="block text-sm font-medium text-gray-700 mb-3">Items Per Page</label> 
            <Dropdown 
              v-model="interfaceSettings.itemsPerPage" 
              :options="itemsPerPageOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="Select items per page" 
              class="w-full" 
            /> 
          </div> 
          <!-- Auto-refresh --> 
          <div> 
            <div class="flex items-center justify-between"> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Auto-refresh Tables</h3> 
                <p class="text-xs text-gray-500 mt-1">Automatically refresh data tables every 30 seconds</p> 
              </div> 
              <label class="relative inline-flex items-center cursor-pointer"> 
                <input type="checkbox" v-model="interfaceSettings.autoRefresh" class="sr-only peer"> 
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
              </label> 
            </div> 
          </div> 
          <!-- Save Button --> 
          <div class="pt-6 border-t"> 
            <button @click="saveInterfaceSettings" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"> 
              <i class="pi pi-save mr-2"></i> 
              Save Changes 
            </button> 
          </div> 
        </div> 
        <!-- Workflow Safety Tab --> 
        <div v-if="activeTab === 'workflow'" class="space-y-6"> 
          <div> 
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Workflow Safety</h2> 
            <p class="text-sm text-gray-600 mb-6">Prevent mistakes and ensure data integrity</p> 
          </div> 
          <!-- Confirmation Dialogs --> 
          <div class="border-b pb-6"> 
            <div class="flex items-center justify-between mb-4"> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Confirmation Dialogs</h3> 
                <p class="text-xs text-gray-500 mt-1">Require confirmation before destructive actions</p> 
              </div> 
              <label class="relative inline-flex items-center cursor-pointer"> 
                <input type="checkbox" v-model="workflowSettings.requireConfirmation" class="sr-only peer"> 
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
              </label> 
            </div> 
          </div> 
          <!-- Mandatory Reasons --> 
          <div class="border-b pb-6"> 
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Require Mandatory Reason Before:</h3> 
            <div class="space-y-4"> 
              <div class="flex items-center justify-between"> 
                <div> 
                  <p class="text-sm font-medium text-gray-900">Rejecting Claims</p> 
                  <p class="text-xs text-gray-500">Must provide a reason when rejecting ownership claims</p> 
                </div> 
                <label class="relative inline-flex items-center cursor-pointer"> 
                  <input type="checkbox" v-model="workflowSettings.mandatoryReasons.rejectingClaims" class="sr-only peer"> 
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
                </label> 
              </div> 
              <div class="flex items-center justify-between"> 
                <div> 
                  <p class="text-sm font-medium text-gray-900">Deleting Reviews</p> 
                  <p class="text-xs text-gray-500">Must provide a reason when deleting user reviews</p> 
                </div> 
                <label class="relative inline-flex items-center cursor-pointer"> 
                  <input type="checkbox" v-model="workflowSettings.mandatoryReasons.deletingReviews" class="sr-only peer"> 
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
                </label> 
              </div> 
              <div class="flex items-center justify-between"> 
                <div> 
                  <p class="text-sm font-medium text-gray-900">Banning Users</p> 
                  <p class="text-xs text-gray-500">Must provide a detailed reason when banning users</p> 
                </div> 
                <label class="relative inline-flex items-center cursor-pointer"> 
                  <input type="checkbox" v-model="workflowSettings.mandatoryReasons.banningUsers" class="sr-only peer"> 
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
                </label> 
              </div> 
            </div> 
          </div> 
          <!-- Auto-save Drafts --> 
          <div class="border-b pb-6"> 
            <div class="flex items-center justify-between"> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Auto-save Drafts</h3> 
                <p class="text-xs text-gray-500 mt-1">Automatically save draft reasons to prevent data loss</p> 
              </div> 
              <label class="relative inline-flex items-center cursor-pointer"> 
                <input type="checkbox" v-model="workflowSettings.autoSaveDrafts" class="sr-only peer"> 
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
              </label> 
            </div> 
          </div> 
          <!-- Keyboard Shortcuts --> 
          <div> 
            <div class="flex items-center justify-between"> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Keyboard Shortcuts</h3> 
                <p class="text-xs text-gray-500 mt-1">Enable keyboard shortcuts for faster navigation</p> 
              </div> 
              <label class="relative inline-flex items-center cursor-pointer"> 
                <input type="checkbox" v-model="workflowSettings.keyboardShortcuts" class="sr-only peer"> 
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div> 
              </label> 
            </div> 
            <div v-if="workflowSettings.keyboardShortcuts" class="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4"> 
              <p class="text-sm font-medium text-emerald-900 mb-2">Available Shortcuts:</p> 
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-800"> 
                <div><kbd class="px-2 py-1 bg-white rounded">Ctrl + K</kbd> Quick search</div> 
                <div><kbd class="px-2 py-1 bg-white rounded">Ctrl + /</kbd> Show shortcuts</div> 
                <div><kbd class="px-2 py-1 bg-white rounded">Esc</kbd> Close modal</div> 
                <div><kbd class="px-2 py-1 bg-white rounded">Tab</kbd> Navigate fields</div> 
              </div> 
            </div> 
          </div> 
          <!-- Save Button --> 
          <div class="pt-6 border-t"> 
            <button @click="saveWorkflowSettings" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"> 
              <i class="pi pi-save mr-2"></i> 
              Save Changes 
            </button> 
          </div> 
        </div> 
        <!-- Regional Tab --> 
        <div v-if="activeTab === 'regional'" class="space-y-6"> 
          <div> 
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Language & Regional</h2> 
            <p class="text-sm text-gray-600 mb-6">Configure language, timezone, and date formats</p> 
          </div> 
          <!-- Language --> 
          <div class="border-b pb-6"> 
            <label class="block text-sm font-medium text-gray-700 mb-3">Language</label> 
            <Dropdown 
              v-model="regionalSettings.language" 
              :options="languageOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="Select language" 
              class="w-full" 
            /> 
          </div> 
          <!-- Timezone --> 
          <div class="border-b pb-6"> 
            <label class="block text-sm font-medium text-gray-700 mb-3">Timezone</label> 
            <Dropdown 
              v-model="regionalSettings.timezone" 
              :options="timezoneOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="Select timezone" 
              filter 
              class="w-full" 
            /> 
          </div> 
          <!-- Date Format --> 
          <div class="border-b pb-6"> 
            <label class="block text-sm font-medium text-gray-700 mb-3">Date Format</label> 
            <Dropdown 
              v-model="regionalSettings.dateFormat" 
              :options="dateFormatOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="Select date format" 
              class="w-full" 
            /> 
          </div> 
          <!-- Time Format --> 
          <div> 
            <label class="block text-sm font-medium text-gray-700 mb-3">Time Format</label> 
            <div class="grid grid-cols-2 gap-3"> 
              <button 
                @click="regionalSettings.timeFormat = '12h'" 
                :class="regionalSettings.timeFormat === '12h' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-300 text-gray-700'" 
                class="px-4 py-3 border-2 rounded-lg hover:border-emerald-400 transition-colors text-sm font-medium" 
              > 
                12-hour 
              </button> 
              <button 
                @click="regionalSettings.timeFormat = '24h'" 
                :class="regionalSettings.timeFormat === '24h' ? 'border-emerald-600 bg-blue-50 text-emerald-700' : 'border-gray-300 text-gray-700'" 
                class="px-4 py-3 border-2 rounded-lg hover:border-blue-400 transition-colors text-sm font-medium" 
              > 
                24-hour 
              </button> 
            </div> 
          </div> 
          <!-- Save Button --> 
          <div class="pt-6 border-t"> 
            <button @click="saveRegionalSettings" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"> 
              <i class="pi pi-save mr-2"></i> 
              Save Changes 
            </button> 
          </div> 
        </div> 
        <!-- My Activity Tab --> 
        <div v-if="activeTab === 'activity'" class="space-y-6"> 
          <div> 
            <h2 class="text-xl font-semibold text-gray-900 mb-4">My Activity</h2> 
            <p class="text-sm text-gray-600 mb-6">Review your recent actions within the support panel</p> 
          </div> 
          <div class="flex justify-end"> 
            <button @click="exportActivity" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"> 
              <i class="pi pi-download mr-2"></i> 
              Export Activity 
            </button> 
          </div> 
          <!-- Activity List --> 
          <div class="border rounded-lg overflow-hidden"> 
            <ul class="divide-y divide-gray-200"> 
              <li v-for="item in userActivity" :key="item.id" class="p-4 flex items-start"> 
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4"> 
                  <i :class="item.icon" class="text-gray-600"></i> 
                </div> 
                <div class="flex-1"> 
                  <p class="text-sm text-gray-800">{{ item.description }}</p> 
                  <p class="text-xs text-gray-500 mt-1">{{ item.timestamp }}</p> 
                </div> 
              </li> 
            </ul> 
          </div> 
        </div> 
        <!-- Help Tab --> 
        <div v-if="activeTab === 'help'" class="space-y-6"> 
          <div> 
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Help & Meta</h2> 
            <p class="text-sm text-gray-600 mb-6">Find support resources and information about the panel</p> 
          </div> 
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> 
            <a href="#" class="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center"> 
              <i class="pi pi-book text-xl text-emerald-600 mr-4"></i> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Support Guidelines</h3> 
                <p class="text-xs text-gray-500">Read the official support documentation</p> 
              </div> 
            </a> 
            <a href="#" class="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center"> 
              <i class="pi pi-sync text-xl text-emerald-600 mr-4"></i> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">View Changelog</h3> 
                <p class="text-xs text-gray-500">See what's new in the latest version</p> 
              </div> 
            </a> 
            <a href="#" class="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center"> 
              <i class="pi pi-flag text-xl text-emerald-600 mr-4"></i> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Report Internal Issue</h3> 
                <p class="text-xs text-gray-500">Found a bug? Let the dev team know</p> 
              </div> 
            </a> 
            <a href="#" class="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center"> 
              <i class="pi pi-envelope text-xl text-emerald-600 mr-4"></i> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Contact Super Admin</h3> 
                <p class="text-xs text-gray-500">Get in touch with a platform administrator</p> 
              </div> 
            </a> 
          </div> 
        </div> 
        <!-- Data Management Tab --> 
        <div v-if="activeTab === 'data'" class="space-y-6"> 
          <div> 
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Data & Preferences Management</h2> 
            <p class="text-sm text-gray-600 mb-6">Manage your local data and settings</p> 
          </div> 
          <div class="p-4 border border-yellow-300 bg-yellow-50 rounded-lg"> 
            <p class="text-sm text-yellow-800"> 
              <i class="pi pi-exclamation-triangle mr-2"></i> 
              These actions are local to your browser and device. 
            </p> 
          </div> 
          <div class="space-y-4"> 
            <div class="flex items-center justify-between p-4 border rounded-lg"> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Clear Cached Preferences</h3> 
                <p class="text-xs text-gray-500">Clear locally stored UI preferences</p> 
              </div> 
              <button @click="clearCache" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"> 
                Clear Cache 
              </button> 
            </div> 
            <div class="flex items-center justify-between p-4 border rounded-lg"> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Reset Settings to Default</h3> 
                <p class="text-xs text-gray-500">Reset all settings to their original state</p> 
              </div> 
              <button @click="resetSettings" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"> 
                Reset Settings 
              </button> 
            </div> 
            <div class="flex items-center justify-between p-4 border rounded-lg"> 
              <div> 
                <h3 class="text-sm font-medium text-gray-900">Download My Settings</h3> 
                <p class="text-xs text-gray-500">Download a JSON file of your current settings</p> 
              </div> 
              <button @click="downloadSettings" class="px-4 py-2 bg-blue-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"> 
                Download 
              </button> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
    <!-- Modals --> 
    <ChangePasswordModal v-if="showChangePasswordModal" @close="showChangePasswordModal = false" /> 
  </div> 
</template> 
<script setup> 
import { ref, reactive } from 'vue'; 
definePageMeta({ layout: 'support' })
import ChangePasswordModal from '~/components/ChangePasswordModal.vue'; 

const activeTab = ref('account'); 
const tabs = [ 
  { id: 'account', label: 'Account & Security', icon: 'pi pi-user' }, 
  { id: 'notifications', label: 'Notifications', icon: 'pi pi-bell' }, 
  { id: 'interface', label: 'Interface', icon: 'pi pi-palette' }, 
  { id: 'workflow', label: 'Workflow Safety', icon: 'pi pi-shield' }, 
  { id: 'regional', label: 'Regional', icon: 'pi pi-globe' }, 
  { id: 'activity', label: 'My Activity', icon: 'pi pi-history' }, 
  { id: 'data', label: 'Data Management', icon: 'pi pi-database' }, 
  { id: 'help', label: 'Help', icon: 'pi pi-question-circle' }, 
]; 
// -- Account Settings -- 
const showChangePasswordModal = ref(false); 
const accountSettings = reactive({ 
  email: 'support-user@example.com', 
  twoFactorEnabled: true, 
  loginAlerts: true, 
}); 
const activeSessions = ref([ 
  { id: 1, device: 'Desktop', location: 'Abeokuta, Ogun', lastActive: '2 minutes ago', current: true }, 
  { id: 2, device: 'iPhone 14 Pro', location: 'Yaba, Lagos', lastActive: '3 hours ago', current: false }, 
  { id: 3, device: 'Desktop', location: 'Odeda, Ogun', lastActive: '1 day ago', current: false }, 
]); 
const updateEmail = () => { 
  alert(`Email update request for ${accountSettings.email} sent (mock).`); 
}; 
const logoutSession = (sessionId) => { 
  activeSessions.value = activeSessions.value.filter(s => s.id !== sessionId); 
  alert(`Session ${sessionId} logged out (mock).`); 
}; 
const saveAccountSettings = () => { 
  alert('Account settings saved (mock)!'); 
  console.log(accountSettings); 
}; 
// -- Notification Settings -- 
const notificationSettings = reactive({ 
  email: { 
    newClaim: true, 
    flaggedReview: true, 
    systemAnnouncements: true, 
    dailyDigest: false, 
  }, 
  inApp: { 
    realTimeAlerts: true, 
    sound: false, 
  }, 
}); 
const saveNotificationSettings = () => { 
  alert('Notification settings saved (mock)!'); 
  console.log(notificationSettings); 
}; 
// -- Interface Settings -- 
const interfaceSettings = reactive({ 
  theme: 'system', 
  defaultLandingPage: 'dashboard', 
  tableDensity: 'normal', 
  itemsPerPage: 25, 
  autoRefresh: false, 
}); 
const themeOptions = [ 
  { value: 'light', label: 'Light', icon: 'pi pi-sun' }, 
  { value: 'dark', label: 'Dark', icon: 'pi pi-moon' }, 
  { value: 'system', label: 'System', icon: 'pi pi-desktop' }, 
]; 
const landingPageOptions = [ 
  { label: 'Dashboard', value: 'dashboard' }, 
  { label: 'Claims Management', value: 'claims' }, 
  { label: 'Review Moderation', value: 'moderation' }, 
]; 
const densityOptions = [ 
  { label: 'Compact', value: 'compact' }, 
  { label: 'Normal', value: 'normal' }, 
]; 
const itemsPerPageOptions = [ 
  { label: '10 items per page', value: 10 }, 
  { label: '25 items per page', value: 25 }, 
  { label: '50 items per page', value: 50 }, 
]; 
const saveInterfaceSettings = () => { 
  alert('Interface settings saved (mock)!'); 
  console.log(interfaceSettings); 
}; 
// -- Workflow Safety Settings -- 
const workflowSettings = reactive({ 
  requireConfirmation: true, 
  mandatoryReasons: { 
    rejectingClaims: true, 
    deletingReviews: true, 
    banningUsers: false, 
  }, 
  autoSaveDrafts: true, 
  keyboardShortcuts: true, 
}); 
const saveWorkflowSettings = () => { 
  alert('Workflow safety settings saved (mock)!'); 
  console.log(workflowSettings); 
}; 
// -- Regional Settings -- 
const regionalSettings = reactive({ 
  language: 'en-US', 
  timezone: 'America/New_York', 
  dateFormat: 'MM/DD/YYYY', 
  timeFormat: '12h', 
}); 
const languageOptions = [ 
  { label: 'English (US)', value: 'en-US' }, 
  { label: 'English (UK)', value: 'en-GB' }, 
  { label: 'Español', value: 'es-ES' }, 
  { label: 'Français', value: 'fr-FR' }, 
]; 
const timezoneOptions = [ 
  { label: 'UTC-5:00 (Eastern Time)', value: 'America/New_York' }, 
  { label: 'UTC+0:00 (Greenwich Mean Time)', value: 'Europe/London' }, 
  { label: 'UTC+1:00 (Central European Time)', value: 'Europe/Berlin' }, 
]; 
const dateFormatOptions = [ 
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' }, 
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' }, 
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }, 
]; 
const saveRegionalSettings = () => { 
  alert('Regional settings saved (mock)!'); 
  console.log(regionalSettings); 
}; 
// -- My Activity -- 
const userActivity = ref([ 
  { id: 1, icon: 'pi pi-check-circle', description: 'Approved claim for "The Grand Cafe".', timestamp: '2 hours ago' }, 
  { id: 2, icon: 'pi pi-trash', description: 'Deleted review on "City Movers". Reason: Spam.', timestamp: '5 hours ago' }, 
  { id: 3, icon: 'pi pi-user-edit', description: 'Updated your email address.', timestamp: '1 day ago' }, 
  { id: 4, icon: 'pi pi-shield', description: 'Enabled two-factor authentication.', timestamp: '1 day ago' }, 
]); 
const exportActivity = () => { 
  alert('Exporting activity (mock)...'); 
}; 
// -- Data Management -- 
const clearCache = () => { 
  if (confirm('Are you sure you want to clear cached preferences?')) { 
    alert('Cache cleared (mock)!'); 
  } 
}; 
const resetSettings = () => { 
  if (confirm('Are you sure you want to reset ALL settings to default? This cannot be undone.')) { 
    alert('Settings reset to default (mock)!'); 
    // Here you would reset all reactive objects to their initial state 
  } 
}; 
const downloadSettings = () => { 
  const allSettings = { 
    account: accountSettings, 
    notifications: notificationSettings, 
    interface: interfaceSettings, 
    workflow: workflowSettings, 
    regional: regionalSettings, 
  }; 
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allSettings, null, 2)); 
  const downloadAnchorNode = document.createElement('a'); 
  downloadAnchorNode.setAttribute("href", dataStr); 
  downloadAnchorNode.setAttribute("download", "settings.json"); 
  document.body.appendChild(downloadAnchorNode); 
  downloadAnchorNode.click(); 
  downloadAnchorNode.remove(); 
  alert('Settings downloaded!'); 
}; 
</script> 
<style scoped> 
/* PrimeVue Dropdown Customization (optional) */ 
.p-dropdown { 
  border: 1px solid #D1D5DB; /* gray-300 */ 
  border-radius: 0.5rem; /* rounded-lg */ 
} 
.p-dropdown:not(.p-disabled):hover { 
  border-color: #9CA3AF; /* gray-400 */ 
} 
.p-dropdown:not(.p-disabled).p-focus { 
  box-shadow:0 0 0 2px rgba(16, 185, 129, 0.5); /* ring-2 ring-emerald-500 */

  border-color: transparent; 
} 
</style> 

