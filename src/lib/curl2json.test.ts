import { describe, expect, it } from 'vitest'
import { curl2json } from './curl2json'
import type { CapturedFetch } from './generateFriendlyFetch'

describe('curl2json', () => {
  it('simple get request', () => {
    const curl = `curl 'https://example.com/api/v1/users'`
    const json = curl2json(curl)
    expect(json).toEqual({
      url: 'https://example.com/api/v1/users',
    } satisfies CapturedFetch)
  })
  it('get request with urlencoded', () => {
    const curl = `curl 'https://example.com/api/v1/users?page=1&limit=10'`
    const json = curl2json(curl)
    expect(json).toEqual({
      url: 'https://example.com/api/v1/users?page=1&limit=10',
    } satisfies CapturedFetch)
  })
  it('simple post request', () => {
    const curl = `curl 'https://example.com/api/v1/users' \
      -H 'Content-Type: application/json' \
      --data-raw '{"name":"John Doe","email":"john@example.com","age":30}'`
    const json = curl2json(curl)
    expect(json).toEqual({
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        }),
      },
    } satisfies CapturedFetch)
  })
  it('post request with referer', () => {
    const curl = `curl 'https://example.com/api/v1/users' \
      -H 'Content-Type: application/json' \
      -H 'Referer: https://example.com/api/v1/users' \
      --data-raw '{"name":"John Doe","email":"john@example.com","age":30}'`
    const json = curl2json(curl)
    expect(json).toEqual({
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://example.com/api/v1/users',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        }),
      },
    } satisfies CapturedFetch)
  })
  it('post request with credentials and mode', () => {
    const curl = `curl 'https://example.com/api/v1/users' \
      -H 'Content-Type: application/json' \
      -H 'Mode: cors' \
      -H 'Credentials: include' \
      -H 'Authorization: Bearer 1234567890' \
      --data-raw '{"name":"John Doe","email":"john@example.com","age":30}'`
    const json = curl2json(curl)
    expect(json).toEqual({
      url: 'https://example.com/api/v1/users',
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Mode: 'cors',
          Credentials: 'include',
          Authorization: 'Bearer 1234567890',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        }),
      },
    } satisfies CapturedFetch)
  })
})
