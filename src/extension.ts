import * as vscode from 'vscode';

const fileMappings: { [key: string]: string } = {
  '.xaml': '.xaml.cs',
  '.razor': '.razor.cs',
  '.xaml.cs': '.xaml',
  '.razor.cs': '.razor'
};

function getMappedFilePath(filePath: string): string | null {
  for (const [key, value] of Object.entries(fileMappings)) {
    if (filePath.endsWith(key)) {
      return filePath.replace(key, value);
    }
  }
  return null;
}

export function activate(context: vscode.ExtensionContext) {

  let viewCodeDisposable = vscode.commands.registerCommand('extension.viewCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const filePath = document.uri.fsPath;
    const codeBehindPath = getMappedFilePath(filePath);
    if (!codeBehindPath) return;

    try {
      const codeDocument = await vscode.workspace.openTextDocument(codeBehindPath);
      await vscode.window.showTextDocument(codeDocument);
    } catch (error) {
      // vscode.window.showErrorMessage(`Cannot find the code-behind file for ${filePath}`);
    }
  });

  let viewMarkupDisposable = vscode.commands.registerCommand('extension.viewMarkup', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const filePath = document.uri.fsPath;
    const markupPath = getMappedFilePath(filePath);
    if (!markupPath) return;

    try {
      const markupDocument = await vscode.workspace.openTextDocument(markupPath);
      await vscode.window.showTextDocument(markupDocument);
    } catch (error) {
      // vscode.window.showErrorMessage(`Cannot find the markup file for ${filePath}`);
    }
  });

  context.subscriptions.push(viewCodeDisposable, viewMarkupDisposable);
}

export function deactivate() {}
