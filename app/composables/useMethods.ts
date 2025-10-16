import useApi from "~/composables/useApi";
import useUser from "~/composables/useUser";
// import type { BusinessRegistrationForm } from '~/types/business';
export default function () {
  const api = useApi();
  const user = useUser();

  const submitRegistrationForm = async (formData: BusinessRegistrationForm) => {
    try {
      const res = await api.post("registration endpoint", JSON.stringify(formData));
      
      if (res.status === 200 || res.status === 201) {
        
        return { success: true, data: res.data };
      }

      throw new Error("Registration failed: " + res.status);
    } catch (error) {
      console.error("Form submission error:", error);
      let errorMessage = 'An unknown error occurred.';

      if (error instanceof Error) {
        errorMessage = error.message;
      return { success: false, error: errorMessage };
    }  
  };
}


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
    submitRegistrationForm
  };
}
