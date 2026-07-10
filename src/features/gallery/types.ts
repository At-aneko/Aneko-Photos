export type GalleryStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error'

export interface RawPhotoImage {
  img: string
}

export interface RawPhoto {
  id: string
  title?: string
  date?: string
  description?: string
  images?: RawPhotoImage[]
}

export interface PhotoImage {
  img: string
}

export interface Photo {
  id: string
  title: string
  date: string
  description: string
  images: PhotoImage[]
}
