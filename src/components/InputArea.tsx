import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface InputAreaProps {
  value: string
  onChange: (value: string) => void
}

export function InputArea({ value, onChange }: InputAreaProps) {
  return (
    <Card className="overflow-x-hidden">
      <CardHeader>
        <CardTitle>Paste your fetch request here</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your fetch request from Chrome DevTools here..."
          className="w-full h-48 resize-y overflow-x-auto font-mono whitespace-pre"
        />
      </CardContent>
    </Card>
  )
}
