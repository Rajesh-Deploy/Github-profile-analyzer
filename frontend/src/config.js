export const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.warn(
    "WARNING: VITE_API_URL environment variable is not defined. " +
    "Frontend API requests will fail in production if not configured."
  );
}
