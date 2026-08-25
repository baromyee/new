export const TAB_AUTH_KEY = "bball_tab_auth";

const FRESH_LOGIN_MS = 2 * 60 * 1000;

export function clearTabAuth() {
  sessionStorage.removeItem(TAB_AUTH_KEY);
}

export function markTabAuthenticated() {
  sessionStorage.setItem(TAB_AUTH_KEY, "1");
}

export function hasTabAuth() {
  return sessionStorage.getItem(TAB_AUTH_KEY) === "1";
}

export function isFreshLogin(createdAt: Date | string | number | undefined | null) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < FRESH_LOGIN_MS;
}
