/**
 * Auth Configuration
 *
 * ENABLE_AUTH: Master flag to turn auth restriction on or off.
 *   - true  → login required to access dashboard pages; redirects to /login if unauthenticated
 *   - false → all pages accessible without logging in (dev/demo mode)
 *
 * To toggle, set NEXT_PUBLIC_ENABLE_AUTH in .env.local:
 *   NEXT_PUBLIC_ENABLE_AUTH=true   # enforce auth
 *   NEXT_PUBLIC_ENABLE_AUTH=false  # skip auth (default)
 */
export const ENABLE_AUTH =
  process.env.NEXT_PUBLIC_ENABLE_AUTH === "true";

/** Cookie name used to store the session token */
export const AUTH_COOKIE = "aquagov_token";

/** Routes that are always public (never redirected) */
export const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/user-login",
  "/user-register",
];

/** Where to redirect unauthenticated users */
export const LOGIN_REDIRECT = "/login";

/** Where to redirect after successful login */
export const POST_LOGIN_REDIRECT = "/";
