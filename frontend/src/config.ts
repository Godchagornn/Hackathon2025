export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const ACTIVE_PROFILE_ID = Number(
  import.meta.env.VITE_ACTIVE_PROFILE_ID ?? 1
);
