<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 md:mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Business Management</h1>
        <p class="text-gray-600 mt-2">Manage all business listings and ownership</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Businesses</p>
              <p class="text-2xl md:text-3xl font-bold text-blue-600 mt-1">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-building text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Active</p>
              <p class="text-2xl md:text-3xl font-bold text-green-600 mt-1">{{ stats.active }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-check-circle text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Closed</p>
              <p class="text-2xl md:text-3xl font-bold text-red-600 mt-1">{{ stats.closed }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-times-circle text-2xl text-red-600"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Duplicates Found</p>
              <p class="text-2xl md:text-3xl font-bold text-orange-600 mt-1">{{ stats.duplicates }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-clone text-2xl text-orange-600"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Search businesses..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <Dropdown 
              v-model="filters.category" 
              :options="categoryOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All Categories"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Dropdown 
              v-model="filters.status" 
              :options="statusOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All Status"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Owner Status</label>
            <Dropdown 
              v-model="filters.ownerStatus" 
              :options="ownerStatusOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-4">
          <button @click="resetFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            <i class="pi pi-refresh mr-2"></i>
            Reset
          </button>
          <button @click="openMergeDuplicatesModal" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <i class="pi pi-clone mr-2"></i>
            Merge Duplicates
          </button>
        </div>
      </div>

      <!-- Businesses Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Business</th>
                <th class="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th class="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
                <th class="hidden xl:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ratings</th>
                <th class="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="business in filteredBusinesses" :key="business.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 md:px-6 py-4">
                  <div class="space-y-2">
                    <div class="font-semibold text-gray-900">{{ business.name }}</div>
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <i class="pi pi-map-marker text-xs"></i>
                      <span>{{ business.address }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <i class="pi pi-phone text-xs"></i>
                      <span>{{ business.phone }}</span>
                    </div>
                    <!-- Mobile-only info -->
                    <div class="flex flex-wrap gap-2 lg:hidden">
                      <span class="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">{{ business.category }}</span>
                      <span v-if="business.owner" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded md:hidden">
                        <i class="pi pi-user text-xs mr-1"></i>{{ business.owner }}
                      </span>
                    </div>
                  </div>
                </td>

                <td class="hidden lg:table-cell px-6 py-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {{ business.category }}
                  </span>
                </td>

                <td class="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                  <div v-if="business.owner">
                    <div class="font-medium text-gray-900">{{ business.owner }}</div>
                    <div class="text-xs text-gray-500">{{ business.ownerEmail }}</div>
                  </div>
                  <span v-else class="text-gray-400 italic">No owner</span>
                </td>

                <td class="hidden xl:table-cell px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1">
                      <Star 
                      :filled="true" 
                      :colorLevel="Math.floor(business.rating) || 0" 
                      class="w-4 h-4 inline-block" 
                    />
                    <span class="font-medium">{{ business.rating }}</span>
                    </div>
                  </div>
                </td>

                <td class="px-4 md:px-6 py-4">
                  <span :class="getStatusClass(business.status)" class="px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap">
                    {{ business.status }}
                  </span>
                </td>

                <td class="px-4 md:px-6 py-4">
                  <div class="flex flex-col sm:flex-row gap-2">
                    <button @click="viewBusiness(business)" class="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">
                      <i class="pi pi-eye"></i>
                      <span class="hidden sm:inline">View</span>
                    </button>
                    <button @click="editBusiness(business)" class="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 text-sm rounded-lg hover:bg-green-100 transition-colors whitespace-nowrap">
                      <i class="pi pi-pencil"></i>
                      <span class="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredBusinesses.length === 0" class="text-center py-12">
          <i class="pi pi-inbox text-5xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">No businesses found</p>
        </div>

        <!-- Pagination -->
        <div v-if="filteredBusinesses.length > 0" class="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredBusinesses.length }}</span> of <span class="font-medium">{{ filteredBusinesses.length }}</span> results
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              <i class="pi pi-chevron-left"></i>
            </button>
            <button class="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
            <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">2</button>
            <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Business Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full my-10">
        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-2xl font-semibold text-gray-900">Business Details</h4>
            <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
              <i class="pi pi-times text-sm"></i>
            </button>
          </div>

          <div v-if="selectedBusiness" class="space-y-2">
            <!-- Business Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div class="space-y-2">
                <div>
                  <label class="text-sm font-medium text-gray-500">Business Name</label>
                  <p class="mt-1 text-gray-900 font-semibold">{{ selectedBusiness.name }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Category</label>
                  <p class="mt-1"><span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">{{ selectedBusiness.category }}</span></p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Status</label>
                  <p class="mt-1"><span :class="getStatusClass(selectedBusiness.status)" class="px-3 py-1 text-xs font-semibold rounded-full">{{ selectedBusiness.status }}</span></p>
                </div>
              </div>

              <div class="space-y-2">
                <div>
                  <label class="text-sm font-medium text-gray-500">Address</label>
                  <p class="mt-1 text-gray-900">{{ selectedBusiness.address }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Phone</label>
                  <p class="mt-1 text-gray-900">{{ selectedBusiness.phone }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Website</label>
                  <p class="mt-1 text-blue-600">{{ selectedBusiness.website || 'Not provided' }}</p>
                </div>
              </div>
            </div>

            <!-- Owner Info -->
            <div class="border-t pt-2">
              <h4 class="font-semibold text-gray-900 mb-2">Owner Information</h4>
              <div v-if="selectedBusiness.owner" class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="text-sm font-medium text-gray-500">Name</label>
                    <p class="mt-1 text-gray-900">{{ selectedBusiness.owner }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Email</label>
                    <p class="mt-1 text-gray-900">{{ selectedBusiness.ownerEmail }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Claimed On</label>
                    <p class="mt-1 text-gray-900">{{ selectedBusiness.claimedDate }}</p>
                  </div>
                </div>
                <div class="mt-2 flex gap-2">
                  <button @click="changeOwner" class="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
                    <i class="pi pi-user-edit mr-1"></i>
                    Change Owner
                  </button>
                  <button @click="removeOwner" class="px-3 py-2 bg-slate-400 text-white text-sm rounded-lg hover:bg-slate-500 transition-colors">
                    <i class="pi pi-user-minus mr-1"></i>
                    Remove Owner
                  </button>
                </div>
              </div>
              <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-sm text-yellow-800">
                  <i class="pi pi-exclamation-triangle mr-2"></i>
                  This business has no owner assigned
                </p>
              </div>
            </div>

            <!-- Statistics -->
            <div class="border-t pt-2">
              <h4 class="font-semibold text-gray-900 mb-2">Statistics</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-gray-50 rounded-lg p-4 text-center">
                  <div class="flex items-center justify-center gap-1 mb-1">
                    <Star 
                      :filled="true" 
                      :colorLevel="Math.floor(selectedBusiness.rating) || 0" 
                      class="w-5 h-5 inline-block" 
                    />
                    <span class="text-xl font-bold text-gray-900">{{ selectedBusiness.rating }}</span>
                  </div>
                  <p class="text-sm mt-3 text-gray-600">Rating</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 text-center">
                  <p class="text-xl font-bold text-gray-900">{{ selectedBusiness.reviewCount }}</p>
                  <p class="text-sm text-gray-600">Reviews</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 text-center">
                  <p class="text-xl font-bold text-gray-900">{{ selectedBusiness.views || 0 }}</p>
                  <p class="text-sm text-gray-600">Views</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 text-center">
                  <p class="text-xl font-bold text-gray-900">{{ selectedBusiness.followers || 0 }}</p>
                  <p class="text-sm text-gray-600">Followers</p>
                </div>
              </div>
            </div>

            <!-- History -->
            <div class="border-t pt-2">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900">Business History</h4>
                <button @click="viewFullHistory" class="text-sm text-emerald-600 hover:text-emerald-700">
                  View All <i class="pi pi-arrow-right ml-1"></i>
                </button>
              </div>
              <div class="space-y-1">
                <div v-for="entry in selectedBusiness.history?.slice(0, 3)" :key="entry.id" class="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg">
                  <div class="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i :class="entry.icon" class="text-emerald-600 text-sm"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-900 font-medium">{{ entry.action }}</p>
                    <p class="text-xs text-gray-600 mt-1">{{ entry.details }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ entry.date }} • {{ entry.user }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="border-t pt-2 flex flex-col sm:flex-row gap-2">
              <button @click="editBusiness(selectedBusiness)" class="flex-1 px-4 py-3 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors">
                <i class="pi pi-pencil mr-2"></i>
                Edit Business
              </button>
              <button @click="markAsClosed" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <i class="pi pi-times-circle mr-2"></i>
                Mark as Closed
              </button>
              <button @click="openMergeModal" class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <i class="pi pi-clone mr-2"></i>
                Merge Duplicate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Business Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Edit Business</h3>
            <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
              <i class="pi pi-times text-sm"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
              <input 
                v-model="editForm.name" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <Dropdown 
                  v-model="editForm.category" 
                  :options="categoryOptions.filter(c => c.value !== 'all')" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="Select Category"
                  class="w-full"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <Dropdown 
                  v-model="editForm.status" 
                  :options="statusOptions.filter(s => s.value !== 'all')" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="Select Status"
                  class="w-full"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <input 
                v-model="editForm.address" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input 
                  v-model="editForm.phone" 
                  type="tel" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input 
                  v-model="editForm.website" 
                  type="url" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                v-model="editForm.description" 
                rows="4" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Edit Reason *</label>
              <textarea 
                v-model="editForm.editReason" 
                rows="2" 
                placeholder="Explain why you're making these changes..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button @click="closeEditModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button @click="saveBusinessEdit" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Merge Duplicates Modal -->
<div v-if="showMergeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Merge Duplicate Businesses</h3>
        <button @click="closeMergeModal" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Source Business (will be deleted) *</label>
          <Dropdown 
            v-model="mergeForm.sourceId" 
            :options="businesses.map(b => ({ label: b.name, value: b.id }))" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Select source business"
            filter
            class="w-full"
          />
          <div v-if="getBusinessById(mergeForm.sourceId)" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm font-medium text-red-900">{{ getBusinessById(mergeForm.sourceId)?.name }}</p>
            <p class="text-sm text-red-700">{{ getBusinessById(mergeForm.sourceId)?.reviewCount }} reviews • {{ getBusinessById(mergeForm.sourceId)?.rating }} rating</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Target Business (will keep all data) *</label>
          <Dropdown 
            v-model="mergeForm.targetId" 
            :options="businesses.filter(b => b.id !== mergeForm.sourceId).map(b => ({ label: b.name, value: b.id }))" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Select target business"
            filter
            class="w-full"
            :disabled="!mergeForm.sourceId"
          />
          <div v-if="getBusinessById(mergeForm.targetId)" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm font-medium text-green-900">{{ getBusinessById(mergeForm.targetId)?.name }}</p>
            <p class="text-sm text-green-700">{{ getBusinessById(mergeForm.targetId)?.reviewCount }} reviews • {{ getBusinessById(mergeForm.targetId)?.rating }} rating</p>
          </div>
        </div>

        <div v-if="mergeForm.sourceId && mergeForm.targetId" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h5 class="font-medium text-purple-900 mb-2">
            <i class="pi pi-info-circle mr-2"></i>
            Merge Summary
          </h5>
          <ul class="text-sm text-purple-800 space-y-1">
            <li><i class="pi pi-check mr-2"></i>Reviews will be combined: {{ (getBusinessById(mergeForm.sourceId)?.reviewCount || 0) + (getBusinessById(mergeForm.targetId)?.reviewCount || 0) }} total</li>
            <li><i class="pi pi-check mr-2"></i>New average rating: {{ calculateMergedRating().toFixed(1) }}</li>
            <li><i class="pi pi-check mr-2"></i>Total views: {{ (getBusinessById(mergeForm.sourceId)?.views || 0) + (getBusinessById(mergeForm.targetId)?.views || 0) }}</li>
            <li><i class="pi pi-check mr-2"></i>Total followers: {{ (getBusinessById(mergeForm.sourceId)?.followers || 0) + (getBusinessById(mergeForm.targetId)?.followers || 0) }}</li>
            <li><i class="pi pi-exclamation-triangle mr-2"></i><strong>{{ getBusinessById(mergeForm.sourceId)?.name }}</strong> will be permanently deleted</li>
          </ul>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Merge Reason *</label>
          <textarea 
            v-model="mergeForm.reason" 
            rows="3" 
            placeholder="Explain why these businesses are duplicates (e.g., same location, same owner, different names)..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
        </div>
      </div>

      <div class="flex gap-3 justify-end mt-6">
        <button @click="closeMergeModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          Cancel
        </button>
        <button 
          @click="confirmMerge" 
          :disabled="!mergeForm.sourceId || !mergeForm.targetId || !mergeForm.reason.trim() || mergeForm.sourceId === mergeForm.targetId" 
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <i class="pi pi-clone mr-2"></i>
          Merge Businesses
        </button>
      </div>
    </div>
  </div>
</div>

    <!-- Change Owner Modal -->
    <div v-if="showChangeOwnerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900">Change Business Owner</h3>
            <button @click="closeChangeOwnerModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <div class="space-y-2">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
              <p class="text-sm text-blue-800">
                <i class="pi pi-info-circle mr-2"></i>
                Current owner will be notified about the ownership change
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Owner Email *</label>
              <input 
                v-model="ownerChangeForm.newOwnerEmail" 
                type="email" 
                placeholder="Enter new owner's email..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Reason for Change *</label>
              <textarea 
                v-model="ownerChangeForm.reason" 
                rows="3" 
                placeholder="Explain why ownership is being changed..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button @click="closeChangeOwnerModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button @click="confirmChangeOwner" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Change Owner
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Business History Modal -->
    <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Business History</h3>
            <button @click="closeHistoryModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="entry in fullHistory" :key="entry.id" class="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i :class="entry.icon" class="text-blue-600"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h5 class="font-semibold text-gray-900">{{ entry.action }}</h5>
                  <span class="text-xs text-gray-500">{{ entry.date }}</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ entry.details }}</p>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <i class="pi pi-user"></i>
                  <span>{{ entry.user }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Star from '~/components/Stars.vue'
import type { DropdownChangeEvent } from 'primevue/dropdown'
definePageMeta({ layout: 'support' })

interface Business {
  id: string
  name: string
  address: string
  phone: string
  website?: string
  category: string
  status: string
  owner?: string
  ownerEmail?: string
  claimedDate?: string
  rating: number
  reviewCount: number
  views?: number
  followers?: number
  description?: string
  history?: HistoryEntry[]
}

interface HistoryEntry {
  id: string
  action: string
  details: string
  date: string
  user: string
  icon: string
}

// Stats
const stats = ref({
  total: 1247,
  active: 1098,
  closed: 149,
  duplicates: 23
})

// Filters
const filters = ref({
  search: '',
  category: 'all',
  status: 'all',
  ownerStatus: 'all'
})

const categoryOptions = [
  { label: 'All Categories', value: 'all' },
  { label: 'Restaurants', value: 'restaurants' },
  { label: 'Hotels', value: 'hotels' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Health & Wellness', value: 'health' },
  { label: 'Services', value: 'services' }
]

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Closed', value: 'closed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Suspended', value: 'suspended' }
]

const ownerStatusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Has Owner', value: 'has-owner' },
  { label: 'No Owner', value: 'no-owner' }
]

const quickActionOptions = [
  { label: 'View History', value: 'history' },
  { label: 'Mark as Closed', value: 'close' },
  { label: 'Change Owner', value: 'change-owner' },
  { label: 'Remove Owner', value: 'remove-owner' },
  { label: 'Merge Duplicate', value: 'merge' }
]

// Modal states
const showViewModal = ref(false)
const showEditModal = ref(false)
const showMergeModal = ref(false)
const showChangeOwnerModal = ref(false)
const showHistoryModal = ref(false)
const selectedBusiness = ref<Business | null>(null)

// Forms
const editForm = ref({
  name: '',
  category: '',
  status: '',
  address: '',
  phone: '',
  website: '',
  description: '',
  editReason: ''
})

const mergeForm = ref({
  sourceId: '',
  targetId: '',
  reason: ''
})

const ownerChangeForm = ref({
  newOwnerEmail: '',
  reason: ''
})

const fullHistory = ref<HistoryEntry[]>([])

// Sample data
const businesses = ref<Business[]>([
  {
    id: '1',
    name: 'Grand Hotel Plaza',
    address: '123 Main St, Downtown, Lagos',
    phone: '+234 801 234 5678',
    website: 'www.grandhotelplaza.com',
    category: 'hotels',
    status: 'active',
    owner: 'John Doe',
    ownerEmail: 'john@grandhotel.com',
    claimedDate: 'Jan 15, 2024',
    rating: 4.5,
    reviewCount: 234,
    views: 12450,
    followers: 567,
    description: 'Luxury hotel in the heart of Lagos',
    history: [
      { id: '1', action: 'Business Claimed', details: 'Ownership claimed by John Doe', date: 'Jan 15, 2024', user: 'John Doe', icon: 'pi pi-user-plus' },
      { id: '2', action: 'Information Updated', details: 'Phone number and website updated', date: 'Feb 3, 2024', user: 'Admin User', icon: 'pi pi-pencil' },
      { id: '3', action: 'Category Changed', details: 'Changed from "Accommodation" to "Hotels"', date: 'Mar 10, 2024', user: 'Support Team', icon: 'pi pi-tag' }
    ]
  },
  {
    id: '2',
    name: 'Joe\'s Pizza Restaurant',
    address: '456 Food Street, Victoria Island, Lagos',
    phone: '+234 802 345 6789',
    category: 'restaurants',
    status: 'active',
    owner: 'Jane Smith',
    ownerEmail: 'jane@joespizza.com',
    claimedDate: 'Feb 20, 2024',
    rating: 4.2,
    reviewCount: 189,
    views: 8920,
    followers: 432,
    description: 'Authentic Italian pizza and pasta',
    history: [
      { id: '1', action: 'Business Created', details: 'Business listing created', date: 'Dec 5, 2023', user: 'System', icon: 'pi pi-plus-circle' },
      { id: '2', action: 'Business Claimed', details: 'Ownership claimed by Jane Smith', date: 'Feb 20, 2024', user: 'Jane Smith', icon: 'pi pi-user-plus' }
    ]
  },
  {
    id: '3',
    name: 'Tech Repair Center',
    address: '789 Tech Avenue, Ikeja, Lagos',
    phone: '+234 803 456 7890',
    website: 'www.techrepair.ng',
    category: 'services',
    status: 'active',
    rating: 3.8,
    reviewCount: 145,
    views: 5430,
    followers: 234,
    description: 'Professional electronics repair service',
    history: [
      { id: '1', action: 'Business Created', details: 'Business listing created', date: 'Nov 12, 2023', user: 'System', icon: 'pi pi-plus-circle' }
    ]
  },
  {
    id: '4',
    name: 'Beauty Salon & Spa',
    address: '321 Beauty Lane, Lekki, Lagos',
    phone: '+234 804 567 8901',
    category: 'health',
    status: 'closed',
    owner: 'Sarah Johnson',
    ownerEmail: 'sarah@beautyspa.com',
    claimedDate: 'Oct 5, 2023',
    rating: 4.7,
    reviewCount: 312,
    views: 15670,
    followers: 789,
    description: 'Full service beauty salon and spa',
    history: [
      { id: '1', action: 'Business Claimed', details: 'Ownership claimed by Sarah Johnson', date: 'Oct 5, 2023', user: 'Sarah Johnson', icon: 'pi pi-user-plus' },
      { id: '2', action: 'Status Changed', details: 'Marked as closed', date: 'Nov 30, 2024', user: 'Admin User', icon: 'pi pi-times-circle' }
    ]
  },
  {
    id: '5',
    name: 'Downtown Coffee House',
    address: '555 Coffee Road, Yaba, Lagos',
    phone: '+234 805 678 9012',
    category: 'restaurants',
    status: 'active',
    rating: 4.3,
    reviewCount: 98,
    views: 4120,
    followers: 156,
    description: 'Cozy coffee shop with free WiFi',
    history: [
      { id: '1', action: 'Business Created', details: 'Business listing created', date: 'Sep 1, 2024', user: 'System', icon: 'pi pi-plus-circle' }
    ]
  }
])

// Computed
const filteredBusinesses = computed(() => {
  return businesses.value.filter(business => {
    if (filters.value.search && !business.name.toLowerCase().includes(filters.value.search.toLowerCase()) && 
        !business.address.toLowerCase().includes(filters.value.search.toLowerCase())) return false
    if (filters.value.category !== 'all' && business.category !== filters.value.category) return false
    if (filters.value.status !== 'all' && business.status !== filters.value.status) return false
    if (filters.value.ownerStatus === 'has-owner' && !business.owner) return false
    if (filters.value.ownerStatus === 'no-owner' && business.owner) return false
    return true
  })
})

// Methods
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getBusinessById = (id: string) => {
  return businesses.value.find(b => b.id === id)
}

const resetFilters = () => {
  filters.value = {
    search: '',
    category: 'all',
    status: 'all',
    ownerStatus: 'all'
  }
}

const viewBusiness = (business: Business) => {
  selectedBusiness.value = business
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedBusiness.value = null
}

const editBusiness = (business: Business) => {
  selectedBusiness.value = business
  editForm.value = {
    name: business.name,
    category: business.category,
    status: business.status,
    address: business.address,
    phone: business.phone,
    website: business.website || '',
    description: business.description || '',
    editReason: ''
  }
  showEditModal.value = true
  showViewModal.value = false
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedBusiness.value = null
}

const saveBusinessEdit = () => {
  if (!editForm.value.name || !editForm.value.editReason) {
    alert('Please fill in all required fields')
    return
  }

  if (selectedBusiness.value) {
    const business = businesses.value.find(b => b.id === selectedBusiness.value!.id)
    if (business) {
      Object.assign(business, {
        name: editForm.value.name,
        category: editForm.value.category,
        status: editForm.value.status,
        address: editForm.value.address,
        phone: editForm.value.phone,
        website: editForm.value.website,
        description: editForm.value.description
      })

      // Add to history
      if (!business.history) business.history = []
      business.history.unshift({
        id: Date.now().toString(),
        action: 'Information Updated',
        details: editForm.value.editReason,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        user: 'Admin User',
        icon: 'pi pi-pencil'
      })

      alert('Business updated successfully!')
      closeEditModal()
    }
  }
}

const openMergeModal = () => {
  mergeForm.value = { sourceId: '', targetId: '', reason: '' }
  showMergeModal.value = true
  showViewModal.value = false
}

const openMergeDuplicatesModal = () => {
  mergeForm.value = { sourceId: '', targetId: '', reason: '' }
  showMergeModal.value = true
}

const calculateMergedRating = () => {
  const source = getBusinessById(mergeForm.value.sourceId)
  const target = getBusinessById(mergeForm.value.targetId)
  
  if (!source || !target) return 0
  
  const totalReviews = source.reviewCount + target.reviewCount
  const weightedRating = (source.rating * source.reviewCount + target.rating * target.reviewCount) / totalReviews
  
  return Number(weightedRating.toFixed(1))
}

const confirmMerge = () => {
  if (!mergeForm.value.sourceId || !mergeForm.value.targetId || !mergeForm.value.reason.trim()) {
    alert('Please fill in all required fields')
    return
  }

  if (mergeForm.value.sourceId === mergeForm.value.targetId) {
    alert('Source and target businesses must be different')
    return
  }

  const source = getBusinessById(mergeForm.value.sourceId)
  const target = getBusinessById(mergeForm.value.targetId)

  if (!source || !target) {
    alert('Selected businesses not found')
    return
  }

  if (!confirm(`Are you sure you want to merge "${source.name}" into "${target.name}"? This action cannot be undone.`)) {
    return
  }

  // Merge data
  const oldReviewCount = target.reviewCount
  const oldRating = target.rating
  
  target.reviewCount += source.reviewCount
  target.rating = calculateMergedRating()
  target.views = (target.views || 0) + (source.views || 0)
  target.followers = (target.followers || 0) + (source.followers || 0)

  // Add to history
  if (!target.history) target.history = []
  target.history.unshift({
    id: Date.now().toString(),
    action: 'Business Merged',
    details: `Merged with "${source.name}" (${source.reviewCount} reviews, ${source.rating} rating). Reason: ${mergeForm.value.reason}. New stats: ${target.reviewCount} reviews, ${target.rating.toFixed(1)} rating.`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    user: 'Admin User',
    icon: 'pi pi-clone'
  })

  // Remove source business
  const sourceIndex = businesses.value.findIndex(b => b.id === source.id)
  if (sourceIndex > -1) {
    businesses.value.splice(sourceIndex, 1)
  }
  
  stats.value.total--
  if (stats.value.duplicates > 0) {
    stats.value.duplicates--
  }

  alert(`Successfully merged "${source.name}" into "${target.name}"!\n\nNew stats:\n• Reviews: ${oldReviewCount} → ${target.reviewCount}\n• Rating: ${oldRating.toFixed(1)} → ${target.rating.toFixed(1)}\n• Views: ${target.views}\n• Followers: ${target.followers}`)
  
  closeMergeModal()
  
  // If view modal was open, update it with the merged business
  if (showViewModal.value && selectedBusiness.value?.id === source.id) {
    selectedBusiness.value = target
  }
}

const closeMergeModal = () => {
  showMergeModal.value = false
}

const changeOwner = () => {
  ownerChangeForm.value = { newOwnerEmail: '', reason: '' }
  showChangeOwnerModal.value = true
  showViewModal.value = false
}

const closeChangeOwnerModal = () => {
  showChangeOwnerModal.value = false
}

const confirmChangeOwner = () => {
  if (!ownerChangeForm.value.newOwnerEmail || !ownerChangeForm.value.reason) {
    alert('Please fill in all required fields')
    return
  }

  if (selectedBusiness.value) {
    const business = businesses.value.find(b => b.id === selectedBusiness.value!.id)
    if (business) {
      const oldOwner = business.owner
      business.owner = ownerChangeForm.value.newOwnerEmail.split('@')[0]
      business.ownerEmail = ownerChangeForm.value.newOwnerEmail
      business.claimedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

      // Add to history
      if (!business.history) business.history = []
      business.history.unshift({
        id: Date.now().toString(),
        action: 'Owner Changed',
        details: `Ownership transferred from ${oldOwner} to ${business.owner}. Reason: ${ownerChangeForm.value.reason}`,
        date: business.claimedDate,
        user: 'Admin User',
        icon: 'pi pi-user-edit'
      })

      alert('Business owner changed successfully!')
      closeChangeOwnerModal()
      selectedBusiness.value = business
      showViewModal.value = true
    }
  }
}

const removeOwner = () => {
  if (selectedBusiness.value && confirm('Are you sure you want to remove the current owner?')) {
    const business = businesses.value.find(b => b.id === selectedBusiness.value!.id)
    if (business) {
      const oldOwner = business.owner
      business.owner = undefined
      business.ownerEmail = undefined
      business.claimedDate = undefined

      // Add to history
      if (!business.history) business.history = []
      business.history.unshift({
        id: Date.now().toString(),
        action: 'Owner Removed',
        details: `Ownership removed from ${oldOwner}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        user: 'Admin User',
        icon: 'pi pi-user-minus'
      })

      alert('Business owner removed successfully!')
      selectedBusiness.value = business
    }
  }
}

const markAsClosed = () => {
  if (selectedBusiness.value && confirm('Are you sure you want to mark this business as closed?')) {
    const business = businesses.value.find(b => b.id === selectedBusiness.value!.id)
    if (business) {
      business.status = 'closed'
      stats.value.active--
      stats.value.closed++

      // Add to history
      if (!business.history) business.history = []
      business.history.unshift({
        id: Date.now().toString(),
        action: 'Status Changed',
        details: 'Business marked as closed',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        user: 'Admin User',
        icon: 'pi pi-times-circle'
      })

      alert('Business marked as closed!')
      selectedBusiness.value = business
    }
  }
}

const viewFullHistory = () => {
  if (selectedBusiness.value?.history) {
    fullHistory.value = selectedBusiness.value.history
    showHistoryModal.value = true
    showViewModal.value = false
  }
}

const closeHistoryModal = () => {
  showHistoryModal.value = false
  fullHistory.value = []
}

const handleQuickAction = (action: string, business: Business) => {
  selectedBusiness.value = business

  switch (action) {
    case 'history':
      if (business.history && business.history.length > 0) {
        fullHistory.value = business.history
        showHistoryModal.value = true
      } else {
        alert('No history available for this business')
      }
      break
    case 'close':
      markAsClosed()
      break
    case 'change-owner':
      changeOwner()
      break
    case 'remove-owner':
      removeOwner()
      break
    case 'merge':
      openMergeModal()
      break
  }
}
</script>

<style>
</style>
