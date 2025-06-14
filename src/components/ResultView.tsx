import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CodeBlock } from './CodeBlock'

interface ResultViewProps {
  generatedCode: string
}

export function ResultView({ generatedCode }: ResultViewProps) {
  return (
    <Card className="overflow-x-hidden">
      <CardHeader>
        <CardTitle>Generated Code</CardTitle>
      </CardHeader>
      <CardContent>
        <CodeBlock code={generatedCode} language="javascript" />
      </CardContent>
    </Card>
  )
}
