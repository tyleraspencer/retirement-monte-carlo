export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Shorter display for large values in tight UI slots (e.g. summary cards). */
export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    const millions = value / 1_000_000
    return `$${millions.toFixed(millions >= 100 ? 0 : millions >= 10 ? 1 : 2)}M`
  }
  if (abs >= 10_000) {
    return `$${Math.round(value / 1_000)}K`
  }
  return formatCurrency(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function parseCurrencyInput(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  if (digits === '') return 0
  const parsed = parseInt(digits, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Format raw digits with commas, preserving leading zeros (for in-progress editing). */
export function formatDigitString(digits: string): string {
  if (!digits) return ''
  const firstLen = digits.length % 3 || 3
  const first = digits.slice(0, firstLen)
  const rest = digits.slice(firstLen)
  if (!rest) return first
  const groups = rest.match(/.{1,3}/g) ?? []
  return [first, ...groups].join(',')
}

export function extractDigits(raw: string): string {
  return raw.replace(/\D/g, '')
}

/** Map a display cursor position to how many digits appear before it. */
export function digitIndexBeforeCursor(display: string, cursor: number): number {
  return display.slice(0, cursor).replace(/\D/g, '').length
}

/** Map a digit index to the cursor position after that digit in formatted text. */
export function cursorAfterDigitIndex(formatted: string, digitIndex: number): number {
  if (digitIndex <= 0) return 0
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++
      if (count === digitIndex) return i + 1
    }
  }
  return formatted.length
}

export function removeCurrencyDigit(
  display: string,
  digitIndex: number,
): { formatted: string; digits: string; cursor: number } {
  const digits = extractDigits(display)
  const nextDigits = digits.slice(0, digitIndex) + digits.slice(digitIndex + 1)
  const formatted = formatDigitString(nextDigits)
  const cursor = cursorAfterDigitIndex(formatted, digitIndex)
  return { formatted, digits: nextDigits, cursor }
}

/** Backspace with cursor immediately after a comma removes the preceding digit. */
export function backspaceAtComma(display: string, cursor: number) {
  if (cursor === 0 || display[cursor - 1] !== ',') return null
  const digitIndex = digitIndexBeforeCursor(display, cursor) - 1
  if (digitIndex < 0) return null
  return removeCurrencyDigit(display, digitIndex)
}

/** Delete with cursor immediately before a comma removes the following digit. */
export function deleteAtComma(display: string, cursor: number) {
  if (cursor >= display.length || display[cursor] !== ',') return null
  const digitIndex = digitIndexBeforeCursor(display, cursor)
  if (digitIndex >= extractDigits(display).length) return null
  return removeCurrencyDigit(display, digitIndex)
}

/** Resolve cursor position after a currency input edit. */
export function resolveCurrencyCursor(
  oldValue: string,
  newFormatted: string,
  oldCursor: number,
  newDigits: string,
): number {
  const oldDigits = extractDigits(oldValue)
  const digitsBefore = digitIndexBeforeCursor(oldValue, oldCursor)

  // Typing at or past the end — keep cursor at the end
  if (newDigits.length > oldDigits.length && digitsBefore >= oldDigits.length) {
    return newFormatted.length
  }

  return currencyInputCursor(oldValue, newFormatted, oldCursor)
}

/** Preserve cursor position when commas are inserted/removed during editing. */
export function currencyInputCursor(
  oldValue: string,
  newValue: string,
  oldCursor: number,
): number {
  const digitsBefore = digitIndexBeforeCursor(oldValue, oldCursor)
  if (digitsBefore === 0) return 0

  let digitCount = 0
  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i])) {
      digitCount++
      if (digitCount === digitsBefore) return i + 1
    }
  }
  return newValue.length
}

/** Format a committed numeric value for display inside currency input fields. */
export function formatCurrencyInputValue(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function parsePercentInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return Number.isFinite(parsed) ? parsed / 100 : 0
}
