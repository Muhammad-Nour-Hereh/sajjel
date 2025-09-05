import { useEffect, useRef, useState } from 'react'

interface Props {
  quantity: number
  editable?: boolean
  onChange: (val: number) => void
}

const QuantityInput = ({ quantity, editable = true, onChange }: Props) => {
  const [editing, setEditing] = useState(false)
  const [tempQuantity, setTempQuantity] = useState(quantity.toString())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editing) {
      setTempQuantity(quantity.toString())
    }
  }, [quantity, editing])

  const handleBlur = () => {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setEditing(false)
        onChange(Math.max(1, parseInt(tempQuantity) || 1))
      }
    }, 100)
  }

  return editable && editing ? (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className="flex gap-2 items-center">
      <input
        value={tempQuantity}
        onChange={(e) => setTempQuantity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setEditing(false)
            onChange(Math.max(1, parseInt(tempQuantity) || 1))
          }
        }}
        autoFocus
        className="border px-2 py-1 text-sm w-full"
      />
    </div>
  ) : (
    <p onDoubleClick={() => setEditing(true)} className="cursor-pointer">
      {quantity}
    </p>
  )
}

export default QuantityInput
