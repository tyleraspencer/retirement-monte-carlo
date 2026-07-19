# Retirement Monte Carlo Simulator

A client-side React + TypeScript + Vite SPA that runs retirement Monte Carlo simulations in the browser (no backend, no database). All market data is embedded in `src/data/sp500Returns.ts`, and simulations run in a Web Worker.

## Cursor Cloud specific instructions

- Requires Node 20.19+ / 22.12+ (Vite 8). The VM's default Node (v22.x) works.
- This is a single frontend service — there is no backend, API, or database to start.
- Standard commands live in `package.json` scripts: `npm run dev` (dev server on http://localhost:5173), `npm run lint` (oxlint), `npm run build` (`tsc -b && vite build`), `npm run preview`.
- Dependencies are installed by the startup update script (`npm install`), so you normally do not need to reinstall.
- To verify end-to-end, open http://localhost:5173 and change a sidebar input (e.g. retirement age); the KPIs and charts re-run automatically via the Web Worker after a ~300ms debounce.
