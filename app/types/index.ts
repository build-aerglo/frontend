export interface EndUser {
  username: string;
  email: string;
  phone: string;
  password: string;
  socialMedia: string;
}
export interface LoginData {
  email: string;
  password: string;
}

export interface UserReview {
  businessId?: string | null;
  businessName?: string | null;
  isNewBusiness: boolean;
  locationId?: string | null;
  isNewBranch: boolean;
  branchStreet?: string | null;
  branchCityTown?: string | null;
  branchState?: string | null;
  reviewerId?: string | null;
  email?: string | null;
  starRating: number;
  reviewBody: string;
  photoUrls?: string[] | null;
  reviewAsAnon: boolean;
}