import * as vscode from 'vscode'
import { parseFetchCode, generateFriendlyFetch } from '@fetch-beautifier/core'

async function formatter(code: string) {
  try {
    const parsed = await parseFetchCode(code)
    if (parsed.error) {
      vscode.window.showErrorMessage(
        `Failed to parse fetch code: ${parsed.error}`,
      )
      return
    }
    if (!parsed.fetchObj) {
      vscode.window.showErrorMessage('No fetch request found in the code')
      return
    }
    const formatted = await generateFriendlyFetch(parsed.fetchObj)
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found')
      return
    }
    await editor.edit((editBuilder) => {
      const selections = editor.selections
      for (const selection of selections) {
        editBuilder.replace(selection, formatted)
      }
    })
  } catch (e) {
    vscode.window.showErrorMessage('Failed to paste formatted fetch code.')
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'fetch-beautifier.pasteFormatted',
      async () => {
        const code = await vscode.env.clipboard.readText()
        await formatter(code)
      },
    ),
  )
  context.subscriptions.push(
    vscode.commands.registerCommand('fetch-beautifier.formatSelection', () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showErrorMessage('No active editor found')
        return
      }
      const selections = editor.selections
      for (const selection of selections) {
        const code = editor.document.getText(selection)
        formatter(code)
      }
    }),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
