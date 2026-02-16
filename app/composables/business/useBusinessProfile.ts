import { useBusinessProfileStore } from "~/store/business/businessProfile";
export default function () {
  const store = useBusinessProfileStore();
  return store;
}
