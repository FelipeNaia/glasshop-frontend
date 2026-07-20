# Project Conventions

## Money / Prices
- Prices come from the API as integer **cents** (matches the backend convention)
- Convert to display units only at render time, e.g. `(price / 100).toFixed(2)` — see
  `src/pages/ProductPage.jsx` — never store a converted float back in state

## Stack
- React 18 + Vite
- React Router v6 (client-side routing, `BrowserRouter`)
- Axios for API calls
- Context API for global state (no Redux/Zustand)
- CSS Modules (`*.module.css`) for component styling, no CSS-in-JS

## In-progress feature specs — `ai-development/`
Before starting work on auth, cart, or checkout/payment UI, read the matching file in
`ai-development/` first — it has the routes, components, API layer, and a checkbox list
of what's done vs. outstanding:
- `ai-development/authentication.md`
- `ai-development/shopping-cart.md`
- `ai-development/payment.md`

These mirror the equivalent specs in `../backend/ai-development/` — the frontend ticket
depends on the backend endpoints described there actually existing. When you finish a
piece of work described in one of these files, tick its checkbox (`- [ ]` → `- [x]`) so
the next session (human or model) knows what's already implemented. If a detail turns
out wrong or outdated once you've looked at the real code, update the file rather than
leaving it stale. `FRONTEND_PLAN.md` also has a short pointer to these same files.
