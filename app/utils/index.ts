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
