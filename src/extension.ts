import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerCodeActionsProvider(
        { language: "*" },
        new SearchAction()
    );

    const command = vscode.commands.registerCommand(
        "_vscodeoverflow.search",
        (lang: string, error: string) => {
            search(lang, error);
        }
    );

    context.subscriptions.push(provider, command);
}

function search(lang: string, error: string) {
    vscode.window.showInformationMessage("Opening on StackOverflow...");

    vscode.env.openExternal(
        vscode.Uri.parse(
            `https://stackoverflow.com/search?q=${encodeURI(
                `${lang} ${error}`
            )}`,
            true
        )
    );
}

class SearchAction implements vscode.CodeActionProvider {
    public provideCodeActions(
        _document: vscode.TextDocument,
        _range: vscode.Range,
        context: vscode.CodeActionContext,
        _token: vscode.CancellationToken
    ): vscode.CodeAction[] | undefined {
        const action = new vscode.CodeAction(
            "Search StackOverflow",
            vscode.CodeActionKind.QuickFix
        );

        action.command = {
            command: "_vscodeoverflow.search",
            title: "",
            arguments: [
                vscode.window.activeTextEditor?.document.languageId,
                context.diagnostics[0].message,
            ],
        };

        return [action];
    }
}

export function deactivate() {}
