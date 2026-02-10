interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const key = "sk_test_39d7051c278ed1e3c25ffbd8dd7d3c272cf5ea26";

  if (!body.email || !body.amount) {
    return { success: false, error: "Missing Parameters!" };
  }

  const config = useRuntimeConfig();

  try {
    const response = await $fetch<PaystackInitializeResponse>(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        body: {
          ...body,
          callback_url: `${config.public.app_url}/payment/callback`,
          metadata: {
            cancel_url: `${config.public.app_url}/payment/cancel`,
          },
        },
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status) {
      return {
        success: true,
        reference: response.data.reference,
        url: response.data.authorization_url,
      };
    }

    return {
      success: false,
      error: "Transaction Error",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message ?? "Unknown error",
    };
  }
});
