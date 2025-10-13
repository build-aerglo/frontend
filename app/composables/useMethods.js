import useApi from "~/composables/useApi";
import useUser from "~/composables/useUser";

export default function () {
  const api = useApi();
  const user = useUser();

  const mockFunction = async () => {
    try {
      const res = await api.get("url");
      if (res.status === 200) {
        return res.body;
      }

      throw new Error("Error");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    mockFunction,
  };
}
