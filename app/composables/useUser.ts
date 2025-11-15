import { useUserStore } from "~/store/user";
export default function () {
  const store = useUserStore();
  return store;
}


