export const getImageUrl = (thumbnail: string | null | undefined): string => {
  // Handle null/undefined cases
  if (!thumbnail) return ''
  
  // If it's already a full URL (http or https), return as-is
  if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
    return thumbnail
  }
  
  // Otherwise, prepend the storage base URL
  const storageUrl = import.meta.env.VITE_STORAGE_BASE_URL
  
  // Handle trailing/leading slashes to avoid double slashes
  const cleanStorageUrl = storageUrl.endsWith('/') ? storageUrl.slice(0, -1) : storageUrl
  const cleanThumbnail = thumbnail.startsWith('/') ? thumbnail : `/${thumbnail}`
  
  return `${cleanStorageUrl}${cleanThumbnail}`
}