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

type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type RawHours = Record<Day, string>;

type DayBlock = {
  open: string | null;
  close: string | null;
  closed: boolean;
};

type NormalizedHours = {
  same: boolean;
  same_time: DayBlock;
} & Record<Day, DayBlock>;

const DAYS: readonly Day[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const WEEKDAYS: readonly Day[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

function parseRange(range: string): { open: string; close: string } | null {
  if (range === "00:00 - 00:00") return null;
  const [open, close] = range.split(" - ");
  // @ts-ignore
  return { open, close };
}

function toISO(time: string): string {
  const d = new Date().toISOString().split("T")[0];
  return new Date(`${d}T${time}:00.000Z`).toISOString();
}

// function isoToRange(open: string | null, close: string | null): string {
//   if (!open || open === null || close === null || !close)
//     return "00:00 - 00:00";
//   return `${open.slice(11, 16)} - ${close.slice(11, 16)}`;
// }
function isoToRange(
  open: string | Date | null,
  close: string | Date | null,
): string {
  if (!open || !close) {
    return "00:00 - 00:00";
  }

  const openStr = typeof open === "string" ? open : open.toISOString();

  const closeStr = typeof close === "string" ? close : close.toISOString();

  return `${openStr.slice(11, 16)} - ${closeStr.slice(11, 16)}`;
}

export function rawToNormalized(raw: RawHours): NormalizedHours {
  const out = {} as NormalizedHours;
  const weekdayRanges: string[] = [];

  for (const day of DAYS) {
    const parsed = parseRange(raw[day]);

    if (!parsed) {
      out[day] = { open: null, close: null, closed: true };
    } else {
      out[day] = {
        open: toISO(parsed.open),
        close: toISO(parsed.close),
        closed: false,
      };

      if (WEEKDAYS.includes(day)) {
        weekdayRanges.push(raw[day]);
      }
    }
  }

  const same =
    weekdayRanges.length === 5 &&
    weekdayRanges.every((r) => r === weekdayRanges[0]);

  if (same) {
    // @ts-ignore
    const parsed = parseRange(weekdayRanges[0]);
    if (!parsed) throw new Error("Invalid weekday range");

    out.same_time = {
      open: toISO(parsed.open),
      close: toISO(parsed.close),
      closed: false,
    };

    for (const d of WEEKDAYS) {
      out[d] = { open: null, close: null, closed: true };
    }
  } else {
    out.same_time = { open: null, close: null, closed: true };
  }

  out.same = same;
  return out;
}

export function normalizedToRaw(n: NormalizedHours): RawHours {
  const out = {} as RawHours;

  if (n.same && !n.same_time.closed) {
    const range = isoToRange(n.same_time.open, n.same_time.close);
    for (const d of WEEKDAYS) {
      out[d] = range;
    }
  } else {
    for (const d of WEEKDAYS) {
      out[d] = isoToRange(n[d].open, n[d].close);
    }
  }

  out.saturday = isoToRange(n.saturday.open, n.saturday.close);
  out.sunday = isoToRange(n.sunday.open, n.sunday.close);

  return out;
}

export const businessClaim = (s: string) => {
  const status = s.toLowerCase();
  if (status === "approved") return "Claimed Business";
  if (status === "in_progress") return "Claim in Progress";
  if (status === "unclaimed") return "Unclaimed Business";
};

export const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();

  // Mapping category keywords to appropriate icons
  if (
    name.includes("restaurant") ||
    name.includes("food") ||
    name.includes("dining")
  ) {
    return "pi-shopping-bag";
  }
  if (
    name.includes("hotel") ||
    name.includes("accommodation") ||
    name.includes("lodging")
  ) {
    return "pi-building";
  }
  if (
    name.includes("health") ||
    name.includes("medical") ||
    name.includes("hospital")
  ) {
    return "pi-heart";
  }
  if (
    name.includes("education") ||
    name.includes("school") ||
    name.includes("university")
  ) {
    return "pi-book";
  }
  if (
    name.includes("entertainment") ||
    name.includes("cinema") ||
    name.includes("movie")
  ) {
    return "pi-ticket";
  }
  if (
    name.includes("shop") ||
    name.includes("retail") ||
    name.includes("store")
  ) {
    return "pi-shopping-cart";
  }
  if (
    name.includes("beauty") ||
    name.includes("salon") ||
    name.includes("spa")
  ) {
    return "pi-sparkles";
  }
  if (
    name.includes("fitness") ||
    name.includes("gym") ||
    name.includes("sport")
  ) {
    return "pi-heart-fill";
  }
  if (
    name.includes("auto") ||
    name.includes("car") ||
    name.includes("vehicle")
  ) {
    return "pi-car";
  }
  if (
    name.includes("finance") ||
    name.includes("bank") ||
    name.includes("money")
  ) {
    return "pi-wallet";
  }
  if (
    name.includes("tech") ||
    name.includes("computer") ||
    name.includes("electronics")
  ) {
    return "pi-desktop";
  }
  if (name.includes("service") || name.includes("business")) {
    return "pi-briefcase";
  }
  if (
    name.includes("travel") ||
    name.includes("tour") ||
    name.includes("tourism")
  ) {
    return "pi-compass";
  }
  if (
    name.includes("pet") ||
    name.includes("animal") ||
    name.includes("veterinary")
  ) {
    return "pi-discord";
  }
  if (
    name.includes("home") ||
    name.includes("furniture") ||
    name.includes("decor")
  ) {
    return "pi-home";
  }

  // Default icon for unmatched categories
  return "pi-tag";
};

// const ENCRYPTION_KEY = "YourSecure32CharacterKeyHere123";

export async function encryptPasswordNative(password: string): Promise<string> {
  // Convert key to bytes (ensure 32 bytes for AES-256)
  const config = useRuntimeConfig();
  const ENCRYPTION_KEY = config.public.encrypt_key as string;

  const keyBytes = new TextEncoder().encode(
    ENCRYPTION_KEY.padEnd(32).substring(0, 32),
  );

  // Generate random 16-byte IV
  const iv = crypto.getRandomValues(new Uint8Array(16));

  // Import key for AES-CBC
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["encrypt"],
  );

  // Encrypt
  const passwordBytes = new TextEncoder().encode(password);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    passwordBytes,
  );

  // Combine IV and ciphertext
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Convert to Base64
  return btoa(String.fromCharCode(...combined));
}

export function moneyFormat(amount: number) {
  if (isNaN(amount)) return "";

  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getDayWithSuffix(day: number) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export function dateFormat(dateString: string) {
  const date = new Date(dateString);
  const day = getDayWithSuffix(date.getDate());
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}
