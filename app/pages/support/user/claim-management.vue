<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Claim Management</h1>
        <p class="text-gray-600 mt-2">Review and manage business ownership claims</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input 
              v-model="filters.businessName" 
              type="text" 
              placeholder="Search business..." 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">User</label>
            <input 
              v-model="filters.user" 
              type="text" 
              placeholder="Search user..." 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By Date</label>
            <Dropdown 
              v-model="filters.dateSort" 
              :options="dateSortOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select order"
              class="w-full"
            />
          </div>
        </div>
        
        <div class="mt-3 flex gap-2">
          <button @click="resetFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Reset
          </button>
        </div>
      </div>

      <!-- Claims Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Business Name</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Claimant</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Submitted</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Documents</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="claim in filteredClaims" :key="claim.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900">{{ claim.businessName }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ claim.userName }}</div>
                  <div class="text-xs text-gray-500">{{ claim.userEmail }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ formatDate(claim.dateSubmitted) }}
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(claim.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                    {{ claim.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button @click="viewDocument(claim.idProof)" class="flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">
                      <i class="pi pi-id-card"></i>
                      img
                    </button>
                    <button @click="viewDocument(claim.businessProof)" class="flex items-center gap-1 px-3 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">
                      <i class="pi pi-file"></i>
                      pdf
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="claim.status === 'pending'" class="flex gap-2">
                    <button @click="approveClaim(claim.id)" class="flex items-center gap-1 px-3 py-2 bg-emerald-400 text-white text-sm rounded-lg hover:bg-emerald-500 transition-colors">
                      <i class="pi pi-check text-xs"></i>
                      Approve
                    </button>
                    <button @click="openRejectModal(claim.id)" class="flex items-center gap-1 px-3 py-2 bg-red-400 text-white text-sm rounded-lg hover:bg-red-500 transition-colors">
                      <i class="pi pi-times text-xs"></i>
                      Reject
                    </button>
                  </div>
                  <button v-else @click="viewHistory(claim.id)" class="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                    <i class="pi pi-history"></i>
                    View History
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredClaims.length === 0" class="text-center py-12">
          <i class="pi pi-inbox text-5xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">No claims found</p>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Reject Claim</h3>
            <button @click="closeRejectModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
            <textarea 
              v-model="rejectReason" 
              rows="4" 
              placeholder="Please provide a reason for rejection..." 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            ></textarea>
          </div>
          
          <div class="flex gap-3 justify-end">
            <button @click="closeRejectModal" class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button @click="confirmReject" class="px-3 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900">Action History</h3>
            <button @click="closeHistoryModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="action in selectedHistory" :key="action.id" class="border-l-4 pl-4 py-2" :class="action.type === 'approved' ? 'border-green-500' : 'border-red-500'">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-gray-900">{{ action.type === 'approved' ? 'Approved' : 'Rejected' }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(action.timestamp) }}</span>
              </div>
              <div class="text-sm text-gray-600">By: {{ action.adminName }}</div>
              <div v-if="action.reason" class="text-sm text-gray-500 mt-1">Reason: {{ action.reason }}</div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="closeHistoryModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Claim {
  id: string
  businessName: string
  userName: string
  userEmail: string
  dateSubmitted: string
  status: 'pending' | 'approved' | 'rejected'
  idProof: string
  businessProof: string
}

interface ActionHistory {
  id: string
  type: 'approved' | 'rejected'
  adminName: string
  timestamp: string
  reason?: string
}

// Filters
const filters = ref({
  status: 'all',
  businessName: '',
  user: '',
  dateSort: 'latest'
})

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' }
]

const dateSortOptions = [
  { label: 'Latest First', value: 'latest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Most Recent', value: 'recent' }
]

// Modal states
const showRejectModal = ref(false)
const showHistoryModal = ref(false)
const selectedClaimId = ref<string | null>(null)
const rejectReason = ref('')
const selectedHistory = ref<ActionHistory[]>([])

definePageMeta({ layout: 'support' })

// Sample data
const claims = ref<Claim[]>([
  {
    id: '1',
    businessName: 'Joe\'s Pizza',
    userName: 'Jimmy Joe',
    userEmail: 'joe@example.com',
    dateSubmitted: '2025-12-10',
    status: 'pending',
    idProof: 'id_proof_1.pdf',
    businessProof: 'business_license_1.pdf'
  },
  {
    id: '2',
    businessName: 'Tech Repair Shop',
    userName: 'Jane Musa',
    userEmail: 'jane@example.com',
    dateSubmitted: '2025-12-09',
    status: 'approved',
    idProof: 'id_proof_2.pdf',
    businessProof: 'business_license_2.pdf'
  },
  {
    id: '3',
    businessName: 'Beauty Salon & Spa',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    dateSubmitted: '2025-12-08',
    status: 'rejected',
    idProof: 'id_proof_3.pdf',
    businessProof: 'business_license_3.pdf'
  },
  {
    id: '4',
    businessName: 'Downtown Coffee House',
    userName: 'Sarah Adams',
    userEmail: 'sarah@example.com',
    dateSubmitted: '2025-12-11',
    status: 'pending',
    idProof: 'id_proof_4.pdf',
    businessProof: 'business_license_4.pdf'
  }
])

const filteredClaims = computed(() => {
  let filtered = claims.value.filter(claim => {
    if (filters.value.status !== 'all' && claim.status !== filters.value.status) return false
    if (filters.value.businessName && !claim.businessName.toLowerCase().includes(filters.value.businessName.toLowerCase())) return false
    if (filters.value.user && !claim.userName.toLowerCase().includes(filters.value.user.toLowerCase())) return false
    return true
  })
  
  // Sort by date
  if (filters.value.dateSort === 'latest' || filters.value.dateSort === 'recent') {
    filtered.sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime())
  } else if (filters.value.dateSort === 'oldest') {
    filtered.sort((a, b) => new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime())
  }
  
  return filtered
})

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const resetFilters = () => {
  filters.value = {
    status: 'all',
    businessName: '',
    user: '',
    dateSort: 'latest'
  }
}

const viewDocument = (docUrl: string) => {
  alert(`Opening document: ${docUrl}`)
  // In production, open document viewer or download
}

const approveClaim = (claimId: string) => {
  const claim = claims.value.find(c => c.id === claimId)
  if (claim) {
    claim.status = 'approved'
    alert(`Claim for ${claim.businessName} has been approved!`)
  }
}

const openRejectModal = (claimId: string) => {
  selectedClaimId.value = claimId
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedClaimId.value = null
  rejectReason.value = ''
}

const confirmReject = () => {
  if (!rejectReason.value.trim()) {
    alert('Please provide a reason for rejection')
    return
  }
  
  const claim = claims.value.find(c => c.id === selectedClaimId.value)
  if (claim) {
    claim.status = 'rejected'
    alert(`Claim for ${claim.businessName} has been rejected.`)
  }
  
  closeRejectModal()
}

const viewHistory = (claimId: string) => {
  // Sample history data
  selectedHistory.value = [
    {
      id: '1',
      type: 'approved',
      adminName: 'Admin User',
      timestamp: '2024-12-09T14:30:00',
      reason: ''
    }
  ]
  showHistoryModal.value = true
}

const closeHistoryModal = () => {
  showHistoryModal.value = false
  selectedHistory.value = []
}
</script>

<style>
</style>