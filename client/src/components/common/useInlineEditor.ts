import { useState, useRef, useCallback } from 'react'

interface UseInlineEditorOptions {
  onSave?: () => void
  onCancel?: () => void
  autoFocus?: boolean
}

export const useInlineEditor = (options: UseInlineEditorOptions = {}) => {
  const [isEditing, setIsEditing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { onSave, onCancel, autoFocus = true } = options

  const startEditing = useCallback(() => {
    setIsEditing(true)
  }, [])

  const stopEditing = useCallback(() => {
    setIsEditing(false)
    onSave?.()
  }, [onSave])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    onCancel?.()
  }, [onCancel])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        stopEditing()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        cancelEditing()
      }
    },
    [stopEditing, cancelEditing],
  )

  const handleBlur = useCallback(() => {
    // Delay to check if focus moved to another element within the container
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        stopEditing()
      }
    }, 100)
  }, [stopEditing])

  return {
    isEditing,
    containerRef,
    startEditing,
    stopEditing,
    cancelEditing,
    handleKeyDown,
    handleBlur,
    autoFocus,
  }
}
