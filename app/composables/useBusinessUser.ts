import { useBusinessUserStore } from "~/store/businessUser";
export default function () {
  const store = useBusinessUserStore();
  return store;
}