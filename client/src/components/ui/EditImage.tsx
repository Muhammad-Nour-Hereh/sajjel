import { useRef } from 'react'

type EditImageProps = {
  src: string
  alt: string
  onChange: (file: File) => void
}

function EditImage({ src, alt, onChange }: EditImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDoubleClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onChange(file)
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full h-48 cursor-pointer object-contain"
        onDoubleClick={handleDoubleClick}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}

export default EditImage
