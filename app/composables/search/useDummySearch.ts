
export interface CompanyData {
  name: string;
  url: string;
  logoUrl: string; 
  reviewCount: string; 
  rating: number; 
}

export interface GroupedSearchResult {
  companies: CompanyData[]; 
  categories: string[];   
}

export const dummySearchData: { companies: CompanyData[], categories: string[] } = {
  companies: [
    { 
      name: 'Business-Class.com', 
      url: 'business-class.com', 
      logoUrl: '/images/logos/business-class.png', 
      reviewCount: '15K reviews', 
      rating: 4.7 
    },
    { 
      name: 'Omio', 
      url: 'omio.com', 
      logoUrl: '/images/logos/omio.png', 
      reviewCount: '20K reviews', 
      rating: 4.3 
    },
    { 
      name: 'Optimalprint', 
      url: 'optimalprint.com', 
      logoUrl: '/images/logos/optimalprint.png', 
      reviewCount: '137K reviews', 
      rating: 4.2 
    },
    { 
      name: 'Booksy Biz', 
      url: 'booksy.com', 
      logoUrl: '/images/logos/booksy.png', 
      reviewCount: '56K reviews', 
      rating: 3.3 
    },
    { 
      name: 'eBay', 
      url: 'ebay.com', 
      logoUrl: '/images/logos/ebay.png', 
      reviewCount: '11K reviews', 
      rating: 1.5 
    },
    { 
      name: 'TravelWise Agency', 
      url: 'travelwise.com', 
      logoUrl: '/images/logos/travel.png', 
      reviewCount: '8K reviews', 
      rating: 4.9 
    },
  ],
  categories: [
    'Restuarants',
    'Travel',
    'Home Services',
    'Academic',
    'Business Services',
    'Shopping',
  ],
};