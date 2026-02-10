import useBusinessApi from "~/composables/business/useBusinessApi";
import useNotificationApi from "../api/useNotificationApi";

interface IDRequest {
  id: string;
  url: string;
  type: string;
  name?: string;
}
export default function () {
  const api = useBusinessApi();
  const notification_api = useNotificationApi();

  const sendVerificationOtp = async (
    type: string,
    id: string,
    purpose?: string,
  ) => {
    try {
      const res = await notification_api.post(
        `api/otp/create?id=${id}&purpose=${purpose}&type=${type}`,
      );
      return {
        ok: true,
        statusCode: res.status,
        data: res.data,
      };
    } catch (error: any) {
      const statusCode = error?.response?.status ?? 500;
      const data = error?.response?.data ?? { message: "Something went wrong" };

      return {
        ok: false,
        statusCode,
        data,
      };
    }
  };

  const confirmVerificationOtp = async (
    code: string,
    id: string,
    type: string,
  ) => {
    try {
      const res = await notification_api.post(
        `api/otp/validate?id=${id}&code=${code}&type=${type}`,
      );
      return {
        ok: true,
        statusCode: res.status,
        data: res.data,
      };
    } catch (error: any) {
      const statusCode = error?.response?.status ?? 500;
      const data = error?.response?.data ?? { message: "Something went wrong" };

      return {
        ok: false,
        statusCode,
        data,
      };
    }
  };

  const verifyId = async (data: IDRequest) => {
    return {
      statusCode: 200,
    };
  };

  const getBusinessVerification = async (id: string) => {
    try {
      const res = await api.get(`api/BusinessVerification/${id}`);
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  return {
    sendVerificationOtp,
    confirmVerificationOtp,
    verifyId,
    getBusinessVerification,
  };
}
