import { useState } from 'react'

interface props {
  value: string
  onChange: (newValue: string) => void
  editable?: boolean
}

export const TextInput = ({ value, onChange, editable = true }: props) => {
  const [editing, setEditing] = useState(false)
  const [temp, setTemp] = useState(value)

  return editable && editing ? (
    <input
      value={temp}
      onChange={(e) => setTemp(e.target.value)}
      onBlur={() => {
        setEditing(false)
        onChange(temp)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setEditing(false)
          onChange(temp)
        }
      }}
      autoFocus
      className="border px-2 py-1 text-sm w-full"
    />
  ) : (
    <p
      onDoubleClick={() => {
        setTemp(value)
        setEditing(true)
      }}
      className="cursor-pointer">
      {value || 'N/A'}
    </p>
  )
}
