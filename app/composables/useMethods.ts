import useApi from "~/composables/useApi";
import useBusinessApi from "~/composables/useBusinessApi";
import useUser from "~/composables/useUser";
import type { BusinessData, LoginData } from "~/types";
export default function () {
  const api = useApi();
  const businessApi = useBusinessApi();
  const user = useUser();
  const loginUser = async (data: LoginData) => {
  try {
    const res = await api.post("api/auth/login", {
      email: data.email,
      password: data.password,
    });

    if (res.status === 200) {
      const { token, user } = res.data;
      if (token) {
        localStorage.setItem("token", token);
      }
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Login successful:", user);
      navigateTo("/business/profile");

      return user;
    } else {
      throw new Error("Login failed");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      error: error.response?.data?.message || "Invalid credentials or network issue",
    };
  }
};
const registerBusiness = async (data: BusinessData) => {
  try {
    const res = await api.post("api/User/business", data);

    if (res.status === 200 || res.status === 201) {
      console.log("Business registered successfully:", res.data);
      return res.data;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error: any) {
    console.error("Business registration error:", error);
    return {
      error: error.response?.data?.message || "Something went wrong during registration",
    };
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
    loginUser,
    registerBusiness
  };
}
