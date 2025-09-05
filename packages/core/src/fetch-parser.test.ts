import { describe, it, expect, vi } from 'vitest'
import { parseFetchCode } from './fetch-parser'

describe('parseFetchCode', () => {
  it('should parse simple fetch request', async () => {
    const code = `
      fetch('https://api.example.com/users')
    `
    const result = await parseFetchCode(code)
    expect(result.fetchObj).toBeDefined()
    expect(result.fetchObj).toEqual({ url: 'https://api.example.com/users' })
  })

  it('should parse fetch request with options', async () => {
    const code = `
      fetch('https://api.example.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'John' })
      })
    `
    const result = await parseFetchCode(code)
    expect(result.fetchObj).toBeDefined()
    expect(result.fetchObj?.url).toBe('https://api.example.com/users')
    expect(result.fetchObj?.init?.method).toBe('POST')
    expect(result.fetchObj?.init?.headers).toEqual({
      'Content-Type': 'application/json',
    })
    expect(result.fetchObj?.init?.body).toBe(JSON.stringify({ name: 'John' }))
  })

  it('should handle invalid JavaScript code', async () => {
    const code = `
      fetch('https://api.example.com/users' // missing closing parenthesis
    `
    const result = await parseFetchCode(code)
    expect(result.error).toBeDefined()
    expect(result.fetchObj).toBeUndefined()
  })

  it('should handle code without fetch', async () => {
    const code = `
      console.log('Hello, World!')
    `
    const result = await parseFetchCode(code)
    expect(result.error).toBe('No fetch request found in the code')
    expect(result.fetchObj).toBeUndefined()
  })

  it('should parse fetch request with URL parameters', async () => {
    const code = `
      fetch('https://api.example.com/users?page=1&limit=10')
    `
    const result = await parseFetchCode(code)
    expect(result.fetchObj).toBeDefined()
    expect(result.fetchObj?.url).toBe(
      'https://api.example.com/users?page=1&limit=10',
    )
  })

  it('should parse fetch request with FormData', async () => {
    const code = `
      const formData = new FormData()
      formData.append('name', 'John')
      formData.append('file', new Blob(['test']))
      fetch('https://api.example.com/upload', {
        method: 'POST',
        body: formData
      })
    `
    const result = await parseFetchCode(code)
    expect(result.fetchObj).toBeDefined()
    expect(result.fetchObj?.url).toBe('https://api.example.com/upload')
    expect(result.fetchObj?.init?.method).toBe('POST')
    expect(result.fetchObj?.init?.body).toBeInstanceOf(FormData)
    const formData = result.fetchObj?.init?.body as FormData
    expect(formData.get('name')).toBe('John')
  })
  it('should parse fetch request with credentials', async () => {
    const code = `
      fetch('https://api.example.com/users', {
        credentials: 'include',
        mode: 'cors',
      })
    `
    const result = await parseFetchCode(code)
    expect(result.fetchObj).toBeDefined()
    expect(result.fetchObj?.init?.credentials).toBe('include')
    expect(result.fetchObj?.init?.mode).toBe('cors')
  })
})
