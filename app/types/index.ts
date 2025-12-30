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
  businessId: string;
  locationId: string | null;
  reviewerId: string | null;
  email: string | null;
  starRating: number;
  reviewBody: string;
  photoUrls: string[] | null;
  reviewAsAnon: boolean;
}