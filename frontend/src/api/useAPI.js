import axios from "axios";

let apiSingleton = null;
export default function useAPI() {
  if (!apiSingleton) {
    apiSingleton = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL,
    });
  }
  return apiSingleton;
}
