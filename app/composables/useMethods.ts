import useApi from "~/composables/useApi";
import useUser from "~/composables/useUser";
import type { BusinessData } from "~/types";
export default function () {
  const api = useApi();
  const user = useUser();
  const registerBusiness = async (data: BusinessData) => {
    try {
      const res = await api.post("/api/User/create-business-user", JSON.stringify({data}))
      if (res.status === 200 ) {
        return res.data;
      }
      throw new Error("Error");
    } catch (error) {
      console.log(error)
    }
  };

  const mockFunction = async () => {
    try {
      const res = await api.get("url");
      if (res.status === 200) {
        return res.data;
      }

      throw new Error("Error");
    } catch (error) {
      console.log(error);
    }
  };

  const mockFunctionPost = async () => {
    try {
      const res = await api.post("url", JSON.stringify({ name: "test" }));
      if (res.status === 200) {
        return res.data;
      }

      throw new Error("Error");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    mockFunction,
    mockFunctionPost,
    registerBusiness
  };
}
