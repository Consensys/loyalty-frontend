export const FETCH_CONFIG = {
  headers: {
    'X-API-KEY': import.meta.env.VITE_API_KEY,
    accept: 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning',
  }
}