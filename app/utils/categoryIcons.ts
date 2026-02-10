import {
  GraduationCap,
  Hotel,
  HeartPlus,
  Utensils,
  Wallet,
  Sparkles,
  Palmtree,
  ShoppingCart,
  Store,
  CircleEllipsis
} from 'lucide-vue-next'

export const DEFAULT_CATEGORY_ICON = CircleEllipsis

export const categoryIconMap: Record<
  string,
  { icon: any; color: string }
> = {
  'Education and Training': { icon: GraduationCap, color: 'text-yellow-500' },
  'Hotels, BnB and vacation': { icon: Hotel, color: 'text-sky-400' },
  'Health and Wellness': { icon: HeartPlus, color: 'text-red-600' },
  'Food and Resturants': { icon: Utensils, color: 'text-orange-500' },
  'Finance': { icon: Wallet, color: 'text-emerald-600' },
  'Fashion and Baauty': { icon: Sparkles, color: 'text-pink-400' },
  'Tourism': { icon: Palmtree, color: 'text-teal-500' },
  'Shopping': { icon: ShoppingCart, color: 'text-purple-500' },
  'Retail': { icon: Store, color: 'text-indigo-500' }
}

export const getCategoryIcon = (categoryName: string) => {
  return categoryIconMap[categoryName]?.icon || DEFAULT_CATEGORY_ICON
}

export const getCategoryIconColor = (categoryName: string) => {
  return categoryIconMap[categoryName]?.color || 'text-gray-400'
}
