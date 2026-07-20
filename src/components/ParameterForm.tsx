import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ContributionMode, SimulationParams } from '../types'
import {
  backspaceAtComma,
  deleteAtComma,
  extractDigits,
  formatCurrency,
  formatCurrencyInputValue,
  formatDigitString,
  resolveCurrencyCursor,
} from '../utils/format'

interface ParameterFormProps {
  params: SimulationParams
  onChange: (params: SimulationParams) => void
}

function InfoHint({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="ml-1 inline-flex h-3.5 w-3.5 shrink-0 cursor-help items-center justify-center rounded-full border border-[var(--border)] text-[9px] leading-none text-[var(--text-faint)]"
    >
      i
    </span>
  )
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="mb-3 cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">
            {title}
          </span>
          <span className="text-xs text-[var(--text-faint)] transition-transform group-open:rotate-180">
            ▾
          </span>
        </span>
      </summary>
      <div className="space-y-3.5">{children}</div>
    </details>
  )
}

const fieldClass =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]'

const labelClass = 'mb-1.5 flex items-center text-[13px] text-[var(--text-muted)]'

function IntegerField({
  label,
  value,
  onChange,
  min,
  max,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  hint?: string
}) {
  const [display, setDisplay] = useState(String(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) {
      setDisplay(String(value))
    }
  }, [value, focused])

  const commit = (raw: string) => {
    if (raw === '') {
      onChange(value)
      setDisplay(String(value))
      return
    }
    let numeric = parseInt(raw, 10)
    if (!Number.isFinite(numeric)) {
      onChange(value)
      setDisplay(String(value))
      return
    }
    if (min !== undefined) numeric = Math.max(min, numeric)
    if (max !== undefined) numeric = Math.min(max, numeric)
    onChange(numeric)
    setDisplay(String(numeric))
  }

  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {hint && <InfoHint text={hint} />}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          commit(display)
        }}
        onChange={(e) => setDisplay(e.target.value.replace(/\D/g, ''))}
        className={fieldClass}
      />
    </label>
  )
}

function DecimalField({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  suffix?: string
  min?: number
  max?: number
  hint?: string
}) {
  const [display, setDisplay] = useState(String(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) {
      setDisplay(String(value))
    }
  }, [value, focused])

  const commit = (raw: string) => {
    if (raw === '' || raw === '.') {
      onChange(typeof min === 'number' ? min : value)
      setDisplay(String(typeof min === 'number' ? min : value))
      return
    }
    let numeric = parseFloat(raw)
    if (!Number.isFinite(numeric)) {
      onChange(value)
      setDisplay(String(value))
      return
    }
    if (min !== undefined) numeric = Math.max(min, numeric)
    if (max !== undefined) numeric = Math.min(max, numeric)
    onChange(numeric)
    setDisplay(String(numeric))
  }

  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {hint && <InfoHint text={hint} />}
      </span>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            commit(display)
          }}
          onChange={(e) => {
            const next = e.target.value.replace(/[^\d.]/g, '')
            const parts = next.split('.')
            const sanitized =
              parts.length <= 1 ? parts[0] : `${parts[0]}.${parts.slice(1).join('')}`
            setDisplay(sanitized)
          }}
          className={`${fieldClass} ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-faint)]">
            {suffix}
          </span>
        )}
      </div>
    </label>
  )
}

function CurrencyField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  hint?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingCursor = useRef<number | null>(null)
  const [display, setDisplay] = useState(() => formatCurrencyInputValue(value))
  const [editDigits, setEditDigits] = useState(String(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) {
      setDisplay(formatCurrencyInputValue(value))
    }
  }, [value, focused])

  useLayoutEffect(() => {
    const el = inputRef.current
    if (el && pendingCursor.current !== null) {
      el.setSelectionRange(pendingCursor.current, pendingCursor.current)
      pendingCursor.current = null
    }
  }, [display])

  const handleFocus = () => {
    setFocused(true)
    const digits = String(value)
    const formatted = formatDigitString(digits)
    setEditDigits(digits)
    setDisplay(formatted)
    pendingCursor.current = formatted.length
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const oldValue = display
    const oldCursor = input.selectionStart ?? oldValue.length
    const digits = extractDigits(input.value)
    const formatted = formatDigitString(digits)

    pendingCursor.current = resolveCurrencyCursor(
      oldValue,
      formatted,
      oldCursor,
      digits,
    )
    setEditDigits(digits)
    setDisplay(formatted)
  }

  const handleBlur = () => {
    setFocused(false)
    const numeric = editDigits === '' ? 0 : parseInt(editDigits, 10)
    onChange(Number.isFinite(numeric) ? numeric : 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const cursor = input.selectionStart ?? 0
    const end = input.selectionEnd ?? cursor
    if (cursor !== end) return

    const edit =
      e.key === 'Backspace'
        ? backspaceAtComma(display, cursor)
        : e.key === 'Delete'
          ? deleteAtComma(display, cursor)
          : null

    if (!edit) return

    e.preventDefault()
    setEditDigits(edit.digits)
    setDisplay(edit.formatted)
    pendingCursor.current = edit.cursor
  }

  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {hint && <InfoHint text={hint} />}
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-faint)]">
          $
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${fieldClass} pl-7`}
        />
      </div>
    </label>
  )
}

function PercentField({
  label,
  value,
  onChange,
  hint,
  max = Infinity,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  hint?: string
  max?: number
}) {
  const displayValue = Math.round(value * 1000) / 10
  return (
    <DecimalField
      label={label}
      value={displayValue}
      onChange={(v) => onChange(v / 100)}
      suffix="%"
      min={0}
      max={max}
      hint={hint}
    />
  )
}

export function ParameterForm({ params, onChange }: ParameterFormProps) {
  const update = <K extends keyof SimulationParams>(
    key: K,
    value: SimulationParams[K],
  ) => onChange({ ...params, [key]: value })

  return (
    <div className="space-y-6">
      <Section title="Portfolio">
        <CurrencyField
          label="Current net worth"
          value={params.currentNetWorth}
          onChange={(v) => update('currentNetWorth', v)}
          hint="Starting portfolio balance today"
        />
        <CurrencyField
          label="Annual spending at retirement"
          value={params.annualSpending}
          onChange={(v) => update('annualSpending', v)}
          hint="Inflation-adjusted spending once retired"
        />
      </Section>

      <Section title="Retirement Timeline">
        <div className="grid grid-cols-2 gap-3">
          <IntegerField
            label="Current age"
            value={params.currentAge}
            onChange={(v) => update('currentAge', v)}
            min={18}
            max={100}
          />
          <IntegerField
            label="Retirement age"
            value={params.retirementAge}
            onChange={(v) => update('retirementAge', v)}
            min={40}
            max={100}
            hint="Age when contributions stop and spending begins"
          />
          <IntegerField
            label="End age"
            value={params.endAge}
            onChange={(v) => update('endAge', v)}
            min={60}
            max={120}
            hint="Planning horizon — success means lasting to this age"
          />
        </div>
      </Section>

      <Section title="Accumulation">
        <div
          className="grid grid-cols-2 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-0.5"
          role="group"
          aria-label="Contribution mode"
        >
          {(
            [
              { value: 'salary', label: 'From salary' },
              { value: 'fixed', label: 'Fixed amount' },
            ] as const
          ).map((option) => {
            const active = params.contributionMode === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => update('contributionMode', option.value as ContributionMode)}
                className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  active
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {params.contributionMode === 'salary' ? (
          <>
            <CurrencyField
              label="Annual salary"
              value={params.annualSalary}
              onChange={(v) => update('annualSalary', v)}
              hint="Gross annual income used to size savings"
            />
            <PercentField
              label="Savings rate"
              value={params.savingsRate}
              onChange={(v) => update('savingsRate', v)}
              hint="Fraction of salary saved each year (before retirement)"
              max={100}
            />
            <p className="text-xs text-[var(--text-faint)]">
              ≈ {formatCurrency(params.annualSalary * params.savingsRate)} first-year
              contribution
            </p>
          </>
        ) : (
          <CurrencyField
            label="Annual contributions"
            value={params.annualContributions}
            onChange={(v) => update('annualContributions', v)}
            hint="Pre-retirement yearly savings into the portfolio"
          />
        )}

        <details className="group">
          <summary className="cursor-pointer list-none text-[13px] text-[var(--text-muted)] marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--text-faint)] transition-transform group-open:rotate-180">
                ▾
              </span>
              More options
            </span>
          </summary>
          <div className="mt-3 space-y-3.5">
            {params.contributionMode === 'salary' ? (
              <PercentField
                label="Salary growth rate"
                value={params.salaryGrowthRate}
                onChange={(v) => update('salaryGrowthRate', v)}
                hint="Annual raise applied to salary (and thus contributions)"
              />
            ) : (
              <PercentField
                label="Contribution growth rate"
                value={params.contributionGrowthRate}
                onChange={(v) => update('contributionGrowthRate', v)}
                hint="Annual increase in contributions"
              />
            )}
            <CurrencyField
              label="Pre-retirement annual expenses"
              value={params.preRetirementExpenses}
              onChange={(v) => update('preRetirementExpenses', v)}
              hint="Optional portfolio draw during working years"
            />
          </div>
        </details>
      </Section>

      <Section title="Inflation & Spending">
        <PercentField
          label="Inflation rate"
          value={params.inflationRate}
          onChange={(v) => update('inflationRate', v)}
          hint="Applied to retirement spending each year"
        />
      </Section>

      <Section title="Additional Income" defaultOpen={false}>
        <CurrencyField
          label="Social Security (annual)"
          value={params.socialSecurityAnnual}
          onChange={(v) => update('socialSecurityAnnual', v)}
        />
        <IntegerField
          label="SS start age"
          value={params.socialSecurityStartAge}
          onChange={(v) => update('socialSecurityStartAge', v)}
          min={62}
          max={70}
        />
        <CurrencyField
          label="Pension (annual)"
          value={params.pensionAnnual}
          onChange={(v) => update('pensionAnnual', v)}
        />
        <IntegerField
          label="Pension start age"
          value={params.pensionStartAge}
          onChange={(v) => update('pensionStartAge', v)}
          min={55}
          max={75}
        />
        <CurrencyField
          label="Other income (annual)"
          value={params.otherIncomeAnnual}
          onChange={(v) => update('otherIncomeAnnual', v)}
        />
        <IntegerField
          label="Other income end age"
          value={params.otherIncomeEndAge}
          onChange={(v) => update('otherIncomeEndAge', v)}
          min={50}
          max={100}
        />
      </Section>

      <Section title="Simulation">
        <label className="block">
          <span className={labelClass}>
            Return sampling mode
            <InfoHint text="Bootstrap picks random historical years; sequential preserves year-to-year order with wrap-around" />
          </span>
          <select
            value={params.samplingMode}
            onChange={(e) =>
              update('samplingMode', e.target.value as SimulationParams['samplingMode'])
            }
            className={`${fieldClass} appearance-none bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235c6578' d='M3 4.5L6 8l3-3.5'/%3E%3C/svg%3E")`,
            }}
          >
            <option value="bootstrap">Random year bootstrap</option>
            <option value="sequential">Sequential block (wrap-around)</option>
          </select>
        </label>
        <label className="block">
          <span className={`${labelClass} justify-between`}>
            <span className="flex items-center">
              Number of trials
              <InfoHint text="More trials = smoother estimates, slower runs" />
            </span>
            <span className="font-medium tabular-nums text-[var(--text)]">
              {params.numTrials.toLocaleString()}
            </span>
          </span>
          <input
            type="range"
            min={500}
            max={20000}
            step={500}
            value={params.numTrials}
            onChange={(e) => update('numTrials', parseInt(e.target.value, 10))}
            className="mt-1 w-full"
          />
        </label>
        <label className="block">
          <span className={labelClass}>Random seed (optional)</span>
          <input
            type="number"
            value={params.randomSeed ?? ''}
            placeholder="Auto"
            onChange={(e) => {
              const raw = e.target.value
              update('randomSeed', raw === '' ? null : parseInt(raw, 10))
            }}
            className={fieldClass}
          />
        </label>
      </Section>
    </div>
  )
}
