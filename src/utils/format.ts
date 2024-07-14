import { format } from "date-fns";

export const timeFormat = (date: any) => {
  return date ? format(date * 1000, "yyyy-MM-dd HH:mm:ss") : "";
};
