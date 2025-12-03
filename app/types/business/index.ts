export interface BusinessUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: string;
  categoryIds: string[]
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
    branchName: string | null;
    branchAddress: string | null;
    createdAt: string;
    updatedAt: string;
  };

  auth0UserId: string;
}
export interface BusinessProfile {
  name: string;
  website: string;
  sector: string;
  contact: string;
   location: {
    street:string;
    city:string;
    state:string;
  };
   openingHours: {
    dayKey: 'mon-sat', 
    startTime: '07:00',
    endTime: '23:00',
  }; 
  categoryIds: string[]
  parentBusinessId: string | null;
}

export interface BusinessPreference {
  reviewsPrivate: boolean;
  dndModeEnabled: boolean;
  dndModeDurationHours: number | null;
}
