# Feature: Authentication & Authorization (Frontend)

Login/register UI, token storage, and route protection for the two backend roles
(`BUYER`, `ADMIN`). This is the foundation ticket — the cart and checkout UIs both
require a logged-in buyer, and the existing `/admin` routes currently have **no**
protection at all (anyone can navigate to `/admin` today).

Mirrors the backend spec: [`../backend/ai-development/authentication.md`](../../backend/ai-development/authentication.md).

**Out of scope for v1:** forgot/reset password UI, email verification UI, "remember me"
beyond normal token expiry (matches backend's out-of-scope list).

---

## Token storage decision

The backend returns both tokens directly in the response body (no cookies). Plan:
- **Access token** — kept in memory only (`AuthContext` state), never persisted. Lost on
  page refresh by design; recovered via a silent `POST /api/auth/refresh` on app load.
- **Refresh token** — persisted in `localStorage` so a page refresh doesn't force a full
  re-login. Accepted tradeoff: vulnerable to XSS exfiltration like any localStorage value;
  no `httpOnly` cookie option exists here since the backend hands the raw token to the
  client, not a `Set-Cookie` header.

## API layer (`src/api/auth.js`)
- `register(email, password)` → `POST /api/auth/register`
- `login(email, password)` → `POST /api/auth/login`
- `refresh(refreshToken)` → `POST /api/auth/refresh`
- `logout()` → `POST /api/auth/logout`

## Axios wiring
- Request interceptor: attach `Authorization: Bearer <accessToken>` from `AuthContext` to
  every request.
- Response interceptor: on `401`, attempt one `refresh()` call; if it succeeds, retry the
  original request with the new access token; if it fails, clear auth state and redirect
  to `/login`.

## `AuthContext` (`src/context/AuthContext.jsx`)
- State: `user` (`{ id, email, role }` decoded from the access token, or fetched), `accessToken`, `isLoading` (true while the silent refresh-on-load runs).
- Actions: `login(email, password)`, `register(email, password)`, `logout()`.
- On mount: if a refresh token exists in `localStorage`, call `refresh()` silently to
  obtain a fresh access token before rendering protected content.

## Routing & pages
| Path | Component | Notes |
|------|-----------|-------|
| `/login` | `LoginPage` | Email + password form, calls `login`, redirects to `/` (or the page the user was trying to reach) on success. |
| `/register` | `RegisterPage` | Email + password form, calls `register`, then logs in automatically. |

## Route protection
- `RequireAuth` wrapper component — redirects to `/login` if `accessToken` is null (used
  to guard `/cart`, `/checkout`, `/orders`, `/orders/:id`).
- `RequireAdmin` wrapper component — redirects to `/` if `user.role !== 'ADMIN'` (used to
  guard `/admin` and `/admin/products/:id`, replacing today's unprotected routes in
  `App.jsx`).

## Sidebar changes (`src/components/Sidebar.jsx`)
- Show "Admin" nav link only when `user?.role === 'ADMIN'`.
- Show "Login" when logged out; show email + "Logout" button when logged in.

---

## Checklist

- [ ] `src/api/auth.js` — register/login/refresh/logout wrappers
- [ ] Axios request interceptor (attach access token)
- [ ] Axios response interceptor (401 → refresh → retry, else redirect to `/login`)
- [ ] `AuthContext` + provider, wrapping `App.jsx`
- [ ] Silent refresh-on-load using the stored refresh token
- [ ] `LoginPage` + route
- [ ] `RegisterPage` + route
- [ ] `RequireAuth` wrapper, applied to `/cart`, `/checkout`, `/orders`, `/orders/:id`
- [ ] `RequireAdmin` wrapper, applied to `/admin`, `/admin/products/:id`
- [ ] Sidebar: conditional Admin link, login/logout state
- [ ] Logout clears `AuthContext` state + `localStorage` refresh token + redirects to `/`
