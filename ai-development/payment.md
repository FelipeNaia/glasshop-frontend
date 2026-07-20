# Feature: Checkout & Payment (Frontend)

UI for turning a cart into an order and collecting PIX payment via Abacate Pay.
PIX confirmation is asynchronous (backend webhook, not synchronous like a card charge),
so the frontend's job is: kick off checkout, display the QR/copy-paste code, and **poll**
for the order to flip from `PENDING` to `PAID`/`FAILED` — there is no server push to the
browser.

**Depends on:** [authentication](authentication.md), [shopping-cart](shopping-cart.md).

Mirrors the backend spec: [`../backend/ai-development/payment.md`](../../backend/ai-development/payment.md).

**⚠️ Before implementing:** confirm with the backend spec what shape `POST /api/checkout`
actually returns for `pixQrCode` (image data URI? a value to feed into a QR-rendering
library? a URL to an image?) — that determines whether `PixPaymentDisplay` renders an
`<img>` or generates a QR code client-side.

**Out of scope for v1:** card payment UI, refund UI, an abandoned-order "cancel" button
(matches backend's out-of-scope list — there's no cancellation endpoint to call).

---

## API layer (`src/api/orders.js`)
- `checkout()` → `POST /api/checkout` (no body — reads the caller's cart server-side)
- `getOrders()` → `GET /api/orders`
- `getOrder(id)` → `GET /api/orders/:id`

## Pages & components
| Path | Component | Notes |
|------|-----------|-------|
| `/checkout` | `CheckoutPage` | Shows an order summary (from the current cart), a "Pay with PIX" button that calls `checkout()`, then renders `PixPaymentDisplay` with the returned QR/copy-paste data. Redirects back to `/cart` if the cart is empty. |
| `/orders` | `OrderHistoryPage` | List of the caller's past orders (`GET /api/orders`): date, item count, total, status badge, link to detail. |
| `/orders/:id` | `OrderDetailPage` | Full order: line items (snapshotted name/price, not live product data), total, status, and — if still `PENDING` — the same `PixPaymentDisplay` + polling used at checkout. |

- `PixPaymentDisplay` — shows the QR code and copy-paste code (with a "copy" button),
  plus a polling status line ("Waiting for payment confirmation…").
- `OrderStatusBadge` — small colored badge for `PENDING` / `PAID` / `FAILED` /
  `CANCELLED`.

## Polling strategy
- While an order is `PENDING`, poll `GET /api/orders/:id` on an interval (e.g. every 3–5s)
  until status becomes `PAID` or `FAILED`, then stop.
- On `PAID`: show a success state, clear the local cart view (the backend already clears
  the server-side cart on the `PAID` webhook), offer a link to `/orders/:id`.
- On `FAILED`: show a failure state with a way back to `/cart` to retry checkout.
- Stop polling and clean up the interval on unmount (leaving `/checkout` or `/orders/:id`
  mid-poll shouldn't leak a timer).

---

## Checklist

- [ ] Confirm actual `pixQrCode`/`pixCopyPaste` response shape against the real backend implementation before building `PixPaymentDisplay`
- [ ] `src/api/orders.js` — checkout/getOrders/getOrder wrappers
- [ ] `CheckoutPage` + `/checkout` route (wrapped in `RequireAuth`), redirects if cart is empty
- [ ] `PixPaymentDisplay` (QR/copy-paste rendering + copy-to-clipboard)
- [ ] Polling hook (e.g. `useOrderStatusPolling(orderId)`) — interval poll, stops on terminal status, cleans up on unmount
- [ ] `OrderHistoryPage` + `/orders` route (wrapped in `RequireAuth`)
- [ ] `OrderDetailPage` + `/orders/:id` route (wrapped in `RequireAuth`), reuses `PixPaymentDisplay`/polling while `PENDING`
- [ ] `OrderStatusBadge` component
- [ ] Success/failure end states on checkout completion
