export interface BusinessRegistrationForm {
  businessName: string;
  businessAddress: string;
  logo: string;
  openingDaysTime: string;
  businessEmail: string;
  businessPhoneNum: string;
  cacNum: string; 
  branchUsername: string; 
  branchPhoneNum: string;
  socialMediaLinks: string; 
  websiteLink: string;
  businessDescription: string;
  sector: string; 
  mediaFiles: File[] | string[];
  verifiedBadge: boolean;
  reviewLink: string;
  preferredModeOfContact: string; 
}

// the basic structure for form field
export interface FormField {
  label: string;
  fieldName: keyof BusinessRegistrationForm;
  type: string;
  mandatory: boolean;
  desc?: string; 
}