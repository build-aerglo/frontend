import useApi from "~/composables/useApi";
import useUser from "~/composables/useUser";
import type { BusinessData, LoginData } from "~/types";
export default function () {
  const api = useApi();
  const user = useUser();
  const loginAuth0 = async (data:LoginData, type: "business_user" | "end_user" | "support_user") => {
    try {
      // Step 1: Send email & password to backend
      const res = await api.post("api/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (res.status === 200) {
        const { token, user } = res.data;
        // Step 2: Store token (if any)
        localStorage.setItem("token", token);
        localStorage.setItem("user_type", type);

        // Step 3: Redirect or return user data
        if (type === "business_user") {
          // e.g., navigate to business dashboard
          console.log("Logged in as Business User:", user);
        } else if (type === "end_user") {
          console.log("Logged in as End User:", user);
        } else if (type === "support_user") {
          console.log("Logged in as Support User:", user);
        }
        return user;
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Auth0 login error:", error);
      return { error: "Invalid credentials or network issue" };
    }
  };



  // const registerAuth0 = async (data:BusinessData, type: "business_user" | "end_user" | "support_user") => {
  //   try {
  //     const res = await api.post(
  //       "api/auth/register",
  //       JSON.stringify({ email: data.email, password: data.password})
  //     );
  //     if (res.status === 200) {
  //       if (type === "business_user") {
  //         return await registerBusiness(data);
  //       }
  //       if (type === "end_user") {
  //         return await registerEndUser(data);
  //       }
  //       if (type === "support_user") {
  //         return await registerSupportUser(data);
  //       }
  //       return res.data;
  //     }
  //     throw new Error("Error");
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };
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
    loginAuth0,

  };
}
