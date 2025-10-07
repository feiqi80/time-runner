import dayjs from "dayjs";


const digital = 60;
const formats = [
  "YYYY-MM-DD",
  "YYYY/MM/DD",
  "YYYY-MM-DD HH:mm",
  "YYYY/MM/DD HH:mm",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY/MM/DD HH:mm:ss",
];

export const getTimeDiff = (endTime: string) => {
  if (!isValidTime(endTime)) {
    return "00:00:00";
  }

  const diffMs = dayjs(endTime).diff(dayjs());
  if (diffMs <= 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const t =`${days ? `${days}:` : ""}${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(2, "0")}:${`${seconds}`.padStart(2, "0")}`;

  return t;
}

export const countTime = (t: number) => {
  const fomatTime = (num: number) => `${num}`.padStart(2, "0");
  return `${fomatTime(Math.floor(t / digital / digital))}:${fomatTime(Math.floor(t / digital) % digital)}:${fomatTime(t % digital)}`;
}

export const isValidTime = (time: string) => {
  return formats.some((ele) => dayjs(time, ele, true).isValid());
}