# Fetch Beautifier

Format and beautify fetch requests copied from browser DevTools.

## Why?

When copying fetch requests from Chrome/Edge/Firefox DevTools, the code is often minified and unreadable - especially for complex requests with long URLs, multiple headers, or FormData. This extension instantly formats them into clean, readable code.

## Features

- 🎨 **Instant formatting** - Paste and format in one action
- 📊 **Smart parsing** - Handles complex URLs, headers, and request bodies
- 🔧 **Configurable** - Customize indentation and quote styles
- ⚡ **Fast** - No external dependencies or API calls

## Usage

### Method 1: Paste and Format (Recommended)

1. Copy fetch code from browser DevTools
2. Press `Ctrl+Shift+V` (`Cmd+Shift+V` on Mac)
3. Done! Your formatted code is inserted

### Method 2: Format Existing Code

1. Select the fetch code in your editor
2. Press `Alt+Shift+F` or right-click → "Format Fetch Code"

## Example

**Before:**

```js
fetch('https://api.example.com/data?userId=123&type=post&limit=10&offset=0', {
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  },
  body: '{"title":"Hello World","content":"This is a test"}',
  method: 'POST',
})
```

**After:**

```js
const url = new URL('https://api.example.com/data')
url.search = new URLSearchParams([
  ['userId', '123'],
  ['type', 'post'],
  ['limit', '10'],
  ['offset', '0'],
]).toString()
fetch(url, {
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  },
  body: JSON.stringify({
    title: 'Hello World',
    content: 'This is a test',
  }),
  method: 'POST',
})
```

## Use Cases

- 🔍 **API Debugging** - Compare your implementation with the browser's actual request
- 🔄 **Reverse Engineering** - Understand and reproduce API calls
- 📝 **Documentation** - Clean up requests for documentation or sharing
- 🧪 **Testing** - Quickly format requests for test files

## Requirements

- VSCode 1.100.0 or higher

## Known Issues

- FormData formatting is basic and may need manual adjustment for complex cases

## Links

- [Web Version](https://rxliuli.com/fetch-beautifier/)
- [Report Issues](https://github.com/rxliuli/fetch-beautifier/issues)
