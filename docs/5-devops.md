# 5. DevOps

#### Index

1. [Analysis](1-analysis.md)
2. [Design](2-design.md)
3. [Architecture](3-architecture.md)
4. [Implementation](4-implementation.md)
5. [DevOps](5-devops.md)
   - 5.1. [DVCS Workflow](#51-dvcs-workflow)
   - 5.2. [Release Automation](#52-release-automation)
     - 5.2.1 [Conventional Commits](#521-conventional-commits)
     - 5.2.2 [Semantic Release](#522-semantic-release)
   - 5.3. [Quality Assurance](#53-quality-assurance)
   - 5.4. [Continuous Integration and Delivery](#54-continuous-integration-and-delivery)
6. [License](6-license.md)

To streamline collaboration among group members and automate repetitive tasks, the choice of a deployment strategy is
crucial. For this reason, we decided to adopt the continuous release strategy described below. This requires a robust
test suite to limit errors, along with an adequate workflow and tools to automate releases.

## 5.1. DVCS Workflow

![GitFlow Diagram](figures/gitflow-diagram.svg)

For the DVCS workflow, we chose [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow):
a workflow centred around two persistent branches, with `main` holding the stable production history and `develop`
serving as an integration point for ongoing work, supported by temporary branches. We chose this strategy for our
project because it provides the necessary control in an environment where multiple work streams occur simultaneously. By
isolating new feature development from the production codebase using dedicated `feature` branches, we ensure that the
application remains stable regardless of the state of ongoing work. Additionally, GitFlow's dedicated `release` branches
enable us to finalize and test a new version without halting development on future features. Its `hotfix` protocol
allows us to address critical production bugs immediately.

## 5.2. Release Automation

### 5.2.1 Conventional Commits

We chose to adopt [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the standard for our commit
messages. It is a lightweight convention for formatting commit messages that creates an explicit history that is easy
for both humans and machines to understand. Every commit must follow a specific structure: a standard type, such as
`feat` for new features or `fix` for bug repairs (optionally followed by a scope in parentheses), followed by a concise
description of the change. We adopted this standard for our project because it removes ambiguity from our version
history, significantly improving collaboration by enabling anyone to scan the log and immediately grasp the purpose of
each change. Furthermore, strictly adhering to this structured format enables us to automate critical parts of our
DevOps pipeline. For example, we can automatically generate semantic version numbers and changelogs based on the commit
types. This reduces manual overhead and ensures our release documentation is always accurate and up to date.

### 5.2.2. Semantic Release

Assigning software versions is often an arbitrary and difficult process, as manually determining the impact of changes
from commit histories is time-consuming and prone to error. To address this problem, standards have been introduced to
help developers assign an identifier to each unique state of the software in a predictable way, to make it easier to
understand the software itself. We chose [Semantic Versioning](https://semver.org) as the standard for the project we
are working on.

Moreover, thanks to the standardized notation adopted for our commit messages, tools such as semantic-release can fully
automate version assignment and artifact management. For example, they can generate changelogs and manage release
notifications without the need for human intervention.

Therefore, automating the release workflow minimizes errors and enables teams to concentrate exclusively on development
rather than versioning tasks.

## 5.3 Quality Assurance

### 5.3.1 Husky

We chose Husky to efficiently manage Git hooks across the development team. This allows us to automatically trigger
scripts at specific points in the Git workflow. It acts as a first line of defence, preventing low-quality code or
incorrect commit messages from ever entering the repository.

In our configuration, we utilize two primary hooks:

- **commit-msg**: This hook integrates with `Commitlint` to enforce the Conventional Commits standard (described
  in [Section 5.2.1](#521-conventional-commits)). Before a commit is finalized, Husky validates the message format; if
  the message does not adhere to the required structure (i.e., `<type>[(scope)][!]: <description>`), the commit is
  aborted, providing the developer with immediate feedback.
- **pre-commit**: This hook triggers `Lint-staged`, a tool that runs linters and formatters only on files currently
  staged for the commit. We have configured this to run `Prettier`, which ensures that all code is automatically
  formatted according to our style guidelines before being saved. By formatting only the changed files rather than the
  entire project, we maintain high performance while ensuring the codebase remains consistent.

This setup ensures that quality assurance is not an additional step, but an integral, automated part of the daily
contribution workflow.

## 5.4 Continuous Integration and Delivery

TODO: In depth explanation (when we write the scripts) on pipelines and GHA.
