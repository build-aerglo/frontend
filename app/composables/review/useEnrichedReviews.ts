// Enhanced composable for fetching user reviews with business information
import useReviewMethods from "~/composables/review/useReviewMethods";
import useBusinessMethods from "~/composables/business/useBusinessMethods";

export default function useEnrichedReviews() {
  const { getUserReviews } = useReviewMethods();
  const { getBusinessProfile, getBusinessBranches } = useBusinessMethods();

  /**
   * Get review status display information
   */
  const getStatusInfo = (status: string) => {
    const statusUpper = status?.toUpperCase() || 'PENDING';
    
    switch (statusUpper) {
      case 'APPROVED':
        return { 
          label: 'Posted', 
          class: 'bg-green-100 text-green-700',
          textClass: 'text-gray-700',
          isGrayedOut: false
        };
      case 'PENDING':
        return { 
          label: 'Pending', 
          class: 'bg-gray-100 text-gray-600',
          textClass: 'text-gray-400',
          isGrayedOut: true
        };
      case 'REJECTED':
        return { 
          label: 'Rejected', 
          class: 'bg-red-100 text-red-700',
          textClass: 'text-gray-400',
          isGrayedOut: true
        };
      default:
        return { 
          label: 'Unknown', 
          class: 'bg-gray-100 text-gray-600',
          textClass: 'text-gray-400',
          isGrayedOut: true
        };
    }
  };

  /**
   * Format location string from branch or business data
   * Priority: Branch data first, then Business data
   */
  const formatLocation = (branchData: any, businessData: any) => {
    const parts = [];
    
    // If we have branch data, use it (it's more specific)
    if (branchData) {
      // Branch fields: branchStreet, branchCityTown, branchState
      if (branchData.branchStreet && branchData.branchStreet.trim()) {
        parts.push(branchData.branchStreet.trim());
      }
      if (branchData.branchCityTown && branchData.branchCityTown.trim()) {
        parts.push(branchData.branchCityTown.trim());
      }
      if (branchData.branchState && branchData.branchState.trim()) {
        parts.push(branchData.branchState.trim());
      }
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    
    // Fall back to business data if no branch data or branch data is incomplete
    if (businessData) {
      // Business fields: businessStreet, businessCityTown, businessState
      // Note: Don't use businessAddress if using businessStreet
      
      if (businessData.businessStreet && businessData.businessStreet.trim()) {
        parts.push(businessData.businessStreet.trim());
      }
      if (businessData.businessCityTown && businessData.businessCityTown.trim()) {
        parts.push(businessData.businessCityTown.trim());
      }
      if (businessData.businessState && businessData.businessState.trim()) {
        parts.push(businessData.businessState.trim());
      }
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
      // Last resort: use businessAddress if available
      if (businessData.businessAddress && businessData.businessAddress.trim()) {
        return businessData.businessAddress.trim();
      }
    }
    
    // Ultimate fallback
    return "Location unavailable";
  };

  /**
   * Fetch location data - checks branch first for location only
   */
  const getLocationData = async (locationId: string, businessId: string) => {
    let matchingBranch = null;
    
    try {
      // Step 1: Try to fetch branch data for location
      console.log(`🔍 Fetching branches for businessId: ${businessId}`);
      const branchResponse = await getBusinessBranches(businessId);
      
      if (branchResponse?.statusCode === 200 && branchResponse.data) {
        // Find the branch that matches the locationId
        matchingBranch = branchResponse.data.find(
          (branch: any) => branch.id === locationId
        );
        
        if (matchingBranch) {
          console.log(`✅ Found matching branch for location:`, matchingBranch);
        } else {
          console.log(`⚠️ No branch found with locationId ${locationId}`);
        }
      }
    } catch (branchError) {
      console.log(`⚠️ Error fetching branches:`, branchError);
    }
    
    // Step 2: ALWAYS fetch business data (for name, category, etc.)
    try {
      console.log(`🔍 Fetching business data for businessId: ${businessId}`);
      const businessResponse = await getBusinessProfile(businessId);
      
      if (businessResponse?.statusCode === 200 && businessResponse.data) {
        console.log(`✅ Found business data:`, businessResponse.data);
        return { branch: matchingBranch, business: businessResponse.data };
      }
    } catch (businessError) {
      console.error(`❌ Failed to fetch business data:`, businessError);
    }
    
    // Return whatever we have
    return { branch: matchingBranch, business: null };
  };

  /**
   * Fetch user reviews and enrich them with business information
   * @param reviewerId - The user's ID
   * @param email - The user's email (optional)
   * @returns Enriched reviews with business data
   */
  const getEnrichedUserReviews = async (reviewerId?: string, email?: string) => {
    try {
      // 1. Fetch all user reviews
      const reviews = await getUserReviews(reviewerId, email);
      
      if (!reviews || reviews.length === 0) {
        return [];
      }

      console.log(`📋 Fetched ${reviews.length} reviews, enriching with business data...`);

      // 2. Fetch business/branch information for each review
      const enrichedReviews = await Promise.all(
        reviews.map(async (review: any) => {
          try {
            // Fetch business data (always) and branch data (for location only)
            const { branch, business } = await getLocationData(
              review.locationId,
              review.businessId
            );
            
            if (!business) {
              throw new Error("No business data found");
            }
            
            // Get status information
            const statusInfo = getStatusInfo(review.status);
            
            // Format location (branch takes priority, falls back to business)
            const location = formatLocation(branch, business);
            
            // Get business name from BUSINESS data (not branch)
            const businessName = business.name || 
                               business.businessName || 
                               "Unknown Business";
            
            // Get category name from BUSINESS data
            const categoryName = business.categories?.[0]?.name || 
                               business.categoryName || 
                               business.category?.name ||
                               null;
            
            console.log(`✅ Enriched review ${review.id}:`, {
              businessName,
              location,
              category: categoryName,
              status: statusInfo.label,
              rating: review.starRating,
              locationSource: branch ? 'branch' : 'business'
            });
            
            // Combine review data with business/branch information
            return {
              id: review.id,
              businessId: review.businessId,
              locationId: review.locationId,
              businessName, // ✅ Always from business table
              location, // ✅ From branch if available, else business
              category: categoryName, // ✅ Always from business table
              // Include both branch and business location details
              branchCity: branch?.branchCityTown || "",
              branchState: branch?.branchState || "",
              branchStreet: branch?.branchStreet || "",
              businessCity: business.businessCityTown || "",
              businessState: business.businessState || "",
              businessStreet: business.businessStreet || "",
              date: review.createdAt
                ? new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : "N/A",
              status: statusInfo.label,
              statusClass: statusInfo.class,
              textClass: statusInfo.textClass,
              isGrayedOut: statusInfo.isGrayedOut,
              rawStatus: review.status,
              body: review.reviewBody || "",
              rating: review.starRating || 0,
              photoUrls: review.photoUrls || null,
              reviewAsAnon: review.reviewAsAnon || false,
              isGuestReview: review.isGuestReview || false,
              validatedAt: review.validatedAt,
              createdAt: review.createdAt,
            };
          } catch (error) {
            console.error(`❌ Failed to fetch data for review ${review.id}:`, error);
            
            // Get status information even for failed fetch
            const statusInfo = getStatusInfo(review.status);
            
            // Return review with fallback data
            return {
              id: review.id,
              businessId: review.businessId,
              locationId: review.locationId,
              businessName: "Business information unavailable",
              location: "Location unavailable",
              category: null,
              branchCity: "",
              branchState: "",
              branchStreet: "",
              businessCity: "",
              businessState: "",
              businessStreet: "",
              date: review.createdAt
                ? new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : "N/A",
              status: statusInfo.label,
              statusClass: statusInfo.class,
              textClass: statusInfo.textClass,
              isGrayedOut: statusInfo.isGrayedOut,
              rawStatus: review.status,
              body: review.reviewBody || "",
              rating: review.starRating || 0,
              photoUrls: review.photoUrls || null,
              reviewAsAnon: review.reviewAsAnon || false,
              isGuestReview: review.isGuestReview || false,
              validatedAt: review.validatedAt,
              createdAt: review.createdAt,
            };
          }
        })
      );

      return enrichedReviews;
    } catch (error: any) {
      console.error("❌ Error fetching enriched reviews:", error);
      throw error;
    }
  };

  return {
    getEnrichedUserReviews,
  };
}