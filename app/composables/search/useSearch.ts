import useSearchApi from "./useSearchApi";
export default function () {
  const api = useSearchApi();
  const search = async (q: string) => {
    try {
      const res = await api.get(`api/search?query=${q}`);

      if (res) {
        return res.data;
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return {
    search,
  };
}
