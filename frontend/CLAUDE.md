# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm install        # install dependencies
npm start          # run dev server (create-react-app / react-scripts)
npm run build       # production build (runs with CI= to not fail on warnings)
npm test            # run tests via react-scripts test (Jest + React Testing Library, watch mode)
```

- Run a single test file: `npm test -- src/path/to/File.test.tsx`
- Netlify functions live under `./functions` (configured in `netlify.toml`) and are deployed/served by Netlify, not by `npm start`. To test them locally end-to-end, use `netlify dev` (requires `netlify-cli`, already a devDependency).
- There is no separate lint script; ESLint runs as part of `react-scripts` (config: `react-app`, `react-app/jest` in package.json).

## Architecture

This is a Create React App (react-scripts 4) + TypeScript e-commerce storefront. Key architectural points that span multiple files:

### Data flow: Sanity CMS via GraphQL
- `src/client.ts` configures the Sanity client (projectId/dataset only; used mainly for image URL building, not queries).
- Product data is actually fetched with a raw `axios.post` GraphQL request to `API_ENDPOINT` using the `QUERY` string, both defined in `src/utils/constants.tsx`.
- `src/context/products_context.tsx` fires this fetch once on mount, dispatches into `src/reducers/products_reducer.ts`, and exposes `allProducts`/`featuredProducts`/`singleProduct` plus loading/error state via `useProductsContext()`.
- To change what product fields are available, edit the GraphQL `QUERY` in `constants.tsx` and the `productDataType` in `src/utils/productData.ts` together — the reducer and components assume they match.

### State management: two parallel systems
- **React Context + `useReducer`** (legacy/primary pattern): `products_context.tsx`, `src/context/cart_context.tsx`, `src/context/filter_context.tsx`, each paired with a reducer in `src/reducers/`. These are plain action-type/dispatch reducers (action type constants centralized in `src/actions.ts`), not Redux.
- **Redux Toolkit** (newer, used only for wishlist): `src/store/store.ts` + `src/store/wishlistSlice.ts`, with typed hooks in `src/store/hooks.ts`. Wishlist state is persisted to `localStorage` via `saveWishlist`, invoked on every store subscription.
- When adding a new cross-cutting feature, decide which pattern fits: cart/filters/products follow the Context+reducer pattern; anything resembling wishlist (needing persistence/typed selectors) should extend the Redux slice instead of adding a new Context.

### Filtering system (non-obvious design)
- Product filtering by `age` and `height` uses fixed "bucket" categories (e.g. `0-3 months`, `60-69 cm`) assigned to each product in the CMS, separate from free-text descriptive fields (`heightDescription`, etc.) shown on `SingleProductPage`. See `src/reducers/filter_reducer.ts` for the filter/sort logic and `src/components/Filters/` for the UI (checkboxes for multi-select fields like age, tabs for single-select fields like category).
- `ProductsPage` clears filters on every mount *except* when navigated from `Services` (`ServicesCards.tsx` sets category filters, then an `isClickFromServices`-style check in `ProductsPage.tsx` skips the clear) — this lets the services section link directly into pre-filtered product views.

### Routing and layout
- `src/App.tsx` uses `react-router-dom` v5 (intentionally not v6 — see README). All routes render inside a shared `Layout` (Navbar, Sidebar, Footer, ScrollToTop) wrapping the `Switch`.
- Pages are re-exported from `src/pages/index.ts` and components from `src/components/index.ts`; prefer importing from these barrel files rather than deep paths.

### Payment flow
- `src/components/CheckoutForm.tsx` / `StripeCheckout.tsx` use `@stripe/react-stripe-js` on the client.
- The Netlify function `functions/create-payment-intent.ts` computes the charge total **server-side** from the cart payload (never trusts a client-supplied total) and creates a Stripe PaymentIntent, returning `clientSecret` to the frontend. Currency is hardcoded to `thb`.
- Stripe keys and any secrets are read from env vars (`REACT_APP_STRIPE_SECRET_KEY`, loaded via `dotenv` in the function); CRA env vars prefixed `REACT_APP_` are also exposed client-side at build time — don't put secrets behind that prefix for use in frontend code.
