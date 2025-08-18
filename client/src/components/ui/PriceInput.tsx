import { currency } from '@/models/Price'
import { useEffect, useRef, useState } from 'react'

interface props {
  amount: number
  currency: currency
  editable?: boolean
  onChange: (val: { amount: number; currency: currency }) => void
}

export const PriceInput = ({
  amount,
  currency,
  editable = true,
  onChange,
}: props) => {
  const [editing, setEditing] = useState(false)
  const [tempAmount, setTempAmount] = useState(amount.toString())
  const [tempCurrency, setTempCurrency] = useState<any>(currency)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editing) {
      setTempAmount(amount.toString())
      setTempCurrency(currency)
    }
  }, [amount, currency, editing])

  const handleBlur = () => {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setEditing(false)
        onChange({
          amount: parseFloat(tempAmount) || 0,
          currency: tempCurrency,
        })
      }
    }, 100)
  }

  return editable && editing ? (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className="flex gap-2 items-center">
      <input
        value={tempAmount}
        onChange={(e) => setTempAmount(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setEditing(false)
            onChange({
              amount: parseFloat(tempAmount) || 0,
              currency: tempCurrency,
            })
          }
        }}
        autoFocus
        className="border px-2 py-1 text-sm w-full"
      />
      <select
        value={tempCurrency}
        onChange={(e) => setTempCurrency(e.target.value)}
        className="border px-2 py-1 text-sm">
        <option value="USD">USD</option>
        <option value="LBP">LBP</option>
      </select>
    </div>
  ) : (
    <p onDoubleClick={() => setEditing(true)} className="cursor-pointer">
      {amount} {currency}
    </p>
  )
}
