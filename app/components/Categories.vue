<template>
  <div class="w-full max-w-7xl mx-auto p-6">
    <!-- Search Component -->
    <CategorySearch 
      v-model="searchQuery"
      @clear="searchQuery = ''"
    />

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 items-start">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
      >
        <!-- Category Header -->
        <button
          @click="toggleCategory(category.id)"
          class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-50': expandedCategories.has(category.id) }"
        >
          <div class="flex items-center gap-3">
            <component :is="category.icon" :class="category.color" class="w-6 h-6 flex-shrink-0" />
            <div class="text-left">
              <span class="font-semibold text-gray-800 text-base block">{{ category.name }}</span>
              <span class="text-xs text-gray-500">
                {{ category.subcategories.length }} subcategories
              </span>
            </div>
          </div>
          <component
            :is="expandedCategories.has(category.id) ? ChevronDown : ChevronRight"
            class="w-5 h-5 text-gray-400 flex-shrink-0"
          />
        </button>

        <!-- Subcategories -->
        <div
          v-show="expandedCategories.has(category.id)"
          class="border-t border-gray-100 bg-gray-50 p-3 flex-grow"
        >
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="subcategory in category.subcategories"
              :key="subcategory.id"
              @click="handleSelection(category.id, subcategory.id)"
              class="text-left px-3 py-2 rounded-md text-sm transition-colors"
              :class="[
                selectedCategory === category.id && selectedSubcategory === subcategory.id
                  ? 'bg-blue-500 text-white font-medium'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              ]"
            >
              {{ subcategory.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div
      v-if="filteredCategories.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500 text-lg">No categories found matching "{{ searchQuery }}"</p>
      <button
        @click="searchQuery = ''"
        class="mt-4 text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear search
      </button>
    </div>

    <!-- Selected Category Display -->
    <div
      v-if="selectedCategory"
      class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <p class="text-sm text-gray-600">Selected:</p>
      <p class="text-lg font-semibold text-blue-700">
        {{ categories.find(c => c.id === selectedCategory)?.name }}
        <span v-if="selectedSubcategory" class="text-blue-600">
          → {{ categories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Utensils,
  ShoppingBag,
  Dumbbell,
  Sparkles,
  Shirt,
  Home,
  Smartphone,
  Plane,
  GraduationCap,
  Stethoscope,
  Car,
  Building2,
  BookOpen,
  Camera,
  Music,
  ChevronDown,
  ChevronRight
} from 'lucide-vue-next'

interface SubCategory {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  icon: any
  color: string
  subcategories: SubCategory[]
}

const categories = ref<Category[]>([
  {
    id: 'food-dining',
    name: 'Food & Dining',
    icon: Utensils,
    color: 'text-orange-500',
    subcategories: [
      { id: 'restaurants', name: 'Restaurants' },
      { id: 'cafes', name: 'Cafes & Coffee Shops' },
      { id: 'fast-food', name: 'Fast Food' },
      { id: 'bakeries', name: 'Bakeries & Desserts' },
      { id: 'bars', name: 'Bars & Pubs' },
      { id: 'food-delivery', name: 'Food Delivery Services' },
      { id: 'catering', name: 'Catering Services' },
      { id: 'food-trucks', name: 'Food Trucks' }
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping & Retail',
    icon: ShoppingBag,
    color: 'text-pink-500',
    subcategories: [
      { id: 'clothing-stores', name: 'Clothing Stores' },
      { id: 'grocery-stores', name: 'Grocery Stores' },
      { id: 'department-stores', name: 'Department Stores' },
      { id: 'bookstores', name: 'Bookstores' },
      { id: 'toy-stores', name: 'Toy Stores' },
      { id: 'pet-stores', name: 'Pet Stores' },
      { id: 'jewelry-stores', name: 'Jewelry Stores' },
      { id: 'online-shops', name: 'Online Shops' }
    ]
  },
  {
    id: 'fitness',
    name: 'Fitness & Sports',
    icon: Dumbbell,
    color: 'text-green-500',
    subcategories: [
      { id: 'gyms', name: 'Gyms & Fitness Centers' },
      { id: 'yoga-studios', name: 'Yoga Studios' },
      { id: 'personal-trainers', name: 'Personal Trainers' },
      { id: 'sports-clubs', name: 'Sports Clubs' },
      { id: 'martial-arts', name: 'Martial Arts' },
      { id: 'swimming-pools', name: 'Swimming Pools' },
      { id: 'fitness-equipment', name: 'Fitness Equipment' }
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    icon: Sparkles,
    color: 'text-purple-500',
    subcategories: [
      { id: 'hair-salons', name: 'Hair Salons' },
      { id: 'nail-salons', name: 'Nail Salons' },
      { id: 'spas', name: 'Spas & Massage' },
      { id: 'barbers', name: 'Barber Shops' },
      { id: 'skincare', name: 'Skincare Services' },
      { id: 'cosmetics', name: 'Cosmetics & Makeup' },
      { id: 'tattoo-piercing', name: 'Tattoo & Piercing' }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion & Accessories',
    icon: Shirt,
    color: 'text-indigo-500',
    subcategories: [
      { id: 'mens-fashion', name: "Men's Fashion" },
      { id: 'womens-fashion', name: "Women's Fashion" },
      { id: 'kids-fashion', name: "Kids' Fashion" },
      { id: 'shoes', name: 'Shoes & Footwear' },
      { id: 'bags', name: 'Bags & Luggage' },
      { id: 'accessories', name: 'Accessories' },
      { id: 'watches', name: 'Watches' }
    ]
  },
  {
    id: 'home',
    name: 'Home & Garden',
    icon: Home,
    color: 'text-blue-500',
    subcategories: [
      { id: 'furniture', name: 'Furniture Stores' },
      { id: 'home-decor', name: 'Home Decor' },
      { id: 'appliances', name: 'Appliances' },
      { id: 'hardware', name: 'Hardware Stores' },
      { id: 'garden-centers', name: 'Garden Centers' },
      { id: 'interior-design', name: 'Interior Design' },
      { id: 'cleaning-services', name: 'Cleaning Services' }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics & Tech',
    icon: Smartphone,
    color: 'text-cyan-500',
    subcategories: [
      { id: 'mobile-phones', name: 'Mobile Phones' },
      { id: 'computers', name: 'Computers & Laptops' },
      { id: 'gaming', name: 'Gaming & Consoles' },
      { id: 'audio', name: 'Audio Equipment' },
      { id: 'cameras', name: 'Cameras & Photography' },
      { id: 'smart-home', name: 'Smart Home Devices' },
      { id: 'repair-services', name: 'Repair Services' }
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Hospitality',
    icon: Plane,
    color: 'text-sky-500',
    subcategories: [
      { id: 'hotels', name: 'Hotels & Resorts' },
      { id: 'airlines', name: 'Airlines' },
      { id: 'vacation-rentals', name: 'Vacation Rentals' },
      { id: 'travel-agencies', name: 'Travel Agencies' },
      { id: 'tour-operators', name: 'Tour Operators' },
      { id: 'car-rentals', name: 'Car Rentals' },
      { id: 'hostels', name: 'Hostels & Backpackers' }
    ]
  },
  {
    id: 'education',
    name: 'Education & Training',
    icon: GraduationCap,
    color: 'text-amber-500',
    subcategories: [
      { id: 'schools', name: 'Schools' },
      { id: 'universities', name: 'Universities & Colleges' },
      { id: 'tutoring', name: 'Tutoring Services' },
      { id: 'online-courses', name: 'Online Courses' },
      { id: 'language-schools', name: 'Language Schools' },
      { id: 'music-lessons', name: 'Music Lessons' },
      { id: 'driving-schools', name: 'Driving Schools' }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    icon: Stethoscope,
    color: 'text-red-500',
    subcategories: [
      { id: 'doctors', name: 'Doctors & Clinics' },
      { id: 'dentists', name: 'Dentists' },
      { id: 'pharmacies', name: 'Pharmacies' },
      { id: 'hospitals', name: 'Hospitals' },
      { id: 'opticians', name: 'Opticians' },
      { id: 'physical-therapy', name: 'Physical Therapy' },
      { id: 'mental-health', name: 'Mental Health Services' }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: Car,
    color: 'text-gray-600',
    subcategories: [
      { id: 'car-dealers', name: 'Car Dealers' },
      { id: 'auto-repair', name: 'Auto Repair & Maintenance' },
      { id: 'car-wash', name: 'Car Wash & Detailing' },
      { id: 'tire-shops', name: 'Tire Shops' },
      { id: 'auto-parts', name: 'Auto Parts Stores' },
      { id: 'motorcycle-dealers', name: 'Motorcycle Dealers' },
      { id: 'body-shops', name: 'Body Shops' }
    ]
  },
  {
    id: 'professional',
    name: 'Professional Services',
    icon: Building2,
    color: 'text-slate-600',
    subcategories: [
      { id: 'lawyers', name: 'Lawyers & Legal' },
      { id: 'accountants', name: 'Accountants' },
      { id: 'real-estate', name: 'Real Estate Agents' },
      { id: 'insurance', name: 'Insurance Services' },
      { id: 'financial-advisors', name: 'Financial Advisors' },
      { id: 'marketing', name: 'Marketing Agencies' },
      { id: 'consulting', name: 'Consulting Services' }
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Arts',
    icon: Music,
    color: 'text-violet-500',
    subcategories: [
      { id: 'cinemas', name: 'Cinemas & Theaters' },
      { id: 'museums', name: 'Museums & Galleries' },
      { id: 'concerts', name: 'Concerts & Live Music' },
      { id: 'amusement-parks', name: 'Amusement Parks' },
      { id: 'escape-rooms', name: 'Escape Rooms' },
      { id: 'bowling', name: 'Bowling & Recreation' },
      { id: 'nightclubs', name: 'Nightclubs' }
    ]
  },
  {
    id: 'media',
    name: 'Media & Publishing',
    icon: BookOpen,
    color: 'text-teal-500',
    subcategories: [
      { id: 'books', name: 'Books & Authors' },
      { id: 'magazines', name: 'Magazines' },
      { id: 'podcasts', name: 'Podcasts' },
      { id: 'blogs', name: 'Blogs & Websites' },
      { id: 'newspapers', name: 'Newspapers' },
      { id: 'streaming', name: 'Streaming Services' },
      { id: 'radio', name: 'Radio Stations' }
    ]
  },
  {
    id: 'photography',
    name: 'Photography & Video',
    icon: Camera,
    color: 'text-rose-500',
    subcategories: [
      { id: 'photographers', name: 'Photographers' },
      { id: 'videographers', name: 'Videographers' },
      { id: 'photo-studios', name: 'Photo Studios' },
      { id: 'photo-printing', name: 'Photo Printing' },
      { id: 'drone-services', name: 'Drone Services' },
      { id: 'photo-equipment', name: 'Photo Equipment Rental' }
    ]
  }
])

const expandedCategories = ref<Set<string>>(new Set())
const selectedCategory = ref<string | null>(null)
const selectedSubcategory = ref<string | null>(null)
const searchQuery = ref('')

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  
  return categories.value.filter(category => {
    const categoryMatch = category.name.toLowerCase().includes(query)
    const subcategoryMatch = category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(query)
    )
    return categoryMatch || subcategoryMatch
  })
})

const toggleCategory = (categoryId: string) => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId)
  } else {
    expandedCategories.value.add(categoryId)
  }
}

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  selectedSubcategory.value = null
}

const selectSubcategory = (categoryId: string, subcategoryId: string) => {
  selectedCategory.value = categoryId
  selectedSubcategory.value = subcategoryId
}

const emit = defineEmits<{
  categorySelected: [category: string, subcategory: string | null]
}>()

const handleSelection = (categoryId: string, subcategoryId: string | null = null) => {
  if (subcategoryId) {
    selectSubcategory(categoryId, subcategoryId)
  } else {
    selectCategory(categoryId)
  }
  emit('categorySelected', categoryId, subcategoryId)
}
</script>