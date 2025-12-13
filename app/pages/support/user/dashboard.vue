<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- System Stats -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-2">
            <i :class="stat.icon" class="text-2xl" :style="{ color: stat.color }"></i>
          </div>
          <div class="text-2xl font-bold text-slate-800 mb-1">
            {{ stat.value }}
          </div>
          <div class="text-sm text-slate-600">{{ stat.label }}</div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Left Column: Pending Claims -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <i class="pi pi-inbox text-[#008253]"></i>
                Pending Claim Requests
              </h2>
              <button
                @click="viewAllClaims"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-[#008259] transition-colors text-sm font-medium flex items-center gap-2"
              >
                View All
                <i class="pi pi-arrow-right text-xs"></i>
              </button>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-200">
                    <th class="text-left py-3 px-2 text-sm font-semibold text-slate-700">
                      Business Name
                    </th>
                    <th class="text-left py-3 px-2 text-sm font-semibold text-slate-700 hidden md:table-cell">
                      Requester
                    </th>
                    <th class="text-left py-3 px-2 text-sm font-semibold text-slate-700 hidden sm:table-cell">
                      Date
                    </th>
                    <th class="text-left py-3 px-2 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="claim in pendingClaims"
                    :key="claim.id"
                    class="border-b border-slate-100 hover:bg-green-50 transition-colors"
                  >
                    <td class="py-4 px-2">
                      <div class="font-medium text-slate-800">{{ claim.businessName }}</div>
                    </td>
                    <td class="py-4 px-2 hidden md:table-cell">
                      <div class="text-slate-600 text-sm">{{ claim.requester }}</div>
                    </td>
                    <td class="py-4 px-2 text-slate-600 text-sm hidden sm:table-cell">
                      {{ claim.date }}
                    </td>
                    <td class="py-4 px-2">
                      <span
                        class="px-3 py-1 rounded-full text-xs font-medium"
                        :class="getStatusClass(claim.status)"
                      >
                        {{ claim.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="pendingClaims.length === 0" class="text-center py-12">
              <i class="pi pi-inbox text-4xl text-slate-300 mb-3"></i>
              <p class="text-slate-500">No pending claims at the moment</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Forms -->
        <div class="space-y-6">
          <!-- Add New Category Form -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 class="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <i class="pi pi-folder text-emerald-600"></i>
              Add New Category
            </h2>
            <form @submit.prevent="saveCategory" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Category Name
                </label>
                <input
                  v-model="categoryForm.name"
                  type="text"
                  placeholder="e.g., Restaurants"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  v-model="categoryForm.description"
                  placeholder="Brief description of the category"
                  rows="3"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                class="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <i class="pi pi-save"></i>
                Save Category
              </button>
            </form>
          </div>

          <!-- Add New Tag Form -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 class="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <i class="pi pi-tag text-emerald-600"></i>
              Add New Tag
            </h2>
            <form @submit.prevent="saveTag" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Tag Name
                </label>
                <input
                  v-model="tagForm.name"
                  type="text"
                  placeholder="e.g., Family Friendly"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008253] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Select Category
                </label>
                <Dropdown
                  v-model="tagForm.category"
                  :options="categoryOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Choose a category"
                  class="w-full"
                />
              </div>
              <button
                type="submit"
                class="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <i class="pi pi-save"></i>
                Save Tag
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Success Toast -->
      <Transition name="slide-up">
        <div
          v-if="showToast"
          class="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
        >
          <i class="pi pi-check-circle text-xl"></i>
          <span class="font-medium">{{ toastMessage }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Claim {
  id: number
  businessName: string
  requester: string
  date: string
  status: string
}

interface Stat {
  label: string
  value: number
  icon: string
  color: string
}

interface CategoryForm {
  name: string
  description: string
}

interface TagForm {
  name: string
  category: string
}

interface CategoryOption {
  label: string
  value: string
}

definePageMeta({ layout: 'support' })

// Stats data
const stats = ref<Stat[]>([
  {
    label: 'Pending Claims',
    value: 12,
    icon: 'pi pi-inbox',
    color: '#3b82f6'
  },
  {
    label: 'Total Businesses',
    value: 348,
    icon: 'pi pi-building',
    color: '#8b5cf6'
  },
  {
    label: 'Categories',
    value: 24,
    icon: 'pi pi-folder',
    color: '#10b981'
  },
  {
    label: 'Tags',
    value: 156,
    icon: 'pi pi-tags',
    color: '#f59e0b'
  },
  {
    label: 'Flagged Reviews',
    value: 97,
    icon: 'pi pi-flag',
    color: '#ef4444'
  }
])

// Pending claims data
const pendingClaims = ref<Claim[]>([
  {
    id: 1,
    businessName: 'Blue Ocean Restaurant',
    requester: 'John Emeka',
    date: '2024-12-10',
    status: 'Pending'
  },
  {
    id: 2,
    businessName: 'Tech Solutions Inc',
    requester: 'Sarah Johnson',
    date: '2024-12-09',
    status: 'Under Review'
  },
  {
    id: 3,
    businessName: 'Green Valley Spa',
    requester: 'Mike Udoma',
    date: '2024-12-08',
    status: 'Pending'
  },
  {
    id: 4,
    businessName: 'Urban Coffee House',
    requester: 'Ayobami David',
    date: '2024-12-07',
    status: 'Pending'
  }
])

// Categories for dropdown
const categories = ref<string[]>([
  'Restaurants',
  'Technology',
  'Healthcare',
  'Education',
  'Retail',
  'Services'
])

// Computed property to format categories for PrimeVue Dropdown
const categoryOptions = computed<CategoryOption[]>(() => {
  return categories.value.map(cat => ({
    label: cat,
    value: cat
  }))
})

// Forms
const categoryForm = ref<CategoryForm>({
  name: '',
  description: ''
})

const tagForm = ref<TagForm>({
  name: '',
  category: ''
})

// Toast
const showToast = ref(false)
const toastMessage = ref('')

// Methods
const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    'Pending': 'bg-amber-100 text-amber-700',
    'Under Review': 'bg-blue-100 text-blue-700',
    'Approved': 'bg-emerald-100 text-emerald-700',
    'Rejected': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-slate-100 text-slate-700'
}

const viewAllClaims = (): void => {
  console.log('Navigate to Claim Management Page')
  // Add your navigation logic here
}

const saveCategory = (): void => {
  console.log('Saving category:', categoryForm.value)
  
  // Add the new category to the list
  categories.value.push(categoryForm.value.name)
  
  // Show success toast
  toastMessage.value = 'Category saved successfully!'
  showToast.value = true
  
  // Reset form
  categoryForm.value = { name: '', description: '' }
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const saveTag = (): void => {
  if (!tagForm.value.category) {
    alert('Please select a category')
    return
  }
  
  console.log('Saving tag:', tagForm.value)
  
  // Show success toast
  toastMessage.value = 'Tag saved successfully!'
  showToast.value = true
  
  // Reset form
  tagForm.value = { name: '', category: '' }
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
/* Toast animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
</style>