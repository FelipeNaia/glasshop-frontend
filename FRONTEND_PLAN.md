# Frontend Plan: Product Catalog (React)

## Stack
- React 18
- React Router v6 (client-side routing)
- Axios (API calls)
- Context API (global state)

---

## Layout

A persistent **sidebar** on the left lets the user switch between two main sections. The right side renders the active section.

```
┌─────────────┬──────────────────────────────────┐
│             │                                  │
│   Sidebar   │         Main Content             │
│             │                                  │
│  🛍 Shop    │                                  │
│  ⚙ Admin   │                                  │
│             │                                  │
└─────────────┴──────────────────────────────────┘
```

---

## Routes

| Path | Section | Component |
|------|---------|-----------|
| `/` | Shop | `ShopPage` |
| `/admin` | Admin | `AdminProductListPage` |
| `/admin/products/:id` | Admin | `AdminProductEditPage` |

---

## Sections

### 1. Shop (`/`)

Displays a public-facing product grid. Only visible products are shown.

**Features:**
- Paginated product grid (`GET /api/products?visible=true&page=X&size=Y`)
- Filter by tag (e.g. `male`, `female`) — tag buttons above the grid, multi-select
- Each product card shows: primary image (lowest priority), name, price (formatted from cents)
- Pagination controls (previous / next)

**Components:**
- `ShopPage` — fetches products, owns filter + pagination state
- `TagFilter` — renders tag toggle buttons
- `ProductCard` — displays a single product (image, name, price)
- `Pagination` — previous/next controls

---

### 2. Admin — Product List (`/admin`)

Internal panel for managing products.

**Features:**
- Full product list (no visibility filter — shows all products)
- Each row shows: name, price, tags, visible toggle (on/off switch), edit button
- Toggling visibility calls `PATCH /api/products/:id/visibility` immediately (optimistic update)
- "New Product" button to create a product via `POST /api/products`
- Paginated with filters (same params, but no `visible` default)

**Components:**
- `AdminProductListPage` — fetches all products, owns pagination state
- `ProductRow` — single product row with inline visibility toggle
- `VisibilityToggle` — switch that calls the toggle endpoint on change
- `NewProductModal` — form to create a new product (name, price in cents, stock, tags)

---

### 3. Admin — Product Edit (`/admin/products/:id`)

Detail view for a single product.

**Features:**
- Edit name, price, stock quantity, tags via `PUT /api/products/:id`
- Tags: free-form tag input (type and press Enter to add, click × to remove)
- Image management:
  - List of current images ordered by priority
  - Upload new image via `POST /api/images/products/:id` (file picker)
  - Drag-and-drop reorder → on drop, calls `PUT /api/images/products/:id/reorder`
  - Each image shows a preview pulled from `GET /api/images/:imageId`
- Save button submits the full product update

**Components:**
- `AdminProductEditPage` — fetches product, owns form state
- `ProductForm` — controlled form for name, price, stock
- `TagInput` — add/remove tags
- `ImageManager` — drag-and-drop image list + upload button
- `ImagePreview` — single image tile with drag handle and delete button

---

## State Management

- **`ProductContext`** — holds the current product list and pagination state; shared between shop and admin list views so navigating back doesn't re-fetch unnecessarily
- Local component state for forms and modals

---

## API Layer (`src/api/`)

Thin Axios wrappers — one file per resource:

```
src/api/products.js   → getProducts, getProduct, createProduct, updateProduct, toggleVisibility
src/api/images.js     → uploadImage, reorderImages, getImageUrl
```

`getImageUrl(imageId)` returns the full URL string (`/api/images/:imageId`) — used directly as an `<img src>` rather than fetching through JS.

---

## Project Structure

```
src/
├── api/
│   ├── products.js
│   └── images.js
├── components/
│   ├── Sidebar.jsx
│   ├── ProductCard.jsx
│   ├── Pagination.jsx
│   ├── TagFilter.jsx
│   ├── TagInput.jsx
│   ├── VisibilityToggle.jsx
│   ├── ImageManager.jsx
│   └── ImagePreview.jsx
├── pages/
│   ├── ShopPage.jsx
│   ├── AdminProductListPage.jsx
│   └── AdminProductEditPage.jsx
├── context/
│   └── ProductContext.jsx
└── App.jsx
```

---

## Steps

1. **Scaffold** — `create-react-app` or Vite, install React Router + Axios
2. **Layout + Sidebar** — `App.jsx` with routes, `Sidebar` with nav links
3. **API layer** — `src/api/products.js` and `src/api/images.js`
4. **Shop page** — product grid, tag filter, pagination
5. **Admin list page** — product table, visibility toggle
6. **Admin edit page** — product form, tag input
7. **Image manager** — upload, preview, drag-and-drop reorder

---

# Plan: Auth, Cart & Checkout UI

Full detail, routes, components, API layers, and per-item progress checkboxes live in
`ai-development/` — that's the source of truth for what's implemented vs. outstanding.
This section is just a map of the three tickets and how they relate.

## Goals

- Login/register UI, token handling, and route protection for `BUYER` vs `ADMIN` — the
  `/admin` routes are currently open to anyone and need to be gated.
- Cart UI wired to the existing (currently disabled, no-op) "Add to Cart" button on
  `ProductPage`.
- Checkout UI that hands off to Abacate Pay's PIX flow and polls for async payment
  confirmation, plus an order history/detail view.

## Tickets

| Ticket | File | Depends on |
|--------|------|------------|
| Authentication & Authorization | [`ai-development/authentication.md`](ai-development/authentication.md) | — |
| Shopping Cart | [`ai-development/shopping-cart.md`](ai-development/shopping-cart.md) | Authentication |
| Checkout & Payment (Abacate Pay) | [`ai-development/payment.md`](ai-development/payment.md) | Authentication, Shopping Cart |

## Notes
- These tickets are the frontend counterpart to `../backend/ai-development/` — each
  frontend ticket assumes the matching backend endpoints exist; check the backend's
  checkboxes if something doesn't behave as documented.
- Explicitly deferred for v1 (see individual tickets for details): forgot/reset password
  UI, guest carts, cart merge-on-login, card payment UI, refunds, order cancellation.
