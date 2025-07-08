import { useState } from "react"

export const EditableText = ({
  value,
  onChange,
}: {
  value: string
  onChange: (newValue: string) => void
}) => {
  const [editing, setEditing] = useState(false)
  const [temp, setTemp] = useState(value)

  return editing ? (
    <input
      value={temp}
      onChange={(e) => setTemp(e.target.value)}
      onBlur={() => {
        setEditing(false)
        onChange(temp)
      }}
      autoFocus
      className="border px-2 py-1 text-sm w-full"
    />
  ) : (
    <p onDoubleClick={() => setEditing(true)} className="cursor-pointer">
      {value || 'N/A'}
    </p>
  )
}