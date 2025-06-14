import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { parseFetchCode } from './lib/fetch-parser'
import { generateFriendlyFetch } from './lib/generateFriendlyFetch'
import { toast } from 'sonner'
import { Toaster } from './components/ui/sonner'
import { InputArea } from './components/InputArea'
import { ResultView } from './components/ResultView'
import defaultCode from './lib/example/default.js?raw'

export function App() {
  const [input, setInput] = useState(defaultCode)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState({
    generatedCode: '',
  })

  const handleInputChange = async (value: string) => {
    setInput(value)
    if (!value.trim()) {
      setResult({ generatedCode: '' })
      return
    }

    setIsLoading(true)
    try {
      const parseResult = await parseFetchCode(value)
      if (parseResult.error) {
        toast.error(parseResult.error)
        return
      }
      if (parseResult.fetchObj) {
        const generatedCode = await generateFriendlyFetch(parseResult.fetchObj)
        setResult({ generatedCode })
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to parse fetch request',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleInputChange(input)
  }, [])

  return (
    <div className="container overflow-x-hidden mx-auto py-8 space-y-8 max-w-3xl">
      <Toaster />
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Fetch Beautifier</h1>
        <p className="text-muted-foreground">
          Paste your fetch request from Chrome DevTools and get a beautified,
          decoded version with original and encoded data for URL and Body (JSON,
          FormData, etc.)
        </p>
      </div>

      <div className="grid gap-8">
        <InputArea value={input} onChange={handleInputChange} />
        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {result.generatedCode && !isLoading && (
          <ResultView generatedCode={result.generatedCode} />
        )}
      </div>
    </div>
  )
}

export default App
