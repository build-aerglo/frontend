<template>
  <div class="w-full max-w-7xl mx-auto p-6">
    <!-- Search Component -->
    <CategorySearch 
      v-model="searchQuery"
      @clear="searchQuery = ''"
    />

    <!-- Categories Grid - 3 Independent Columns -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
      <div
        v-for="(column, columnIndex) in columnizedCategories"
        :key="columnIndex"
        class="flex flex-col gap-4"
      >
        <div
          v-for="category in column"
          :key="category.id"
          class="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <!-- Category Header -->
          <button
            @click="toggleCategory(category.id)"
            class="w-full flex items-center justify-between p-4 transition-colors"
            :style="{ 
              backgroundColor: expandedCategories.has(category.id) || hoverCategory === category.id 
                ? getCategoryBgColor(category.color) 
                : 'transparent' 
            }"
            @mouseenter="hoverCategory = category.id"
            @mouseleave="hoverCategory = null"
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
            class="border-t border-gray-100 p-3 flex-grow"
            :style="{ backgroundColor: getCategoryBgColor(category.color) }"
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
  ChevronDown,
  ChevronRight,
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
    name: 'Food & Restaurants',
    icon: Utensils,
    color: 'text-orange-500',
    subcategories: [
      { id: 'fine-dining', name: 'Fine Dining' },
      { id: 'bukka', name: 'Bukka' },
      { id: 'night-life', name: 'Night Life' },
      { id: 'bakeries', name: 'Bakeries' },
      { id: 'pastries', name: 'Pasteries' },
      { id: 'food-delivery', name: 'Food Delivery Services' },
      { id: 'local-flavour', name: 'Local Flavour' },
      { id: 'food-trucks', name: 'Food Trucks' },
      { id: 'intercontinental', name: 'Intercontinental' },
      { id: 'vegetarian', name: 'Vegetarian' },
      { id: 'desert', name: 'Deserts' },
      { id: 'italian', name: 'Italian' },
      { id: 'bars', name: 'Bars & Pubs' },
      { id: 'premium', name: 'Premium' },
      { id: 'catering', name: 'Catering Services' },
      { id: 'business', name: 'Business' },
      { id: 'romantic', name: 'Romantic' },
      { id: 'kid-friendly', name: 'Kid-Friendly' },
      { id: 'buffet', name:'Buffet'},
      { id: 'affordable', name: 'Affordable' }
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping & Retail',
    icon: ShoppingCart,
    color: 'text-purple-500',
    subcategories: [
       { id: 'malls', name: 'Malls' },
      { id: 'grocery-stores', name: 'Grocery Stores' },
      { id: 'physical-stores', name: 'Physical Stores' },
      { id: 'personal-shopper', name: 'Personal Shopper' },
      { id: 'clothing-stores', name: 'Clothing Stores' },
      { id: 'department-stores', name: 'Department Stores' },
      { id: 'bookstores', name: 'Bookstores' },
      { id: 'toy-stores', name: 'Toy Stores' },
      { id: 'pet-stores', name: 'Pet Stores' },
      { id: 'jewelry-stores', name: 'Jewelry Stores' },
      { id: 'online-shops', name: 'Online Stores' }
    ]
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: HeartPlus,
    color: 'text-red-500',
    subcategories: [
      { id: 'clinics', name: 'Clinics & Laboratories' },
      { id: 'dental', name: 'Dentists' },
      { id: 'optician', name: 'Opticians' },
      { id: 'mental-health', name: 'Mental Health' },
      { id: 'diagnostics', name: 'Diagnostics' },
      { id: 'gyms', name: 'Gyms & Fitness Centers' },
      { id: 'yoga-studios', name: 'Yoga Studios' },
      { id: 'personal-trainers', name: 'Personal Trainers' },
      { id: 'martial-arts', name: 'Martial Arts' },
      { id: 'swimming-pools', name: 'Swimming Pools' },
      { id: 'fitness-equipment', name: 'Fitness Equipment' },
      { id: 'sports-clubs', name: 'Sports Clubs' },
      { id: 'physiotherapy', name: 'Physiotherapy' },
      { id: 'pharmacy', name: 'Pharmacists' },
      { id: 'massage', name: 'Massage' }
    ]
  },
  {
    id: 'beauty',
    name: 'Fashion & Beauty',
    icon: Sparkles,
    color: 'text-pink-500',
    subcategories: [
      { id: 'hair-salons', name: 'Hair Salons' },
      { id: 'nail-salons', name: 'Nail Salons' },
      { id: 'spas', name: 'Spas & Massage' },
      { id: 'barbers', name: 'Barber Shops' },
      { id: 'skincare', name: 'Skincare Services' },
      { id: 'cosmetics', name: 'Cosmetics & Makeup' },
      { id: 'tattoo-piercing', name: 'Tattoo & Piercing' },
       { id: 'mens-fashion', name: "Men's Fashion" },
      { id: 'womens-fashion', name: "Women's Fashion" },
      { id: 'kids-fashion', name: "Kids' Fashion" },
      { id: 'shoes', name: 'Shoes & Footwear' },
      { id: 'bags', name: 'Bags & Luggage' },
      { id: 'accessories', name: 'Accessories' },
      { id: 'watches', name: 'Watches' },
       { id: 'costume', name: "Costumes" },
      { id: 'thrift', name: "Thrift wears" },
      { id: 'budget-friendly', name: "Budget Friendly" },
      { id: 'luxury', name: 'Luxury' },
      { id: 'vintage', name: 'Vintage' },
    ]
  },
  {
    id: 'home',
    name: 'Home & Garden',
    icon: Home,
    color: 'text-indigo-300',
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
    icon: LaptopMinimal,
    color: 'text-green-500',
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
    id: 'stay',
    name: 'Hotels, BnB & Vacation',
    icon: Hotel,
    color: 'text-sky-500',
    subcategories: [
      { id: 'hotels', name: 'Hotels & Resorts' },
      { id: 'airlines', name: 'Airlines' },
      { id: 'vacation-rentals', name: 'Vacation Rentals' },
      { id: 'travel-agencies', name: 'Travel Agencies' },
      { id: 'tour', name: 'Tour Guides' },
      { id: 'car-rentals', name: 'Car Rentals' },
      { id: 'BnB', name: 'BnB' }
    ]
  },
  {
    id: 'education',
    name: 'Education & Training',
    icon: GraduationCap,
    color: 'text-yellow-400',
    subcategories: [
      { id: 'schools', name: 'Schools' },
      { id: 'universities', name: 'Universities & Colleges' },
      { id: 'tutoring', name: 'Tutoring Services' },
      { id: 'online-courses', name: 'Online Courses' },
      { id: 'language-schools', name: 'Language Schools' },
      { id: 'music-lessons', name: 'Music Lessons' },
      { id: 'driving-schools', name: 'Driving Schools' },
      { id: 'swimming', name: 'Swimming Schools' },
      { id: 'bootcamps', name: 'Bootcamps' },
      { id: 'vocational', name: 'Vocational Training' },
      { id: 'professional', name: 'Professional Tutoring' },
      { id: 'fashion-schools', name: 'Fashion Schools' },
      { id: 'culinary', name: 'Culinary Schools' },
      { id: 'it', name: 'Information Technology' },
      { id: 'certification', name: 'Certification' },
      { id: 'weekend', name: 'Weekend Classes' },
      { id: 'physical', name: 'Physical Lessons' },
      { id: 'hybrid', name: 'Hybrid Learning Platforms' }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: CarFront,
    color: 'text-blue-600',
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
    icon: BriefcaseBusiness,
    color: 'text-slate-500',
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
    icon: Clapperboard,
    color: 'text-rose-500',
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
    color: 'text-amber-600',
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
const hoverCategory = ref<string | null>(null)

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

const columnizedCategories = computed<Category[][]>(() => {
  const itemsPerColumn = Math.ceil(filteredCategories.value.length / 3)
  return [
    filteredCategories.value.slice(0, itemsPerColumn),
    filteredCategories.value.slice(itemsPerColumn, itemsPerColumn * 2),
    filteredCategories.value.slice(itemsPerColumn * 2)
  ]
})

const getCategoryBgColor = (colorClass: string): string => {
  const colorMap: Record<string, string> = {
    'text-orange-500': 'rgba(249, 115, 22, 0.1)',
    'text-purple-500': 'rgba(168, 85, 247, 0.1)',
    'text-red-500': 'rgba(239, 68, 68, 0.1)',
    'text-pink-500': 'rgba(236, 72, 153, 0.1)',
    'text-indigo-300': 'rgba(165, 180, 252, 0.1)',
    'text-green-500': 'rgba(34, 197, 94, 0.1)',
    'text-sky-500': 'rgba(14, 165, 233, 0.1)',
    'text-yellow-400': 'rgba(250, 204, 21, 0.1)',
    'text-blue-600': 'rgba(37, 99, 235, 0.1)',
    'text-slate-500': 'rgba(100, 116, 139, 0.1)',
    'text-rose-500': 'rgba(244, 63, 94, 0.1)',
    'text-teal-500': 'rgba(20, 184, 166, 0.1)',
    'text-amber-600': 'rgba(217, 119, 6, 0.1)',
  }
  
  return colorMap[colorClass] || 'rgba(243, 244, 246, 1)'
}

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