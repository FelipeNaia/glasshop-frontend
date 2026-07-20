# Feature: Shopping Cart (Frontend)

UI for the per-user server-side cart. The "Add to Cart" button already exists in
`ProductPage.jsx` (`src/pages/ProductPage.jsx:77-79`) but is disabled with no click
handler — this ticket wires it up along with the rest of the cart UI.

**Depends on:** [authentication](authentication.md) — cart routes/actions require a
logged-in buyer.

Mirrors the backend spec: [`../backend/ai-development/shopping-cart.md`](../../backend/ai-development/shopping-cart.md).

**Out of scope for v1:** guest carts, cart merging on login (matches backend's
out-of-scope list).

---

## API layer (`src/api/cart.js`)
- `getCart()` → `GET /api/cart`
- `addItem(productId, quantity)` → `POST /api/cart/items`
- `updateItemQuantity(productId, quantity)` → `PATCH /api/cart/items/:productId`
- `removeItem(productId)` → `DELETE /api/cart/items/:productId`
- `clearCart()` → `DELETE /api/cart`

## `CartContext` (`src/context/CartContext.jsx`)
- State: `cart` (lines enriched with product name/price/image + computed totals, as
  returned by `GET /api/cart`), `itemCount` (derived, for the Sidebar badge).
- Actions: `addToCart(productId, quantity)`, `setQuantity(productId, quantity)`,
  `removeFromCart(productId)`, `clear()` — each calls the API then refetches/updates
  local state.
- Fetches the cart once on login (or on app load if already authenticated); cleared on
  logout.

## Pages & components
| Path | Component | Notes |
|------|-----------|-------|
| `/cart` | `CartPage` | Lists each line (image, name, unit price, quantity stepper, line total, remove button) + cart total + "Checkout" button. Empty state when no items. |

- `CartLineItem` — one row: thumbnail (`getImageUrl`), name, quantity stepper (`+`/`-`
  calling `setQuantity`), computed line total, remove (`×`) button.
- `CartBadge` — small count bubble on the Sidebar's cart icon, shows `itemCount`.

## Wiring the existing "Add to Cart" button
- `ProductPage.jsx`: replace the disabled/no-op button with `onClick={() =>
  addToCart(product.id, 1)}`, still disabled when `stockQuantity === 0`. Show a brief
  confirmation (toast or button-label flash to "Added ✓") since the cart isn't
  automatically shown.

## Sidebar changes (`src/components/Sidebar.jsx`)
- Add a cart icon/link (`/cart`) with `CartBadge` showing `itemCount`, visible only when
  logged in.

---

## Checklist

- [ ] `src/api/cart.js` — get/add/update/remove/clear wrappers
- [ ] `CartContext` + provider (fetch on login, clear on logout)
- [ ] `CartPage` + `/cart` route (wrapped in `RequireAuth`)
- [ ] `CartLineItem` component (quantity stepper, remove button, computed totals)
- [ ] Empty-cart state on `CartPage`
- [ ] Wire `ProductPage`'s "Add to Cart" button to `addToCart`
- [ ] Sidebar cart icon + `CartBadge` (item count), hidden when logged out
- [ ] Quantity stepper enforces integer > 0 (matches backend validation; 0 removes the line, mirroring `PATCH` semantics)
