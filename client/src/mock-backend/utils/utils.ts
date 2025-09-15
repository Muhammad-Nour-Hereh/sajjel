// Build absolute URLs to match axios (baseURL + route)
const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const url = (path: string) => BASE_URL + path
