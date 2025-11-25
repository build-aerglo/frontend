import useBusinessApi from "~/composables/business/useBusinessApi";
import useBusinessUser from "./useBusinessUser";

export default function () {
  const store = useBusinessUser();
  const businessApi = useBusinessApi();

  const getCategories = async () => {
    try {
    const res = await businessApi.get("api/Category/top-level"); 
    return res.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }

  };

  return {
    getCategories,
  };
}
