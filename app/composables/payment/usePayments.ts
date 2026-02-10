export default function () {
  interface PaystackResponse {
    success: boolean;
    reference?: string;
    url?: string;
    error?: any | undefined;
  }
  const checkoutPaystack = async (data: { email: string; amount: number }) => {
    try {
      const res = await $fetch<PaystackResponse>("/api/pay/paystack/", {
        method: "POST",
        body: data,
      });

      return {
        ok: true,
        url: res.url,
        reference: res.reference,
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
    checkoutPaystack,
  };
}
