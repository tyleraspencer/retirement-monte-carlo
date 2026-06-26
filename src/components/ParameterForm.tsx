import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { SimulationParams } from '../types'
import {
  backspaceAtComma,
  deleteAtComma,
  extractDigits,
  formatCurrencyInputValue,
  formatDigitString,
  resolveCurrencyCursor,
} from '../utils/format'

interface ParameterFormProps {
  params: SimulationParams
  onChange: (params: SimulationParams) => void
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
    <details open={defaultOpen} className="group rounded-lg border border-slate-200 bg-white">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-800 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between">
          {title}
          <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
        </span>
      </summary>
      <div className="space-y-3 border-t border-slate-100 px-4 pb-4 pt-3">{children}</div>
    </details>
  )
}

function IntegerField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
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
    <label className="block text-sm">
      <span className="mb-1 block text-slate-600">{label}</span>
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
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
}: {
  label: string
  value: number
  onChange: (v: number) => void
  suffix?: string
  min?: number
  max?: number
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
    <label className="block text-sm">
      <span className="mb-1 block text-slate-600">{label}</span>
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
          className={`w-full rounded-md border border-slate-300 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${suffix ? 'pl-3 pr-8' : 'px-3'}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
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
}: {
  label: string
  value: number
  onChange: (v: number) => void
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
    <label className="block text-sm">
      <span className="mb-1 block text-slate-600">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
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
          className="w-full rounded-md border border-slate-300 py-2 pl-7 pr-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </label>
  )
}

function PercentField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  const displayValue = Math.round(value * 1000) / 10
  return (
    <DecimalField
      label={label}
      value={displayValue}
      onChange={(v) => onChange(v / 100)}
      suffix="%"
      min={0}
    />
  )
}

export function ParameterForm({ params, onChange }: ParameterFormProps) {
  const update = <K extends keyof SimulationParams>(
    key: K,
    value: SimulationParams[K],
  ) => onChange({ ...params, [key]: value })

  return (
    <div className="space-y-3">
      <Section title="Personal Timeline">
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
          />
          <IntegerField
            label="End age"
            value={params.endAge}
            onChange={(v) => update('endAge', v)}
            min={60}
            max={120}
          />
        </div>
        <CurrencyField
          label="Current net worth"
          value={params.currentNetWorth}
          onChange={(v) => update('currentNetWorth', v)}
        />
      </Section>

      <Section title="Accumulation">
        <CurrencyField
          label="Annual contributions"
          value={params.annualContributions}
          onChange={(v) => update('annualContributions', v)}
        />
        <PercentField
          label="Contribution growth rate"
          value={params.contributionGrowthRate}
          onChange={(v) => update('contributionGrowthRate', v)}
        />
        <CurrencyField
          label="Pre-retirement annual expenses"
          value={params.preRetirementExpenses}
          onChange={(v) => update('preRetirementExpenses', v)}
        />
      </Section>

      <Section title="Retirement Spending">
        <CurrencyField
          label="Annual spending at retirement"
          value={params.annualSpending}
          onChange={(v) => update('annualSpending', v)}
        />
        <PercentField
          label="Inflation rate"
          value={params.inflationRate}
          onChange={(v) => update('inflationRate', v)}
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

      <Section title="Simulation Settings">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Return sampling mode</span>
          <select
            value={params.samplingMode}
            onChange={(e) =>
              update('samplingMode', e.target.value as SimulationParams['samplingMode'])
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="bootstrap">Random year bootstrap</option>
            <option value="sequential">Sequential block (wrap-around)</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 flex justify-between text-slate-600">
            <span>Number of trials</span>
            <span className="font-medium text-slate-900">
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
            className="w-full accent-blue-600"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Random seed (optional)</span>
          <input
            type="number"
            value={params.randomSeed ?? ''}
            placeholder="Auto"
            onChange={(e) => {
              const raw = e.target.value
              update('randomSeed', raw === '' ? null : parseInt(raw, 10))
            }}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
      </Section>
    </div>
  )
}
