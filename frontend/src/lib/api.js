import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://referral-credit-system-7xml.onrender.com";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// helper to set/unset token after login/logout
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
