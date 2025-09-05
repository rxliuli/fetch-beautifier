import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import vs from 'react-syntax-highlighter/dist/esm/styles/prism/vs'
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'
import { Button } from './ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useTheme } from './theme/ThemeProvider'

SyntaxHighlighter.registerLanguage('javascript', javascript)

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
  const { resolvedTheme } = useTheme()
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <div className="relative group w-full overflow-x-auto">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <SyntaxHighlighter
        language={language}
        style={resolvedTheme === 'dark' ? vscDarkPlus : vs}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          padding: '1rem',
          width: '100%',
          minWidth: 0,
        }}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
