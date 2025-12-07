export interface BusinessUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: string;
  categoryIds: string[]
  address: string ;
  branchName: string ;
  branchAddress: string ;
  website: string ;
}
export interface BusinessUserResponse {
  id: string;
  email: string;
  businessId: string;

  business: {
    id: string;
    businessId: string;
    userId: string;
    branchName: string ;
    branchAddress: string ;
    createdAt: string;
    updatedAt: string;
  };

  auth0UserId: string;
}
export interface BusinessProfile {
  name: string;
  website: string;
  businessAddress: string;
  logo: string ;
  openingHours: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  businessEmail: string ;
  businessPhoneNumber: string;
  cacNumber: string ;
  accessUsername: string ;
  accessNumber: string ;
  socialMediaLinks: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string 
  };
  businessDescription: string;
  media: string[];
  isVerified: boolean 
  reviewLink: string;
  preferredContactMethod: string;
  highlights: string[];
  tags: string[];
  averageResponseTime: string ;
  profileClicks: number ;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface BusinessPreference {
  reviewsPrivate: boolean;
  dndModeEnabled: boolean;
  dndModeDurationHours: number ;
}
