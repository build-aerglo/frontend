import { useBusinessAnnouncement } from "~/store/announcement";
export default function () {
  const store = useBusinessAnnouncement();
  return store;
}
