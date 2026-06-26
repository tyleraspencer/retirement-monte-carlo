# Retirement Monte Carlo Simulator

A browser-based retirement planning tool that runs full-lifecycle Monte Carlo simulations using **100 years of historical S&P 500 total returns** (1926–2025).

## Features

- **Full lifecycle modeling** — accumulation from current age through retirement, then inflation-adjusted withdrawals
- **Historical bootstrap** — each simulation year samples a real S&P 500 annual return (random bootstrap or sequential block mode)
- **Interactive inputs** — ages, net worth, contributions, spending, inflation, Social Security, pension, and other income
- **Rich visualizations** — success rate, percentile portfolio paths, depletion-age histogram, final wealth distribution
- **Non-blocking simulation** — 5,000+ trials run in a Web Worker

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## How It Works

Each Monte Carlo trial simulates year-by-year from your current age to your planning horizon:

1. **Accumulation phase** — portfolio grows via historically sampled S&P 500 returns; contributions added annually
2. **Retirement phase** — inflation-adjusted withdrawals, plus any fixed income (SS, pension, other)

Returns are drawn from embedded historical data — not a synthetic normal distribution. Two sampling modes are available:

- **Random year bootstrap** (default) — independent random draws with replacement
- **Sequential block** — walk forward through consecutive historical years with wrap-around

## Disclaimer

For illustrative purposes only. Past performance does not guarantee future results. This is not financial advice.
