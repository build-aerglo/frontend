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
  businessId: String;
  locationId: String;
  reviewerId: String;
  email: String;
  starRating: Number;
  reviewBody: String;
  photoUrls: String[]
  reviewAsAnon: Boolean;
}