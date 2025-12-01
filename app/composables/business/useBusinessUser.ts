import { useBusinessUserStore } from "~/store/business/businessUser";
export default function () {
  const store = useBusinessUserStore();
  return store;
}