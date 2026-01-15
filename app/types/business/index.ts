export interface BusinessUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: string;
  categoryIds: string[];
  address: string | null;
  branchName: string | null;
  branchAddress: string | null;
  website: string | null;
}
export interface BusinessUserResponse {
  id: string;
  email: string;
  businessId: string;

  business: {
    id: string;
    businessId: string;
    userId: string;
    branchName: string;
    branchAddress: string;
    createdAt: string;
    updatedAt: string;
  };

  auth0UserId: string;
}
export interface BusinessProfile {
  name: string;
  website: string;
  businessAddress: string;
  logo: string;
  openingHours: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  businessEmail: string;
  businessPhoneNumber: string;
  cacNumber: string;
  accessUsername: string;
  accessNumber: string;
  socialMediaLinks: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  businessDescription: string;
  media: string[];
  isVerified: boolean;
  reviewLink: string;
  preferredContactMethod: string;
  highlights: string[];
  tags: string[];
  averageResponseTime: string;
  profileClicks: number;
  faqs: {
    question: string;
    answer: string;
  }[];
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  parentCategoryId: string | null;
}

export interface BusinessProfileResponse {
  id: string;
  name: string;
  website: string;
  isBranch: boolean;
  avgRating: number;
  reviewCount: number;
  parentBusinessId: string;
  categories: Category[];
  businessAddress: string;
  logo: string | null;
  openingHours: any;
  businessEmail: string;
  businessPhoneNumber: string;
  cacNumber: string;
  accessUsername: string;
  accessNumber: string;
  socialMediaLinks: any;
  businessDescription: string;
  media: any;
  isVerified: boolean;
  reviewLink: string;
  preferredContactMethod: string;
  highlights: any;
  tags: any;
  averageResponseTime: any;
  profileClicks: number;
  faqs: any;
  qrCodeBase64: string;
  businessState?: string;
  businessStreet?: string;
  businessCityTown?: string;
}

export interface BusinessPreference {
  reviewsPrivate: boolean;
  dndModeEnabled: boolean;
  dndModeDurationHours: number;
}

export interface Branch {
  id: string;
  businessId: string;
  name: string;
  branchStreet: string | null;
  branchCityTown: string | null;
  branchState: string | null;
}
export interface TagBusiness {
  id: string;
  name: string;
  website: string | null;
  isBranch: boolean;
  avgRating: number;
  reviewCount: number;
  parentBusinessId: string | null;
  categories: Array<{ id: string; name: string }> | null;
  businessAddress: string | null;
  logo: string | null;
  openingHours: any | null; // Can be more specific if you have the internal structure
  businessEmail: string | null;
  businessPhoneNumber: string | null;
  cacNumber: string | null;
  accessUsername: string | null;
  accessNumber: string | null;
  socialMediaLinks: any | null;
  businessDescription: string | null;
  media: any | null;
  isVerified: boolean;
  reviewLink: string | null;
  preferredContactMethod: string | null;
  highlights: any | null;
  tags: Array<string | { id: string; name: string }> | null;
  averageResponseTime: string | null;
  profileClicks: number;
  faqs: any | null;
  qrCodeBase64: string | null;
}

export interface CategoryBusiness {
  id: string;
  name: string;
  avgRating: number;
  reviewCount: number;
  tags?: Array<string | { id: string; name: string }> | null;
  reviewSummary?: string | null;
  isBranch: boolean;
  parentBusinessId: string | null;
}

export type Business = TagBusiness | CategoryBusiness;

export interface ClaimData {
  businessId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  idDocumentUrl: string | null;
  cacDocumentUrl: string | null;
  proofOfOwnerShipUrl: string | null;
  cacNumber: string;
}
