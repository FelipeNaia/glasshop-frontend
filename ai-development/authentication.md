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
- `logout(refreshToken)` → `POST /api/auth/logout`

## Axios wiring (`src/api/authToken.js`)
- The access token lives in a plain module-level variable here (not React state) so the
  axios interceptors can read/attach it synchronously outside the React tree; `AuthContext`
  is still the single source of truth and pushes updates into this module on every
  login/refresh/logout.
- Request interceptor: attach `Authorization: Bearer <accessToken>` to every request.
- Response interceptor: on `401` (excluding `/api/auth/**` itself), call the refresh
  handler registered by `AuthContext`, dedupe concurrent 401s onto one in-flight refresh,
  then retry the original request with the new token; if refresh fails, propagate the
  error (auth state is cleared, and any `RequireAuth`/`RequireAdmin`-guarded route the
  user is on redirects on its next render).

## `AuthContext` (`src/context/AuthContext.jsx`)
- State: `user` (`{ id, email, role }`, taken directly from the `userId`/`email`/`role`
  fields the backend already returns on login/refresh — no JWT decoding needed on the
  frontend), `isLoading` (true while the silent refresh-on-load runs). The access token
  itself is not exposed as React state — see Axios wiring above.
- Actions: `login(email, password)`, `register(email, password)`, `logout()`.
- On mount: if a refresh token exists in `localStorage`, call `refresh()` silently to
  obtain a fresh access token before rendering protected content.

## Routing & pages
| Path | Component | Notes |
|------|-----------|-------|
| `/login` | `LoginPage` | Email + password form, calls `login`, redirects to `/` (or the page the user was trying to reach) on success. |
| `/register` | `RegisterPage` | Email + password form, calls `register`, then logs in automatically. |

## Route protection
- `RequireAuth` wrapper component (`src/components/RequireAuth.jsx`) — a React Router v6
  layout route (`<Outlet/>`-based) that redirects to `/login` if `user` is null. Built,
  but not yet applied to any route — `/cart`, `/checkout`, `/orders`, `/orders/:id` don't
  exist yet; wiring it up is part of the [shopping-cart](shopping-cart.md) /
  [payment](payment.md) tickets.
- `RequireAdmin` wrapper component (`src/components/RequireAdmin.jsx`) — same pattern,
  redirects to `/` if `user.role !== 'ADMIN'`. Applied to `/admin` and
  `/admin/products/:id` in `App.jsx`, replacing the previously unprotected routes.

## Sidebar changes (`src/components/Sidebar.jsx`)
- Show "Admin" nav link only when `user?.role === 'ADMIN'`.
- Show "Login" when logged out; show email + "Logout" button when logged in.

---

## Checklist

- [x] `src/api/auth.js` — register/login/refresh/logout wrappers
- [x] Axios request interceptor (attach access token)
- [x] Axios response interceptor (401 → refresh → retry, else propagate so route guards redirect)
- [x] `AuthContext` + provider, wrapping `App.jsx`
- [x] Silent refresh-on-load using the stored refresh token
- [x] `LoginPage` + route
- [x] `RegisterPage` + route
- [x] `RequireAuth` wrapper component built (`src/components/RequireAuth.jsx`)
- [ ] `RequireAuth` applied to `/cart`, `/checkout`, `/orders`, `/orders/:id` — blocked on those routes existing (see [shopping-cart](shopping-cart.md), [payment](payment.md))
- [x] `RequireAdmin` wrapper, applied to `/admin`, `/admin/products/:id`
- [x] Sidebar: conditional Admin link, login/logout state
- [x] Logout clears `AuthContext`/axios state + `localStorage` refresh token + redirects to `/`
