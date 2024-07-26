import { Cookies } from "react-cookie";

export enum CookieKey {
  ACCESS_TOKEN = "accessToken",
  TMP = "tmp",
}
const cookies = new Cookies();

export const setCookie = (name: CookieKey, value: string, option?: any) => {
  return cookies.set(name, value, { ...option });
};

export const getCookie = (name: CookieKey) => {
  return cookies.get(name);
};
