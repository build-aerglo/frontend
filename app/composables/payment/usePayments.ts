import useBusinessApi from "../business/useBusinessApi";

import type { Plan } from "~/types/payment";
export default function () {
  const business_api = useBusinessApi();

  const checkoutPayment = async (data: any) => {
    try {
      const res = await business_api.post(
        `api/SubscriptionInvoice/checkout`,
        data,
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

  const verifyInvoice = async (id: string) => {
    try {
      const res = await business_api.get(
        `api/SubscriptionInvoice/invoice/${id}`,
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

  const validatePayment = async (ref: string) => {
    try {
      const res = await business_api.get(
        `api/SubscriptionInvoice/validate-payment/${ref}`,
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

  const downgradePlan = async (data: Plan) => {
    try {
      const res = await business_api.put(`api/Subscription/upgrade`, data);
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
  return {
    verifyInvoice,
    checkoutPayment,
    validatePayment,
    downgradePlan,
  };
}
