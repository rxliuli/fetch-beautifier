import type { CapturedFetch } from './generateFriendlyFetch'
import parse from '@bany/curl-to-json'

export function curl2json(curl: string): CapturedFetch {
  const { url, data, header, method, params } = parse(curl)
  const urlObj = new URL(url)
  if (params) {
    urlObj.search = new URLSearchParams(params).toString()
  }
  const contentType = header?.['Content-Type']
  const init: RequestInit = {}
  if (method && method.toUpperCase() !== 'GET') {
    init.method = method.toUpperCase()
  }
  if (header) {
    init.headers = header
  }
  if (data) {
    init.body = contentType === 'application/json' ? JSON.stringify(data) : data
  }
  if (Object.keys(init).length === 0) {
    return { url: urlObj.toString() }
  }
  return {
    url: urlObj.toString(),
    init,
  }
}
