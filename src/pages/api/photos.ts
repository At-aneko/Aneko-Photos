import { createRoute, errorResponse, jsonResponse } from '@/server/http'

export const prerender = false

export const ALL = createRoute({
  GET: async ({ locals }) => {
    const raw = await locals.runtime.env.KV.get('photos')
    if (!raw) return jsonResponse([])

    try {
      return jsonResponse(JSON.parse(raw), 'SHORT')
    } catch {
      return errorResponse('Invalid photos data in KV', 500)
    }
  },
})
