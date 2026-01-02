<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Category & Tag Management</h1>
        <p class="text-gray-600 mt-2">Organize your taxonomies</p>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex">
            <button
              @click="activeTab = 'categories'"
              :class="activeTab === 'categories' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="px-6 py-4 border-b-2 font-medium text-sm transition-colors"
            >
              <i class="pi pi-th-large mr-2"></i>
              Categories
            </button>
            <button
              @click="activeTab = 'tags'"
              :class="activeTab === 'tags' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="px-6 py-4 border-b-2 font-medium text-sm transition-colors"
            >
              <i class="pi pi-tags mr-2"></i>
              Tags
            </button>
          </nav>
        </div>
      </div>

      <!-- Categories Tab -->
      <div v-if="activeTab === 'categories'" class="space-y-6">
        <!-- Category Actions Bar -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex flex-col gap-4">
            <div class="flex-1">
              <input
                v-model="categorySearch"
                type="text"
                placeholder="Search categories..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
            </div>
            <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button @click="openMergeCategoriesModal" class="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap">
                <i class="pi pi-clone text-sm"></i>
                <span class="text-sm">Merge</span>
              </button>
              <button @click="openCategoryModal()" class="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap">
                <i class="pi pi-plus text-sm"></i>
                <span class="text-sm">Add Category</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-2 ">
                <div :style="{ backgroundColor: category.color }" class="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg">
                  <component :is="category.icon" :size="20" />
                </div>
                <div>
                  <h5 class="font-semibold text-slate-900">{{ category.name }}</h5>
                </div>
              </div>
              <div class="flex gap-1">
                <button @click="openCategoryModal(category)" class="p-1 text-emerald-600 hover:bg-blue-50 rounded transition-colors">
                  <i class="pi pi-pencil"></i>
                </button>
                <button @click="deleteCategory(category.id)" class="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-4">{{ category.description }}</p>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">{{ category.businessCount }} businesses</span>
              <span class="text-gray-500">{{ category.tagCount }} tags</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredCategories.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <i class="pi pi-inbox text-5xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">No categories found</p>
        </div>
      </div>

      <!-- Tags Tab -->
      <div v-if="activeTab === 'tags'" class="space-y-6">
        <!-- Tag Actions Bar -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <input
                v-model="tagSearch"
                type="text"
                placeholder="Search tags..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
              <Dropdown 
                v-model="tagCategoryFilter" 
                :options="categoryFilterOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="All Categories"
                class="w-full sm:w-48"
              />
            </div>
            <button @click="openTagModal()" class="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <i class="pi pi-plus text-sm"></i>
              <span>Add New Tag</span>
            </button>
          </div>
        </div>

        <!-- Tags Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tag Name</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slug</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usage Count</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="tag in filteredTags" :key="tag.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :style="{ backgroundColor: tag.color + '20', color: tag.color }">
                      {{ tag.name }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ tag.slug }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-2 text-sm">
                      <component :is="getCategoryById(tag.categoryId)?.icon" :size="16" :style="{ color: getCategoryById(tag.categoryId)?.color }" />
                      {{ getCategoryById(tag.categoryId)?.name }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ tag.usageCount }}</td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <button @click="openTagModal(tag)" class="p-2 text-emerald-600 hover:bg-blue-50 rounded transition-colors">
                        <i class="pi pi-pencil"></i>
                      </button>
                      <button @click="deleteTag(tag.id)" class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <i class="pi pi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredTags.length === 0" class="text-center py-12">
            <i class="pi pi-inbox text-5xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 text-lg">No tags found</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">{{ editingCategory ? 'Edit Category' : 'Add Category' }}</h3>
            <button @click="closeCategoryModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
              <input v-model="categoryForm.name" type="text" placeholder="e.g., Restaurants" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input v-model="categoryForm.slug" type="text" placeholder="e.g., restaurants" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea v-model="categoryForm.description" rows="3" placeholder="Brief description..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <Dropdown 
                  v-model="categoryForm.iconName" 
                  :options="iconOptions" 
                  optionLabel="label" 
                  optionValue="value"
                  placeholder="Select Icon"
                  class="w-full"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input v-model="categoryForm.color" type="color" class="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
              </div>
            </div>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button @click="closeCategoryModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button @click="saveCategory" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              {{ editingCategory ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tag Modal -->
    <div v-if="showTagModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">{{ editingTag ? 'Edit Tag' : 'Add Tag' }}</h3>
            <button @click="closeTagModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tag Name</label>
              <input v-model="tagForm.name" type="text" placeholder="e.g., Vegan Friendly" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input v-model="tagForm.slug" type="text" placeholder="e.g., vegan-friendly" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Dropdown 
                v-model="tagForm.categoryId" 
                :options="categoryDropdownOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Select Category"
                class="w-full"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input v-model="tagForm.color" type="color" class="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
            </div>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button @click="closeTagModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button @click="saveTag" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              {{ editingTag ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Merge Categories Modal -->
    <div v-if="showMergeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Merge Categories</h3>
            <button @click="closeMergeModal" class="text-gray-400 hover:text-gray-600">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Source Category (will be deleted)</label>
              <Dropdown 
                v-model="mergeForm.sourceId" 
                :options="categoryDropdownOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Select Source"
                class="w-full"
              />
            </div>

            <div class="flex items-center justify-center text-gray-400">
              <i class="pi pi-arrow-down text-2xl"></i>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Target Category (will keep all data)</label>
              <Dropdown 
                v-model="mergeForm.targetId" 
                :options="categoryDropdownOptions.filter(cat => cat.value !== mergeForm.sourceId)" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Select Target"
                class="w-full"
              />
            </div>

            <div v-if="mergeForm.sourceId && mergeForm.targetId" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-sm text-yellow-800">
                <i class="pi pi-exclamation-triangle mr-2"></i>
                This will move all businesses and tags from <strong>{{ getCategoryById(mergeForm.sourceId)?.name }}</strong> to <strong>{{ getCategoryById(mergeForm.targetId)?.name }}</strong> and delete the source category.
              </p>
            </div>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button @click="closeMergeModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button @click="mergeCategories" :disabled="!mergeForm.sourceId || !mergeForm.targetId" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
              Merge Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from '#imports'
import {
  Utensils,
  ShoppingCart,
  Sparkles,
  HeartPlus,
  Home,
  LaptopMinimal,
  Hotel,
  GraduationCap,
  CarFront,
  BriefcaseBusiness,
  BookOpen,
  Camera,
  Clapperboard,
} from 'lucide-vue-next'

// Icon mapping
const iconMap: Record<string, any> = {
  Utensils,
  ShoppingCart,
  Sparkles,
  HeartPlus,
  Home,
  LaptopMinimal,
  Hotel,
  GraduationCap,
  CarFront,
  BriefcaseBusiness,
  BookOpen,
  Camera,
  Clapperboard,
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: any
  iconName: string
  color: string
  businessCount: number
  tagCount: number
}

interface Tag {
  id: string
  name: string
  slug: string
  categoryId: string
  color: string
  usageCount: number
}

// State
const activeTab = ref<'categories' | 'tags'>('categories')
const categorySearch = ref('')
const tagSearch = ref('')
const tagCategoryFilter = ref('all')

// Modal states
const showCategoryModal = ref(false)
const showTagModal = ref(false)
const showMergeModal = ref(false)
const editingCategory = ref<Category | null>(null)
const editingTag = ref<Tag | null>(null)

definePageMeta({ layout: 'support' })

// Icon options for dropdown
const iconOptions = [
  { label: 'Utensils', value: 'Utensils' },
  { label: 'Hotel', value: 'Hotel' },
  { label: 'Shopping Cart', value: 'ShoppingCart' },
  { label: 'Clapperboard', value: 'Clapperboard' },
  { label: 'Heart Plus', value: 'HeartPlus' },
  { label: 'Briefcase', value: 'BriefcaseBusiness' },
  { label: 'Home', value: 'Home' },
  { label: 'Graduation Cap', value: 'GraduationCap' },
  { label: 'Car', value: 'CarFront' },
  { label: 'Camera', value: 'Camera' },
  { label: 'Laptop', value: 'LaptopMinimal' },
  { label: 'Book', value: 'BookOpen' },
  { label: 'Sparkles', value: 'Sparkles' }
]

// Forms
const categoryForm = ref({
  name: '',
  slug: '',
  description: '',
  iconName: 'Utensils',
  color: '#3B82F6'
})

const tagForm = ref({
  name: '',
  slug: '',
  categoryId: '',
  color: '#10B981'
})

const mergeForm = ref({
  sourceId: '',
  targetId: ''
})

// Data
const categories = ref<Category[]>([
  {
    id: '1',
    name: 'Restaurants',
    slug: 'restaurants',
    description: 'All types of dining establishments',
    icon: Utensils,
    iconName: 'Utensils',
    color: '#FA5705',
    businessCount: 245,
    tagCount: 18
  },
  {
    id: '2',
    name: 'Hotels',
    slug: 'hotels',
    description: 'Accommodation and lodging services',
    icon: Hotel,
    iconName: 'Hotel',
    color: '#0099FF',
    businessCount: 89,
    tagCount: 12
  },
  {
    id: '3',
    name: 'Shopping',
    slug: 'shopping',
    description: 'Retail stores and shopping centers',
    icon: ShoppingCart,
    iconName: 'ShoppingCart',
    color: '#A344DA',
    businessCount: 156,
    tagCount: 15
  },
  {
    id: '4',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Movies, theaters, and fun activities',
    icon: Clapperboard,
    iconName: 'Clapperboard',
    color: '#EC1349',
    businessCount: 78,
    tagCount: 10
  },
  {
    id: '5',
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Medical, fitness, and wellness services',
    icon: HeartPlus,
    iconName: 'HeartPlus',
    color: '#E61A1A',
    businessCount: 134,
    tagCount: 14
  },
  {
    id: '6',
    name: 'Services',
    slug: 'services',
    description: 'Professional services',
    icon: BriefcaseBusiness,
    iconName: 'BriefcaseBusiness',
    color: '#171717',
    businessCount: 201,
    tagCount: 20
  },
  {
    id: '7',
    name: 'Photography',
    slug: 'photography',
    description: 'For events, shoots and general photography',
    icon: Camera,
    iconName: 'Camera',
    color: '#FF8400',
    businessCount: 45,
    tagCount: 18
  },
  {
    id: '8',
    name: 'Media',
    slug: 'media',
    description: 'Printing, publishing, and broadcasting services',
    icon: BookOpen,
    iconName: 'BookOpen',
    color: '#25BB91',
    businessCount: 89,
    tagCount: 12
  },
  {
    id: '9',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car deals, car wash and repairs',
    icon: CarFront,
    iconName: 'CarFront',
    color: '#2F22DD',
    businessCount: 156,
    tagCount: 15
  },
  {
    id: '10',
    name: 'Education',
    slug: 'education',
    description: 'schools, training centers, and educational services',
    icon: GraduationCap,
    iconName: 'GraduationCap',
    color: '#F2D40D',
    businessCount: 78,
    tagCount: 10
  },
  {
    id: '11',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Tech appliances, household electronics',
    icon: LaptopMinimal,
    iconName: 'LaptopMinimal',
    color: '#40A09D',
    businessCount: 134,
    tagCount: 14
  },
  {
    id: '12',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Domestic services',
    icon: Home,
    iconName: 'Home',
    color: '#4FEE11',
    businessCount: 201,
    tagCount: 20
  },
  {
    id: '13',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Outfits, footies, accesories and more',
    icon: Sparkles,
    iconName: 'Sparkles',
    color: '#F9067F ',
    businessCount: 201,
    tagCount: 20
  }
])

const tags = ref<Tag[]>([
  { id: '1', name: 'Vegan Friendly', slug: 'vegan-friendly', categoryId: '1', color: '#10B981', usageCount: 45 },
  { id: '2', name: 'Pet Friendly', slug: 'pet-friendly', categoryId: '1', color: '#F59E0B', usageCount: 67 },
  { id: '3', name: 'Outdoor Seating', slug: 'outdoor-seating', categoryId: '1', color: '#3B82F6', usageCount: 89 },
  { id: '4', name: 'Free WiFi', slug: 'free-wifi', categoryId: '2', color: '#8B5CF6', usageCount: 78 },
  { id: '5', name: 'Pool', slug: 'pool', categoryId: '2', color: '#06B6D4', usageCount: 34 },
  { id: '6', name: 'Luxury', slug: 'luxury', categoryId: '2', color: '#F59E0B', usageCount: 23 },
  { id: '7', name: 'Organic', slug: 'organic', categoryId: '3', color: '#10B981', usageCount: 56 },
  { id: '8', name: 'Local Business', slug: 'local-business', categoryId: '3', color: '#EF4444', usageCount: 91 },
  { id: '9', name: 'Live Music', slug: 'live-music', categoryId: '4', color: '#EC4899', usageCount: 29 },
  { id: '10', name: 'Family Friendly', slug: 'family-friendly', categoryId: '4', color: '#3B82F6', usageCount: 72 }
])

// Computed
const filteredCategories = computed(() => {
  return categories.value.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.value.toLowerCase()) ||
    cat.description.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
})

const filteredTags = computed(() => {
  return tags.value.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(tagSearch.value.toLowerCase())
    const matchesCategory = tagCategoryFilter.value === 'all' || tag.categoryId === tagCategoryFilter.value
    return matchesSearch && matchesCategory
  })
})

const getCategoryById = (id: string) => {
  return categories.value.find(cat => cat.id === id)
}

// Dropdown options for categories
const categoryDropdownOptions = computed(() => {
  return categories.value.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
})

// Filter options for tags tab
const categoryFilterOptions = computed(() => {
  return [
    { label: 'All Categories', value: 'all' },
    ...categories.value.map(cat => ({
      label: cat.name,
      value: cat.id
    }))
  ]
})

// Category Methods
const openCategoryModal = (category?: Category) => {
  if (category) {
    editingCategory.value = category
    categoryForm.value = {
      name: category.name,
      slug: category.slug,
      description: category.description,
      iconName: category.iconName,
      color: category.color
    }
  } else {
    editingCategory.value = null
    categoryForm.value = {
      name: '',
      slug: '',
      description: '',
      iconName: 'Utensils',
      color: '#3B82F6'
    }
  }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  editingCategory.value = null
}

const saveCategory = () => {
  if (!categoryForm.value.name || !categoryForm.value.slug) {
    alert('Please fill in all required fields')
    return
  }

  if (editingCategory.value) {
    const index = categories.value.findIndex(c => c.id === editingCategory.value!.id)
    categories.value[index] = {
      ...editingCategory.value,
      ...categoryForm.value,
      icon: iconMap[categoryForm.value.iconName]
    }
    alert('Category updated successfully!')
  } else {
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryForm.value,
      icon: iconMap[categoryForm.value.iconName],
      businessCount: 0,
      tagCount: 0
    }
    categories.value.push(newCategory)
    alert('Category created successfully!')
  }

  closeCategoryModal()
}

const deleteCategory = (id: string) => {
  const category = categories.value.find(c => c.id === id)
  if (confirm(`Are you sure you want to delete "${category?.name}"? This will affect ${category?.businessCount} businesses.`)) {
    categories.value = categories.value.filter(c => c.id !== id)
    alert('Category deleted successfully!')
  }
}

// Tag Methods
const openTagModal = (tag?: Tag) => {
  if (tag) {
    editingTag.value = tag
    tagForm.value = { ...tag }
  } else {
    editingTag.value = null
    tagForm.value = {
      name: '',
      slug: '',
      categoryId: '',
      color: '#10B981'
    }
  }
  showTagModal.value = true
}

const closeTagModal = () => {
  showTagModal.value = false
  editingTag.value = null
}

const saveTag = () => {
  if (!tagForm.value.name || !tagForm.value.slug || !tagForm.value.categoryId) {
    alert('Please fill in all required fields')
    return
  }

  if (editingTag.value) {
    const index = tags.value.findIndex(t => t.id === editingTag.value!.id)
    tags.value[index] = { ...editingTag.value, ...tagForm.value }
    alert('Tag updated successfully!')
  } else {
    const newTag: Tag = {
      id: Date.now().toString(),
      ...tagForm.value,
      usageCount: 0
    }
    tags.value.push(newTag)
    
    // Update category tag count
    const category = categories.value.find(c => c.id === tagForm.value.categoryId)
    if (category) category.tagCount++
    
    alert('Tag created successfully!')
  }

  closeTagModal()
}

const deleteTag = (id: string) => {
  const tag = tags.value.find(t => t.id === id)
  if (confirm(`Are you sure you want to delete "${tag?.name}"? This tag is used ${tag?.usageCount} times.`)) {
    tags.value = tags.value.filter(t => t.id !== id)
    
    // Update category tag count
    const category = categories.value.find(c => c.id === tag?.categoryId)
    if (category) category.tagCount--
    
    alert('Tag deleted successfully!')
  }
}

// Merge Methods
const openMergeCategoriesModal = () => {
  mergeForm.value = { sourceId: '', targetId: '' }
  showMergeModal.value = true
}

const closeMergeModal = () => {
  showMergeModal.value = false
}

const mergeCategories = () => {
  if (!mergeForm.value.sourceId || !mergeForm.value.targetId) return

  const source = categories.value.find(c => c.id === mergeForm.value.sourceId)
  const target = categories.value.find(c => c.id === mergeForm.value.targetId)

  if (source && target) {
    // Move businesses and tags to target
    target.businessCount += source.businessCount
    target.tagCount += source.tagCount

    // Update tags to new category
    tags.value.forEach(tag => {
      if (tag.categoryId === source.id) {
        tag.categoryId = target.id
      }
    })

    // Delete source category
    categories.value = categories.value.filter(c => c.id !== source.id)

    alert(`Successfully merged "${source.name}" into "${target.name}"`)
    closeMergeModal()
  }
}
</script>