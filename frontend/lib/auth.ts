const KEY = "accessToken";
export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
export const setToken = (t: string) => localStorage.setItem(KEY, t);
export const logout = () => {
  localStorage.removeItem(KEY);
  window.location.href = "/login";
};
