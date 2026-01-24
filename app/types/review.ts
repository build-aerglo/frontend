export interface Review {
  // Basic Info
  id: string;
  businessId: string;
  businessName: string;
  
  // Location Details
  location: string;
  businessCity?: string;
  businessState?: string;
  businessAddress?: string;
  
  // Category
  category?: string | null;
  
  // Review Content
  body: string;
  rating: number;
  date: string;
  
  // Status Information
  status: string;                // "Posted" | "Pending" | "Rejected"
  statusClass: string;           // CSS classes for status badge
  textClass: string;             // CSS classes for text color
  isGrayedOut: boolean;          // Whether review should be grayed out
  rawStatus: string;             // Original status: "APPROVED" | "PENDING" | "REJECTED"
  
  // Media
  photoUrls?: string[] | null;
  
  // Metadata
  reviewAsAnon?: boolean;
  isGuestReview?: boolean;
  validatedAt?: string | null;
  createdAt?: string;
  
  // Optional legacy fields
  author?: string;
}

// ===================================================================
// OPTION 2: Create a new type file for enriched reviews
// ===================================================================
// File: types/review.ts

export interface EnrichedReview {
  // Basic Info
  id: string;
  businessId: string;
  businessName: string;
  
  // Location Details
  location: string;
  businessCity: string;
  businessState: string;
  businessAddress: string;
  
  // Category
  category: string | null;
  
  // Review Content
  body: string;
  rating: number;
  date: string;
  
  // Status Information
  status: string;                // "Posted" | "Pending" | "Rejected"
  statusClass: string;           // CSS classes for status badge
  textClass: string;             // CSS classes for text color
  isGrayedOut: boolean;          // Whether review should be grayed out
  rawStatus: string;             // Original status: "APPROVED" | "PENDING" | "REJECTED"
  
  // Media
  photoUrls: string[] | null;
  
  // Metadata
  reviewAsAnon: boolean;
  isGuestReview: boolean;
  validatedAt: string | null;
  createdAt: string;
}

// ===================================================================
// OPTION 3: Quick fix - Add to the top of your index.vue <script> section
// ===================================================================

export interface EnrichedReview {
  id: string;
  businessId: string;
  businessName: string;
  location: string;
  businessCity: string;
  businessState: string;
  businessAddress: string;
  category: string | null;
  body: string;
  rating: number;
  date: string;
  status: string;
  statusClass: string;
  textClass: string;
  isGrayedOut: boolean;
  rawStatus: string;
  photoUrls: string[] | null;
  reviewAsAnon: boolean;
  isGuestReview: boolean;
  validatedAt: string | null;
  createdAt: string;
}

// Then update your ref declaration: