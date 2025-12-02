import { ref } from 'vue'

interface BusinessData {
  name: string
  image: string
  rating: number
  reviewCount: number
  category: string
  address: string
  phone: string
  website: string
  isOpen: boolean
  hours: string
  description: string
  highlights: string[]
  services: string[]
  businessHours: Record<string, string>
  amenities: string[]
}

interface Review {
  id: number
  author: string
  date: string
  rating: number
  body: string
  helpful: number
}

interface SimilarBusiness {
  id: number
  name: string
  image: string
  rating: number
  category: string
}

export function useBusinessData() {
  const activeTab = ref<string>('overview')

  const businessData = ref<BusinessData>({
    name: 'The Cozy Cafe',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 127,
    category: 'Coffee & Cafes',
    address: '45 Marina Road, Victoria Island, Lagos',
    phone: '+234 809-456-7890',
    website: 'www.cozycafe.ng',
    isOpen: true,
    hours: 'Closes at 10:00 PM',
    description: 'The Cozy Cafe is your perfect spot for premium coffee, delicious pastries, and a warm atmosphere. Whether you\'re looking for a quiet place to work, catch up with friends, or simply enjoy a great cup of coffee, we\'ve got you covered. Our skilled baristas craft each drink with care, using only the finest locally-sourced beans.',
    highlights: [
      'Free Wi-Fi',
      'Outdoor Seating',
      'Air Conditioned',
      'Pet Friendly',
      'Wheelchair Accessible',
      'Parking Available'
    ],
    services: [
      'Espresso',
      'Cappuccino',
      'Latte',
      'Fresh Pastries',
      'Sandwiches',
      'Smoothies'
    ],
    businessHours: {
      'Monday': '7:00 AM - 11:00 PM',
      'Tuesday': '7:00 AM - 10:00 PM',
      'Wednesday': '7:00 AM - 10:00 PM',
      'Thursday': '7:00 AM - 10:00 PM',
      'Friday': '7:00 AM - 11:00 PM',
      'Saturday': '8:00 AM - 11:00 PM',
      'Sunday': '9:00 AM - 9:00 PM'
    },
    amenities: [
      'Free Wi-Fi',
      'Outdoor Seating',
      'Air Conditioning',
      'Wheelchair Accessible',
      'Pet Friendly',
      'Parking',
      'Takeout Available',
      'Delivery'
    ]
  })

  const businessReviews = ref<Review[]>([
    {
      id: 1,
      author: 'Chioma Okafor',
      date: '2025-11-08',
      rating: 5,
      body: 'Absolutely love this place! The coffee is exceptional and the staff are so friendly. Perfect spot for remote work with fast Wi-Fi.',
      helpful: 12
    },
    {
      id: 2,
      author: 'Tunde Adebayo',
      date: '2025-11-06',
      rating: 4,
      body: 'Great coffee and nice ambiance. Can get a bit crowded during lunch hours but overall a solid choice.',
      helpful: 8
    },
    {
      id: 3,
      author: 'Sarah Manuel',
      date: '2025-11-04',
      rating: 5,
      body: 'The best cafe in VI! Their cappuccino is to die for and the pastries are always fresh. Highly recommend!',
      helpful: 15
    },
    {
      id: 4,
      author: 'Coker Yusuf',
      date: '2025-11-02',
      rating: 4,
      body: 'Good coffee and pleasant atmosphere. Prices are a bit high but worth it for the quality.',
      helpful: 5
    },
    {
      id: 5,
      author: 'Johnson Eze',
      date: '2025-10-30',
      rating: 5,
      body: 'My favorite spot in Lagos! The outdoor seating is lovely and the service is always excellent.',
      helpful: 10
    }
  ])

  const businessPhotos = ref<string[]>([
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop',
  ])

  const similarBusinesses = ref<SimilarBusiness[]>([
    {
      id: 1,
      name: 'Cafe Neo',
      image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=100&h=100&fit=crop',
      rating: 4.3,
      category: 'Coffee & Cafes'
    },
    {
      id: 2,
      name: 'Mocha House',
      image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=100&h=100&fit=crop',
      rating: 4.6,
      category: 'Coffee & Cafes'
    },
    {
      id: 3,
      name: 'Beatrice Bistro',
      image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=100&h=100&fit=crop',
      rating: 4.2,
      category: 'Coffee & Cafes'
    }
  ])

  return {
    activeTab,
    businessData,
    businessReviews,
    businessPhotos,
    similarBusinesses,
  }
}
