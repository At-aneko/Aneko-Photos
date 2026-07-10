import { binaryResponse, createRoute, errorResponse } from '@/server/http'
import { requireParam } from '@/server/params'

export const prerender = false

export const ALL = createRoute({
  GET: async ({ params, request, locals }) => {
    const path = requireParam(params.path, 'path')
    const object = await locals.runtime.env.R2.get(path)
    if (!object) return errorResponse('Not found', 404)

    const isDownload = new URL(request.url).searchParams.has('dl')
    if (!isDownload) return binaryResponse(object, 'IMMUTABLE')

    const fileName = encodeURIComponent(path.split('/').pop() || 'image')
    return binaryResponse(object, undefined, {
      'Content-Disposition': `attachment; filename*=UTF-8''${fileName}`,
    })
  },
})
