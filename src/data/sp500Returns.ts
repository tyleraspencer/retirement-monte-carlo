export interface AnnualReturn {
  year: number
  totalReturn: number
}

/** S&P 500 annual total returns (price + reinvested dividends), 1926–2025. Source: SBBI-style published totals. */
export const SP500_ANNUAL_RETURNS: AnnualReturn[] = [
  { year: 1926, totalReturn: 0.1162 },
  { year: 1927, totalReturn: 0.3749 },
  { year: 1928, totalReturn: 0.4361 },
  { year: 1929, totalReturn: -0.0842 },
  { year: 1930, totalReturn: -0.249 },
  { year: 1931, totalReturn: -0.4334 },
  { year: 1932, totalReturn: -0.0819 },
  { year: 1933, totalReturn: 0.5399 },
  { year: 1934, totalReturn: -0.0144 },
  { year: 1935, totalReturn: 0.4767 },
  { year: 1936, totalReturn: 0.3392 },
  { year: 1937, totalReturn: -0.3503 },
  { year: 1938, totalReturn: 0.3112 },
  { year: 1939, totalReturn: -0.0041 },
  { year: 1940, totalReturn: -0.0978 },
  { year: 1941, totalReturn: -0.1159 },
  { year: 1942, totalReturn: 0.2034 },
  { year: 1943, totalReturn: 0.259 },
  { year: 1944, totalReturn: 0.1975 },
  { year: 1945, totalReturn: 0.3644 },
  { year: 1946, totalReturn: -0.0807 },
  { year: 1947, totalReturn: 0.0571 },
  { year: 1948, totalReturn: 0.055 },
  { year: 1949, totalReturn: 0.1879 },
  { year: 1950, totalReturn: 0.3171 },
  { year: 1951, totalReturn: 0.2402 },
  { year: 1952, totalReturn: 0.1837 },
  { year: 1953, totalReturn: -0.0099 },
  { year: 1954, totalReturn: 0.5262 },
  { year: 1955, totalReturn: 0.3156 },
  { year: 1956, totalReturn: 0.0656 },
  { year: 1957, totalReturn: -0.1078 },
  { year: 1958, totalReturn: 0.4336 },
  { year: 1959, totalReturn: 0.1196 },
  { year: 1960, totalReturn: 0.0047 },
  { year: 1961, totalReturn: 0.2689 },
  { year: 1962, totalReturn: -0.0873 },
  { year: 1963, totalReturn: 0.228 },
  { year: 1964, totalReturn: 0.1648 },
  { year: 1965, totalReturn: 0.1245 },
  { year: 1966, totalReturn: -0.1005 },
  { year: 1967, totalReturn: 0.2398 },
  { year: 1968, totalReturn: 0.1106 },
  { year: 1969, totalReturn: -0.085 },
  { year: 1970, totalReturn: 0.0401 },
  { year: 1971, totalReturn: 0.1431 },
  { year: 1972, totalReturn: 0.1898 },
  { year: 1973, totalReturn: -0.1466 },
  { year: 1974, totalReturn: -0.2647 },
  { year: 1975, totalReturn: 0.372 },
  { year: 1976, totalReturn: 0.2384 },
  { year: 1977, totalReturn: -0.0718 },
  { year: 1978, totalReturn: 0.0656 },
  { year: 1979, totalReturn: 0.1844 },
  { year: 1980, totalReturn: 0.3242 },
  { year: 1981, totalReturn: -0.0491 },
  { year: 1982, totalReturn: 0.2155 },
  { year: 1983, totalReturn: 0.2256 },
  { year: 1984, totalReturn: 0.0627 },
  { year: 1985, totalReturn: 0.3173 },
  { year: 1986, totalReturn: 0.1867 },
  { year: 1987, totalReturn: 0.0525 },
  { year: 1988, totalReturn: 0.1661 },
  { year: 1989, totalReturn: 0.3169 },
  { year: 1990, totalReturn: -0.031 },
  { year: 1991, totalReturn: 0.3047 },
  { year: 1992, totalReturn: 0.0762 },
  { year: 1993, totalReturn: 0.1008 },
  { year: 1994, totalReturn: 0.0132 },
  { year: 1995, totalReturn: 0.3758 },
  { year: 1996, totalReturn: 0.2296 },
  { year: 1997, totalReturn: 0.3336 },
  { year: 1998, totalReturn: 0.2858 },
  { year: 1999, totalReturn: 0.2104 },
  { year: 2000, totalReturn: -0.091 },
  { year: 2001, totalReturn: -0.1189 },
  { year: 2002, totalReturn: -0.221 },
  { year: 2003, totalReturn: 0.2868 },
  { year: 2004, totalReturn: 0.1088 },
  { year: 2005, totalReturn: 0.0491 },
  { year: 2006, totalReturn: 0.1579 },
  { year: 2007, totalReturn: 0.0549 },
  { year: 2008, totalReturn: -0.37 },
  { year: 2009, totalReturn: 0.2646 },
  { year: 2010, totalReturn: 0.1506 },
  { year: 2011, totalReturn: 0.0211 },
  { year: 2012, totalReturn: 0.16 },
  { year: 2013, totalReturn: 0.3239 },
  { year: 2014, totalReturn: 0.1369 },
  { year: 2015, totalReturn: 0.0138 },
  { year: 2016, totalReturn: 0.1196 },
  { year: 2017, totalReturn: 0.2183 },
  { year: 2018, totalReturn: -0.0438 },
  { year: 2019, totalReturn: 0.3149 },
  { year: 2020, totalReturn: 0.184 },
  { year: 2021, totalReturn: 0.2871 },
  { year: 2022, totalReturn: -0.1811 },
  { year: 2023, totalReturn: 0.2629 },
  { year: 2024, totalReturn: 0.2502 },
  { year: 2025, totalReturn: 0.1788 },
]

export interface HistoricalStats {
  startYear: number
  endYear: number
  count: number
  meanReturn: number
  stdDev: number
  bestYear: { year: number; totalReturn: number }
  worstYear: { year: number; totalReturn: number }
  positiveYearPct: number
}

export function computeHistoricalStats(
  returns: AnnualReturn[] = SP500_ANNUAL_RETURNS,
): HistoricalStats {
  const values = returns.map((r) => r.totalReturn)
  const count = values.length
  const meanReturn = values.reduce((a, b) => a + b, 0) / count
  const variance =
    values.reduce((sum, v) => sum + (v - meanReturn) ** 2, 0) / count
  const stdDev = Math.sqrt(variance)
  const positiveCount = values.filter((v) => v > 0).length

  let best = returns[0]
  let worst = returns[0]
  for (const entry of returns) {
    if (entry.totalReturn > best.totalReturn) best = entry
    if (entry.totalReturn < worst.totalReturn) worst = entry
  }

  return {
    startYear: returns[0].year,
    endYear: returns[returns.length - 1].year,
    count,
    meanReturn,
    stdDev,
    bestYear: { year: best.year, totalReturn: best.totalReturn },
    worstYear: { year: worst.year, totalReturn: worst.totalReturn },
    positiveYearPct: positiveCount / count,
  }
}

export const HISTORICAL_STATS = computeHistoricalStats()
