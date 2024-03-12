// The module 'vscode' contains the VS Code extensibility API
import * as vscode from "vscode";

// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "rapid-branch-genius.helloWorld",
    () => {
      vscode.window
        .showInputBox({ prompt: "Enter branch name" })
        .then((branchName) => {
          if (branchName) {
            vscode.window
              .showQuickPick([
                "main",
                "release",
                "develop",
                "feature",
                "bug",
                "hotfix",
              ])
              .then((branchType) => {
                if (branchType) {
                  const fullBranchName = `${branchType}/${branchName}`;
                  vscode.window.showInformationMessage(
                    `Creating and checking out branch: ${fullBranchName}`
                  );

                  // Get the Git extension
                  const gitExtension =
                    vscode.extensions.getExtension("vscode.git");
                  if (gitExtension) {
                    const git = gitExtension.exports.getAPI(1);

                    // Get the current repository
                    const repository = git.repositories[0];

                    // Check if a repository is available
                    if (repository) {
                      // Create a new branch
                      repository.createBranch(fullBranchName).then(() => {
                        // Checkout the newly created branch
                        repository.checkout(fullBranchName).then(() => {
                          vscode.window.showInformationMessage(
                            `Branch created and checked out successfully: ${fullBranchName}`
                          );
                        });
                      });
                    } else {
                      vscode.window.showErrorMessage(
                        "No Git repository found. Please open a project with Git."
                      );
                    }
                  } else {
                    vscode.window.showErrorMessage(
                      "Git extension not found. Please install Git and reload the window."
                    );
                  }
                }
              });
          }
        });
    }
  );

  context.subscriptions.push(disposable);

  // Donation Option
  vscode.window
    .showInformationMessage(
      "If you find this extension helpful, consider supporting the project by making a donation.",
      "Donate Now"
    )
    .then((choice) => {
      if (choice === "Donate Now") {
        // Open the donation link in the default web browser
        vscode.env.openExternal(vscode.Uri.parse("#"));
      }
    });
}
