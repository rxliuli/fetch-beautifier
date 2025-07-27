import { afterEach, assert, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  generateFriendlyFetch,
  type CapturedFetch,
} from './generateFriendlyFetch'
import { omit } from 'es-toolkit'

describe('generateFriendlyFetch', () => {
  let lastRequest: CapturedFetch
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options) => {
      lastRequest = {
        url: url.toString(),
        init: options,
      }
      if (!options) {
        delete lastRequest.init
      }
      return new Response('ok')
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  async function expectRequest(fetchObj: CapturedFetch) {
    assert(lastRequest)
    expect(lastRequest).deep.eq(fetchObj)
  }
  it('simple get request', async () => {
    const fetchObj: CapturedFetch = { url: 'https://example.com/api/v1/users' }
    const code = await generateFriendlyFetch(fetchObj)
    eval(code)
    await expectRequest(fetchObj)
  })
  it('get request with urlencoded', async () => {
    const url = new URL('https://example.com/api/v1/users')
    url.searchParams.set('page', '1')
    url.searchParams.set('limit', '10')
    const fetchObj: CapturedFetch = {
      url: url.toString(),
    }
    const code = await generateFriendlyFetch(fetchObj)
    expect(code).contain('["page", "1"]')
    eval(code)
    await expectRequest(fetchObj)
  })
  it('get request with json url', async () => {
    const url = new URL('https://example.com/api/v1/users')
    url.searchParams.set('data', JSON.stringify({ name: 'John Doe' }))
    const fetchObj: CapturedFetch = {
      url: url.toString(),
    }
    const code = await generateFriendlyFetch(fetchObj)
    eval(code)
    await expectRequest(fetchObj)
  })
  it('simple post request', async () => {
    const fetchObj: CapturedFetch = {
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'John Doe' }),
      },
    }
    const code = await generateFriendlyFetch(fetchObj)
    eval(code)
    await expectRequest(fetchObj)
  })
  it('post request with urlencoded', async () => {
    const fetchObj: CapturedFetch = {
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ name: 'John Doe' }),
      },
    }
    const code = await generateFriendlyFetch(fetchObj)
    eval(code)
    await expectRequest(fetchObj)
  })
  it('post request with form data', async () => {
    const fd = new FormData()
    fd.append('name', 'John Doe')
    fd.append('age', '20')
    const fetchObj: CapturedFetch = {
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        body: fd,
      },
    }
    const code = await generateFriendlyFetch(fetchObj)
    eval(code)
    await expectRequest(fetchObj)
  })
  it('post request with file form data', async () => {
    const fd = new FormData()
    fd.append(
      'file',
      new File(['Hello, world!'], 'hello.txt', { type: 'text/plain' }),
    )
    const fetchObj: CapturedFetch = {
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        body: fd,
      },
    }
    const code = await generateFriendlyFetch(fetchObj)
    eval(code)
    await expectRequest(fetchObj)
  })
  it('post request with json string in form data', async () => {
    const fd = new FormData()
    fd.append('data', JSON.stringify({ foo: 'bar', arr: [1, 2, 3] }))
    fd.append('name', 'John')
    const fetchObj: CapturedFetch = {
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        body: fd,
      },
    }
    const code = await generateFriendlyFetch(fetchObj)
    expect(code).contain(
      JSON.stringify({ foo: 'bar', arr: [1, 2, 3] }, null, 2),
    )
    eval(code)
    await expectRequest(fetchObj)
  })
  it('post request with json urlencoded body', async () => {
    const params = new URLSearchParams()
    params.set('foo', 'bar')
    params.set('data', JSON.stringify({ a: 1, b: [2, 3] }))
    const fetchObj: CapturedFetch = {
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      },
    }
    const code = await generateFriendlyFetch(fetchObj)
    eval(code)
    await expectRequest(fetchObj)
  })
  it.todo('post request with arraybuffer body')
  it.todo('post request with stream body')
  it('should include extra fetch options if set', async () => {
    const fetchObj: CapturedFetch = {
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foo: 'bar' }),
        referrer: 'https://referrer.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        mode: 'no-cors',
        credentials: 'include',
        cache: 'reload',
        redirect: 'error',
        integrity: 'sha256-abc',
        keepalive: true,
      },
    }
    const code = await generateFriendlyFetch(fetchObj)
    expect(code).toContain('referrer: "https://referrer.com/"')
    expect(code).toContain('referrerPolicy: "strict-origin-when-cross-origin"')
    expect(code).toContain('mode: "no-cors"')
    expect(code).toContain('credentials: "include"')
    expect(code).toContain('cache: "reload"')
    expect(code).toContain('redirect: "error"')
    expect(code).toContain('integrity: "sha256-abc"')
    expect(code).toContain('keepalive: true')
    eval(code)
    await expectRequest(fetchObj)
  })
  it('get request with credentials', async () => {
    const fetchObj: CapturedFetch = {
      url: 'https://example.com/api/v1/users',
      init: {
        referrer: 'https://x.com/home',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      },
    }
    const code = await generateFriendlyFetch(fetchObj)
    eval(code)
    delete fetchObj.init?.body
    delete fetchObj.init?.method
    expect(lastRequest.init).deep.eq(
      omit(fetchObj.init!, ['mode', 'credentials']),
    )
  })
  it('should clean up sec-ch-ua headers', async () => {
    const fetchObj: CapturedFetch = {
      url: 'https://example.com/api/v1/users',
      init: {
        headers: {
          'Content-Type': 'application/json',
          'sec-ch-ua': 'Chromium',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      },
    }
    const code = await generateFriendlyFetch(fetchObj)
    expect(code).not.contain('sec-ch-ua')
    eval(code)
    expect(lastRequest.init).toEqual({
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
})
