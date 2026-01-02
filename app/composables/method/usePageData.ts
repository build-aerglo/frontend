import type { BusinessProfileResponse } from "~/types/business";

export const usePageData = () => useState<BusinessProfileResponse>("pageData");
