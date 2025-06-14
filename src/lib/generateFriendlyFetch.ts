export interface CapturedFetch {
  url: string
  init?: RequestInit
}

function stringTab(str: string, tab: number) {
  return str
    .split('\n')
    .map((line) => ' '.repeat(tab) + line)
    .join('\n')
}

function parseString(str: string) {
  if (typeof str !== 'string') {
    return str
  }
  try {
    const data = JSON.parse(str)
    if (typeof data === 'object' && data !== null) {
      return `JSON.stringify(${JSON.stringify(data, null, 2)})`
    }
    return JSON.stringify(str)
  } catch (e) {
    return JSON.stringify(str)
  }
}

export async function generateFriendlyFetch(fetchObj: CapturedFetch) {
  const { url, init = {} } = fetchObj
  const before: string[] = []
  const output: string[] = []
  let urlStr = url
  const urlObj = new URL(urlStr)
  if (urlObj.searchParams.size > 0) {
    const href = urlObj.origin + urlObj.pathname
    before.push(`const url = new URL(${JSON.stringify(href)})`)
    const search = [...urlObj.searchParams]
      .reduce(
        (acc, [k, v]) => {
          acc.push(stringTab(`[${JSON.stringify(k)}, ${parseString(v)}],`, 2))
          return acc
        },
        ['['],
      )
      .concat(']')
      .join('\n')
    before.push(`url.search = new URLSearchParams(${search}).toString()`)
    output.push(`fetch(url`)
  } else {
    output.push(`fetch(${JSON.stringify(urlStr)}`)
  }
  // 判断是否需要 options
  const hasOptions = !!Object.keys(init).length
  if (!hasOptions) {
    output.push(')')
    return (before.join('\n') + '\n' + output.join('')).trim()
  }
  output[0] += ', {'
  // 只输出 init 里实际存在的字段
  for (const [k, v] of Object.entries(init)) {
    if (k === 'method' && v === 'GET') continue
    if (k === 'headers' && Object.keys(v as any).length === 0) continue
    if (k === 'body' && v == null) continue
    if (k === 'body') {
      // 尝试识别 body 类型
      if (typeof v === 'string') {
        try {
          const json = JSON.parse(v)
          output.push(stringTab(`body: JSON.stringify(${JSON.stringify(json, null, 2)}),`, 2))
        } catch {
          output.push(stringTab(`body: ${JSON.stringify(v)},`, 2))
        }
      } else if (v instanceof URLSearchParams) {
        const entries = Array.from(v.entries())
        const paramsCode = entries
          .map(([k, v]) => `[${JSON.stringify(k)}, ${parseString(v)}]`)
          .join(',\n' + ' '.repeat(8))
        output.push(
          stringTab(
            `body: new URLSearchParams([
        ${paramsCode}
      ]),`,
            2,
          ),
        )
      } else if (v instanceof FormData) {
        before.push(`const fd = new FormData()`)
        for (const [key, value] of v.entries()) {
          let str = `fd.append(${JSON.stringify(key)}, `
          if (value instanceof File) {
            str += `new File([new TextEncoder().encode(${JSON.stringify(
              await value.text(),
            )}).buffer], ${JSON.stringify(value.name)}, { type: ${JSON.stringify(value.type)} })`
          } else {
            str += parseString(value)
          }
          str += ')'
          before.push(str)
        }
        output.push(stringTab(`body: fd,`, 2))
      } else if (v instanceof ArrayBuffer) {
        before.push(`const encoder = new TextEncoder()`)
        before.push(`const array = encoder.encode(/* binary data */)`)
        output.push(stringTab(`body: array.buffer,`, 2))
      } else {
        output.push(stringTab(`body: /* custom body type */ null,`, 2))
      }
    } else if (k === 'headers') {
      output.push(stringTab(`headers: ${JSON.stringify(v, null, 2)},`, 2))
    } else if (k === 'method') {
      output.push(stringTab(`method: ${JSON.stringify(v)},`, 2))
    } else {
      output.push(stringTab(`${k}: ${JSON.stringify(v)},`, 2))
    }
  }
  output.push('})')
  return (before.join('\n') + '\n' + output.join('\n')).trim()
}
