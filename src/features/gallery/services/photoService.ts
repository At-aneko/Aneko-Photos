import { galleryConfig } from '@/config/site'
import type { Photo, RawPhoto } from '@/features/gallery/types'

function createImageURL(fileName: string): string {
  const cleanBase = galleryConfig.bucketURL.replace(/\/$/, '')
  const cleanPath = galleryConfig.rawImagePath.replace(/^\/|\/$/g, '')
  const cleanName = fileName.replace(/^\/+/, '')
  return `${cleanBase}/${cleanPath}/${cleanName}`
}

function normalizePhoto(photo: RawPhoto, index: number): Photo {
  return {
    id: photo.id || `photo-${index + 1}`,
    title: photo.title || photo.description || `Photo ${index + 1}`,
    date: photo.date || '',
    description: photo.description || photo.title || '',
    images: (photo.images || [])
      .filter((image) => Boolean(image?.img))
      .map((image) => ({ img: createImageURL(image.img) })),
  }
}

export async function fetchPhotoFeed(signal?: AbortSignal): Promise<Photo[]> {
  const response = await fetch(galleryConfig.dataURL, { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data = await response.json()
  if (!Array.isArray(data)) throw new Error('Photos data must be an array')

  return data
    .map((photo, index) => normalizePhoto(photo as RawPhoto, index))
    .filter((photo) => photo.images.length > 0)
}

export function getDownloadURL(imageURL: string): string {
  const cleanBase = galleryConfig.bucketURL.replace(/\/$/, '')
  const path = imageURL.replace(`${cleanBase}/`, '')
  return `/api/images/${path}?dl`
}
