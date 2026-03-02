import useBusinessApi from "~/composables/business/useBusinessApi";
import useNotificationApi from "../api/useNotificationApi";
import useBusinessMethods from "../business/useBusinessMethods";
import { useBusinessSubscription } from "~/store/business/businessSubscription";
import type { BusinessVerification } from "~/types/business";

interface IDRequest {
  id: string;
  url: string;
  type: string;
  name?: string;
}
export default function () {
  const api = useBusinessApi();
  const notification_api = useNotificationApi();
  const businessSubscription = useBusinessSubscription();
  const { getBusinessVerificationFromStore } = useBusinessMethods();

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

  const getBusinessVerification = async (id: string, update?: boolean) => {
    if (!update) {
      const biz_subscription = await getBusinessVerificationFromStore();
      if (biz_subscription !== null) {
        return {
          statusCode: 200,
          data: biz_subscription,
        };
      }
    }

    try {
      const res = await api.get(`api/BusinessVerification/${id}`);
      if (res.status === 200) {
        const sub = await encryptJSONNative(res.data);
        businessSubscription.setVerificationData(sub);
      }
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const updateBusinessVerificationStore = async (
    data: BusinessVerification,
  ) => {
    const sub = await encryptJSONNative(data);
    businessSubscription.setVerificationData(sub);
  };

  return {
    sendVerificationOtp,
    confirmVerificationOtp,
    verifyId,
    getBusinessVerification,
    updateBusinessVerificationStore,
  };
}
