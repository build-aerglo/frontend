import { ref, readonly } from 'vue'

interface Review {
  author: string
  avatar: string
  rating: number
  text: string
  date: string
}

interface Business {
  id: number
  name: string
  category: string
  logo: string
  rating: number
  reviewCount: number
  trusted: boolean
  verified: boolean
  standard: boolean
  badges:string[]
  tags: string[]
  location: string
  priceRange: string
  positivePercent: number
  negativePercent: number
  keywords: string[]
  reviews: Review[]
  phone: string
  address: string
  reviewSummary: string
}

const businesses = ref<Business[]>([
  {
    id: 1,
    name: 'The Golden Spoon Restaurant',
    category: 'restaurant',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    rating: 4.8,
    reviewCount: 342,
    verified: false,
    trusted: true,
    standard: false,
    badges:['trusted'],  
    tags: ['luxury', 'romantic'],
    location: 'lagos',
    priceRange: 'expensive',
    positivePercent: 92,
    negativePercent: 8,
    keywords: ['Excellent Service', 'Romantic Ambiance', 'Fine Dining', 'Great Wine'],
    phone: '+234 803 456 7890',
    address: '15 Admiralty Way, Lekki Phase 1, Lagos',
    reviewSummary: 'Customers praise the impeccable service and romantic fine dining experience.',
    reviews: [
      {
        author: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=5',
        rating: 5,
        text: 'Absolutely fantastic experience!',
        date: '2 days ago'
      },
      {
        author: 'Donald Williams',
        avatar: 'https://i.pravatar.cc/150?img=13',
        rating: 5,
        text: 'Best fine dining experience in the city.',
        date: '1 week ago'
      }
    ]
  },
  {
    id: 2,
    name: "Wellness Spa & Retreat",
    category: 'service',
    logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 698,
    verified: true,
    trusted: false,
    standard: false,
    tags: ['luxury'],
    location: 'lagos',
    badges:['verified'],
    priceRange: 'luxury',
    positivePercent: 86,
    negativePercent: 14,
    keywords: ['Comfortable Rooms', 'Friendly Staff', 'Clean Environment'],
    phone: '+234 809 222 5566',
    address: 'Plot 22, Ijebu Ode, Ogun',
    reviewSummary: 'Guests love the clean environment and friendly service.',
    reviews: [
      {
        author: 'Michael Ade',
        avatar: 'https://i.pravatar.cc/150?img=45',
        rating: 4,
        text: 'Nice hotel with comfortable rooms.',
        date: '3 days ago'
      },
      {
        author: 'Esther Bello',
        avatar: 'https://i.pravatar.cc/150?img=30',
        rating: 5,
        text: 'Loved the pool and view!',
        date: '1 week ago'
      }
    ]
  },
  {
    id: 3,
    name: 'Grande Hotel',
    category: 'hotel',
    logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
    rating: 4.3,
    reviewCount: 558,
    verified: false,
    trusted: false,
    standard: true,
    tags: ['family-friendly', 'luxury'],
    location: 'lagos',
    badges:['standard'],
    priceRange: 'moderate',
    positivePercent: 86,
    negativePercent: 14,
    keywords: ["Comfortable", "Great Location", "Friendly Staff", "Clean Rooms"],
    phone: '+234 810 222 5566',
    address: 'Plot 11, Yaba, Lagos',
    reviewSummary: 'Guests love the clean environment and friendly service.',
    reviews: [
      {
        author: "Robert Thompson",
        avatar: "https://i.pravatar.cc/150?img=15",
        rating: 5,
        text: "Fantastic stay! The rooms were spacious and immaculate. Staff went above and beyond to make our family vacation memorable.",
        date: "5 days ago"
      },
      {
        author: "Lisa Marvellous",
        avatar: "https://i.pravatar.cc/150?img=44",
        rating: 4,
        text: "Great hotel with excellent amenities. Breakfast buffet was impressive. Only minor issue was noise from the hallway at night.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 4,
    name: "Quick Bite Burger Joint",
    category: 'hotel',
    logo: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop",
    rating: 2.3,
    reviewCount: 198,
    verified: false,
    trusted: false,
    standard: false,
    tags: ['budget'],
    location: 'ogun',
    badges:[''],
    priceRange: 'budget',
    positivePercent: 37,
    negativePercent: 63,
    keywords: ["Slow Service", "Cold Food", "Dirty", "Rude Staff"],
    phone: '+234 809 222 5566',
    address: 'Plot 27, Ijebu Ode, Ogun',
    reviewSummary: 'Guests have a lot to say about poor service and food quality.',
    reviews: [
      {
        author: "Aminatu Fuhad",
        avatar: "https://i.pravatar.cc/150?img=52",
        rating: 1,
        text: "Terrible experience. Waited 45 minutes for a cold burger. The place was dirty and staff was incredibly rude when I complained. Never coming back!",
        date: "1 day ago"
      },
      {
        author: "Kunle Peters",
        avatar: "https://i.pravatar.cc/150?img=38",
        rating: 2,
        text: "Very disappointed. Food quality has gone downhill. My order was wrong and they refused to fix it. Save your money and go elsewhere.",
        date: "3 days ago"
      },
      {
        author: "Ogun Davis",
        avatar: "https://i.pravatar.cc/150?img=68",
        rating: 3,
        text: "It's okay if you're really hungry and have no other options. Nothing special. Fries were decent but burger was mediocre.",
        date: "1 week ago"
      }
    ]
  },
  {
    id: 5,
    name: "Discount Electronics Warehouse",
    category: 'retail',
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop",
    rating: 2.3,
    reviewCount: 198,
    verified: false,
    trusted: false,
    standard: false,
    tags: ['budget'],
    location: 'ogun',
    badges:[''],
    priceRange: 'budget',
    positivePercent: 16,
    negativePercent: 84,
    keywords: ["Poor Quality", "No Returns", "Broken Items", "Unhelpful"],
    phone: '+234 809 222 5566',
    address: 'Plot 22, Ijebu Ode, Ogun',
    reviewSummary: 'Poor business practices and low-quality products leading to dissatisfied customers.',
    reviews: [
      {
        author: "James Obi",
        avatar: "https://i.pravatar.cc/150?img=59",
        rating: 1,
        text: "AVOID! Sold me a broken laptop and refused to accept returns. Customer service is non-existent.",
        date: "2 days ago"
      },
      {
        author: "Patricia Henry",
        avatar: "https://i.pravatar.cc/150?img=20",
        rating: 2,
        text: "Cheap prices but you get what you pay for. Half the products don't work and the warranty is worthless. Very frustrating experience.",
        date: "1 week ago"
      },
      {
        author: "Steven Bala",
        avatar: "https://i.pravatar.cc/150?img=70",
        rating: 3,
        text: "Hit or miss. Some deals are okay but quality control is terrible. Check everything carefully before leaving the store.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 6,
    name: 'Cozy Corner Cafe',
    category: 'hotel',
    logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop',
    rating: 4.3,
    reviewCount: 198,
    verified: false,
    trusted: false,
    standard: true,
    tags: ['family-friendly', 'budget'],
    location: 'kano',
    badges:['standard'],
    priceRange: 'budget',
    positivePercent: 78,
    negativePercent: 22,
    keywords: ["Great Coffee", "Friendly Staff", "Cozy Atmosphere", "Affordable"],
    phone: '+234 809 222 5566',
    address: 'Plot 22, Adams Musa Rd, Kano',
    reviewSummary: 'Guests love the clean environment and friendly service.',
    reviews: [
      {
        author: 'Michael Ade',
        avatar: 'https://i.pravatar.cc/150?img=45',
        rating: 4,
        text: 'Nice and friendly staff.',
        date: '3 days ago'
      },
      {
        author: 'Aminatu Bello',
        avatar: 'https://i.pravatar.cc/150?img=30',
        rating: 5,
        text: 'Loved the coffe.  Only minor issue was noise from the Highway.',
        date: '1 week ago'
      }
    ]
  }
])

export function useDummyReviews() {
  return {
    businesses: readonly(businesses)
  }
}
