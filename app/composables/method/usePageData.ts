import type { BusinessProfileResponse } from "~/types/business";

type PageDataState = {
  data: BusinessProfileResponse | null;
  isBusiness: boolean;
};

export const usePageData = () =>
  useState<PageDataState>("pageData", () => ({
    data: null,
    isBusiness: false,
  }));
