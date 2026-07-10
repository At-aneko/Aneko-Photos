export const siteConfig = {
  brand: 'ANEKO',
  productName: 'Photos',
  title: 'Aneko | Photos',
  description: 'ANEKO - Photos: 一个基于 Cloudflare Worker + R2 + KV 的照片画廊网站',
  splashDurationMs: 1500,
  currentYear: new Date().getFullYear(),
} as const

export const galleryConfig = {
  bucketURL: 'https://photo.atbspb.online',
  rawImagePath: 'org',
  dataURL: '/api/photos',
  batchSize: 24,
} as const
