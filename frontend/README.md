# Smile Store Homepage V1

React + Vite + TypeScript implementation of the original Manus homepage and a shared product catalog. The original `../index.html`, `../styles.css`, `../app.js`, and `../assets/` remain in place as the visual reference.

From `outputs/`:

```powershell
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173/smile/` when that port is available. Run `npm run typecheck`, `npm run lint`, and `npm run build` for checks. Production output is `frontend/dist/`.

Catalog routes: `/smile/products` and `/smile/category/:slug` (`makeup`, `skincare`, `haircare`, `perfume`, `bags`, `natural`, `accessories`). All category pages share `CatalogPage`. The catalog sort selection is kept in the `sort` query parameter. A static host must serve the app entry point for direct visits to these paths; GitHub Pages needs a fallback or rewrite before deploying browser-history routes.

Products, prices, favorites, cart count, and newsletter feedback are still prototype behavior. The app has no catalog API, account, mailing list, cart page, or checkout. Prices display in EGP as requested for the Egypt market but are illustrative and need approval before production.
