<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 md:mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Review Moderation</h1>
        <p class="text-gray-600 mt-2">Manage flagged and reported reviews</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Pending Reviews</p>
              <p class="text-2xl md:text-3xl font-bold text-yellow-600 mt-1">{{ stats.pending }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-clock text-2xl text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Approved Today</p>
              <p class="text-2xl md:text-3xl font-bold text-green-600 mt-1">{{ stats.approved }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-check text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Deleted Today</p>
              <p class="text-2xl md:text-3xl font-bold text-red-600 mt-1">{{ stats.deleted }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-trash text-2xl text-red-600"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">High Priority</p>
              <p class="text-2xl md:text-3xl font-bold text-purple-600 mt-1">{{ stats.highPriority }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-exclamation-triangle text-2xl text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <Dropdown 
              v-model="filters.reason" 
              :options="reasonOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All Reasons"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <Dropdown 
              v-model="filters.priority" 
              :options="priorityOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All Priorities"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Business</label>
            <input 
              v-model="filters.business" 
              type="text" 
              placeholder="Search business..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">User</label>
            <input 
              v-model="filters.user" 
              type="text" 
              placeholder="Search user..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 mt-4">
          <button @click="resetFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            <i class="pi pi-refresh mr-1"></i>
            Reset
          </button>
          <button @click="bulkActionMode = !bulkActionMode" class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <i class="pi pi-check-square mr-1 text-xs"></i>
            {{ bulkActionMode ? 'Cancel' : 'Multiple' }}
          </button>
        </div>

        <!-- Bulk Actions Bar -->
        <div v-if="bulkActionMode && selectedReviews.length > 0" class="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span class="text-sm font-medium text-emerald-900">{{ selectedReviews.length }} review(s) selected</span>
            <div class="flex gap-2">
              <button @click="bulkApprove" class="px-2 py-2 bg-green-400 text-white text-sm rounded-lg hover:bg-green-500 transition-colors">
                <i class="pi pi-check mr-1 text-xs"></i>
                Approve All
              </button>
              <button @click="bulkDelete" class="px-2 py-2 bg-red-400 text-white text-sm rounded-lg hover:bg-red-500 transition-colors">
                <i class="pi pi-trash mr-1 text-xs"></i>
                Delete All
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th v-if="bulkActionMode" class="px-4 py-4 text-left">
                  <input 
                    type="checkbox" 
                    @change="toggleSelectAll"
                    :checked="selectedReviews.length === filteredReviews.length"
                    class="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  >
                </th>
                <th class="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Review Details</th>
                <th class="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                <th class="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th class="hidden md:table-cell px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reported By</th>
                <th class="px-4 md:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="review in filteredReviews" :key="review.id" class="hover:bg-gray-50 transition-colors">
                <td v-if="bulkActionMode" class="px-4 py-4">
                  <input 
                    type="checkbox" 
                    :value="review.id"
                    v-model="selectedReviews"
                    class="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  >
                </td>
                <td class="px-4 md:px-6 py-4">
                  <div class="space-y-2">
                    <!-- Business Info -->
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <i class="pi pi-building text-emerald-600"></i>
                        <span class="font-medium text-gray-900">{{ review.businessName }}</span>
                      </div>
                      
                      <!-- 3-Dot Menu -->
                      <div class="relative">
                        <button 
                          @click.stop="toggleActionMenu(review.id)"
                          class="flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <i class="pi pi-ellipsis-v text-gray-600"></i>
                        </button>
                        
                        <!-- Action Menu Dropdown -->
                        <div 
                          v-if="activeActionMenu === review.id"
                          class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                        >
                          <div class="py-1">
                            <button
                              v-for="option in userActionOptions"
                              :key="option.value"
                              @click="handleUserAction(option.value, review)"
                              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                              <i :class="getActionIcon(option.value)" class="text-gray-500"></i>
                              {{ option.label }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Reviewer Info -->
                    <div class="flex items-center gap-2 text-sm">
                      <i class="pi pi-user text-gray-400"></i>
                      <span class="text-gray-600">{{ review.reviewerName }}</span>
                      <span class="text-gray-400">•</span>
                      <div class="flex items-center">
                        <Star
                          v-for="n in 5"
                          :key="n"
                          :value="review.rating- (n - 1)"
                          :color-level="Math.ceil(review.rating)"
                          class="w-5 h-5"
                        />
                        <span class="text-gray-600 text-xs ml-1">{{ review.rating }}</span>
                      </div>
                    </div>

                    <!-- Review Content -->
                    <div class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <p class="line-clamp-2">{{ review.content }}</p>
                      <button @click="viewFullReview(review)" class="text-emerald-600 hover:text-emerald-700 text-xs mt-1">
                        Read more
                      </button>
                    </div>

                    <!-- Mobile-only info -->
                    <div class="flex flex-wrap gap-2 lg:hidden">
                      <span :class="getReasonBadgeClass(review.reason)" class="text-xs px-2 py-1 rounded-full font-medium">
                        {{ review.reason }}
                      </span>
                      <span :class="getPriorityBadgeClass(review.priority)" class="text-xs px-2 py-1 rounded-full font-medium md:hidden">
                        {{ review.priority }}
                      </span>
                    </div>

                    <!-- Date -->
                    <div class="text-xs text-gray-500">
                      <i class="pi pi-calendar mr-1"></i>
                      {{ formatDate(review.flaggedDate) }}
                    </div>
                  </div>
                </td>

                <td class="hidden lg:table-cell px-6 py-4">
                  <span :class="getReasonBadgeClass(review.reason)" class="px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap">
                    {{ review.reason }}
                  </span>
                </td>

                <td class="hidden md:table-cell px-6 py-4">
                  <span :class="getPriorityBadgeClass(review.priority)" class="px-3 py-1 text-xs font-semibold rounded-full">
                    {{ review.priority }}
                  </span>
                </td>

                <td class="hidden xl:table-cell px-6 py-4">
                  <div class="text-sm">
                    <p class="text-gray-900">{{ review.reportedBy }}</p>
                    <p class="text-xs text-gray-500">{{ review.reportCount }} report(s)</p>
                  </div>
                </td>

                <td class="px-4 md:px-6 py-4">
                  <div class="flex flex-col sm:flex-row gap-2">
                    <button @click="viewFullReview(review)" class="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-emerald-600 text-sm rounded-lg hover:bg-green-100 transition-colors whitespace-nowrap">
                      <i class="pi pi-eye text-xs"></i>
                      <span class="hidden sm:inline">View</span>
                    </button>
                    <button @click="approveReview(review.id)" class="flex items-center justify-center gap-1 px-3 py-2 bg-amber-50 text-amber-600 text-sm rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap">
                      <i class="pi pi-check text-xs"></i>
                      <span class="hidden sm:inline">Approve</span>
                    </button>
                    <button @click="openDeleteModal(review.id)" class="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap">
                      <i class="pi pi-trash text-xs"></i>
                      <span class="hidden sm:inline">Delete</span>
                    </button>
                    
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredReviews.length === 0" class="text-center py-12">
          <i class="pi pi-inbox text-5xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">No flagged reviews found</p>
        </div>

        <!-- Pagination -->
        <div v-if="filteredReviews.length > 0" class="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredReviews.length }}</span> of <span class="font-medium">{{ filteredReviews.length }}</span> results
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <i class="pi pi-chevron-left"></i>
            </button>
            <button class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">1</button>
            <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">2</button>
            <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900">Review Details</h3>
            <button @click="closeReviewModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times text-sm"></i>
            </button>
          </div>

          <div v-if="selectedReview" class="space-y-6">
            <!-- Business Info -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">Business Information</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <i class="pi pi-building text-gray-500"></i>
                  <span class="font-medium">{{ selectedReview.businessName }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-map-marker text-gray-500"></i>
                  <span class="text-gray-600">{{ selectedReview.businessLocation }}</span>
                </div>
              </div>
            </div>

            <!-- Reviewer Info -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">Reviewer Information</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <i class="pi pi-user text-gray-500"></i>
                  <span class="font-medium">{{ selectedReview.reviewerName }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-envelope text-gray-500"></i>
                  <span class="text-gray-600">{{ selectedReview.reviewerEmail }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-gray-500"></i>
                  <span class="text-gray-600">Member since {{ selectedReview.reviewerJoinDate }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-comment text-gray-500"></i>
                  <span class="text-gray-600">{{ selectedReview.reviewerTotalReviews }} total reviews</span>
                </div>
              </div>
            </div>

            <!-- Review Content -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Review Content</h4>
              <div class="flex items-center gap-2 mb-3">
                <div class="flex">
                  <Star
                    v-for="n in 5"
                    :key="n"
                    :value="selectedReview.rating - (n - 1)"
                    :color-level="Math.ceil(selectedReview.rating)"
                    class="w-6 h-6"
                  /> 
                </div>
                <span class="text-sm text-gray-600">{{ selectedReview.rating }}</span>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-700 whitespace-pre-wrap">{{ selectedReview.content }}</p>
              </div>
              <p class="text-xs text-gray-500 mt-2">Posted on {{ formatDate(selectedReview.postedDate) }}</p>
            </div>

            <!-- Flag Information -->
            <div class="bg-slate-50 border border-red-200 rounded-lg p-4">
              <h4 class="font-semibold text-red-600 mb-2">Flag Information</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-red-400">Reason:</span>
                  <span :class="getReasonBadgeClass(selectedReview.reason)" class="px-3 py-1 text-xs font-semibold rounded-full">
                    {{ selectedReview.reason }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-red-400">Priority:</span>
                  <span :class="getPriorityBadgeClass(selectedReview.priority)" class="px-3 py-1 text-xs font-semibold rounded-full">
                    {{ selectedReview.priority }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-red-400">Reported by:</span>
                  <span class="text-red-600 font-medium">{{ selectedReview.reportedBy }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-red-400">Total reports:</span>
                  <span class="text-red-600 font-medium">{{ selectedReview.reportCount }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-red-400">Flagged on:</span>
                  <span class="text-red-600 font-medium">{{ formatDate(selectedReview.flaggedDate) }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <button @click="approveReview(selectedReview.id)" class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors">
                <i class="pi pi-check"></i>
                Approve Review
              </button>
              <button @click="openDeleteModal(selectedReview.id)" class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors">
                <i class="pi pi-trash"></i>
                Delete Review
              </button>
              <button @click="openUserActionModal(selectedReview)" class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors">
                <i class="pi pi-exclamation-triangle"></i>
                User Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900">Delete Review</h3>
            <button @click="closeDeleteModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Deletion</label>
            <Dropdown 
              v-model="deleteReason" 
              :options="deleteReasonOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select reason"
              class="w-full mb-3"
            />
            <textarea 
              v-model="deleteNote" 
              rows="3" 
              placeholder="Additional notes (optional)..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-red-400">
              <i class="pi pi-exclamation-triangle mr-2"></i>
              This action cannot be undone. The review will be permanently deleted.
            </p>
          </div>

          <div class="flex gap-3 justify-end">
            <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button @click="confirmDelete" class="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors">
              Delete Review
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Action Modal -->
    <div v-if="showUserActionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900">User Action</h3>
            <button @click="closeUserActionModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
            <Dropdown 
              v-model="userAction.type" 
              :options="userActionTypeOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select action"
              class="w-full mb-3"
            />

            <label v-if="userAction.type === 'suspend'" class="block text-sm font-medium text-gray-700 mb-2">Suspension Duration</label>
            <Dropdown 
              v-if="userAction.type === 'suspend'"
              v-model="userAction.duration" 
              :options="suspensionDurationOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select duration"
              class="w-full mb-3"
            />

            <label class="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea 
              v-model="userAction.reason" 
              rows="3" 
              placeholder="Explain the reason for this action..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-orange-400">
              <i class="pi pi-info-circle mr-2"></i>
              The user will be notified via email about this action.
            </p>
          </div>

          <div class="flex gap-2 justify-end">
            <button @click="closeUserActionModal" class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button @click="confirmUserAction" class="px-3 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted} from 'vue'
import Star from '~/components/Stars.vue'
definePageMeta({ layout: 'support' })

interface Review {
  id: string
  businessName: string
  businessLocation: string
  reviewerName: string
  reviewerEmail: string
  reviewerJoinDate: string
  reviewerTotalReviews: number
  content: string
  rating: number
  postedDate: string
  flaggedDate: string
  reason: string
  priority: string
  reportedBy: string
  reportCount: number
  status: string
}

// Stats
const stats = ref({
  pending: 23,
  approved: 18,
  deleted: 5,
  highPriority: 7
})
const activeActionMenu = ref<string | null>(null)

// Filters
const filters = ref({
  status: 'pending',
  reason: 'all',
  priority: 'all',
  business: '',
  user: ''
})

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Deleted', value: 'deleted' }
]

const reasonOptions = [
  { label: 'All', value: 'all' },
  { label: 'Spam', value: 'spam' },
  { label: 'Inappropriate Content', value: 'inappropriate' },
  { label: 'Fake Review', value: 'fake' },
  { label: 'Offensive Language', value: 'offensive' },
  { label: 'Personal Information', value: 'personal-info' },
  { label: 'Harassment', value: 'harassment' }
]

const priorityOptions = [
  { label: 'All', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' }
]

const userActionOptions = [
  { label: 'View User Profile', value: 'view-profile' },
  { label: 'Warn User', value: 'warn' },
  { label: 'Suspend User', value: 'suspend' },
  { label: 'Ban User', value: 'ban' }
]

const deleteReasonOptions = [
  { label: 'Violates Community Guidelines', value: 'guidelines' },
  { label: 'Spam/Advertisement', value: 'spam' },
  { label: 'Fake/Fraudulent Review', value: 'fake' },
  { label: 'Offensive/Inappropriate', value: 'offensive' },
  { label: 'Contains Personal Information', value: 'personal' },
  { label: 'Other', value: 'other' }
]

const userActionTypeOptions = [
  { label: 'Send Warning', value: 'warn' },
  { label: 'Suspend Account', value: 'suspend' },
  { label: 'Ban Account', value: 'ban' }
]

const suspensionDurationOptions = [
  { label: '24 Hours', value: '24h' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: 'Permanent', value: 'permanent' }
]

// Modal states
const showReviewModal = ref(false)
const showDeleteModal = ref(false)
const showUserActionModal = ref(false)
const selectedReview = ref<Review | null>(null)
const selectedReviewId = ref<string | null>(null)

// Form states
const deleteReason = ref('')
const deleteNote = ref('')
const userAction = ref({
  type: '',
  duration: '',
  reason: ''
})

// Bulk actions
const bulkActionMode = ref(false)
const selectedReviews = ref<string[]>([])

// Sample data
const reviews = ref<Review[]>([
  {
    id: '1',
    businessName: 'Grand Hotel Plaza',
    businessLocation: 'Downtown, Lagos',
    reviewerName: 'John Smith',
    reviewerEmail: 'john.smith@email.com',
    reviewerJoinDate: 'Jan 2023',
    reviewerTotalReviews: 12,
    content: 'This place is absolutely terrible! The worst experience of my life. Don\'t waste your money here. Complete scam and fraud!',
    rating: 1.6,
    postedDate: '2024-12-10',
    flaggedDate: '2024-12-11',
    reason: 'spam',
    priority: 'high',
    reportedBy: 'Business Owner',
    reportCount: 3,
    status: 'pending'
  },
  {
    id: '2',
    businessName: 'Joe\'s Pizza Restaurant',
    businessLocation: 'Victoria Island, Lagos',
    reviewerName: 'Sarah Johnson',
    reviewerEmail: 'sarah.j@email.com',
    reviewerJoinDate: 'Mar 2024',
    reviewerTotalReviews: 5,
    content: 'The staff were extremely rude and unprofessional. I witnessed them using offensive language towards customers.',
    rating: 2.3,
    postedDate: '2024-12-09',
    flaggedDate: '2024-12-10',
    reason: 'offensive',
    priority: 'medium',
    reportedBy: 'Other User',
    reportCount: 2,
    status: 'pending'
  },
  {
    id: '3',
    businessName: 'Tech Repair Center',
    businessLocation: 'Ikeja, Lagos',
    reviewerName: 'Mike Davis',
    reviewerEmail: 'mike.davis@email.com',
    reviewerJoinDate: 'Aug 2023',
    reviewerTotalReviews: 8,
    content: 'Contact me at 555-1234 or email mike@spam.com for better deals on phone repairs! We beat any price!',
    rating: 4.2,
    postedDate: '2024-12-08',
    flaggedDate: '2024-12-09',
    reason: 'personal-info',
    priority: 'critical',
    reportedBy: 'System',
    reportCount: 1,
    status: 'pending'
  },
  {
    id: '4',
    businessName: 'Beauty Salon & Spa',
    businessLocation: 'Lekki, Lagos',
    reviewerName: 'Emily Chen',
    reviewerEmail: 'emily.chen@email.com',
    reviewerJoinDate: 'Nov 2024',
    reviewerTotalReviews: 1,
    content: 'Amazing service! Best salon ever! 5 stars! Highly recommend to everyone! Perfect in every way!',
    rating: 5,
    postedDate: '2024-12-07',
    flaggedDate: '2024-12-08',
    reason: 'fake',
    priority: 'low',
    reportedBy: 'Competitor',
    reportCount: 1,
    status: 'pending'
  }
])

// Computed
const filteredReviews = computed(() => {
  return reviews.value.filter(review => {
    if (filters.value.status !== 'all' && review.status !== filters.value.status) return false
    if (filters.value.reason !== 'all' && review.reason !== filters.value.reason) return false
    if (filters.value.priority !== 'all' && review.priority !== filters.value.priority) return false
    if (filters.value.business && !review.businessName.toLowerCase().includes(filters.value.business.toLowerCase())) return false
    if (filters.value.user && !review.reviewerName.toLowerCase().includes(filters.value.user.toLowerCase())) return false
    return true
  })
})

// Methods
const getReasonBadgeClass = (reason: string) => {
  const classes: Record<string, string> = {
    spam: 'bg-red-100 text-red-800',
    inappropriate: 'bg-orange-100 text-orange-800',
    fake: 'bg-purple-100 text-purple-800',
    offensive: 'bg-pink-100 text-pink-800',
    'personal-info': 'bg-blue-100 text-blue-800',
    harassment: 'bg-red-100 text-red-800'
  }
  return classes[reason] || 'bg-gray-100 text-gray-800'
}

const getPriorityBadgeClass = (priority: string) => {
  const classes: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const applyFilters = () => {
  console.log('Filters applied:', filters.value)
}

const resetFilters = () => {
  filters.value = {
    status: 'pending',
    reason: 'all',
    priority: 'all',
    business: '',
    user: ''
  }
}

const viewFullReview = (review: Review) => {
  selectedReview.value = review
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  selectedReview.value = null
}

const approveReview = (reviewId: string) => {
  const review = reviews.value.find(r => r.id === reviewId)
  if (review) {
    review.status = 'approved'
    stats.value.pending--
    stats.value.approved++
    alert(`Review for ${review.businessName} has been approved!`)
    closeReviewModal()
  }
}

const openDeleteModal = (reviewId: string) => {
  selectedReviewId.value = reviewId
  deleteReason.value = ''
  deleteNote.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedReviewId.value = null
}

const confirmDelete = () => {
  if (!deleteReason.value) {
    alert('Please select a reason for deletion')
    return
  }

  const review = reviews.value.find(r => r.id === selectedReviewId.value)
  if (review) {
    review.status = 'deleted'
    stats.value.pending--
    stats.value.deleted++
    alert(`Review has been deleted successfully!`)
    closeDeleteModal()
    closeReviewModal()
  }
}

const openUserActionModal = (review: Review) => {
  selectedReview.value = review
  userAction.value = {
    type: '',
    duration: '',
    reason: ''
  }
  showUserActionModal.value = true
}

const closeUserActionModal = () => {
  showUserActionModal.value = false
}

const confirmUserAction = () => {
  if (!userAction.value.type || !userAction.value.reason) {
    alert('Please fill in all required fields')
    return
  }

  if (userAction.value.type === 'suspend' && !userAction.value.duration) {
    alert('Please select suspension duration')
    return
  }

  alert(`User action "${userAction.value.type}" has been applied to ${selectedReview.value?.reviewerName}`)
  closeUserActionModal()
  closeReviewModal()
}
const toggleActionMenu = (reviewId: string) => {
  if (activeActionMenu.value === reviewId) {
    activeActionMenu.value = null
  } else {
    activeActionMenu.value = reviewId
  }
}

const getActionIcon = (action: string) => {
  const icons: Record<string, string> = {
    'view-profile': 'pi pi-user',
    'warn': 'pi pi-exclamation-triangle',
    'suspend': 'pi pi-ban',
    'ban': 'pi pi-times-circle'
  }
  return icons[action] || 'pi pi-circle'
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    activeActionMenu.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleUserAction = (action: string, review: Review) => {
  selectedReview.value = review
  activeActionMenu.value = null // Add this line
  
  if (action === 'view-profile') {
    alert(`Opening profile for ${review.reviewerName}`)
  } else {
    userAction.value.type = action
    openUserActionModal(review)
  }
}

const toggleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selectedReviews.value = filteredReviews.value.map(r => r.id)
  } else {
    selectedReviews.value = []
  }
}

const bulkApprove = () => {
  if (confirm(`Approve ${selectedReviews.value.length} review(s)?`)) {
    selectedReviews.value.forEach(id => {
      const review = reviews.value.find(r => r.id === id)
      if (review) review.status = 'approved'
    })
    stats.value.pending -= selectedReviews.value.length
    stats.value.approved += selectedReviews.value.length
    selectedReviews.value = []
    alert('Reviews approved successfully!')
  }
}

const bulkDelete = () => {
  if (confirm(`Delete ${selectedReviews.value.length} review(s)? This cannot be undone.`)) {
    selectedReviews.value.forEach(id => {
      const review = reviews.value.find(r => r.id === id)
      if (review) review.status = 'deleted'
    })
    stats.value.pending -= selectedReviews.value.length
    stats.value.deleted += selectedReviews.value.length
    selectedReviews.value = []
    alert('Reviews deleted successfully!')
  }
}
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>