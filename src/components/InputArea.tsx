import { Textarea } from './ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import urlParams from '../lib/example/urlParams.js?raw'
import jsonPost from '../lib/example/jsonPost.js?raw'
import formDataPost from '../lib/example/formDataPost.js?raw'
import curl from '../lib/example/curl.sh?raw'
import { useEffect, useRef } from 'react'

interface InputAreaProps {
  value: string
  onChange: (value: string) => void
}

const examples = {
  urlParams: urlParams,
  jsonPost: jsonPost,
  formDataPost: formDataPost,
  curl: curl,
}

export function InputArea({ value, onChange }: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleExampleClick = (example: string) => {
    onChange(example)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  return (
    <Card className="overflow-x-hidden">
      <CardHeader>
        <CardTitle>Paste your fetch request here</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your fetch request from Chrome DevTools here..."
          className="w-full h-48 resize-y overflow-x-auto font-mono whitespace-pre"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(examples.urlParams)}
        >
          URL Params
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(examples.jsonPost)}
        >
          JSON POST
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(examples.formDataPost)}
        >
          FormData POST
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(examples.curl)}
        >
          Curl
        </Button>
      </CardFooter>
    </Card>
  )
}
