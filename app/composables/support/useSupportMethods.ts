import useBusinessApi from "../business/useBusinessApi";

export default function () {
  const api = useBusinessApi();

  const getBusinessClaims = async (
    status?: number,
    date?: string,
    page = 1,
    pageSize = 10,
  ) => {
    let endpoint = `/api/Support/business-claims`;

    endpoint += `?page=${page}&pageSize=${pageSize}`;

    if (status) {
      endpoint += `&status=${status}`;
    }

    if (date) {
      endpoint += `&date_filter=${date}`;
    }

    try {
      const res = await api.get(endpoint);
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

  const updateClaimStatus = async (
    id: string,
    status: string,
    userId: string,
  ) => {
    try {
      const res = await api.put(`/api/Support/update-claim-status/${id}`, {
        userId: userId,
        status: status,
      });
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const approveClaim = async (id: string, userId: string) => {
    try {
      const res = await api.post(`/api/Support/approve-claim/${id}`, {
        userId: userId,
      });
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const rejectClaim = async (
    id: string,
    userId: string,
    rejectReason: string,
  ) => {
    try {
      const res = await api.post(`/api/Support/reject-claim/${id}`, {
        userId: userId,
        rejectReason: rejectReason,
      });
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };
  return {
    getBusinessClaims,
    updateClaimStatus,
    approveClaim,
    rejectClaim,
  };
}
