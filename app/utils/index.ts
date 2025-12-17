export function genRand(length = 10): string {
  const alphaNum =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
  }
  return str;
}

export const parseDateToReadableDateString = (date: Date): string => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

export function splitBusinessImages(urls: string[]) {
  const inside: string[] = [];
  const outside: string[] = [];

  urls.forEach((url) => {
    if (url.includes("/inside/")) inside.push(url);
    else if (url.includes("/outside/")) outside.push(url);
  });

  return { inside, outside };
}

export const timeFormat = (date: Date): string => {
  date = new Date(date);
  const hour = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);

  const time = convertHour(date.getHours());
  return `${time.hour}:${minutes}${time.zone}`;
};

const convertHour = (hour: number) => {
  const zone = makeZone(hour);

  let _hour;
  switch (hour) {
    case 13:
      _hour = 1;
      break;
    case 14:
      _hour = 2;
      break;
    case 15:
      _hour = 3;
      break;
    case 16:
      _hour = 4;
      break;
    case 17:
      _hour = 5;
      break;
    case 18:
      _hour = 6;
      break;
    case 19:
      _hour = 7;
      break;
    case 20:
      _hour = 8;
      break;
    case 21:
      _hour = 9;
      break;
    case 22:
      _hour = 10;
      break;
    case 23:
      _hour = 11;
      break;
    case 0:
      _hour = 12;
      break;

    default:
      _hour = hour;
      break;
  }

  const __hour = `0${_hour}`.slice(-2);
  return { hour: __hour, zone: zone };
};

const makeZone = (hour: number) => {
  if (hour === 0o0) {
    return "am";
  } else if (hour === 12) {
    return "pm";
  } else if (hour > 12) {
    return "pm";
  } else {
    return "am";
  }
};

export const tagsContants = [
  "Fine-Dinning",
  "Bukka",
  "Bakery",
  "Pastries",
  "Bar",
  "Night-life",
  "Local-Flavour",
  "Intercontinental",
  "Buffet",
  "Affordable",
  "Vegetarian",
  "Italian",
  "Deserts",
  "Premium",
  "Kids-Friendly",
  "Romantic",
  "Business",
  "Language school",
  "Swimming Lesson",
  "Bootcamps",
  "Vocational Training",
  "Professional courses",
  "Music school",
  "Driving school",
  "Fashion school",
  "Culinary school",
  "Information Technology",
  "Certification",
  "Weekend Classes",
  "Online",
  "Physical",
  "Hybrid",
  "Massage",
  "Clinics",
  "Dental",
  "Optician",
  "Mental-Health",
  "Spas",
  "Gyms",
  "Diagnotics",
  "Pharmacy",
  "Physiotherapy",
];

export const countries = [
  { name: "Nigeria", code: "ngn" },
  { name: "Uganda", code: "ugd" },
  { name: "Ghana", code: "ghn" },
  { name: "Zimbabwe", code: "zim" },
];

export const SOCIAL_HANDLES = [
  "facebook",
  "instagram",
  "whatsapp",
  "twitter",
  "linkedin",
  "tiktok",
];

export function getInitials(firstName?: string): string {
  // If either name is missing or empty, return "UR"
  if (!firstName) {
    return "U";
  }

  const firstInitial = firstName.charAt(0).toUpperCase();

  return firstInitial;
}

export const getColorCode = (i: string) => {
  if (!i) return "#689F38";

  // @ts-ignore
  const initial = i[0].toUpperCase();

  const batch_a = "ABCDEF";
  const batch_b = "GHIJKL";
  const batch_c = "MNOPQR";
  const batch_d = "RSTUVWX";
  const batch_e = "YZ";

  if (batch_a.includes(initial)) {
    return "#689F38";
  }

  if (batch_b.includes(initial)) {
    return "#FFE1BA";
  }

  if (batch_c.includes(initial)) {
    return "#8D6E63";
  }

  if (batch_d.includes(initial)) {
    return "#78909C";
  }

  if (batch_e.includes(initial)) {
    return "#FFF7C4";
  }

  // fallback (optional but recommended)
  return "#689F38";
};

// export const getMaxMedia = (plan: string) => {
//   if (plan === 'free') return 5;

// }

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { label: string; seconds: number }[] = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "min", seconds: 60 },
    { label: "sec", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export const getBadge = (s: string) => {
  const status = s.toLowerCase();
  if (status === "verified")
    return { badge: "b-user-chck-light", status: "Verified Business" };
  if (status === "trusted")
    return { badge: "b-user-rbn-light", status: "Trusted Business" };
  if (status === "standard")
    return { badge: "b-user-shld-light", status: "Standard Business" };
};

export const truncateDate = (s: string) => {
  const day = s.toLowerCase();
  let returnDay = "mon";
  switch (day) {
    case "monday":
      returnDay = "mon";
      break;

    case "tuesday":
      returnDay = "tue";
      break;

    case "wednesday":
      returnDay = "Wed";
      break;

    case "thursday":
      returnDay = "thur";
      break;

    case "friday":
      returnDay = "fri";
      break;

    case "saturday":
      returnDay = "sat";
      break;

    case "sunday":
      returnDay = "sun";
      break;

    default:
      break;
  }

  return returnDay;
};
