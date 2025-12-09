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
