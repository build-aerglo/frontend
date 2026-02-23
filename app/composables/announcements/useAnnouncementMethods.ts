import useBusinessAnnouncements from "./useBusinessAnnouncements";
import type { Announcement } from "~/store/announcement";
export default function () {
  const store = useBusinessAnnouncements();

  const getAnnouncements = () => {
    return { data: store.getAnnouncements };
  };

  const createAnnouncement = async (data: Announcement) => {
    store.setAnnouncement(data);
  };

  const closeAnnouncement = async (id: string) => {
    store.deleteAnnouncement(id);
  };

  const verifyAccountAnnnouncement = {
    id: "verify-account",
    description: "Complete the next steps to get your business live.",
    header: "Complete your business profile",
    url: "/business/verification/",
    urlLabel: "Verify Business Details",
    isClosable: false,
    hasLink: true,
    percentageComplete: 0,
  };

  const reverifyEmailAnnnouncement = {
    id: "verify-email",
    description: "Business email address needs reverification.",
    header: "Reverify business profile",
    url: "/business/verification/",
    urlLabel: "Reverify Profile",
    isClosable: false,
    hasLink: true,
  };

  const reverifyPhoneAnnnouncement = {
    id: "verify-phone",
    description: "Business phone number needs reverification.",
    header: "Reverify business profile",
    url: "/business/verification/",
    urlLabel: "Re-verify Profile",
    isClosable: false,
    hasLink: true,
  };

  return {
    getAnnouncements,
    createAnnouncement,
    closeAnnouncement,

    // # constants
    verifyAccountAnnnouncement,
    reverifyEmailAnnnouncement,
    reverifyPhoneAnnnouncement,
  };
}
