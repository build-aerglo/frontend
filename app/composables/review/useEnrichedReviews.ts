// Enhanced composable for fetching user reviews with business information
import useReviewMethods from "~/composables/review/useReviewMethods";
import useBusinessMethods from "~/composables/business/useBusinessMethods";

export default function useEnrichedReviews() {
  const { getUserReviews } = useReviewMethods();
  const { getBusinessProfile } = useBusinessMethods();

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
   * Format location string from business data
   */
  const formatLocation = (businessData: any) => {
    const parts = [];
    
    // Try different possible location fields
    if (businessData?.businessAddress) {
      parts.push(businessData.businessAddress);
    }
    if (businessData?.businessCityTown) {
      parts.push(businessData.businessCityTown);
    }
    if (businessData?.businessState) {
      parts.push(businessData.businessState);
    }
    
    // If we have location-related data, join it
    if (parts.length > 0) {
      return parts.join(', ');
    }
    
    // Fallback to any location field
    return businessData?.location || "Location unavailable";
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

      // 2. Fetch business information for each review
      const enrichedReviews = await Promise.all(
        reviews.map(async (review: any) => {
          try {
            // Fetch business profile using businessId
            const businessResponse = await getBusinessProfile(review.businessId);
            const businessData = businessResponse?.data;
            
            // Get status information
            const statusInfo = getStatusInfo(review.status);
            
            // Format location
            const location = formatLocation(businessData);
            
            // Get category name (handle different possible structures)
            const categoryName = businessData?.categoryName || 
                               businessData?.category?.name || 
                               businessData?.categories?.[0]?.name ||
                               null;
            
            console.log(`✅ Enriched review ${review.id}:`, {
              businessName: businessData?.businessName || businessData?.name,
              location,
              category: categoryName,
              status: statusInfo.label,
              rating: review.starRating
            });
            
            // Combine review data with business information
            return {
              id: review.id,
              businessId: review.businessId,
              businessName: businessData?.businessName || businessData?.name || "Unknown Business",
              location: location,
              category: categoryName,
              businessCity: businessData?.city || "",
              businessState: businessData?.state || "",
              businessAddress: businessData?.address || "",
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
          } catch (businessError) {
            console.error(`❌ Failed to fetch business data for review ${review.id}:`, businessError);
            
            // Get status information even for failed business fetch
            const statusInfo = getStatusInfo(review.status);
            
            // Return review with fallback business data
            return {
              id: review.id,
              businessId: review.businessId,
              businessName: "Business information unavailable",
              location: "Location unavailable",
              category: null,
              businessCity: "",
              businessState: "",
              businessAddress: "",
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