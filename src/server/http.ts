import type { APIContext } from 'astro'

export interface ApiError {
  error: string
  code: number
}

export type CachePreset = 'IMMUTABLE' | 'SHORT'

export type RouteHandler = (context: APIContext) => Promise<Response>

export interface R2ResponseMetadata {
  body: ReadableStream | null
  writeHttpMetadata(headers: Headers): void
  httpEtag: string
}

const CACHE_HEADERS: Record<CachePreset, string> = {
  IMMUTABLE: 'public, max-age=31536000, immutable',
  SHORT: 'public, max-age=300, stale-while-revalidate=600',
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
}

export function createHeaders(cache?: CachePreset, extra?: Record<string, string>) {
  const headers = new Headers({ ...CORS_HEADERS, ...extra })
  if (cache) headers.set('Cache-Control', CACHE_HEADERS[cache])
  return headers
}

export function jsonResponse<T>(data: T, cache?: CachePreset): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: createHeaders(cache, { 'Content-Type': 'application/json; charset=utf-8' }),
  })
}

export function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message, code: status } satisfies ApiError), {
    status,
    headers: createHeaders(undefined, { 'Content-Type': 'application/json; charset=utf-8' }),
  })
}

export function binaryResponse(
  object: R2ResponseMetadata,
  cache?: CachePreset,
  extra?: Record<string, string>,
): Response {
  const headers = createHeaders(cache, extra)
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  return new Response(object.body, { headers })
}

export function createRoute(handlers: Record<string, RouteHandler>) {
  return async (context: APIContext): Promise<Response> => {
    if (context.request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: new Headers(CORS_HEADERS) })
    }

    const handler = handlers[context.request.method]
    if (!handler) return errorResponse('Method Not Allowed', 405)

    try {
      return await handler(context)
    } catch (error) {
      console.error(error)
      return errorResponse('Internal Server Error', 500)
    }
  }
}
