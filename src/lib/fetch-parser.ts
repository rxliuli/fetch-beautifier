import type { CapturedFetch } from './generateFriendlyFetch'

export interface ParseResult {
  fetchObj?: CapturedFetch
  error?: string
}

export async function parseFetchCode(code: string): Promise<ParseResult> {
  let captured: CapturedFetch | undefined = undefined
  const originalFetch = globalThis.fetch
  globalThis.fetch = (url, init) => {
    captured = { url: url.toString(), init }
    return Promise.resolve(new Response('mock'))
  }
  try {
    eval(code)
    if (!captured) {
      return {
        error: 'No fetch request found in the code',
      }
    }
    return { fetchObj: captured }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid JavaScript code',
    }
  } finally {
    window.fetch = originalFetch
  }
}
